import React, { useState, useEffect, useRef } from "react";
import { sendMessageToGemini } from "../lib/gemini";

// --- Sub-Component: Message ---
const Message = ({ sender, text }) => (
  <div className={`mb-6 animate-fade-in-up flex flex-col ${sender === 'User' ? 'items-end' : 'items-start'}`}>
    <p className={`font-bold text-lg mb-1 ${sender === 'User' ? 'text-blue-300' : 'text-white'}`}>{sender.split(' ')[0]}:</p>
    <div className={`rounded-2xl p-4 max-w-[80%] ${sender === 'User' ? 'bg-[#1e3a8a]/50 text-white' : 'bg-black/30 text-white/90'}`}>
      <p className="text-lg leading-relaxed">{text}</p>
    </div>
    <style>{`
      @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .animate-fade-in-up { animation: fadeInUp 0.4s ease-out forwards; }
    `}</style>
  </div>
);

export default function ChatInterface() {
  // --- Logic State ---
  const [character, setCharacter] = useState("Kuroda Yukinari");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);

  const charLines = {
    "Kuroda Yukinari": "User.Name000, are we climbing, racing, or just talking at the start line?",
    "Shinkai Yuto": "What do you want to talk about?",
    "Izumida Touichirou": "User.Name000. Tell me, do you wish to talk cycling?",
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typing]);

  // Initial greeting on character change
  useEffect(() => {
    setMessages([{ role: 'model', sender: character, message: charLines[character] || "..." }]);
    setInputValue("");
  }, [character]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue;
    setInputValue("");

    // Add user message immediately
    const newMessages = [...messages, { role: 'user', sender: 'User', message: userMessage }];
    setMessages(newMessages);
    setTyping(true);

    try {
      // Filter out the initial greeting if it's not a real conversation turn, 
      // but for simplicity we'll just pass the purely conversation history excluding current user message
      // or actually, pass the history correctly.
      // The API expects history in specific format. 
      // We'll pass the `messages` state (excluding the just added one for history, or include it if the API handles it).
      // Our `sendMessageToGemini` takes history separately. 
      // We should pass the *previous* messages as history.

      // Only include actual conversation messages (skip initial greeting)
      const historyForApi = messages
        .filter((m, idx) => idx > 0) // skip the first greeting message
        .map(m => ({
          role: m.sender === 'User' ? 'user' : 'model',
          message: m.message
        }));

      const responseText = await sendMessageToGemini(userMessage, character, historyForApi);

      setMessages(prev => [...prev, { role: 'model', sender: character, message: responseText }]);
    } catch (error) {
      console.error("Chat error", error);
      const errorMsg = error?.message || String(error);
      setMessages(prev => [...prev, { role: 'model', sender: 'System', message: `Error: ${errorMsg}` }]);
    } finally {
      setTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#bfdbfe] font-sans overflow-hidden relative">

      {/* 1. Global Halftone Background */}
      <div className="absolute inset-0 z-0 opacity-60 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle, white 4px, transparent 4px)', backgroundSize: '30px 30px' }} />

      {/* 2. Sidebar Component */}
      <aside className={`fixed lg:relative inset-y-0 left-0 z-50 w-72 bg-[#03112b] transition-transform duration-300 transform lg:translate-x-0 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-5 flex flex-col h-full gap-6">
          <div className="flex items-center justify-between text-white px-1">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
              <span className="font-bold tracking-tight">YowaPedaAi</span>
              <button className="p-1 hover:bg-white/10 rounded ml-1"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></svg></button>
            </div>
            <button onClick={() => setIsMenuOpen(false)} className="lg:hidden text-gray-400">✕</button>
          </div>
          <button
            onClick={() => {
              setMessages([{ role: 'model', sender: character, message: charLines[character] }]);
              setIsMenuOpen(false);
            }}
            className="bg-white text-[#03112b] rounded-lg py-2.5 font-bold shadow-lg hover:bg-gray-200 transition-colors"
          >
            New Chat
          </button>
          <div className="flex flex-col gap-2">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest px-1">👤 Characters</p>
            {Object.keys(charLines).map((c) => (
              <button key={c} onClick={() => { setCharacter(c); setIsMenuOpen(false); }}
                className={`w-full py-2.5 rounded-lg font-bold text-sm transition-all ${character === c ? "bg-white text-[#03112b]" : "bg-white/10 text-white hover:bg-white/20"}`}>
                {c}
              </button>
            ))}
          </div>
          <div className="mt-auto bg-white text-[#03112b] rounded-lg py-2.5 px-4 font-bold flex items-center gap-3 shadow-xl">
            <div className="w-7 h-7 bg-black rounded-full flex items-center justify-center text-[10px] text-white">USER</div>
            User.Name000
          </div>
        </div>
      </aside>

      {/* 3. Main Content Container */}
      <main className="flex-1 relative z-10 p-4 sm:p-6 flex flex-col items-center justify-center">

        {/* Mobile Menu Trigger */}
        <button onClick={() => setIsMenuOpen(true)} className="lg:hidden absolute top-6 left-6 bg-[#0f2550] text-white p-2 rounded-lg shadow-xl z-50">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></svg>
        </button>

        {/* --- CHAT WINDOW START --- */}
        <div className="flex flex-col h-full gap-3 sm:gap-4 max-w-4xl w-full mx-auto">

          {/* Header Pill */}
          <div className="bg-[#0f2550] rounded-xl sm:rounded-2xl p-3 sm:p-5 shadow-2xl border border-white/10 shrink-0">
            <p className="text-gray-400 text-[10px] sm:text-xs font-medium uppercase tracking-wider">Welcome,</p>
            <div className="flex items-center gap-2 text-white text-lg sm:text-2xl font-bold">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08s5.97 1.09 6 3.08c-1.29 1.94-3.5 3.22-6 3.22z" /></svg>
              User.Name000
            </div>
          </div>

          {/* Main Panel */}
          <div className="flex-1 bg-[#0f2550]/90 rounded-2xl sm:rounded-[32px] relative overflow-hidden shadow-2xl border border-white/10 flex flex-col p-6 sm:p-12 lg:p-16">
            <div className="absolute inset-0 z-0 opacity-40 bg-cover bg-center pointer-events-none" style={{ backgroundImage: "url('https://i.pinimg.com/736x/28/76/3e/28763eb80c7a8b668ebc7634be99b380.jpg')" }} />
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #051c48 10px, transparent 10px)', backgroundSize: '40px 40px' }} />

            <div className="relative z-10 h-full flex flex-col justify-start overflow-y-auto custom-scrollbar">
              {messages.map((m, i) => <Message key={i} sender={m.sender} text={m.message} />)}
              {typing && (
                <div className="flex items-center gap-2 mt-4 animate-pulse">
                  <p className="text-white/60 italic text-sm sm:text-lg">{character} is typing...</p>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Bar */}
          <div className="bg-[#0f2550] rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-2xl border border-white/10 flex flex-col gap-2 sm:gap-4 shrink-0 transition-all hover:border-white/20">
            <p className="text-gray-500 italic text-[10px] sm:text-sm pl-1 font-light tracking-wide">Chat with {character.split(' ')[0]} . . .</p>
            <div className="flex items-center gap-3 sm:gap-5">
              <div className="flex items-center gap-3 sm:gap-4 text-white/70">
                <button className="hover:text-white transition-colors p-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="rotate-45"><path d="m16 6-8.414 8.586a2 2 0 0 0 2.829 2.829l8.414-8.586a4 4 0 1 0-5.657-5.657l-8.379 8.551a6 6 0 1 0 8.485 8.485l8.379-8.551" /></svg>
                </button>
                <button className="hover:text-white transition-colors p-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" x2="12" y1="19" y2="22" /></svg>
                </button>
              </div>
              <div className="h-6 w-[1px] bg-white/20"></div>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`You're in chat with ${character}!`}
                className="flex-1 bg-transparent text-white placeholder-white/30 focus:outline-none italic text-sm sm:text-lg font-light"
              />
              <button
                onClick={handleSendMessage}
                disabled={typing || !inputValue.trim()}
                className="text-white/70 hover:text-white transition-transform hover:scale-110 active:scale-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="m16 12-4-4-4 4" /><path d="M12 16V8" /></svg>
              </button>
            </div>
          </div>
        </div>
        {/* --- CHAT WINDOW END --- */}

      </main>
    </div>
  );
}
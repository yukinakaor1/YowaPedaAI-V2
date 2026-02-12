import React, { useState, useEffect, useRef } from 'react';
import { Menu, CircleUserRound, MessageSquare, Paperclip, Mic, CircleArrowUp, X, Bike, UserRound, Zap, Trophy, ChevronRight, LogOut, ArrowLeft, Brain, Timer, Route } from 'lucide-react';
import { sendMessageToGemini } from '../lib/gemini'; 

// --- LANDING PAGE COMPONENT ---
const LandingPage = ({ onStart }) => {
  return (
    <div className="min-h-screen w-full bg-[#03112b] overflow-x-hidden font-sans text-white relative">
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-cover bg-center grayscale fixed" 
        style={{ backgroundImage: `url('https://wallpapercave.com/wp/wp2293933.jpg')` }} 
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#03112b]/80 via-transparent to-[#03112b]" />
      
      <header className="relative z-10 px-6 py-8 lg:px-20 flex justify-between items-center border-b border-white/10 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <Bike className="w-8 h-8 text-blue-400" />
          <h1 className="text-2xl font-black tracking-tighter italic">YOWAPEDA<span className="text-blue-400">AI</span></h1>
        </div>
      </header>

      <main className="relative z-10 flex flex-col items-center pt-20 pb-32 px-6">
        <div className="text-center max-w-4xl mb-24">
          <div className="inline-block bg-blue-600/20 border border-blue-500/30 px-4 py-1 rounded-full text-blue-300 text-xs font-black uppercase tracking-widest mb-6">Hakone Academy Edition</div>
          <h2 className="text-5xl lg:text-8xl font-black italic tracking-tighter mb-6 leading-none uppercase">OVER THE <span className="text-blue-500">LIMIT.</span></h2>
          <p className="text-gray-400 text-lg lg:text-xl max-w-2xl mx-auto mb-10">Chat with the kings of the road. AI-powered Hakone Academy rivals await your challenge.</p>
          <button onClick={onStart} className="group relative inline-flex items-center gap-3 bg-white text-[#03112b] px-10 py-5 rounded-2xl font-black text-xl transition-all hover:bg-blue-500 hover:text-white shadow-[0_0_50px_rgba(59,130,246,0.3)] active:scale-95">
            START TRAINING <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mb-32">
          {['Kuroda Yukinari', 'Shinkai Yuto', 'Izumida Touichirou'].map((name) => (
            <div key={name} className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl hover:border-blue-400/50 transition-all group cursor-default">
              <Bike className="w-10 h-10 text-blue-400 mb-6 group-hover:rotate-12 transition-transform" />
              <h3 className="text-2xl font-bold italic uppercase tracking-tighter">{name}</h3>
              <div className="h-1 w-12 bg-blue-500 rounded-full mt-4 group-hover:w-full transition-all duration-500"></div>
            </div>
          ))}
        </div>

        <section className="w-full max-w-6xl">
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            <div className="lg:w-1/3">
              <h2 className="text-4xl font-black italic uppercase tracking-tighter text-blue-400 mb-4">The Will to Win</h2>
              <p className="text-gray-400 leading-relaxed">
                YowaPedaAi is a high-performance chat experience designed to bring the tactical world of competitive cycling to your screen. 
                Utilizing advanced AI models, we recreate the personalities and racing philosophies of the legendary Hakone Academy.
              </p>
            </div>
            
            <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { title: 'Neural Tactics', icon: <Brain />, desc: 'Powered by Gemini AI to simulate real-time racing strategies and character-specific dialogue.' },
                { title: 'Peak Performance', icon: <Zap />, desc: 'Discuss climbing techniques, sprint mechanics, or mental endurance with the best in the Inter-High.' },
                { title: 'Race Records', icon: <Timer />, desc: 'The AI retains the intensity of the race, allowing for deep, context-aware conversations.' },
                { title: 'The Hakone Path', icon: <Route />, desc: 'Specifically tuned for Hakone Academy fans who want to feel the heat of the road.' }
              ].map((item, i) => (
                <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-all">
                  <div className="text-blue-400 mb-4">{item.icon}</div>
                  <h4 className="text-lg font-black italic uppercase mb-2">{item.title}</h4>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

// --- MAIN APPLICATION COMPONENT ---
const YowamushiAi = () => {
  const [showApp, setShowApp] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeCharacter, setActiveCharacter] = useState('Izumida Touichirou');
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([]); // Start empty to allow typing effect on load

  const characterGreetings = {
    'Kuroda Yukinari': "Are we climbing, racing, or just talking at the start line?",
    'Shinkai Yuto': "What do you want to talk about?",
    'Izumida Touichirou': "Tell me, do you wish to talk cycling?"
  };

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Initial greeting effect when entering chat
  useEffect(() => {
    if (showApp && messages.length === 0) {
      resetToGreeting(activeCharacter);
    }
  }, [showApp]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping) return;
    const userMsg = inputValue;
    setInputValue('');
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const history = messages.slice(1).map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        message: m.text
      }));
      const responseText = await sendMessageToGemini(userMsg, activeCharacter, history);
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', text: responseText }]);
    } catch (error) {
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', text: "The road is blocked. (Error connecting to AI)" }]);
    } finally {
      setIsTyping(false);
    }
  };

  const resetToGreeting = (charName) => {
    setActiveCharacter(charName);
    setMessages([]); // Clear chat
    setIsTyping(true); // Show typing bubbles
    setIsSidebarOpen(false);
    
    // Simulate typing for 1.5 seconds before showing default line
    setTimeout(() => {
      setMessages([{ id: Date.now(), sender: 'bot', text: characterGreetings[charName] }]);
      setIsTyping(false);
    }, 1500);
  };

  if (!showApp) return <LandingPage onStart={() => setShowApp(true)} />;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#03112b] font-sans text-white relative">
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-cover bg-center grayscale" 
        style={{ backgroundImage: `url('https://static.wikia.nocookie.net/yowamushipedal/images/9/9d/Ahighplacecover.jpg/revision/latest?cb=20190804220737')` }} 
      />

      {isSidebarOpen && <div className="fixed inset-0 bg-black/70 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />}

      <aside className={`fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col h-full bg-[#03112b] p-5 border-r border-white/10 shadow-2xl`}>
        <div className="flex items-center justify-between mb-8 px-1">
          <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setShowApp(false)}>
            <ArrowLeft className="w-5 h-5 text-blue-400" />
            <h1 className="text-xl font-black italic tracking-tighter uppercase">YOWAPEDA<span className="text-blue-400">AI</span></h1>
          </div>
          <X className="lg:hidden cursor-pointer" onClick={() => setIsSidebarOpen(false)} />
        </div>

        <nav className="space-y-6">
          <div className="bg-[#1e3a8a]/30 p-3 rounded-xl border border-white/5 flex items-center gap-3">
             <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center font-black">U</div>
             <span className="font-bold text-sm tracking-wide">Username</span>
          </div>

          <div 
            onClick={() => resetToGreeting(activeCharacter)}
            className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer transition-all border border-white/10 active:scale-95"
          >
            <span className="font-bold text-sm">New Chat</span>
            <MessageSquare className="w-4 h-4 text-blue-400" />
          </div>

          <div className="space-y-2">
            <p className="text-[10px] font-black uppercase tracking-widest text-blue-400 px-1 mb-4">Elite Rivals</p>
            {Object.keys(characterGreetings).map(name => (
              <div 
                key={name}
                onClick={() => resetToGreeting(name)}
                className={`p-3 rounded-xl cursor-pointer transition-all border-2 ${activeCharacter === name ? 'bg-blue-600/30 border-blue-500 shadow-lg' : 'bg-[#03112b] border-transparent hover:bg-white/5'}`}
              >
                <span className="font-black italic text-sm">{name.split(' ')[0]}</span>
              </div>
            ))}
          </div>
        </nav>
      </aside>

      <main className="flex-1 relative flex flex-col items-center justify-center p-4 lg:p-8">
        <div className="lg:hidden flex w-full items-center justify-between mb-4 px-2">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-[#0d2545] rounded-lg"><Menu /></button>
          <span className="font-black italic text-blue-400 uppercase tracking-tighter">RACING: {activeCharacter.split(' ')[0]}</span>
          <button onClick={() => setShowApp(false)} className="p-2 bg-[#0d2545] rounded-lg"><LogOut className="w-5 h-5" /></button>
        </div>

        <div className="opacity-90 relative w-full max-w-3xl h-[85vh] lg:h-[80vh] bg-[#0d2545] rounded-[40px] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-8 py-6 border-b border-white/10 bg-[#0a1b33]">
            <h2 className="text-lg font-black italic tracking-tighter uppercase">Challenging <span className="text-blue-400">{activeCharacter}</span></h2>
            <button onClick={() => setShowApp(false)} className="flex items-center gap-2 bg-white/5 hover:bg-red-500/20 px-4 py-2 rounded-xl border border-white/10 transition-all text-[10px] font-black tracking-widest uppercase hover:text-red-400"><LogOut className="w-3 h-3" />Quit Race</button>
          </div>

          <div className="flex-1 overflow-y-auto px-8 py-8 space-y-6 custom-scrollbar bg-[#0d2545]">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-pop`}>
                <div className={`max-w-[85%] p-4 lg:p-5 rounded-2xl shadow-xl border ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-tr-none border-blue-400' : 'bg-[#1e3a8a]/40 text-white rounded-tl-none border-white/10'}`}>
                  <p className="text-sm font-bold italic leading-relaxed">{msg.text}</p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start animate-pop">
                <div className="bg-[#1e3a8a]/40 p-4 rounded-xl flex gap-1">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-8 bg-[#0a1b33] border-t border-white/10">
            <div className="relative flex items-center bg-[#1e3a8a]/20 rounded-2xl px-5 py-2 border border-white/10 focus-within:border-blue-500/50 transition-all">
              <div className="flex items-center gap-3 mr-3 text-white/50">
                <Paperclip className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
                <Mic className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
              </div>
              <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} placeholder={`Tell ${activeCharacter.split(' ')[0]} your next move...`} className="bg-transparent flex-1 outline-none py-3 text-sm font-black italic placeholder:text-gray-500" disabled={isTyping} />
              <button onClick={handleSendMessage} disabled={isTyping || !inputValue.trim()} className="bg-blue-600 p-2 rounded-xl hover:bg-blue-500 shadow-lg ml-2 transition-transform active:scale-90 disabled:opacity-50"><CircleArrowUp className="w-6 h-6" /></button>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(59, 130, 246, 0.3); border-radius: 10px; }
        @keyframes pop { 0% { opacity: 0; transform: translateY(10px); } 100% { opacity: 1; transform: translateY(0); } }
        .animate-pop { animation: pop 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default YowamushiAi;
import React, { useState, useEffect, useRef } from 'react';
import { Menu, UserCircle, MessageSquare, ChevronDown, Paperclip, Mic, SendHorizontal, X, Globe } from 'lucide-react';
import { sendMessageToGemini } from '../lib/gemini';

// --- Helper Component: Main Sidebar Navigation Items ---
const NavItem = ({ icon, label, onClick }) => (
  <div 
    onClick={onClick}
    className="flex items-center justify-between p-3 rounded-lg hover:bg-white/10 cursor-pointer transition-all group active:scale-95"
  >
    <span className="font-semibold text-sm">{label}</span>
    <span className="text-white group-hover:opacity-100">{icon}</span>
  </div>
);

// --- Helper Component: Character List Items ---
const CharacterItem = ({ label, onClick, isActive }) => (
  <div 
    onClick={onClick}
    className={`bg-white/10 rounded-lg p-3 cursor-pointer hover:bg-white/20 transition-all shadow-sm active:scale-95 border-2 ${
      isActive ? 'border-white/60 scale-105 shadow-lg bg-white/20' : 'border-transparent'
    }`}
  >
    <span className="font-bold text-sm text-white">{label}</span>
  </div>
);

// --- MAIN APPLICATION COMPONENT ---
const ChatInterface = () => {
  const characterGreetings = {
    'Kuroda Yukinari': "User.Name000, are we climbing, racing, or just talking at the start line?",
    'Shinkai Yuto': "What do you want to talk about?",
    'Izumida Touichirou': "User.Name000. Tell me, do you wish to talk cycling?"
  };

  const characterThemes = {
    'Kuroda Yukinari': {
      glow: 'shadow-[0_0_40px_rgba(30,58,138,0.4)]',
      border: 'border-[#1e3a8a]/30',
      accent: 'text-blue-300',
      msgBg: 'bg-[#1e3a8a]/20'
    },
    'Shinkai Yuto': {
      glow: 'shadow-[0_0_40px_rgba(239,68,68,0.4)]',
      border: 'border-red-600/30',
      accent: 'text-red-300',
      msgBg: 'bg-red-900/20'
    },
    'Izumida Touichirou': {
      glow: 'shadow-[0_0_40px_rgba(34,197,94,0.4)]',
      border: 'border-green-600/30',
      accent: 'text-green-300',
      msgBg: 'bg-green-900/20'
    }
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeCharacter, setActiveCharacter] = useState('Kuroda Yukinari');
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: characterGreetings['Kuroda Yukinari']
    }
  ]);

  const messagesEndRef = useRef(null);
  const currentTheme = characterThemes[activeCharacter];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSwitchCharacter = (name) => {
    setActiveCharacter(name);
    setMessages([
      {
        id: Date.now(),
        sender: 'bot',
        text: characterGreetings[name]
      }
    ]);
    setInputValue('');
    setIsSidebarOpen(false);
  };

  const handleNewChat = () => {
    setMessages([
      {
        id: Date.now(),
        sender: 'bot',
        text: characterGreetings[activeCharacter]
      }
    ]);
    setInputValue('');
    setIsSidebarOpen(false);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userMessage = inputValue;
    setInputValue('');

    // Add user message
    const newUserMsg = {
      id: Date.now(),
      sender: 'user',
      text: userMessage
    };
    setMessages(prev => [...prev, newUserMsg]);
    setIsTyping(true);

    try {
      // Prepare history (exclude initial greeting and current message)
      const historyForApi = messages
        .slice(1) // Skip first greeting
        .map(m => ({
          role: m.sender === 'user' ? 'user' : 'model',
          message: m.text
        }));

      const responseText = await sendMessageToGemini(userMessage, activeCharacter, historyForApi);
      
      setMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          sender: 'bot',
          text: responseText
        }
      ]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          sender: 'bot',
          text: `Error: ${error?.message || String(error)}`
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#bfdbfe] font-sans text-white">
      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0
        flex flex-col h-full bg-[#03112b] p-5 border-r border-white/5
      `}>
        {/* Header */}
        <div className="flex items-center justify-between mb-8 px-1">
          <div className="flex items-center gap-2">
            <Globe className="w-6 h-6 text-white" />
            <h1 className="text-xl font-bold tracking-tight text-white">YowaPedaAi</h1>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-1"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          <Menu className="hidden lg:block w-6 h-6 cursor-pointer text-white" />
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3 mb-8 px-1">
          <UserCircle className="w-9 h-9 text-white" />
          <span className="font-semibold text-sm">User.Name000</span>
        </div>

        {/* Navigation */}
        <nav className="space-y-1 mb-6">
          <NavItem 
            icon={<MessageSquare size={20} />} 
            label="New Chat"
            onClick={handleNewChat}
          />
        </nav>

        {/* Characters Section */}
        <div className="space-y-2 mb-6">
          <div className="bg-white/10 rounded-lg p-3 flex justify-between items-center shadow-inner">
            <span className="font-bold text-sm text-white">👤 Characters</span>
          </div>
          <div className="space-y-2">
            {Object.keys(characterGreetings).map((charName) => (
              <CharacterItem
                key={charName}
                label={charName.split(' ')[0]}
                isActive={activeCharacter === charName}
                onClick={() => handleSwitchCharacter(charName)}
              />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-4 border-t border-white/5">
          <div className="bg-white text-[#03112b] rounded-lg p-3 flex items-center gap-2 shadow-xl">
            <div className="w-7 h-7 bg-[#03112b] rounded-full flex items-center justify-center text-[10px] text-white font-bold">
              U
            </div>
            <span className="font-bold text-sm truncate">User.Name000</span>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main 
        className="flex-1 relative flex items-center justify-center p-2 sm:p-4 lg:p-6 bg-cover bg-center"
        style={{ 
          backgroundImage: `url('https://i.pinimg.com/736x/28/76/3e/28763eb80c7a8b668ebc7634be99b380.jpg')` 
        }}
      >
        {/* Chat Container */}
        <div className={`
          relative w-full max-w-5xl h-full lg:h-[90vh] 
          bg-[#0f2550]/90 backdrop-blur-xl 
          rounded-2xl lg:rounded-[40px] border 
          transition-all duration-700 
          flex flex-col p-4 sm:p-6 lg:p-10
          ${currentTheme.glow} ${currentTheme.border}
        `}>
          {/* Header */}
          <div className="flex items-center gap-3 mb-6 lg:mb-8">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 text-white"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-1">
              <h2 className={`font-bold text-lg transition-colors duration-500 ${currentTheme.accent}`}>
                Chatting with {activeCharacter.split(' ')[0]}
              </h2>
              <ChevronDown className="w-4 h-4 text-white" />
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto space-y-6 lg:space-y-8 pr-2 custom-scrollbar">
            {messages.map((msg) => (
              <div 
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-pop`}
              >
                <div className={`
                  max-w-[85%] lg:max-w-[65%] 
                  p-4 lg:p-6 
                  rounded-2xl lg:rounded-3xl 
                  shadow-xl border 
                  transition-all duration-500
                  ${msg.sender === 'user' 
                    ? 'bg-[#1e3a8a]/50 text-white rounded-tr-none border-white/10' 
                    : `${currentTheme.msgBg} text-white rounded-tl-none ${currentTheme.border} backdrop-blur-md`
                  }
                `}>
                  <p className="text-xs lg:text-sm font-medium leading-relaxed text-white">
                    {msg.text}
                  </p>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start animate-pop">
                <div className={`p-4 lg:p-6 rounded-2xl lg:rounded-3xl shadow-xl border ${currentTheme.msgBg} ${currentTheme.border} backdrop-blur-md`}>
                  <div className="flex gap-1 items-center h-4 text-white">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <div className="mt-4 lg:mt-8 flex justify-center">
            <div className={`
              relative w-full max-w-2xl 
              bg-[#0a4559] border 
              transition-all duration-700 
              rounded-full flex items-center 
              px-4 py-3 lg:px-6 lg:py-4 
              shadow-2xl
              ${currentTheme.border}
            `}>
              <div className="flex items-center gap-3 lg:gap-4 mr-2 lg:mr-4">
                <Paperclip className="w-4 lg:w-5 h-4 lg:h-5 text-white/70 hover:text-white cursor-pointer transition-colors" />
                <Mic className="w-4 lg:w-5 h-4 lg:h-5 text-white/70 hover:text-white cursor-pointer transition-colors" />
              </div>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Chatting with ${activeCharacter.split(' ')[0]}...`}
                className="bg-transparent flex-1 outline-none text-white text-xs lg:text-sm placeholder:text-white/30 font-medium"
                disabled={isTyping}
              />
              <button 
                onClick={handleSendMessage}
                disabled={isTyping || !inputValue.trim()}
                className="ml-2 lg:ml-4 bg-white hover:bg-gray-200 transition-all rounded-full p-2 lg:p-2.5 shadow-lg active:scale-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <SendHorizontal className="w-4 lg:w-5 h-4 lg:h-5 text-[#0a4559]" />
              </button>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
        @keyframes pop {
          0% {
            opacity: 0;
            transform: scale(0.95) translateY(10px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-pop {
          animation: pop 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ChatInterface;
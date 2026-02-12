import React, { useState, useEffect, useRef } from 'react';
import { Route, MessageSquare, Paperclip, Mic, CircleArrowUp, X, Bike, UserRound, Zap, ChevronRight, LogOut, ArrowLeft, Brain, Timer} from 'lucide-react';
import { sendMessageToGemini } from '../lib/gemini'; 

// --- CHARACTER DATA ---
const CHARACTER_PROFILES = [
  {
    name: 'Kuroda Yukinari',
    title: 'The Black Cat of Hakone',
    description: 'A tactical genius and vice-captain of Hakone Academy. Known for his "Black Cat" climbing style, he uses his flexible body and sharp intellect to corner rivals.',
    image: 'https://ami.animecharactersdatabase.com/uploads/chars/5688-347584970.jpg',
    specialty: 'Tactical Climbing'
  },
  {
    name: 'Shinkai Yuto',
    title: 'The Peak Hornet',
    description: 'The younger brother of the legendary sprinter Shinkai Hayato. Yuto is an elite climber who strikes with the precision and aggression of a hornet.',
    image: 'https://ami.animecharactersdatabase.com/uploads/chars/5688-1449331564.jpg',
    specialty: 'High-Cadence Attack'
  },
  {
    name: 'Izumida Touichirou',
    title: 'The Absolute Captain',
    description: 'The leader of Hakone Academy who pushes his body to the absolute limit. He treats his muscles (Andy, Frank, and Fabian) as his closest teammates.',
    image: 'https://ami.animecharactersdatabase.com/uploads/chars/5688-1483881039.jpg',
    specialty: 'Power Sprinting'
  }
];

// --- LANDING PAGE COMPONENT ---
const LandingPage = ({ onStart }) => {
  const [showCharacters, setShowCharacters] = useState(false);

  return (
    <div className="min-h-screen w-full bg-[#03112b] overflow-x-hidden font-sans text-white relative">
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-cover bg-center grayscale fixed" 
        style={{ backgroundImage: `url('https://wallpapercave.com/wp/wp2293933.jpg')` }} 
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#03112b]/80 via-transparent to-[#03112b]" />
      
      {/* Header */}
      <header className="relative z-10 px-6 py-8 lg:px-20 flex justify-between items-center border-b border-white/10 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <Bike className="w-8 h-8 text-blue-400" />
          <h1 className="text-2xl font-black tracking-tighter italic">YOWAPEDA<span className="text-blue-400">AI</span></h1>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowCharacters(true)}
            className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:text-blue-400 transition-colors"
          >
            <UserRound className="w-4 h-4" />
            Characters
          </button>
        </div>
      </header>

      {/* Character Profile Modal */}
      {showCharacters && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 animate-pop">
          <div className="bg-[#0d2545] w-full max-w-5xl rounded-[40px] border-2 border-white/10 overflow-hidden relative flex flex-col max-h-[90vh]">
            <button 
              onClick={() => setShowCharacters(false)}
              className="absolute top-6 right-6 p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="p-8 lg:p-12 overflow-y-auto custom-scrollbar">
              <h2 className="text-3xl lg:text-5xl font-black italic uppercase tracking-tighter mb-10 text-blue-400">Characters</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {CHARACTER_PROFILES.map((char) => (
                  <div key={char.name} className="flex flex-col bg-white/5 rounded-3xl border border-white/10 overflow-hidden hover:border-blue-500/50 transition-all group">
                    <div className="h-64 overflow-hidden relative">
                      <img src={char.image} alt={char.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-105 group-hover:scale-100" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0d2545] to-transparent" />
                      <div className="absolute bottom-4 left-6">
                        <span className="text-[10px] font-black uppercase tracking-widest bg-blue-600 px-2 py-1 rounded-md">{char.specialty}</span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-black italic uppercase tracking-tighter mb-1">{char.name}</h3>
                      <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-4">{char.title}</p>
                      <p className="text-gray-400 text-sm leading-relaxed">{char.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="relative z-10 flex flex-col items-center pt-20 pb-32 px-6">
        <div className="text-center max-w-4xl mb-24">
          <div className="inline-block bg-blue-600/20 border border-blue-500/30 px-4 py-1 rounded-full text-blue-300 text-xs font-black uppercase tracking-widest mb-6">Hakone Academy Edition</div>
          <h2 className="text-5xl lg:text-8xl font-black italic tracking-tighter mb-6 leading-none uppercase">OVER THE <span className="text-blue-500">LIMIT.</span></h2>
          <p className="text-gray-400 text-lg lg:text-xl max-w-2xl mx-auto mb-10">Chat with the kings of the road. AI-powered Hakone Academy rivals await your challenge.</p>
          <button onClick={onStart} className="group relative inline-flex items-center gap-3 bg-white text-[#03112b] px-10 py-5 rounded-2xl font-black text-xl transition-all hover:bg-blue-500 hover:text-white shadow-[0_0_50px_rgba(59,130,246,0.3)]">
            START TRAINING <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Feature Preview (Icons Only) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mb-32">
          {CHARACTER_PROFILES.map((char) => (
            <div key={char.name} className="bg-white/5 border border-white/10 p-8 rounded-3xl transition-all group cursor-default">
              <Bike className="w-10 h-10 text-blue-400 mb-6 group-hover:rotate-12 transition-transform" />
              <h3 className="text-2xl font-bold italic uppercase tracking-tighter">{char.name}</h3>
              <div className="h-1 w-12 bg-blue-500 rounded-full mt-4 group-hover:w-full transition-all duration-500"></div>
            </div>
          ))}
        </div>

        <section className="w-full max-w-6xl">
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            <div className="lg:w-1/3">
              <h2 className="text-4xl font-black italic uppercase tracking-tighter text-blue-400 mb-4">ABOUT</h2>
              <p className="text-gray-400 leading-relaxed">
                YowaPedaAI is an immersive roleplay experience designed to bring the elite members of Hakone Academy directly to you. From high-stakes race banter to quiet moments off the road, your story starts here. 
              </p>
            </div>
            
           <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            { title: 'ELITE PERSONAS', icon: <Brain />, desc: 'AUTHENTIC VOICES Powered by GeminiAI to capture the unique speech patterns, quirks, and attitudes of Kuroda, Yuto, and Izumida. It\'s more than a chat—it\'s them.' },
            { title: 'LIMITLESS SCENARIOS', icon: <Zap />, desc: 'BEYOND THE RACE Whether it\'s a grueling climb up the mountain, a post-training recovery, or a casual after-school AU, the narrative is entirely in your hands.' },
            { title: 'PERSISTENT MEMORY', icon: <Timer />, desc: 'EVOLVING BONDS The AI remembers your past interactions and shared history, allowing your relationships—and the drama—to grow deeper with every message.' },
            { title: 'THE HAKONE SPIRIT', icon: <Route />, desc: 'THE KING\'S PRIDE Specifically tuned for fans who want to experience the intensity and brotherhood of Hakone Academy. Feel the heat of the road and the heart of the team.' }
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
  const [messages, setMessages] = useState([]);

  const characterGreetings = {
    'Kuroda Yukinari': "Are we climbing, racing, or just talking at the start line?",
    'Shinkai Yuto': "What do you want to talk about?",
    'Izumida Touichirou': "Tell me, do you wish to talk cycling?"
  };

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (showApp && messages.length === 0) resetToGreeting(activeCharacter);
  }, [showApp]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping) return;
    const userMsg = inputValue;
    setInputValue('');
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const history = messages.slice(1).map(m => ({ role: m.sender === 'user' ? 'user' : 'model', message: m.text }));
      const responseText = await sendMessageToGemini(userMsg, activeCharacter, history);
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', text: responseText }]);
    } catch (error) {
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', text: "Road blocked... check your connection." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const resetToGreeting = (charName) => {
    setActiveCharacter(charName);
    setMessages([]);
    setIsTyping(true);
    setIsSidebarOpen(false);
    setTimeout(() => {
      setMessages([{ id: Date.now(), sender: 'bot', text: characterGreetings[charName] }]);
      setIsTyping(false);
    }, 1500);
  };

  if (!showApp) return <LandingPage onStart={() => setShowApp(true)} />;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#03112b] font-sans text-white relative">
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-cover bg-center grayscale fixed" 
        style={{ backgroundImage: `url('https://static.wikia.nocookie.net/yowamushipedal/images/9/9d/Ahighplacecover.jpg/revision/latest?cb=20190804220737')` }} 
      />

      <aside className={`fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col h-full bg-[#03112b] p-5 border-r border-white/10 shadow-2xl`}>
        <div className="flex items-center justify-between mb-8 px-1">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setShowApp(false)}>
            <ArrowLeft className="w-5 h-5 text-blue-400" />
            <h1 className="text-xl font-black italic tracking-tighter uppercase">YOWAPEDA<span className="text-blue-400">AI</span></h1>
          </div>
          <X className="lg:hidden" onClick={() => setIsSidebarOpen(false)} />
        </div>

        <nav className="space-y-6">
          <div className="bg-[#1e3a8a]/30 p-3 rounded-xl border border-white/5 flex items-center gap-3">
             <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center font-black text-xs">U</div>
             <span className="font-bold text-sm">Username</span>
          </div>

          <div onClick={() => resetToGreeting(activeCharacter)} className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer transition-all active:scale-95">
            <span className="font-bold text-sm">New Chat</span>
            <MessageSquare className="w-4 h-4 text-blue-400" />
          </div>

          <div className="space-y-2">
            <p className="text-[10px] font-black uppercase tracking-widest text-blue-400 px-1 mb-4">Elite Rivals</p>
            {Object.keys(characterGreetings).map(name => (
              <div key={name} onClick={() => resetToGreeting(name)} className={`p-3 rounded-xl cursor-pointer transition-all border-2 ${activeCharacter === name ? 'bg-blue-600/30 border-blue-500 shadow-lg' : 'bg-transparent border-transparent hover:bg-white/5'}`}>
                <span className="font-black italic text-sm">{name.split(' ')[0]}</span>
              </div>
            ))}
          </div>
        </nav>
      </aside>

      <main className="opacity-90 flex-1 relative flex flex-col items-center justify-center p-4 lg:p-8">
        <div className="relative w-full max-w-3xl h-[85vh] lg:h-[80vh] bg-[#0d2545] rounded-[40px] border border-white/10 shadow-2xl flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-8 py-6 border-b border-white/10 bg-[#0a1b33]">
            <h2 className="text-lg font-black italic tracking-tighter uppercase tracking-wide">Challenging <span className="text-blue-400">{activeCharacter}</span></h2>
            <button onClick={() => setShowApp(false)} className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase hover:text-red-400"><LogOut className="w-3 h-3" />Quit Race</button>
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
              <div className="flex justify-start animate-pop"><div className="bg-[#1e3a8a]/40 p-4 rounded-xl flex gap-1"><span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></span><span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span><span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span></div></div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-8 bg-[#0a1b33] border-t border-white/10">
            <div className="relative flex items-center bg-[#1e3a8a]/20 rounded-2xl px-5 py-2 border border-white/10 focus-within:border-blue-500/50">
              <div className="flex items-center gap-3 mr-3 text-white/50"><Paperclip className="w-5 h-5 cursor-pointer hover:text-white" /><Mic className="w-5 h-5 cursor-pointer hover:text-white" /></div>
              <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} placeholder={`Type your strategy...`} className="bg-transparent flex-1 outline-none py-3 text-sm font-black italic placeholder:text-gray-500" disabled={isTyping} />
              <button onClick={handleSendMessage} disabled={isTyping || !inputValue.trim()} className="bg-blue-600 p-2 rounded-xl ml-2"><CircleArrowUp className="w-6 h-6" /></button>
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
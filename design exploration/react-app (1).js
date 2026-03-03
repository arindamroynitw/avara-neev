import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';

const customStyles = {
  fontSerifDisplay: {
    fontFamily: "'Cormorant Garamond', serif",
  },
  fontSansBody: {
    fontFamily: "'Manrope', sans-serif",
  },
  textGoldGradient: {
    background: 'linear-gradient(135deg, #F0D588 0%, #D4AF37 50%, #B8860B 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  glassPanel: {
    background: 'rgba(255, 253, 248, 0.7)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
  },
  chatDrawerOpen: {
    transform: 'translateY(0)',
    transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
  },
  chatDrawerClosed: {
    transform: 'translateY(320px)',
    transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
  },
  textureGrain: {
    backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E\")",
  },
};

const HomePage = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [activeNav, setActiveNav] = useState('home');

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,400&family=Manrope:wght@200;300;400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  const handleSendMessage = () => {
    if (messageText.trim()) {
      setMessageText('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div
      className="w-[400px] h-[867px] bg-[#F9F7F2] rounded-[20px] shadow-2xl overflow-hidden relative flex flex-col"
      style={customStyles.fontSansBody}
    >
      {/* Header */}
      <div
        className="bg-[#1C1915] text-[#F9F7F2] pt-12 pb-16 px-6 relative rounded-b-[40px] z-0"
        style={customStyles.textureGrain}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37] opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

        <div className="flex justify-between items-center mb-8 relative z-10">
          <button className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#D4AF37]">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          <div className="text-2xl tracking-wide font-bold" style={customStyles.fontSerifDisplay}>NEEV.</div>
          <button className="w-10 h-10 rounded-full bg-[#2C2824] flex items-center justify-center relative border border-[#D4AF37]/30">
            <span className="absolute top-2 right-2.5 w-1.5 h-1.5 bg-[#D4AF37] rounded-full shadow-[0_0_8px_#D4AF37]"></span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F9F7F2" strokeWidth="1.5">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
          </button>
        </div>

        <div className="text-center relative z-10">
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#8C7B65] mb-2 font-semibold">Total Liquidity</p>
          <h1 className="text-6xl font-normal tracking-tight" style={{ ...customStyles.fontSerifDisplay, ...customStyles.textGoldGradient }}>24.50L</h1>
          <div className="flex justify-center items-center gap-3 mt-4">
            <div className="px-3 py-1.5 bg-[#2C2824] rounded-full border border-white/5 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
              <span className="text-xs font-medium text-green-400">+8.4% YIELD</span>
            </div>
            <div className="px-3 py-1.5 bg-[#2C2824] rounded-full border border-white/5 flex items-center gap-2">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="3">
                <path d="M12 2v20M2 12h20"></path>
              </svg>
              <span className="text-xs font-medium text-[#D4AF37]">₹540 ACCRUAL</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 -mt-8 relative z-10 flex flex-col overflow-hidden">
        <div className="h-full overflow-y-auto pb-28 px-5" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>

          {/* Morning Brief Card */}
          <div className="bg-white rounded-2xl p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#E5E0D5] mb-6 flex gap-4 items-start relative overflow-hidden">
            <div className="absolute right-0 top-0 w-24 h-24 bg-gradient-to-br from-[#D4AF37]/10 to-transparent rounded-bl-full -mr-8 -mt-8"></div>
            <div className="relative shrink-0">
              <div className="w-12 h-12 rounded-full p-[2px] bg-gradient-to-br from-[#D4AF37] to-[#E5E0D5]">
                <img
                  src="https://ui-avatars.com/api/?name=Arjun&background=1C1915&color=D4AF37"
                  alt="Concierge"
                  className="w-full h-full rounded-full object-cover border-2 border-white"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-white p-[2px] rounded-full">
                <div className="w-4 h-4 bg-[#D4AF37] rounded-full flex items-center justify-center">
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                </div>
              </div>
            </div>
            <div className="flex-1 z-10">
              <div className="flex justify-between items-baseline mb-1">
                <h4 className="font-bold text-lg text-[#1C1915]" style={customStyles.fontSerifDisplay}>Morning Brief</h4>
                <span className="text-[10px] text-[#8C7B65] font-semibold uppercase tracking-wider">09:30 AM</span>
              </div>
              <p className="text-sm text-[#5C554B] leading-relaxed italic">
                "Arjun, your curated portfolio outperformed standard savings by{' '}
                <span className="text-[#B8860B] font-medium border-b border-[#B8860B]/30">₹1,200</span>
                {' '}this week. Shall we reinvest?"
              </p>
            </div>
          </div>

          {/* Opportunities Section */}
          <div className="mb-8">
            <div className="flex justify-between items-end mb-4 px-1">
              <h3 className="text-2xl text-[#1C1915]" style={customStyles.fontSerifDisplay}>Opportunities</h3>
            </div>

            <div className="bg-[#F0EDE6] rounded-[24px] overflow-hidden relative min-h-[180px]">
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(45deg, transparent 25%, rgba(212,175,55,0.05) 25%, rgba(212,175,55,0.05) 50%, transparent 50%, transparent 75%, rgba(212,175,55,0.05) 75%, rgba(212,175,55,0.05) 100%)',
                  backgroundSize: '20px 20px',
                }}
              ></div>
              <div className="absolute right-0 bottom-0 w-32 h-32 border-[20px] border-[#D4AF37]/10 rounded-full translate-x-1/3 translate-y-1/3"></div>
              <div className="relative p-6 h-full flex flex-col justify-between z-10">
                <div>
                  <span className="inline-block px-2 py-1 bg-[#D4AF37] text-white text-[10px] font-bold tracking-widest uppercase rounded mb-3">Exclusive</span>
                  <h3 className="text-3xl leading-none text-[#1C1915] mb-1" style={customStyles.fontSerifDisplay}>Private Reserve</h3>
                  <p className="text-[#5C554B] text-xs font-medium max-w-[60%]">Deploy excess capital into high-yield instruments.</p>
                </div>
                <div className="flex items-center gap-3 mt-6">
                  <button className="bg-[#1C1915] text-[#F9F7F2] px-6 py-3 rounded-full text-xs font-bold tracking-widest uppercase shadow-lg hover:bg-[#2C2824] transition-colors">
                    Invest Now
                  </button>
                  <span className="text-xs italic text-[#8C7B65]" style={customStyles.fontSerifDisplay}>7.2% APY</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Drawer */}
      <div
        className="absolute bottom-0 left-0 w-full bg-[#1C1915] rounded-t-[32px] z-40 p-6 pt-10 shadow-[0_-20px_40px_rgba(0,0,0,0.4)] cursor-pointer"
        style={chatOpen ? customStyles.chatDrawerOpen : customStyles.chatDrawerClosed}
        onClick={() => !chatOpen && setChatOpen(true)}
      >
        <div
          className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-1 bg-white/20 rounded-full"
          onClick={(e) => { e.stopPropagation(); setChatOpen(!chatOpen); }}
        ></div>

        <div className="flex items-start gap-4 mb-6">
          <div className="w-8 h-8 rounded-full bg-[#2C2824] border border-[#D4AF37]/40 flex items-center justify-center shrink-0">
            <span className="text-[#D4AF37] text-sm italic" style={customStyles.fontSerifDisplay}>N.</span>
          </div>
          <div className="space-y-3">
            <p className="text-[#F9F7F2] font-light text-sm leading-relaxed tracking-wide" style={customStyles.fontSansBody}>
              Arjun, looking at your current cash surplus, are you planning any upcoming travel or major leisure spends this quarter?
            </p>
            <p className="text-[#8C7B65] font-light text-[13px]" style={customStyles.fontSansBody}>
              I can suggest short-term high-yield buckets if your capital is free for 60+ days.
            </p>
          </div>
        </div>

        <div className="relative" onClick={(e) => e.stopPropagation()}>
          <textarea
            className="w-full bg-[#2C2824] border border-white/5 rounded-2xl p-4 pr-14 text-sm text-[#F9F7F2] font-light placeholder:text-[#5C554B] resize-none focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/30"
            placeholder="Type your plans..."
            rows={3}
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={handleKeyDown}
            style={customStyles.fontSansBody}
          ></textarea>
          <button
            className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-[#D4AF37] flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.4)] hover:scale-105 transition-transform"
            onClick={handleSendMessage}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1C1915" strokeWidth="2.5">
              <path d="M22 2L11 13"></path>
              <path d="M22 2L15 22L11 13L2 9L22 2Z"></path>
            </svg>
          </button>
        </div>

        <div className="h-20"></div>
      </div>

      {/* Bottom Navigation */}
      <nav
        className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] rounded-full p-2 px-6 flex justify-between items-center shadow-[0_20px_40px_rgba(0,0,0,0.1)] z-50"
        style={customStyles.glassPanel}
      >
        <button
          className="flex flex-col items-center gap-1 p-2 group"
          onClick={() => setActiveNav('home')}
        >
          <div className="relative">
            <svg className={`w-5 h-5 ${activeNav === 'home' ? 'text-[#1C1915]' : 'text-[#8C7B65]'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            {activeNav === 'home' && (
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#1C1915] rounded-full"></span>
            )}
          </div>
          <span className={`text-[9px] font-bold tracking-widest uppercase ${activeNav === 'home' ? 'text-[#1C1915]' : 'text-[#8C7B65]'}`}>Home</span>
        </button>

        <button
          className="flex flex-col items-center gap-1 p-2"
          onClick={() => setActiveNav('invest')}
        >
          <svg className={`w-5 h-5 ${activeNav === 'invest' ? 'text-[#1C1915]' : 'text-[#8C7B65]'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="1" x2="12" y2="23"></line>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
          </svg>
          <span className={`text-[9px] font-bold tracking-widest uppercase ${activeNav === 'invest' ? 'text-[#1C1915]' : 'text-[#8C7B65]'}`}>Invest</span>
        </button>

        <button
          className="flex flex-col items-center gap-1 p-2"
          onClick={() => setActiveNav('activity')}
        >
          <svg className={`w-5 h-5 ${activeNav === 'activity' ? 'text-[#1C1915]' : 'text-[#8C7B65]'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
          </svg>
          <span className={`text-[9px] font-bold tracking-widest uppercase ${activeNav === 'activity' ? 'text-[#1C1915]' : 'text-[#8C7B65]'}`}>Activity</span>
        </button>

        <button
          className="flex flex-col items-center gap-1 p-2"
          onClick={() => setActiveNav('private')}
        >
          <svg className={`w-5 h-5 ${activeNav === 'private' ? 'text-[#1C1915]' : 'text-[#8C7B65]'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          <span className={`text-[9px] font-bold tracking-widest uppercase ${activeNav === 'private' ? 'text-[#1C1915]' : 'text-[#8C7B65]'}`}>Private</span>
        </button>
      </nav>
    </div>
  );
};

const App = () => {
  return (
    <Router basename="/">
      <div
        className="bg-[#E5E0D5] flex justify-center items-center min-h-screen p-4"
        style={{ fontFamily: "'Manrope', sans-serif", color: '#262118' }}
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
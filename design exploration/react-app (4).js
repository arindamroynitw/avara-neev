import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Link } from 'react-router-dom';

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
  chatBubbleAdvisor: {
    background: '#2C2824',
    color: '#F9F7F2',
    borderRadius: '16px 16px 16px 4px',
  },
  chatBubbleUser: {
    background: '#E5E0D5',
    color: '#1C1915',
    borderRadius: '16px 16px 4px 16px',
  },
};

const HomePage = () => {
  const [chatInput, setChatInput] = useState('');
  const [activeNav, setActiveNav] = useState('home');

  const handleSendMessage = () => {
    if (chatInput.trim()) {
      setChatInput('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div
      className="w-full h-full max-w-[400px] max-h-[867px] bg-[#F9F7F2] rounded-[20px] shadow-2xl overflow-hidden relative flex flex-col"
      style={customStyles.fontSansBody}
    >
      {/* Header */}
      <div
        className="bg-[#1C1915] text-[#F9F7F2] pt-12 pb-16 px-6 relative rounded-b-[40px] z-0"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E\")",
        }}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37] opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

        <div className="flex justify-between items-center mb-8 relative z-10">
          <button className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[#D4AF37]"
            >
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>

          <div className="text-2xl tracking-wide font-bold" style={customStyles.fontSerifDisplay}>
            NEEV.
          </div>

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
          <h1
            className="text-6xl font-normal tracking-tight"
            style={{ ...customStyles.fontSerifDisplay, ...customStyles.textGoldGradient }}
          >
            24.50L
          </h1>

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
        <div
          className="h-full overflow-y-auto pb-28 px-5"
          style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
        >
          {/* Private Advisor Chat */}
          <div className="bg-white rounded-2xl p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#E5E0D5] mb-6 flex flex-col gap-4 relative overflow-hidden">
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full p-[1px] bg-gradient-to-br from-[#D4AF37] to-[#E5E0D5]">
                  <img
                    src="https://ui-avatars.com/api/?name=Arjun&background=1C1915&color=D4AF37"
                    alt="Concierge"
                    className="w-full h-full rounded-full object-cover border-[1px] border-white"
                  />
                </div>
                <h4 className="font-bold text-md text-[#1C1915]" style={customStyles.fontSerifDisplay}>
                  Private Advisor
                </h4>
              </div>
              <span className="text-[10px] text-[#8C7B65] font-semibold uppercase tracking-wider">09:30 AM</span>
            </div>

            <div className="flex flex-col gap-3 text-sm">
              <div className="p-3 max-w-[85%] self-start italic" style={customStyles.chatBubbleAdvisor}>
                "Arjun, your portfolio is well-positioned for the quarter. Do you have any upcoming travel plans? I'd like to account for potential cash impact."
              </div>
              <div className="p-3 max-w-[80%] self-end" style={customStyles.chatBubbleUser}>
                "Thinking about a family trip to Tuscany in June. Probably around ₹15L total."
              </div>
              <div className="p-3 max-w-[85%] self-start italic" style={customStyles.chatBubbleAdvisor}>
                "Understood. We can stagger some liquidations in May to minimize tax impact. Should I draft the strategy?"
              </div>
            </div>

            <div className="mt-4 relative">
              <input
                type="text"
                placeholder="Tell me about your plans..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-[#F4F1EA] border border-[#E5E0D5] rounded-full py-3 px-5 text-sm text-[#1C1915] placeholder-[#8C7B65] focus:outline-none focus:border-[#D4AF37] transition-colors"
              />
              <button
                onClick={handleSendMessage}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#1C1915] rounded-full flex items-center justify-center"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2.5">
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"></path>
                </svg>
              </button>
            </div>
          </div>

          {/* Opportunities */}
          <div className="mb-8">
            <div className="flex justify-between items-end mb-4 px-1">
              <h3 className="text-2xl text-[#1C1915]" style={customStyles.fontSerifDisplay}>
                Opportunities
              </h3>
              <div className="flex gap-2">
                <button className="w-8 h-8 rounded-full border border-[#D4AF37] flex items-center justify-center">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#D4AF37"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M15 18l-6-6 6-6"></path>
                  </svg>
                </button>
                <button className="w-8 h-8 rounded-full bg-[#1C1915] text-[#D4AF37] flex items-center justify-center">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 18l6-6-6-6"></path>
                  </svg>
                </button>
              </div>
            </div>

            <div className="bg-[#F0EDE6] rounded-[24px] overflow-hidden relative min-h-[180px] group cursor-pointer transition-transform hover:scale-[1.02]">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    'linear-gradient(45deg,transparent 25%,rgba(212,175,55,0.05) 25%,rgba(212,175,55,0.05) 50%,transparent 50%,transparent 75%,rgba(212,175,55,0.05) 75%,rgba(212,175,55,0.05) 100%)',
                  backgroundSize: '20px 20px',
                }}
              ></div>
              <div className="absolute right-0 bottom-0 w-32 h-32 border-[20px] border-[#D4AF37]/10 rounded-full translate-x-1/3 translate-y-1/3"></div>
              <div className="absolute right-0 bottom-0 w-48 h-48 border-[1px] border-[#D4AF37]/20 rounded-full translate-x-1/3 translate-y-1/3"></div>
              <div className="relative p-6 h-full flex flex-col justify-between z-10">
                <div>
                  <span className="inline-block px-2 py-1 bg-[#D4AF37] text-white text-[10px] font-bold tracking-widest uppercase rounded mb-3">
                    Exclusive
                  </span>
                  <h3 className="text-3xl leading-none text-[#1C1915] mb-1" style={customStyles.fontSerifDisplay}>
                    Private Reserve
                  </h3>
                  <p className="text-[#5C554B] text-xs font-medium max-w-[60%]">
                    Deploy excess capital into high-yield instruments.
                  </p>
                </div>
                <div className="flex items-center gap-3 mt-6">
                  <button className="bg-[#1C1915] text-[#F9F7F2] px-6 py-3 rounded-full text-xs font-bold tracking-widest uppercase shadow-lg group-hover:bg-[#D4AF37] transition-colors">
                    Invest Now
                  </button>
                  <span className="text-xs italic text-[#8C7B65]" style={customStyles.fontSerifDisplay}>
                    7.2% APY
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Holdings */}
          <div>
            <div className="flex justify-between items-baseline mb-4 px-1 border-b border-[#E5E0D5] pb-2">
              <h3 className="text-2xl text-[#1C1915]" style={customStyles.fontSerifDisplay}>
                Holdings
              </h3>
              <a href="#" className="text-[10px] font-bold text-[#B8860B] tracking-widest hover:text-[#1C1915] transition-colors">
                VIEW ALL
              </a>
            </div>
            <div className="space-y-3">
              <div className="flex items-center p-3 hover:bg-white rounded-xl transition-colors group cursor-pointer">
                <div className="w-12 h-12 rounded-xl bg-[#2C2824] flex items-center justify-center shrink-0 shadow-sm group-hover:shadow-md transition-shadow">
                  <span className="text-[#D4AF37] text-lg italic" style={customStyles.fontSerifDisplay}>
                    Nr
                  </span>
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex justify-between items-center mb-0.5">
                    <h4 className="font-bold text-[#1C1915]">Neev Reserve</h4>
                    <span className="text-sm font-bold text-[#1C1915]">₹12.4L</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] text-[#8C7B65] font-medium tracking-wide">INSTITUTIONAL • INSTANT</span>
                    <span className="text-[11px] text-green-600 bg-green-50 px-1.5 py-0.5 rounded font-bold">+7.2%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="h-8"></div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav
        className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] rounded-full p-2 px-6 flex justify-between items-center shadow-[0_20px_40px_rgba(0,0,0,0.1)] z-50"
        style={customStyles.glassPanel}
      >
        <button
          onClick={() => setActiveNav('home')}
          className="flex flex-col items-center gap-1 p-2 group"
        >
          <div className="relative">
            <svg
              className={`w-5 h-5 transition-colors ${activeNav === 'home' ? 'text-[#1C1915]' : 'text-[#8C7B65]'}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            {activeNav === 'home' && (
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#1C1915] rounded-full"></span>
            )}
          </div>
          <span
            className={`text-[9px] font-bold tracking-widest uppercase transition-colors ${
              activeNav === 'home' ? 'text-[#1C1915]' : 'text-[#8C7B65]'
            }`}
          >
            Home
          </span>
        </button>

        <button
          onClick={() => setActiveNav('invest')}
          className="flex flex-col items-center gap-1 p-2 group"
        >
          <div className="relative">
            <svg
              className={`w-5 h-5 transition-colors ${activeNav === 'invest' ? 'text-[#1C1915]' : 'text-[#8C7B65]'}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="1" x2="12" y2="23"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
            {activeNav === 'invest' && (
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#1C1915] rounded-full"></span>
            )}
          </div>
          <span
            className={`text-[9px] font-bold tracking-widest uppercase transition-colors ${
              activeNav === 'invest' ? 'text-[#1C1915]' : 'text-[#8C7B65]'
            }`}
          >
            Invest
          </span>
        </button>

        <button
          onClick={() => setActiveNav('activity')}
          className="flex flex-col items-center gap-1 p-2 group"
        >
          <div className="relative">
            <svg
              className={`w-5 h-5 transition-colors ${activeNav === 'activity' ? 'text-[#1C1915]' : 'text-[#8C7B65]'}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
            </svg>
            {activeNav === 'activity' && (
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#1C1915] rounded-full"></span>
            )}
          </div>
          <span
            className={`text-[9px] font-bold tracking-widest uppercase transition-colors ${
              activeNav === 'activity' ? 'text-[#1C1915]' : 'text-[#8C7B65]'
            }`}
          >
            Activity
          </span>
        </button>

        <button
          onClick={() => setActiveNav('private')}
          className="flex flex-col items-center gap-1 p-2 group"
        >
          <div className="relative">
            <svg
              className={`w-5 h-5 transition-colors ${activeNav === 'private' ? 'text-[#1C1915]' : 'text-[#8C7B65]'}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            {activeNav === 'private' && (
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#1C1915] rounded-full"></span>
            )}
          </div>
          <span
            className={`text-[9px] font-bold tracking-widest uppercase transition-colors ${
              activeNav === 'private' ? 'text-[#1C1915]' : 'text-[#8C7B65]'
            }`}
          >
            Private
          </span>
        </button>
      </nav>
    </div>
  );
};

const App = () => {
  useEffect(() => {
    const link = document.createElement('link');
    link.href =
      'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,400&family=Manrope:wght@200;300;400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    const style = document.createElement('style');
    style.textContent = `
      .hide-scroll::-webkit-scrollbar { display: none; }
      .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(link);
      document.head.removeChild(style);
    };
  }, []);

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
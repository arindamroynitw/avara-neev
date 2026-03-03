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
  vaultBlur: {
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    background: 'rgba(28, 25, 21, 0.85)',
  },
};

const VaultPage = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,400&family=Manrope:wght@200;300;400;500;600;700&display=swap');
      
      .hide-scroll::-webkit-scrollbar { display: none; }
      .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      
      .texture-grain {
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E");
      }

      @keyframes pulse-gold {
        0% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.4); }
        70% { box-shadow: 0 0 0 20px rgba(212, 175, 55, 0); }
        100% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0); }
      }
      .animate-pulse-gold {
        animation: pulse-gold 2s infinite;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div
      className="w-full h-full max-w-[400px] max-h-[867px] bg-[#F9F7F2] rounded-[20px] shadow-2xl overflow-hidden relative flex flex-col"
      style={customStyles.fontSansBody}
    >
      {/* Header */}
      <div className="bg-[#1C1915] text-[#F9F7F2] pt-12 pb-12 px-6 relative rounded-b-[40px] z-0 texture-grain">
        <div className="flex justify-between items-center mb-6 relative z-10">
          <button className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#D4AF37]">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          <div className="text-2xl tracking-wide font-bold" style={customStyles.fontSerifDisplay}>NEEV.</div>
          <div className="w-10 h-10"></div>
        </div>

        <div className="text-center relative z-10">
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#8C7B65] mb-2 font-semibold">Secure Repository</p>
          <h1 className="text-4xl font-normal tracking-tight" style={{ ...customStyles.fontSerifDisplay, ...customStyles.textGoldGradient }}>The Vault</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 -mt-6 relative z-10 flex flex-col overflow-hidden px-5">
        <div className={`space-y-6 mt-10 ${!isUnlocked ? 'opacity-40 grayscale pointer-events-none' : ''}`}>
          <div className="border-b border-[#E5E0D5] pb-2 flex justify-between items-center">
            <h3 className="text-2xl text-[#1C1915]" style={customStyles.fontSerifDisplay}>Statements</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center p-4 bg-white rounded-xl border border-[#E5E0D5]">
              <div className="w-10 h-10 rounded bg-[#F0EDE6] flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5C554B" strokeWidth="1.5">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-bold">Annual Tax Report FY24</p>
                <p className="text-[10px] text-[#8C7B65]">PDF • 2.4 MB</p>
              </div>
            </div>
            <div className="flex items-center p-4 bg-white rounded-xl border border-[#E5E0D5]">
              <div className="w-10 h-10 rounded bg-[#F0EDE6] flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5C554B" strokeWidth="1.5">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-bold">Quarterly Wealth Summary</p>
                <p className="text-[10px] text-[#8C7B65]">PDF • 1.1 MB</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vault Locked Overlay */}
      {!isUnlocked && (
        <div
          className="absolute inset-x-0 bottom-0 top-[180px] z-40 flex flex-col items-center justify-center px-10 text-center rounded-t-[40px] border-t border-white/10 shadow-[0_-20px_50px_rgba(0,0,0,0.3)]"
          style={customStyles.vaultBlur}
        >
          <div className="mb-8 relative">
            <div className="w-24 h-24 rounded-full bg-[#2C2824] border border-[#D4AF37]/30 flex items-center justify-center animate-pulse-gold">
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 12c0-4.4 3.6-8 8-8s8 3.6 8 8"></path>
                <path d="M5 12c0-2.8 2.2-5 5-5s5 2.2 5 5"></path>
                <path d="M8 12c0-1.1.9-2 2-2s2 .9 2 2"></path>
                <path d="M10 22c-4.4 0-8-3.6-8-8"></path>
                <path d="M13 22c4.4 0 8-3.6 8-8"></path>
                <path d="M22 12c0 4.4-3.6 8-8 8"></path>
                <path d="M19 12c0 2.8-2.2 5-5 5"></path>
                <path d="M16 12c0 1.1-.9 2-2 2"></path>
              </svg>
            </div>
            <div className="absolute -bottom-2 -right-2 bg-[#D4AF37] w-8 h-8 rounded-full flex items-center justify-center border-4 border-[#1C1915]">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
          </div>

          <h2 className="text-2xl text-[#F9F7F2] mb-3" style={customStyles.fontSerifDisplay}>Vault Locked</h2>
          <p className="text-[#8C7B65] text-sm leading-relaxed mb-10">
            Access your confidential tax certificates, legal documents, and performance audits.
          </p>

          <button
            onClick={() => setIsUnlocked(true)}
            className="bg-[#D4AF37] text-[#1C1915] px-10 py-4 rounded-full text-xs font-bold tracking-[0.2em] uppercase shadow-xl active:scale-95 transition-transform"
          >
            Tap to Unlock
          </button>

          <p className="mt-6 text-[10px] text-white/30 tracking-widest uppercase font-medium">Biometric Authentication Required</p>
        </div>
      )}

      {/* Navigation */}
      <nav
        className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] rounded-full p-2 px-6 flex justify-between items-center shadow-[0_20px_40px_rgba(0,0,0,0.1)] z-50"
        style={customStyles.glassPanel}
      >
        <button onClick={() => navigate('/')} className="flex flex-col items-center gap-1 p-2 group">
          <svg className="w-5 h-5 text-[#8C7B65] group-hover:text-[#1C1915] transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          <span className="text-[9px] font-bold tracking-widest uppercase text-[#8C7B65]">Home</span>
        </button>

        <button onClick={() => navigate('/invest')} className="flex flex-col items-center gap-1 p-2 group">
          <svg className="w-5 h-5 text-[#8C7B65] group-hover:text-[#1C1915] transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="1" x2="12" y2="23"></line>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
          </svg>
          <span className="text-[9px] font-bold tracking-widest uppercase text-[#8C7B65]">Invest</span>
        </button>

        <button onClick={() => navigate('/activity')} className="flex flex-col items-center gap-1 p-2 group">
          <svg className="w-5 h-5 text-[#8C7B65] group-hover:text-[#1C1915] transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
          </svg>
          <span className="text-[9px] font-bold tracking-widest uppercase text-[#8C7B65]">Activity</span>
        </button>

        <button onClick={() => navigate('/private')} className="flex flex-col items-center gap-1 p-2 group">
          <div className="relative">
            <svg className="w-5 h-5 text-[#1C1915] transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#1C1915] rounded-full"></span>
          </div>
          <span className="text-[9px] font-bold tracking-widest uppercase text-[#1C1915]">Private</span>
        </button>
      </nav>
    </div>
  );
};

const PlaceholderPage = ({ title }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,400&family=Manrope:wght@200;300;400;500;600;700&display=swap');
      .texture-grain {
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E");
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const isActive = (path) => {
    if (path === '/' && title === 'Home') return true;
    if (path === '/invest' && title === 'Invest') return true;
    if (path === '/activity' && title === 'Activity') return true;
    if (path === '/private' && title === 'Private') return true;
    return false;
  };

  return (
    <div
      className="w-full h-full max-w-[400px] max-h-[867px] bg-[#F9F7F2] rounded-[20px] shadow-2xl overflow-hidden relative flex flex-col"
      style={customStyles.fontSansBody}
    >
      {/* Header */}
      <div className="bg-[#1C1915] text-[#F9F7F2] pt-12 pb-12 px-6 relative rounded-b-[40px] z-0 texture-grain">
        <div className="flex justify-between items-center mb-6 relative z-10">
          <button className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#D4AF37]">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          <div className="text-2xl tracking-wide font-bold" style={customStyles.fontSerifDisplay}>NEEV.</div>
          <div className="w-10 h-10"></div>
        </div>

        <div className="text-center relative z-10">
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#8C7B65] mb-2 font-semibold">Navigation</p>
          <h1 className="text-4xl font-normal tracking-tight" style={{ ...customStyles.fontSerifDisplay, ...customStyles.textGoldGradient }}>{title}</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-[#8C7B65] text-sm" style={customStyles.fontSansBody}>
            {title} section content coming soon.
          </p>
          <button
            onClick={() => navigate('/private')}
            className="mt-6 bg-[#1C1915] text-[#F9F7F2] px-8 py-3 rounded-full text-xs font-bold tracking-[0.2em] uppercase shadow-md active:scale-95 transition-transform"
          >
            Go to Vault
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav
        className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] rounded-full p-2 px-6 flex justify-between items-center shadow-[0_20px_40px_rgba(0,0,0,0.1)] z-50"
        style={customStyles.glassPanel}
      >
        <button onClick={() => navigate('/')} className="flex flex-col items-center gap-1 p-2 group">
          <svg className={`w-5 h-5 ${isActive('/') ? 'text-[#1C1915]' : 'text-[#8C7B65]'} group-hover:text-[#1C1915] transition-colors`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          <span className={`text-[9px] font-bold tracking-widest uppercase ${isActive('/') ? 'text-[#1C1915]' : 'text-[#8C7B65]'}`}>Home</span>
        </button>

        <button onClick={() => navigate('/invest')} className="flex flex-col items-center gap-1 p-2 group">
          <svg className={`w-5 h-5 ${isActive('/invest') ? 'text-[#1C1915]' : 'text-[#8C7B65]'} group-hover:text-[#1C1915] transition-colors`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="1" x2="12" y2="23"></line>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
          </svg>
          <span className={`text-[9px] font-bold tracking-widest uppercase ${isActive('/invest') ? 'text-[#1C1915]' : 'text-[#8C7B65]'}`}>Invest</span>
        </button>

        <button onClick={() => navigate('/activity')} className="flex flex-col items-center gap-1 p-2 group">
          <svg className={`w-5 h-5 ${isActive('/activity') ? 'text-[#1C1915]' : 'text-[#8C7B65]'} group-hover:text-[#1C1915] transition-colors`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
          </svg>
          <span className={`text-[9px] font-bold tracking-widest uppercase ${isActive('/activity') ? 'text-[#1C1915]' : 'text-[#8C7B65]'}`}>Activity</span>
        </button>

        <button onClick={() => navigate('/private')} className="flex flex-col items-center gap-1 p-2 group">
          <div className="relative">
            <svg className={`w-5 h-5 ${isActive('/private') ? 'text-[#1C1915]' : 'text-[#8C7B65]'} group-hover:text-[#1C1915] transition-colors`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            {isActive('/private') && (
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#1C1915] rounded-full"></span>
            )}
          </div>
          <span className={`text-[9px] font-bold tracking-widest uppercase ${isActive('/private') ? 'text-[#1C1915]' : 'text-[#8C7B65]'}`}>Private</span>
        </button>
      </nav>
    </div>
  );
};

const App = () => {
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      body {
        background-color: #E5E0D5;
        font-family: 'Manrope', sans-serif;
        color: #262118;
        min-height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 1rem;
        margin: 0;
      }
      #root {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        width: 100%;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <Router basename="/">
      <div className="flex justify-center items-center min-h-screen w-full" style={{ backgroundColor: '#E5E0D5', padding: '1rem' }}>
        <Routes>
          <Route path="/" element={<PlaceholderPage title="Home" />} />
          <Route path="/invest" element={<PlaceholderPage title="Invest" />} />
          <Route path="/activity" element={<PlaceholderPage title="Activity" />} />
          <Route path="/private" element={<VaultPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
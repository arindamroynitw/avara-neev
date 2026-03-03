import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

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
  textureGrain: {
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")`,
  },
  glassPanel: {
    background: 'rgba(255, 253, 248, 0.7)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
  },
  drawerGradient: {
    background: 'linear-gradient(180deg, #1C1915 0%, #12100E 100%)',
  },
};

const NotificationCard = ({ children, className, style }) => (
  <div className={className} style={style}>
    {children}
  </div>
);

const HomePage = () => {
  const [drawerVisible, setDrawerVisible] = useState(true);
  const [notifications, setNotifications] = useState([
    { id: 1, read: false },
    { id: 2, read: false },
    { id: 3, read: false },
    { id: 4, read: false },
  ]);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
  };

  const openDrawer = () => {
    setDrawerVisible(true);
  };

  return (
    <div
      className="w-full h-full max-w-[400px] max-h-[867px] bg-[#F9F7F2] rounded-[20px] shadow-2xl overflow-hidden relative flex flex-col"
      style={{ minHeight: '867px' }}
    >
      {/* Header */}
      <div
        className="bg-[#1C1915] text-[#F9F7F2] pt-12 pb-16 px-6 relative rounded-b-[40px] z-0"
        style={customStyles.textureGrain}
      >
        <div className="flex justify-between items-center mb-8">
          <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center"></div>
          <div className="text-2xl tracking-wide font-bold" style={customStyles.fontSerifDisplay}>
            NEEV.
          </div>
          <div className="w-10 h-10 rounded-full bg-[#2C2824] flex items-center justify-center relative border border-[#D4AF37]/30">
            <button onClick={openDrawer} className="w-full h-full flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
            </button>
          </div>
        </div>
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#8C7B65] mb-2 font-semibold">
            Total Liquidity
          </p>
          <h1 className="text-6xl font-normal tracking-tight" style={{ ...customStyles.fontSerifDisplay, ...customStyles.textGoldGradient }}>
            24.50L
          </h1>
        </div>
      </div>

      {/* Overlay */}
      {drawerVisible && (
        <div
          className="absolute inset-0 bg-black/40 z-[60] backdrop-blur-[2px]"
          onClick={closeDrawer}
        ></div>
      )}

      {/* Notifications Drawer */}
      {drawerVisible && (
        <div
          className="absolute inset-x-0 bottom-0 top-20 z-[70] rounded-t-[40px] flex flex-col shadow-[0_-20px_50px_rgba(0,0,0,0.5)] border-t border-white/10"
          style={{ ...customStyles.drawerGradient, ...customStyles.textureGrain }}
        >
          {/* Drag Handle */}
          <div className="w-full flex justify-center pt-4 pb-2">
            <div className="w-12 h-1 bg-white/20 rounded-full"></div>
          </div>

          {/* Drawer Header */}
          <div className="px-8 py-4 flex justify-between items-center">
            <h2 className="text-3xl text-[#F9F7F2]" style={customStyles.fontSerifDisplay}>
              Concierge Alerts
            </h2>
            <button
              className="text-[10px] font-bold text-[#D4AF37] tracking-[0.2em] uppercase"
              onClick={markAllRead}
            >
              Mark All Read
            </button>
          </div>

          {/* Notifications List */}
          <div
            className="flex-1 overflow-y-auto px-6 py-2 space-y-4 pb-24"
            style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
          >
            {/* Morning Brief */}
            <NotificationCard className="bg-[#2C2824] rounded-2xl p-5 border border-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#D4AF37]/5 rounded-bl-full"></div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#8C7B65] p-[1px]">
                  <div className="w-full h-full rounded-full bg-[#1C1915] flex items-center justify-center">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-[#D4AF37] tracking-widest uppercase">
                  Morning Brief • Just Now
                </span>
              </div>
              <p className="text-sm text-[#E5E0D5] leading-relaxed">
                Good morning, Arjun. Your Private Reserve has accrued{' '}
                <span className="text-[#D4AF37] font-semibold">₹1,200</span> overnight. Liquidity remains optimal for the upcoming venture cycle.
              </p>
            </NotificationCard>

            {/* Accrual */}
            <NotificationCard className="bg-white/5 rounded-2xl p-5 border border-white/5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ADE80" strokeWidth="2">
                    <path d="M12 2v20M2 12h20"></path>
                  </svg>
                </div>
                <span className="text-[10px] font-bold text-[#8C7B65] tracking-widest uppercase">
                  Accrual • 2h ago
                </span>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <h4 className="text-xl text-[#F9F7F2]" style={customStyles.fontSerifDisplay}>
                    Neev Protect Yield
                  </h4>
                  <p className="text-xs text-[#8C7B65]">Institutional distribution processed</p>
                </div>
                <span className="text-lg text-[#4ADE80]" style={customStyles.fontSerifDisplay}>
                  +₹540
                </span>
              </div>
            </NotificationCard>

            {/* Milestone */}
            <NotificationCard
              className="rounded-2xl p-5 border border-[#D4AF37]/30 relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.2) 0%, transparent 100%)' }}
            >
              <div className="absolute -right-4 -top-4 w-20 h-20 border border-[#D4AF37]/20 rounded-full"></div>
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-8 h-8 rounded-full bg-[#D4AF37] flex items-center justify-center"
                  style={{ boxShadow: '0 0 15px rgba(212,175,55,0.4)' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                    <path d="M12 15l5 3-1-5.8 4.2-4.1-5.8-.8-2.6-5.3-2.6 5.3-5.8.8 4.2 4.1-1 5.8z"></path>
                  </svg>
                </div>
                <span className="text-[10px] font-bold text-white tracking-widest uppercase">
                  Celebration • Yesterday
                </span>
              </div>
              <h4 className="text-2xl text-white mb-1" style={customStyles.fontSerifDisplay}>
                Wealth Milestone
              </h4>
              <p className="text-xs text-white/80 leading-relaxed">
                Congratulations! Your total liquidity has crossed the{' '}
                <span className="font-bold underline underline-offset-4">24L mark</span>. You are now eligible for the Sovereign Tier benefits.
              </p>
            </NotificationCard>

            {/* Opportunity */}
            <NotificationCard className="bg-white/5 rounded-2xl p-5 border border-white/5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="2">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                  </svg>
                </div>
                <span className="text-[10px] font-bold text-[#8C7B65] tracking-widest uppercase">
                  Opportunity • 5h ago
                </span>
              </div>
              <p className="text-sm text-[#E5E0D5] mb-4">
                New Private Equity allocation open:{' '}
                <span className="italic">Global Tech Series D</span>. 14.5% projected IRR.
              </p>
              <button className="w-full py-3 bg-white/10 hover:bg-white/20 transition-colors rounded-xl text-[10px] font-bold tracking-[0.2em] text-[#D4AF37] uppercase border border-white/5">
                Review Prospectus
              </button>
            </NotificationCard>

            <div className="h-10"></div>
          </div>

          {/* Close Button */}
          <div className="absolute bottom-10 left-0 right-0 px-8">
            <button
              className="w-full py-5 bg-[#D4AF37] text-[#1C1915] rounded-full font-bold tracking-[0.2em] text-xs uppercase"
              style={{ boxShadow: '0 10px 30px rgba(212,175,55,0.3)' }}
              onClick={closeDrawer}
            >
              Close Briefing
            </button>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav
        className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] rounded-full p-2 px-6 flex justify-between items-center shadow-[0_20px_40px_rgba(0,0,0,0.1)] z-40 opacity-30"
        style={customStyles.glassPanel}
      >
        <div className="flex flex-col items-center gap-1 p-2">
          <svg className="w-5 h-5 text-[#1C1915]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          </svg>
          <span className="text-[9px] font-bold tracking-widest uppercase text-[#1C1915]">Home</span>
        </div>
        <div className="flex flex-col items-center gap-1 p-2">
          <svg className="w-5 h-5 text-[#8C7B65]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="1" x2="12" y2="23"></line>
          </svg>
          <span className="text-[9px] font-bold tracking-widest uppercase text-[#8C7B65]">Invest</span>
        </div>
        <div className="flex flex-col items-center gap-1 p-2">
          <svg className="w-5 h-5 text-[#8C7B65]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
          </svg>
          <span className="text-[9px] font-bold tracking-widest uppercase text-[#8C7B65]">Activity</span>
        </div>
        <div className="flex flex-col items-center gap-1 p-2">
          <svg className="w-5 h-5 text-[#8C7B65]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          </svg>
          <span className="text-[9px] font-bold tracking-widest uppercase text-[#8C7B65]">Private</span>
        </div>
      </nav>
    </div>
  );
};

const App = () => {
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,400&family=Manrope:wght@200;300;400;500;600;700&display=swap');
      .hide-scroll::-webkit-scrollbar { display: none; }
      .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <Router basename="/">
      <div
        className="bg-[#E5E0D5] flex justify-center items-center min-h-screen p-4"
        style={customStyles.fontSansBody}
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
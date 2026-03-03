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
  },
  glassPanel: {
    background: 'rgba(255, 253, 248, 0.7)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
  },
  hideScroll: {
    msOverflowStyle: 'none',
    scrollbarWidth: 'none',
  },
};

const NavBar = ({ activeTab, setActiveTab }) => {
  const tabs = [
    {
      id: 'home',
      label: 'Home',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
    },
    {
      id: 'invest',
      label: 'Invest',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
    },
    {
      id: 'activity',
      label: 'Activity',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      ),
    },
    {
      id: 'private',
      label: 'Private',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      ),
    },
  ];

  return (
    <nav
      className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] rounded-full p-2 px-6 flex justify-between items-center shadow-[0_20px_40px_rgba(0,0,0,0.1)] z-50"
      style={customStyles.glassPanel}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            className="flex flex-col items-center gap-1 p-2 group"
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.id === 'activity' ? (
              <div className="relative">
                <span style={{ color: isActive ? '#1C1915' : '#8C7B65' }}>{tab.icon}</span>
                {isActive && (
                  <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#1C1915] rounded-full" />
                )}
              </div>
            ) : (
              <span style={{ color: isActive ? '#1C1915' : '#8C7B65' }}>{tab.icon}</span>
            )}
            <span
              className="text-[9px] font-bold tracking-widest uppercase"
              style={{ color: isActive ? '#1C1915' : '#8C7B65' }}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

const ActivityItem = ({ icon, title, subtitle, amount, amountColor, badge, badgeStyle, time }) => (
  <div className="flex gap-4 relative z-10">
    <div
      className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-sm"
      style={icon.containerStyle}
    >
      {icon.svg}
    </div>
    <div className="flex-1 pt-1">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-bold text-[#1C1915] text-sm">{title}</h4>
          <p className="text-[11px] text-[#8C7B65] mt-0.5">{subtitle}</p>
        </div>
        <span className="text-sm font-bold" style={{ color: amountColor || '#1C1915' }}>
          {amount}
        </span>
      </div>
      {badge && (
        <div className="mt-2">
          <span
            className="text-[9px] font-bold tracking-widest px-2 py-0.5 rounded"
            style={badgeStyle}
          >
            {badge}
          </span>
        </div>
      )}
      {time && <p className="text-[10px] text-[#8C7B65] mt-1">{time}</p>}
    </div>
  </div>
);

const ActivityPage = () => {
  const timelineLineStyle = {
    position: 'relative',
  };

  return (
    <div className="w-full h-full max-w-[400px] max-h-[867px] bg-[#F9F7F2] rounded-[20px] shadow-2xl overflow-hidden relative flex flex-col" style={customStyles.fontSansBody}>

      {/* Header */}
      <div
        className="bg-[#1C1915] text-[#F9F7F2] pt-12 pb-12 px-6 relative rounded-b-[40px] z-0 shrink-0"
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E\")",
        }}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37] opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

        <div className="flex justify-between items-center mb-6 relative z-10">
          <button className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="text-xl tracking-wide font-bold" style={customStyles.fontSerifDisplay}>ACTIVITY</div>
          <button className="w-10 h-10 rounded-full bg-[#2C2824] flex items-center justify-center border border-[#D4AF37]/30">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F9F7F2" strokeWidth="1.5">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>

        {/* Performance summary */}
        <div className="relative z-10 px-2">
          <div className="flex justify-between items-end mb-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#8C7B65] font-semibold">Month performance</p>
              <h2 className="text-3xl" style={{ ...customStyles.fontSerifDisplay, ...customStyles.textGoldGradient }}>+₹12,450</h2>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-green-400 bg-green-400/10 px-2 py-0.5 rounded">↑ 4.2%</span>
            </div>
          </div>

          {/* Chart */}
          <div className="h-16 w-full mt-2">
            <svg viewBox="0 0 300 60" className="w-full h-full drop-shadow-[0_0_8px_rgba(212,175,55,0.3)]">
              <defs>
                <linearGradient id="goldGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#F0D588" />
                  <stop offset="100%" stopColor="#B8860B" />
                </linearGradient>
              </defs>
              <path
                d="M0 50 Q 25 45, 50 48 T 100 30 T 150 35 T 200 15 T 250 20 T 300 5"
                fill="none"
                stroke="url(#goldGradient)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="300" cy="5" r="3" fill="#D4AF37" />
            </svg>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 -mt-6 relative z-10 flex flex-col overflow-hidden">
        <div
          className="h-full overflow-y-auto pb-28 px-6 bg-[#F9F7F2] rounded-t-[40px] pt-8"
          style={customStyles.hideScroll}
        >
          {/* Today */}
          <div className="mb-8 relative" style={timelineLineStyle}>
            <div
              style={{
                position: 'absolute',
                left: '23px',
                top: '40px',
                bottom: '-20px',
                width: '1px',
                background: 'linear-gradient(to bottom, #D4AF37 0%, #E5E0D5 100%)',
                opacity: 0.3,
              }}
            />
            <h3 className="text-lg font-bold text-[#1C1915] mb-6 flex items-center" style={customStyles.fontSerifDisplay}>
              Today <span className="ml-2 w-1.5 h-1.5 bg-[#D4AF37] rounded-full inline-block" />
            </h3>

            <div className="space-y-8">
              <ActivityItem
                icon={{
                  containerStyle: {
                    background: '#1C1915',
                    border: '1px solid rgba(212,175,55,0.3)',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                  },
                  svg: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2">
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                    </svg>
                  ),
                }}
                title="Portfolio Rebalancing"
                subtitle="Neev Protect → Growth Fund"
                amount="₹42,000"
                badge="REINVESTED"
                badgeStyle={{
                  color: '#B8860B',
                  border: '1px solid rgba(184,134,11,0.2)',
                }}
              />

              <ActivityItem
                icon={{
                  containerStyle: {
                    background: '#fff',
                    border: '1px solid #E5E0D5',
                  },
                  svg: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  ),
                }}
                title="Interest Accrual"
                subtitle="Neev Reserve • Quarterly Yield"
                amount="+₹1,240"
                amountColor="#16a34a"
                time="09:15 AM"
              />
            </div>
          </div>

          {/* Yesterday */}
          <div className="mb-8 relative" style={timelineLineStyle}>
            <div
              style={{
                position: 'absolute',
                left: '23px',
                top: '40px',
                bottom: '-20px',
                width: '1px',
                background: 'linear-gradient(to bottom, #D4AF37 0%, #E5E0D5 100%)',
                opacity: 0.3,
              }}
            />
            <h3 className="text-lg font-bold text-[#1C1915] opacity-50 mb-6" style={customStyles.fontSerifDisplay}>Yesterday</h3>

            <div className="space-y-8">
              <ActivityItem
                icon={{
                  containerStyle: {
                    background: '#fff',
                    border: '1px solid #E5E0D5',
                  },
                  svg: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1C1915" strokeWidth="2">
                      <path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14" />
                    </svg>
                  ),
                }}
                title="External Deposit"
                subtitle="HDFC Bank • **** 8291"
                amount="₹2,50,000"
                badge="COMPLETED"
                badgeStyle={{
                  color: '#1C1915',
                  background: '#E5E0D5',
                }}
              />
            </div>
          </div>

          {/* Last Week */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-[#1C1915] opacity-50 mb-6" style={customStyles.fontSerifDisplay}>Last Week</h3>

            <div className="space-y-8">
              <div className="flex gap-4 opacity-70">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: '#fff', border: '1px solid #E5E0D5' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8C7B65" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M16 12l-4-4-4 4M12 16V8" />
                  </svg>
                </div>
                <div className="flex-1 pt-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-[#1C1915] text-sm">Equity Buy Order</h4>
                      <p className="text-[11px] text-[#8C7B65] mt-0.5">Aggressive Growth Fund</p>
                    </div>
                    <span className="text-sm font-bold text-[#1C1915]">₹15,000</span>
                  </div>
                  <p className="text-[10px] text-[#8C7B65] mt-1">Oct 12 • 03:45 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

const PlaceholderPage = ({ title }) => (
  <div
    className="w-full h-full max-w-[400px] max-h-[867px] bg-[#F9F7F2] rounded-[20px] shadow-2xl overflow-hidden relative flex flex-col items-center justify-center"
    style={customStyles.fontSansBody}
  >
    <div className="text-center px-8">
      <div className="w-16 h-16 rounded-full bg-[#1C1915] flex items-center justify-center mx-auto mb-4 border border-[#D4AF37]/30">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v4M12 16h.01" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-[#1C1915] mb-2" style={customStyles.fontSerifDisplay}>{title}</h2>
      <p className="text-sm text-[#8C7B65]">This section is coming soon.</p>
    </div>
  </div>
);

const App = () => {
  const [activeTab, setActiveTab] = useState('activity');

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,400&family=Manrope:wght@200;300;400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  const renderPage = () => {
    switch (activeTab) {
      case 'activity':
        return <ActivityPage />;
      case 'home':
        return <PlaceholderPage title="Home" />;
      case 'invest':
        return <PlaceholderPage title="Invest" />;
      case 'private':
        return <PlaceholderPage title="Private" />;
      default:
        return <ActivityPage />;
    }
  };

  return (
    <div
      className="bg-[#E5E0D5] flex justify-center items-center min-h-screen p-4"
      style={customStyles.fontSansBody}
    >
      <div className="w-full max-w-[400px] relative" style={{ height: '867px' }}>
        <div className="w-full h-full relative">
          {renderPage()}
          <NavBar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      </div>
    </div>
  );
};

export default App;
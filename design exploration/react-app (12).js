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
  glassPanel: {
    background: 'rgba(255, 253, 248, 0.7)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
  },
  textureGrain: {
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")`,
  },
};

const NavItem = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center gap-1 p-2 group"
    style={customStyles.fontSansBody}
  >
    <div className="relative">
      <svg
        className={`w-5 h-5 transition-colors ${active ? 'text-[#1C1915]' : 'text-[#8C7B65] group-hover:text-[#1C1915]'}`}
        viewBox={icon.viewBox}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {icon.paths.map((p, i) =>
          p.type === 'path' ? <path key={i} d={p.d} /> :
          p.type === 'polyline' ? <polyline key={i} points={p.points} /> :
          p.type === 'line' ? <line key={i} x1={p.x1} y1={p.y1} x2={p.x2} y2={p.y2} /> :
          p.type === 'rect' ? <rect key={i} x={p.x} y={p.y} width={p.width} height={p.height} rx={p.rx} ry={p.ry} /> :
          null
        )}
      </svg>
      {active && (
        <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#1C1915] rounded-full"></span>
      )}
    </div>
    <span
      className={`text-[9px] font-bold tracking-widest uppercase transition-colors ${active ? 'text-[#1C1915]' : 'text-[#8C7B65] group-hover:text-[#1C1915]'}`}
    >
      {label}
    </span>
  </button>
);

const HoldingItem = ({ icon, name, amount, type, settlement, yield: yieldVal }) => (
  <div className="flex items-center p-3 hover:bg-white rounded-xl transition-colors group cursor-pointer">
    <div className="w-12 h-12 rounded-xl bg-[#F0EDE6] border border-[#E5E0D5] flex items-center justify-center shrink-0 shadow-sm group-hover:shadow-md transition-shadow">
      {icon}
    </div>
    <div className="ml-4 flex-1">
      <div className="flex justify-between items-center mb-0.5">
        <h4 className="font-bold text-[#1C1915]" style={customStyles.fontSansBody}>{name}</h4>
        <span className="text-sm font-bold text-[#1C1915]" style={customStyles.fontSansBody}>{amount}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-[11px] text-[#8C7B65] font-medium tracking-wide" style={customStyles.fontSansBody}>{type} • {settlement}</span>
        <span className="text-[11px] text-green-600 bg-green-50 px-1.5 py-0.5 rounded font-bold" style={customStyles.fontSansBody}>{yieldVal}</span>
      </div>
    </div>
  </div>
);

const HomePage = ({ activeNav, setActiveNav }) => {
  const [investHovered, setInvestHovered] = useState(false);

  const navItems = [
    {
      label: 'Home',
      icon: {
        viewBox: '0 0 24 24',
        paths: [
          { type: 'path', d: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' },
          { type: 'polyline', points: '9 22 9 12 15 12 15 22' },
        ],
      },
    },
    {
      label: 'Invest',
      icon: {
        viewBox: '0 0 24 24',
        paths: [
          { type: 'line', x1: '12', y1: '1', x2: '12', y2: '23' },
          { type: 'path', d: 'M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' },
        ],
      },
    },
    {
      label: 'Activity',
      icon: {
        viewBox: '0 0 24 24',
        paths: [
          { type: 'polyline', points: '22 12 18 12 15 21 9 3 6 12 2 12' },
        ],
      },
    },
    {
      label: 'Private',
      icon: {
        viewBox: '0 0 24 24',
        paths: [
          { type: 'rect', x: '3', y: '11', width: '18', height: '11', rx: '2', ry: '2' },
          { type: 'path', d: 'M7 11V7a5 5 0 0 1 10 0v4' },
        ],
      },
    },
  ];

  return (
    <div
      className="w-full h-full max-w-[400px] max-h-[867px] bg-[#F9F7F2] rounded-[20px] shadow-2xl overflow-hidden relative flex flex-col"
      style={customStyles.fontSansBody}
    >
      {/* Header */}
      <div
        className="bg-[#1C1915] text-[#F9F7F2] pt-12 pb-16 px-6 relative rounded-b-[40px] z-0"
        style={customStyles.textureGrain}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37] opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

        <div className="flex justify-between items-center mb-8 relative z-10">
          <button className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#D4AF37]">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          <div className="text-2xl tracking-wide font-bold" style={{ ...customStyles.fontSerifDisplay }}>NEEV.</div>

          <button className="w-10 h-10 rounded-full bg-[#2C2824] flex items-center justify-center relative border border-[#D4AF37]/30">
            <span className="absolute top-2 right-2.5 w-1.5 h-1.5 bg-[#D4AF37] rounded-full shadow-[0_0_8px_#D4AF37]"></span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F9F7F2" strokeWidth="1.5">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
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
                <path d="M12 2v20M2 12h20" />
              </svg>
              <span className="text-xs font-medium text-[#D4AF37]">₹540 ACCRUAL</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 -mt-8 relative z-10 flex flex-col overflow-hidden">
        <div className="h-full overflow-y-auto pb-28 px-5" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>

          {/* Morning Brief */}
          <div className="bg-white rounded-2xl p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#E5E0D5] mb-6 flex gap-4 items-start relative overflow-hidden group">
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
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
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
                <span className="text-[#B8860B] font-medium border-b border-[#B8860B]/30">₹1,200</span>{' '}
                this week. Shall we reinvest?"
              </p>
            </div>
          </div>

          {/* Opportunities */}
          <div className="mb-8">
            <div className="flex justify-between items-end mb-4 px-1">
              <h3 className="text-2xl text-[#1C1915]" style={customStyles.fontSerifDisplay}>Opportunities</h3>
              <div className="flex gap-2">
                <button className="w-8 h-8 rounded-full border border-[#D4AF37] flex items-center justify-center opacity-30">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>
                <button className="w-8 h-8 rounded-full bg-[#1C1915] text-[#D4AF37] flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="bg-[#F0EDE6] rounded-[24px] overflow-hidden relative min-h-[180px] group cursor-pointer transition-transform hover:scale-[1.02]">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: 'linear-gradient(45deg, transparent 25%, rgba(212,175,55,0.05) 25%, rgba(212,175,55,0.05) 50%, transparent 50%, transparent 75%, rgba(212,175,55,0.05) 75%, rgba(212,175,55,0.05) 100%)',
                  backgroundSize: '20px 20px',
                }}
              ></div>
              <div className="absolute right-0 bottom-0 w-32 h-32 border-[20px] border-[#D4AF37]/10 rounded-full translate-x-1/3 translate-y-1/3"></div>
              <div className="absolute right-0 bottom-0 w-48 h-48 border-[1px] border-[#D4AF37]/20 rounded-full translate-x-1/3 translate-y-1/3"></div>

              <div className="relative p-6 h-full flex flex-col justify-between z-10">
                <div>
                  <span className="inline-block px-2 py-1 bg-[#D4AF37] text-white text-[10px] font-bold tracking-widest uppercase rounded mb-3">Exclusive</span>
                  <h3 className="text-3xl leading-none text-[#1C1915] mb-1" style={customStyles.fontSerifDisplay}>Private Reserve</h3>
                  <p className="text-[#5C554B] text-xs font-medium max-w-[60%]">Deploy excess capital into high-yield instruments.</p>
                </div>

                <div className="flex items-center gap-3 mt-6">
                  <button
                    className="px-6 py-3 rounded-full text-xs font-bold tracking-widest uppercase shadow-lg transition-colors"
                    style={{
                      backgroundColor: investHovered ? '#D4AF37' : '#1C1915',
                      color: '#F9F7F2',
                    }}
                    onMouseEnter={() => setInvestHovered(true)}
                    onMouseLeave={() => setInvestHovered(false)}
                  >
                    Invest Now
                  </button>
                  <span className="text-xs italic text-[#8C7B65]" style={customStyles.fontSerifDisplay}>7.2% APY</span>
                </div>
              </div>
            </div>
          </div>

          {/* Holdings */}
          <div>
            <div className="flex justify-between items-baseline mb-4 px-1 border-b border-[#E5E0D5] pb-2">
              <h3 className="text-2xl text-[#1C1915]" style={customStyles.fontSerifDisplay}>Holdings</h3>
              <button className="text-[10px] font-bold text-[#B8860B] tracking-widest hover:text-[#1C1915] transition-colors">VIEW ALL</button>
            </div>

            <div className="space-y-3">
              {/* Neev Reserve */}
              <div className="flex items-center p-3 hover:bg-white rounded-xl transition-colors group cursor-pointer">
                <div className="w-12 h-12 rounded-xl bg-[#2C2824] flex items-center justify-center shrink-0 shadow-sm group-hover:shadow-md transition-shadow">
                  <span className="text-[#D4AF37] text-lg italic" style={customStyles.fontSerifDisplay}>Nr</span>
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

              {/* Neev Protect */}
              <div className="flex items-center p-3 hover:bg-white rounded-xl transition-colors group cursor-pointer">
                <div className="w-12 h-12 rounded-xl bg-[#F0EDE6] border border-[#E5E0D5] flex items-center justify-center shrink-0 shadow-sm group-hover:shadow-md transition-shadow">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5C554B" strokeWidth="1.5">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex justify-between items-center mb-0.5">
                    <h4 className="font-bold text-[#1C1915]">Neev Protect</h4>
                    <span className="text-sm font-bold text-[#1C1915]">₹8.2L</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] text-[#8C7B65] font-medium tracking-wide">WEALTH • T+1</span>
                    <span className="text-[11px] text-green-600 bg-green-50 px-1.5 py-0.5 rounded font-bold">+8.5%</span>
                  </div>
                </div>
              </div>

              {/* Growth Fund */}
              <div className="flex items-center p-3 hover:bg-white rounded-xl transition-colors group cursor-pointer">
                <div className="w-12 h-12 rounded-xl bg-[#F0EDE6] border border-[#E5E0D5] flex items-center justify-center shrink-0 shadow-sm group-hover:shadow-md transition-shadow">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5C554B" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M16 14l-4-4-4 4" />
                  </svg>
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex justify-between items-center mb-0.5">
                    <h4 className="font-bold text-[#1C1915]">Growth Fund</h4>
                    <span className="text-sm font-bold text-[#1C1915]">₹3.9L</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] text-[#8C7B65] font-medium tracking-wide">EQUITY • T+3</span>
                    <span className="text-[11px] text-green-600 bg-green-50 px-1.5 py-0.5 rounded font-bold">+12.1%</span>
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
        {[
          {
            label: 'Home',
            icon: {
              viewBox: '0 0 24 24',
              paths: [
                { type: 'path', d: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' },
                { type: 'polyline', points: '9 22 9 12 15 12 15 22' },
              ],
            },
          },
          {
            label: 'Invest',
            icon: {
              viewBox: '0 0 24 24',
              paths: [
                { type: 'line', x1: '12', y1: '1', x2: '12', y2: '23' },
                { type: 'path', d: 'M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' },
              ],
            },
          },
          {
            label: 'Activity',
            icon: {
              viewBox: '0 0 24 24',
              paths: [
                { type: 'polyline', points: '22 12 18 12 15 21 9 3 6 12 2 12' },
              ],
            },
          },
          {
            label: 'Private',
            icon: {
              viewBox: '0 0 24 24',
              paths: [
                { type: 'rect', x: '3', y: '11', width: '18', height: '11', rx: '2', ry: '2' },
                { type: 'path', d: 'M7 11V7a5 5 0 0 1 10 0v4' },
              ],
            },
          },
        ].map((item) => (
          <NavItem
            key={item.label}
            label={item.label}
            icon={item.icon}
            active={activeNav === item.label}
            onClick={() => setActiveNav(item.label)}
          />
        ))}
      </nav>
    </div>
  );
};

const App = () => {
  const [activeNav, setActiveNav] = useState('Home');

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,400&family=Manrope:wght@200;300;400;500;600;700&display=swap';
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
        style={customStyles.fontSansBody}
      >
        <Routes>
          <Route
            path="/"
            element={<HomePage activeNav={activeNav} setActiveNav={setActiveNav} />}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
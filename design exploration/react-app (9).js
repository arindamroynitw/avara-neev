import React, { useState, useEffect } from 'react';

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
  shimmer: {
    background: 'linear-gradient(90deg, #E5E0D5 25%, #F0EDE6 50%, #E5E0D5 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 2s infinite linear',
  },
  textureGrain: {
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")`,
  },
};

const ShimmerBox = ({ className, style }) => (
  <div className={className} style={{ ...customStyles.shimmer, ...style }} />
);

const NavItem = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className="flex flex-col items-center gap-1 p-2 group border-none bg-transparent cursor-pointer">
    <div className="relative">
      <div style={{ color: active ? '#1C1915' : '#8C7B65' }}>
        {icon}
      </div>
      {active && (
        <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#1C1915] rounded-full" />
      )}
    </div>
    <span
      className="text-[9px] font-bold tracking-widest uppercase"
      style={{ color: active ? '#1C1915' : '#8C7B65', fontFamily: "'Manrope', sans-serif" }}
    >
      {label}
    </span>
  </button>
);

const HomeIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
  </svg>
);

const InvestIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const ActivityIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);

const PrivateIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const FundModal = ({ isOpen, onClose }) => {
  const [amount, setAmount] = useState('');

  if (!isOpen) return null;

  return (
    <div
      className="absolute inset-0 z-[100] flex items-end justify-center"
      style={{ background: 'rgba(0,0,0,0.5)' }}
      onClick={onClose}
    >
      <div
        className="w-full bg-[#F9F7F2] rounded-t-[28px] p-6 pb-10"
        onClick={e => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-[#D4AF37]/40 rounded-full mx-auto mb-6" />
        <h3 style={{ ...customStyles.fontSerifDisplay, fontSize: '24px', color: '#1C1915', marginBottom: '8px' }}>
          Fund Your Account
        </h3>
        <p className="text-xs text-[#8C7B65] mb-6" style={customStyles.fontSansBody}>
          Add capital to unlock exclusive investment opportunities.
        </p>
        <div className="relative mb-4">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AF37] font-bold text-lg" style={customStyles.fontSerifDisplay}>₹</span>
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full pl-9 pr-4 py-3 bg-[#F0EDE6] border border-[#E5E0D5] rounded-xl text-[#1C1915] text-base outline-none focus:border-[#D4AF37] transition-colors"
            style={customStyles.fontSansBody}
          />
        </div>
        <button
          className="w-full py-3 bg-[#D4AF37] rounded-full text-[#1C1915] font-bold text-sm tracking-widest uppercase hover:bg-[#F0D588] transition-colors"
          style={customStyles.fontSansBody}
          onClick={onClose}
        >
          Proceed
        </button>
        <button
          className="w-full py-3 mt-2 text-[#8C7B65] text-sm"
          style={customStyles.fontSansBody}
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

const HomePage = () => {
  const [activeNav, setActiveNav] = useState('home');
  const [fundModalOpen, setFundModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      className="w-full h-full max-w-[400px] max-h-[867px] bg-[#F9F7F2] rounded-[20px] shadow-2xl overflow-hidden relative flex flex-col"
      style={{ ...customStyles.fontSansBody }}
    >
      {/* Header */}
      <div
        className="bg-[#1C1915] text-[#F9F7F2] pt-12 pb-16 px-6 relative rounded-b-[40px] z-0"
        style={customStyles.textureGrain}
      >
        <div
          className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37] opacity-5 rounded-full blur-3xl pointer-events-none"
          style={{ transform: 'translate(50%, -50%)' }}
        />

        {/* Top Bar */}
        <div className="flex justify-between items-center mb-8 relative z-10">
          <button
            className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors bg-transparent cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <div style={{ ...customStyles.fontSerifDisplay, fontSize: '24px', letterSpacing: '0.05em', fontWeight: 700 }}>
            NEEV.
          </div>
          <button className="w-10 h-10 rounded-full bg-[#2C2824] flex items-center justify-center relative border border-[#D4AF37]/30 cursor-pointer hover:bg-[#3C3830] transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F9F7F2" strokeWidth="1.5">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </button>
        </div>

        {/* Balance */}
        <div className="text-center relative z-10">
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#8C7B65] mb-2 font-semibold">
            Total Liquidity
          </p>
          <h1 style={{ ...customStyles.fontSerifDisplay, fontSize: '60px', fontWeight: 400, color: 'rgba(255,255,255,0.2)', letterSpacing: '-0.02em' }}>
            ₹0.00
          </h1>

          <div className="flex justify-center items-center gap-3 mt-4">
            <button
              onClick={() => setFundModalOpen(true)}
              className="px-4 py-2 bg-[#D4AF37] rounded-full flex items-center gap-2 cursor-pointer hover:bg-[#F0D588] transition-colors border-none"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#1C1915" strokeWidth="3">
                <path d="M12 5v14M5 12h14" />
              </svg>
              <span className="text-xs font-bold text-[#1C1915] tracking-widest uppercase">Fund Account</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 -mt-8 relative z-10 flex flex-col overflow-hidden">
        <div
          className="h-full overflow-y-auto pb-28 px-5"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* Welcome Card */}
          <div className="bg-white rounded-2xl p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#E5E0D5] mb-6 flex gap-4 items-start relative overflow-hidden">
            <div className="relative shrink-0">
              <div className="w-12 h-12 rounded-full p-[2px] bg-gradient-to-br from-[#D4AF37] to-[#E5E0D5]">
                <img
                  src="https://ui-avatars.com/api/?name=Neev+AI&background=1C1915&color=D4AF37"
                  alt="Concierge"
                  className="w-full h-full rounded-full object-cover border-2 border-white"
                />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-baseline mb-1">
                <h4 style={{ ...customStyles.fontSerifDisplay, fontWeight: 700, fontSize: '18px', color: '#1C1915' }}>
                  Welcome, Arjun
                </h4>
                <span className="text-[10px] text-[#8C7B65] font-semibold uppercase tracking-wider">Just now</span>
              </div>
              <p className="text-sm text-[#5C554B] leading-relaxed italic">
                "I'm your private wealth concierge. Once you fund your account, I'll begin curating exclusive opportunities to grow your capital."
              </p>
            </div>
          </div>

          {/* Opportunities */}
          <div className="mb-8">
            <h3 style={{ ...customStyles.fontSerifDisplay, fontSize: '24px', color: '#1C1915', marginBottom: '16px', paddingLeft: '4px' }}>
              Opportunities
            </h3>
            <div className="bg-[#F0EDE6]/50 border border-dashed border-[#D4AF37]/30 rounded-[24px] p-8 flex flex-col items-center text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#D4AF37]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <div>
                <h4 style={{ ...customStyles.fontSerifDisplay, fontSize: '20px', color: '#1C1915' }}>
                  Awaiting Capital
                </h4>
                <p className="text-[#8C7B65] text-xs max-w-[200px] mx-auto">
                  Opportunities are tailored to your liquid profile. Add funds to see Private Reserves.
                </p>
              </div>
            </div>
          </div>

          {/* Portfolio */}
          <div>
            <div className="flex justify-between items-baseline mb-4 px-1 border-b border-[#E5E0D5] pb-2">
              <h3 style={{ ...customStyles.fontSerifDisplay, fontSize: '24px', color: '#1C1915' }}>
                Portfolio
              </h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center p-3 opacity-60">
                <ShimmerBox className="w-12 h-12 rounded-xl shrink-0" />
                <div className="ml-4 flex-1 space-y-2">
                  <ShimmerBox className="h-3 w-24 rounded" />
                  <ShimmerBox className="h-2 w-32 rounded" />
                </div>
                <ShimmerBox className="h-4 w-12 rounded" />
              </div>
              <div className="flex items-center p-3 opacity-40">
                <ShimmerBox className="w-12 h-12 rounded-xl shrink-0" />
                <div className="ml-4 flex-1 space-y-2">
                  <ShimmerBox className="h-3 w-20 rounded" />
                  <ShimmerBox className="h-2 w-28 rounded" />
                </div>
                <ShimmerBox className="h-4 w-12 rounded" />
              </div>
            </div>
          </div>

          <div className="h-8" />
        </div>
      </div>

      {/* Bottom Nav */}
      <nav
        className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] rounded-full p-2 px-6 flex justify-between items-center shadow-[0_20px_40px_rgba(0,0,0,0.1)] z-50"
        style={customStyles.glassPanel}
      >
        <NavItem icon={<HomeIcon />} label="Home" active={activeNav === 'home'} onClick={() => setActiveNav('home')} />
        <NavItem icon={<InvestIcon />} label="Invest" active={activeNav === 'invest'} onClick={() => setActiveNav('invest')} />
        <NavItem icon={<ActivityIcon />} label="Activity" active={activeNav === 'activity'} onClick={() => setActiveNav('activity')} />
        <NavItem icon={<PrivateIcon />} label="Private" active={activeNav === 'private'} onClick={() => setActiveNav('private')} />
      </nav>

      {/* Fund Modal */}
      <FundModal isOpen={fundModalOpen} onClose={() => setFundModalOpen(false)} />

      {/* Menu Overlay */}
      {menuOpen && (
        <div
          className="absolute inset-0 z-[90] flex"
          onClick={() => setMenuOpen(false)}
        >
          <div
            className="w-3/4 h-full bg-[#1C1915] p-8 flex flex-col gap-6 shadow-2xl"
            style={customStyles.textureGrain}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ ...customStyles.fontSerifDisplay, fontSize: '24px', color: '#F9F7F2', fontWeight: 700 }}>
              NEEV.
            </div>
            <div className="border-t border-white/10 pt-6 flex flex-col gap-4">
              {['Dashboard', 'Portfolio', 'Invest', 'Activity', 'Settings', 'Support'].map(item => (
                <button
                  key={item}
                  className="text-left text-[#F9F7F2] hover:text-[#D4AF37] transition-colors bg-transparent border-none cursor-pointer py-1"
                  style={{ ...customStyles.fontSerifDisplay, fontSize: '20px' }}
                  onClick={() => setMenuOpen(false)}
                >
                  {item}
                </button>
              ))}
            </div>
            <div className="mt-auto">
              <p className="text-[#8C7B65] text-xs" style={customStyles.fontSansBody}>
                Private Wealth Platform
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const App = () => {
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,400&family=Manrope:wght@200;300;400;500;600;700&display=swap');

      @keyframes shimmer {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }

      .hide-scroll::-webkit-scrollbar { display: none; }
      .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }

      *::-webkit-scrollbar { display: none; }
      * { -ms-overflow-style: none; scrollbar-width: none; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div
      className="bg-[#E5E0D5] flex justify-center items-center min-h-screen p-4"
      style={customStyles.fontSansBody}
    >
      <HomePage />
    </div>
  );
};

export default App;
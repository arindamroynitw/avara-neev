import React, { useState, useEffect } from 'react';
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
  investCard: {
    background: 'white',
    border: '1px solid #E5E0D5',
    transition: 'all 0.3s ease',
  },
  filterChipActive: {
    background: '#1C1915',
    color: '#F9F7F2',
    borderColor: '#1C1915',
  },
  textureGrain: {
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")`,
  },
};

const FilterChip = ({ label, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      style={active ? customStyles.filterChipActive : {}}
      className={`px-5 py-2.5 rounded-full border text-[10px] font-bold tracking-widest uppercase transition-all whitespace-nowrap ${
        active
          ? 'bg-[#1C1915] text-[#F9F7F2] border-[#1C1915]'
          : 'border-[#E5E0D5] bg-white text-[#1C1915] hover:border-[#D4AF37]'
      }`}
    >
      {label}
    </button>
  );
};

const InvestCard = ({ icon, title, subtitle, returnValue, returnLabel, details, onInvest }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        ...customStyles.investCard,
        ...(hovered ? { borderColor: '#D4AF37', transform: 'translateY(-2px)', boxShadow: '0 12px 30px rgba(0,0,0,0.04)' } : {}),
      }}
      className="rounded-[24px] p-5 mb-4 relative overflow-hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={icon.bgStyle}>
            {icon.content}
          </div>
          <div>
            <h4 className="text-xl text-[#1C1915]" style={customStyles.fontSerifDisplay}>{title}</h4>
            <span className="text-[10px] font-bold tracking-widest text-[#8C7B65] uppercase">{subtitle}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[#1C1915] text-2xl leading-none" style={customStyles.fontSerifDisplay}>{returnValue}</div>
          <div className="text-[9px] font-bold text-[#8C7B65] uppercase tracking-wider">{returnLabel}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-5 border-t border-[#F0EDE6] pt-4">
        {details.map((detail, index) => (
          <div key={index}>
            <p className="text-[9px] font-bold text-[#8C7B65] uppercase tracking-widest mb-0.5">{detail.label}</p>
            <p className={`text-sm font-bold ${detail.valueColor || 'text-[#1C1915]'}`}>{detail.value}</p>
          </div>
        ))}
      </div>

      <button
        onClick={onInvest}
        className="w-full bg-[#1C1915] text-[#D4AF37] py-3.5 rounded-xl text-[10px] font-bold tracking-[0.2em] uppercase border border-[#D4AF37]/20 hover:bg-[#D4AF37] hover:text-[#1C1915] transition-all"
      >
        Initiate Investment
      </button>
    </div>
  );
};

const InvestmentModal = ({ isOpen, onClose, investment }) => {
  const [amount, setAmount] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setAmount('');
      setSubmitted(false);
    }
  }, [isOpen]);

  if (!isOpen || !investment) return null;

  const handleSubmit = () => {
    if (amount) {
      setSubmitted(true);
    }
  };

  return (
    <div className="absolute inset-0 z-50 flex items-end justify-center" style={{ background: 'rgba(28, 25, 21, 0.7)' }}>
      <div className="bg-[#F9F7F2] rounded-t-[32px] w-full p-6 pb-10">
        {!submitted ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl text-[#1C1915]" style={customStyles.fontSerifDisplay}>Initiate Investment</h3>
              <button onClick={onClose} className="w-8 h-8 rounded-full bg-[#F0EDE6] flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1C1915" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="bg-white rounded-2xl p-4 mb-5 border border-[#E5E0D5]">
              <p className="text-[10px] font-bold tracking-widest text-[#8C7B65] uppercase mb-1">{investment.subtitle}</p>
              <p className="text-lg text-[#1C1915]" style={customStyles.fontSerifDisplay}>{investment.title}</p>
              <p className="text-[10px] text-[#8C7B65] mt-1">Target: <span className="font-bold text-[#1C1915]">{investment.returnValue} {investment.returnLabel}</span></p>
            </div>
            <div className="mb-5">
              <label className="text-[10px] font-bold tracking-widest text-[#8C7B65] uppercase mb-2 block">Investment Amount (₹)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={investment.details[0]?.value?.replace('₹', '') || ''}
                className="w-full border border-[#E5E0D5] rounded-xl px-4 py-3 text-sm font-bold text-[#1C1915] focus:outline-none focus:border-[#D4AF37] bg-white"
                style={customStyles.fontSansBody}
              />
              {investment.details[0] && (
                <p className="text-[10px] text-[#8C7B65] mt-1">Min: {investment.details[0].value}</p>
              )}
            </div>
            <button
              onClick={handleSubmit}
              className="w-full bg-[#1C1915] text-[#D4AF37] py-4 rounded-xl text-[10px] font-bold tracking-[0.2em] uppercase border border-[#D4AF37]/20 hover:bg-[#D4AF37] hover:text-[#1C1915] transition-all"
            >
              Confirm Investment
            </button>
          </>
        ) : (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-[#1C1915] flex items-center justify-center mx-auto mb-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3 className="text-2xl text-[#1C1915] mb-2" style={customStyles.fontSerifDisplay}>Request Submitted</h3>
            <p className="text-[11px] text-[#8C7B65] uppercase tracking-widest mb-6">Our advisor will contact you shortly</p>
            <button
              onClick={onClose}
              className="px-8 py-3 bg-[#1C1915] text-[#D4AF37] rounded-xl text-[10px] font-bold tracking-[0.2em] uppercase"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const NavBar = ({ activePage, onNavigate }) => {
  return (
    <nav
      className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] rounded-full p-2 px-6 flex justify-between items-center shadow-[0_20px_40px_rgba(0,0,0,0.1)] z-50"
      style={customStyles.glassPanel}
    >
      <button onClick={() => onNavigate('home')} className="flex flex-col items-center gap-1 p-2 group">
        <svg className={`w-5 h-5 transition-colors ${activePage === 'home' ? 'text-[#1C1915]' : 'text-[#8C7B65]'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
        <span className={`text-[9px] font-bold tracking-widest uppercase transition-colors ${activePage === 'home' ? 'text-[#1C1915]' : 'text-[#8C7B65]'}`}>Home</span>
      </button>

      <button onClick={() => onNavigate('invest')} className="flex flex-col items-center gap-1 p-2 group">
        <div className="relative">
          <svg className={`w-5 h-5 transition-colors ${activePage === 'invest' ? 'text-[#1C1915]' : 'text-[#8C7B65]'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
          {activePage === 'invest' && (
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#1C1915] rounded-full" />
          )}
        </div>
        <span className={`text-[9px] font-bold tracking-widest uppercase transition-colors ${activePage === 'invest' ? 'text-[#1C1915]' : 'text-[#8C7B65]'}`}>Invest</span>
      </button>

      <button onClick={() => onNavigate('activity')} className="flex flex-col items-center gap-1 p-2 group">
        <svg className={`w-5 h-5 transition-colors ${activePage === 'activity' ? 'text-[#1C1915]' : 'text-[#8C7B65]'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
        <span className={`text-[9px] font-bold tracking-widest uppercase transition-colors ${activePage === 'activity' ? 'text-[#1C1915]' : 'text-[#8C7B65]'}`}>Activity</span>
      </button>

      <button onClick={() => onNavigate('private')} className="flex flex-col items-center gap-1 p-2 group">
        <svg className={`w-5 h-5 transition-colors ${activePage === 'private' ? 'text-[#1C1915]' : 'text-[#8C7B65]'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        <span className={`text-[9px] font-bold tracking-widest uppercase transition-colors ${activePage === 'private' ? 'text-[#1C1915]' : 'text-[#8C7B65]'}`}>Private</span>
      </button>
    </nav>
  );
};

const investmentsData = [
  {
    id: 1,
    category: 'Private Equity',
    title: 'Falcon Alpha PE',
    subtitle: 'Private Equity • Series B',
    returnValue: '18.5%',
    returnLabel: 'Target IRR',
    icon: {
      bgStyle: { background: '#2C2824' },
      content: <span style={{ ...customStyles.fontSerifDisplay, color: '#D4AF37', fontSize: '1rem', fontStyle: 'italic' }}>Pe</span>,
    },
    details: [
      { label: 'Min Investment', value: '₹10,00,000' },
      { label: 'Lock-in Period', value: '36 Months' },
    ],
  },
  {
    id: 2,
    category: 'Bonds',
    title: 'Sovereign Yield Bond',
    subtitle: 'Corporate Bond • AA+',
    returnValue: '9.2%',
    returnLabel: 'Fixed APY',
    icon: {
      bgStyle: { background: '#F0EDE6', border: '1px solid #E5E0D5' },
      content: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5C554B" strokeWidth="1.5">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      ),
    },
    details: [
      { label: 'Min Investment', value: '₹50,000' },
      { label: 'Payout', value: 'Quarterly' },
    ],
  },
  {
    id: 3,
    category: 'Mutual Funds',
    title: 'Neev Bluechip Focus',
    subtitle: 'Mutual Fund • Equity',
    returnValue: '14.8%',
    returnLabel: '3Y CAGR',
    icon: {
      bgStyle: { background: '#F0EDE6', border: '1px solid #E5E0D5' },
      content: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5C554B" strokeWidth="1.5">
          <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
          <polyline points="16 7 22 7 22 13" />
        </svg>
      ),
    },
    details: [
      { label: 'Min Investment', value: '₹5,000' },
      { label: 'Risk Level', value: 'Moderate', valueColor: 'text-orange-600' },
    ],
  },
];

const InvestPage = ({ onNavigate }) => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInvestment, setSelectedInvestment] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const filters = ['All', 'Mutual Funds', 'Bonds', 'Private Equity'];

  const filteredInvestments = investmentsData.filter((inv) => {
    const matchesFilter = activeFilter === 'All' || inv.category === activeFilter;
    const matchesSearch = inv.title.toLowerCase().includes(searchQuery.toLowerCase()) || inv.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleInvest = (investment) => {
    setSelectedInvestment(investment);
    setModalOpen(true);
  };

  return (
    <div className="w-full h-full flex flex-col overflow-hidden relative">
      <div
        className="bg-[#1C1915] text-[#F9F7F2] pt-12 pb-10 px-6 relative rounded-b-[40px] z-0"
        style={customStyles.textureGrain}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37] opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

        <div className="flex justify-between items-center mb-6 relative z-10">
          <button
            onClick={() => onNavigate('home')}
            className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <div className="text-2xl tracking-wide font-bold" style={customStyles.fontSerifDisplay}>INVEST.</div>
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="w-10 h-10 rounded-full bg-[#2C2824] flex items-center justify-center border border-[#D4AF37]/30"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F9F7F2" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
        </div>

        {searchOpen && (
          <div className="relative z-10 mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search investments..."
              className="w-full bg-[#2C2824] text-[#F9F7F2] border border-[#D4AF37]/30 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37] placeholder-[#8C7B65]"
              style={customStyles.fontSansBody}
              autoFocus
            />
          </div>
        )}

        <div className="relative z-10">
          <h2 className="text-4xl font-normal tracking-tight mb-2" style={{ ...customStyles.fontSerifDisplay, ...customStyles.textGoldGradient }}>Curated Assets</h2>
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#8C7B65] font-semibold">Exclusively selected for your profile</p>
        </div>
      </div>

      <div className="flex-1 -mt-6 relative z-10 flex flex-col overflow-hidden">
        <div
          className="px-5 mb-6 overflow-x-auto flex gap-2 shrink-0 py-2"
          style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
        >
          {filters.map((filter) => (
            <FilterChip
              key={filter}
              label={filter}
              active={activeFilter === filter}
              onClick={() => setActiveFilter(filter)}
            />
          ))}
        </div>

        <div
          className="h-full overflow-y-auto pb-28 px-5"
          style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
        >
          {filteredInvestments.length > 0 ? (
            filteredInvestments.map((investment) => (
              <InvestCard
                key={investment.id}
                {...investment}
                onInvest={() => handleInvest(investment)}
              />
            ))
          ) : (
            <div className="text-center py-16">
              <p className="text-[#8C7B65] text-sm">No investments found</p>
            </div>
          )}
          <div className="h-8" />
        </div>
      </div>

      <InvestmentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        investment={selectedInvestment}
      />
    </div>
  );
};

const HomePage = ({ onNavigate }) => {
  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      <div
        className="bg-[#1C1915] text-[#F9F7F2] pt-12 pb-16 px-6 relative rounded-b-[40px]"
        style={customStyles.textureGrain}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37] opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="flex justify-between items-center mb-8 relative z-10">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#8C7B65] font-semibold mb-1">Good Morning</p>
            <div className="text-2xl tracking-wide font-bold" style={customStyles.fontSerifDisplay}>NEEV.</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#2C2824] border border-[#D4AF37]/30 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.5">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#8C7B65] font-semibold mb-1">Portfolio Value</p>
          <h2 className="text-5xl font-light mb-1" style={{ ...customStyles.fontSerifDisplay, ...customStyles.textGoldGradient }}>₹48,25,000</h2>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-green-400 text-xs font-bold">+₹3,12,500</span>
            <span className="text-[#8C7B65] text-[10px]">this month</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-28 px-5 -mt-6 relative z-10" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
        <div className="grid grid-cols-2 gap-3 mb-6 mt-2">
          <button
            onClick={() => onNavigate('invest')}
            className="bg-[#1C1915] text-[#D4AF37] rounded-2xl p-4 text-left border border-[#D4AF37]/20 hover:bg-[#D4AF37] hover:text-[#1C1915] transition-all"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-2">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            <p className="text-[10px] font-bold tracking-widest uppercase">Invest</p>
          </button>
          <button
            onClick={() => onNavigate('activity')}
            className="bg-white text-[#1C1915] rounded-2xl p-4 text-left border border-[#E5E0D5] hover:border-[#D4AF37] transition-all"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-2 text-[#8C7B65]">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
            <p className="text-[10px] font-bold tracking-widest uppercase text-[#8C7B65]">Activity</p>
          </button>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E5E0D5] mb-4">
          <h3 className="text-lg text-[#1C1915] mb-4" style={customStyles.fontSerifDisplay}>Portfolio Breakdown</h3>
          {[
            { label: 'Mutual Funds', value: '42%', color: '#D4AF37' },
            { label: 'Bonds', value: '28%', color: '#1C1915' },
            { label: 'Private Equity', value: '30%', color: '#8C7B65' },
          ].map((item) => (
            <div key={item.label} className="mb-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#8C7B65]">{item.label}</span>
                <span className="text-[10px] font-bold text-[#1C1915]">{item.value}</span>
              </div>
              <div className="h-1.5 bg-[#F0EDE6] rounded-full">
                <div className="h-full rounded-full" style={{ width: item.value, background: item.color }} />
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E5E0D5]">
          <h3 className="text-lg text-[#1C1915] mb-1" style={customStyles.fontSerifDisplay}>Featured Investment</h3>
          <p className="text-[10px] text-[#8C7B65] uppercase tracking-widest mb-4">Recommended for you</p>
          <div className="flex justify-between items-center mb-3">
            <div>
              <p className="text-base text-[#1C1915]" style={customStyles.fontSerifDisplay}>Falcon Alpha PE</p>
              <p className="text-[10px] text-[#8C7B65] uppercase tracking-widest">Private Equity • Series B</p>
            </div>
            <div className="text-right">
              <p className="text-xl text-[#1C1915]" style={customStyles.fontSerifDisplay}>18.5%</p>
              <p className="text-[9px] text-[#8C7B65] uppercase tracking-wider">Target IRR</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('invest')}
            className="w-full bg-[#1C1915] text-[#D4AF37] py-3 rounded-xl text-[10px] font-bold tracking-[0.2em] uppercase border border-[#D4AF37]/20 hover:bg-[#D4AF37] hover:text-[#1C1915] transition-all"
          >
            View All Investments
          </button>
        </div>

        <div className="h-8" />
      </div>
    </div>
  );
};

const ActivityPage = () => {
  const activities = [
    { id: 1, title: 'Neev Bluechip Focus', type: 'SIP Investment', amount: '+₹5,000', date: 'Today, 10:32 AM', status: 'success' },
    { id: 2, title: 'Sovereign Yield Bond', type: 'Interest Payout', amount: '+₹1,150', date: 'Yesterday, 3:15 PM', status: 'success' },
    { id: 3, title: 'Falcon Alpha PE', type: 'Capital Call', amount: '-₹2,00,000', date: '12 Jun 2025', status: 'pending' },
    { id: 4, title: 'Neev Bluechip Focus', type: 'SIP Investment', amount: '+₹5,000', date: '01 Jun 2025', status: 'success' },
    { id: 5, title: 'Sovereign Yield Bond', type: 'Interest Payout', amount: '+₹1,150', date: '15 May 2025', status: 'success' },
  ];

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      <div
        className="bg-[#1C1915] text-[#F9F7F2] pt-12 pb-10 px-6 relative rounded-b-[40px]"
        style={customStyles.textureGrain}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37] opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="relative z-10">
          <h2 className="text-4xl font-normal tracking-tight mb-2" style={{ ...customStyles.fontSerifDisplay, ...customStyles.textGoldGradient }}>Activity</h2>
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#8C7B65] font-semibold">Your transaction history</p>
        </div>
      </div>

      <div
        className="flex-1 -mt-6 relative z-10 overflow-y-auto pb-28 px-5"
        style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
      >
        <div className="bg-white rounded-2xl border border-[#E5E0D5] overflow-hidden mt-2">
          {activities.map((activity, index) => (
            <div key={activity.id} className={`p-4 flex justify-between items-center ${index !== activities.length - 1 ? 'border-b border-[#F0EDE6]' : ''}`}>
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center ${activity.status === 'success' ? 'bg-green-50' : 'bg-amber-50'}`}>
                  {activity.status === 'success' ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1C1915]">{activity.title}</p>
                  <p className="text-[10px] text-[#8C7B65] uppercase tracking-widest">{activity.type}</p>
                  <p className="text-[10px] text-[#8C7B65]">{activity.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-bold ${activity.amount.startsWith('+') ? 'text-green-600' : 'text-[#1C1915]'}`}>{activity.amount}</p>
                <span className={`text-[9px] font-bold uppercase tracking-wider ${activity.status === 'success' ? 'text-green-500' : 'text-amber-500'}`}>
                  {activity.status === 'success' ? 'Completed' : 'Pending'}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="h-8" />
      </div>
    </div>
  );
};

const PrivatePage = () => {
  const [unlocked, setUnlocked] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handlePinDigit = (digit) => {
    if (pin.length < 4) {
      const newPin = pin + digit;
      setPin(newPin);
      if (newPin.length === 4) {
        if (newPin === '1234') {
          setUnlocked(true);
          setError(false);
        } else {
          setError(true);
          setTimeout(() => {
            setPin('');
            setError(false);
          }, 800);
        }
      }
    }
  };

  const handleBackspace = () => {
    setPin(pin.slice(0, -1));
    setError(false);
  };

  if (!unlocked) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center px-6 bg-[#F9F7F2]">
        <div className="w-16 h-16 rounded-full bg-[#1C1915] flex items-center justify-center mb-6">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.5">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <h2 className="text-3xl text-[#1C1915] mb-2 text-center" style={customStyles.fontSerifDisplay}>Private Vault</h2>
        <p className="text-[11px] uppercase tracking-[0.2em] text-[#8C7B65] font-semibold mb-10 text-center">Enter your 4-digit PIN to access</p>

        <div className="flex gap-4 mb-8">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full border-2 transition-all ${
                error ? 'border-red-400 bg-red-400' : i < pin.length ? 'border-[#D4AF37] bg-[#D4AF37]' : 'border-[#8C7B65] bg-transparent'
              }`}
            />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4 w-full max-w-xs">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
            <button
              key={digit}
              onClick={() => handlePinDigit(String(digit))}
              className="h-14 rounded-2xl bg-white border border-[#E5E0D5] text-[#1C1915] text-xl font-light hover:border-[#D4AF37] hover:bg-[#F0EDE6] transition-all"
              style={customStyles.fontSerifDisplay}
            >
              {digit}
            </button>
          ))}
          <div />
          <button
            onClick={() => handlePinDigit('0')}
            className="h-14 rounded-2xl bg-white border border-[#E5E0D5] text-[#1C1915] text-xl font-light hover:border-[#D4AF37] hover:bg-[#F0EDE6] transition-all"
            style={customStyles.fontSerifDisplay}
          >
            0
          </button>
          <button
            onClick={handleBackspace}
            className="h-14 rounded-2xl bg-[#F0EDE6] border border-[#E5E0D5] text-[#8C7B65] flex items-center justify-center hover:border-[#D4AF37] transition-all"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
              <line x1="18" y1="9" x2="12" y2="15" />
              <line x1="12" y1="9" x2="18" y2="15" />
            </svg>
          </button>
        </div>

        <p className="text-[10px] text-[#8C7B65] mt-6">Hint: try 1234</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      <div
        className="bg-[#1C1915] text-[#F9F7F2] pt-12 pb-10 px-6 relative rounded-b-[40px]"
        style={customStyles.textureGrain}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37] opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="flex justify-between items-center mb-4 relative z-10">
          <div className="text-2xl tracking-wide font-bold" style={customStyles.fontSerifDisplay}>PRIVATE.</div>
          <button onClick={() => setUnlocked(false)} className="w-8 h-8 rounded-full bg-[#2C2824] flex items-center justify-center border border-[#D4AF37]/30">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </button>
        </div>
        <div className="relative z-10">
          <h2 className="text-4xl font-normal tracking-tight mb-2" style={{ ...customStyles.fontSerifDisplay, ...customStyles.textGoldGradient }}>Private Vault</h2>
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#8C7B65] font-semibold">Exclusive high-net-worth opportunities</p>
        </div>
      </div>

      <div
        className="flex-1 -mt-6 relative z-10 overflow-y-auto pb-28 px-5"
        style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
      >
        {[
          { title: 'Prestige REIT Fund', sub: 'Real Estate • Grade A', ret: '22.4%', label: 'Target IRR', min: '₹50,00,000', lock: '48 Months' },
          { title: 'Apex Venture Capital', sub: 'Venture Capital • Fund IV', ret: '3.2x', label: 'Target MOIC', min: '₹1,00,00,000', lock: '60 Months' },
        ].map((item, i) => (
          <div key={i} className="bg-white rounded-[24px] p-5 mb-4 border border-[#E5E0D5] mt-2">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-xl text-[#1C1915] mb-1" style={customStyles.fontSerifDisplay}>{item.title}</h4>
                <span className="text-[10px] font-bold tracking-widest text-[#8C7B65] uppercase">{item.sub}</span>
              </div>
              <div className="text-right">
                <div className="text-2xl text-[#1C1915] leading-none" style={customStyles.fontSerifDisplay}>{item.ret}</div>
                <div className="text-[9px] font-bold text-[#8C7B65] uppercase tracking-wider">{item.label}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-5 border-t border-[#F0EDE6] pt-4">
              <div>
                <p className="text-[9px] font-bold text-[#8C7B65] uppercase tracking-widest mb-0.5">Min Investment</p>
                <p className="text-sm font-bold text-[#1C1915]">{item.min}</p>
              </div>
              <div>
                <p className="text-[9px] font-bold text-[#8C7B65] uppercase tracking-widest mb-0.5">Lock-in Period</p>
                <p className="text-sm font-bold text-[#1C1915]">{item.lock}</p>
              </div>
            </div>
            <button className="w-full bg-[#1C1915] text-[#D4AF37] py-3.5 rounded-xl text-[10px] font-bold tracking-[0.2em] uppercase border border-[#D4AF37]/20 hover:bg-[#D4AF37] hover:text-[#1C1915] transition-all">
              Request Access
            </button>
          </div>
        ))}
        <div className="h-8" />
      </div>
    </div>
  );
};

const App = () => {
  const [activePage, setActivePage] = useState('invest');

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,400&family=Manrope:wght@200;300;400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return <HomePage onNavigate={setActivePage} />;
      case 'invest':
        return <InvestPage onNavigate={setActivePage} />;
      case 'activity':
        return <ActivityPage />;
      case 'private':
        return <PrivatePage />;
      default:
        return <InvestPage onNavigate={setActivePage} />;
    }
  };

  return (
    <div
      className="bg-[#E5E0D5] flex justify-center items-center min-h-screen p-4"
      style={customStyles.fontSansBody}
    >
      <div
        className="w-full h-full max-w-[400px] bg-[#F9F7F2] rounded-[20px] shadow-2xl overflow-hidden relative flex flex-col"
        style={{ height: '867px' }}
      >
        {renderPage()}
        <NavBar activePage={activePage} onNavigate={setActivePage} />
      </div>
    </div>
  );
};

export default App;
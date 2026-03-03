import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const customStyles = {
  darkGradientBg: {
    background: 'linear-gradient(180deg, #1F1B16 0%, #2A251E 100%)',
  },
  goldGradientBg: {
    background: 'linear-gradient(135deg, #D4AF37 0%, #AA8A26 100%)',
  },
  goldGradientText: {
    background: 'linear-gradient(135deg, #D4AF37 0%, #8C701B 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  glassNav: {
    background: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    borderTop: '1px solid rgba(212, 175, 55, 0.15)',
  },
  cardShadow: {
    boxShadow: '0 10px 30px -5px rgba(31, 27, 22, 0.08)',
  },
  outerShadow: {
    boxShadow: '0 25px 50px -12px rgba(31, 27, 22, 0.20)',
  },
};

const holdings = [
  {
    id: 1,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.5">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
      </svg>
    ),
    iconBg: 'bg-[#F7F5F0] border border-[#D4AF37]/20',
    name: 'Private Equity',
    value: '₹8,50,000',
    tag: 'Locked • 3Y',
    change: '+14.2%',
    changeColor: 'text-green-600',
  },
  {
    id: 2,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.5">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
      </svg>
    ),
    iconBg: 'bg-[#1F1B16]',
    name: 'Neev Protect',
    value: '₹12,00,000',
    tag: 'Liquid • T+1',
    change: '+8.5%',
    changeColor: 'text-green-600',
  },
  {
    id: 3,
    icon: (
      <div className="w-6 h-6 rounded-full border border-[#D4AF37] opacity-40"></div>
    ),
    iconBg: 'bg-[#F7F5F0] border border-[#D4AF37]/20',
    name: 'Gold Bonds',
    value: '₹4,00,000',
    tag: 'Sovereign',
    change: '0.0%',
    changeColor: 'text-[#D4AF37]',
  },
];

const NavBar = ({ activeTab, setActiveTab }) => {
  const tabs = [
    {
      id: 'home',
      label: 'HOME',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22" stroke="currentColor" fill="none" strokeWidth="2"></polyline>
        </svg>
      ),
    },
    {
      id: 'invest',
      label: 'INVEST',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="1" x2="12" y2="23"></line>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
        </svg>
      ),
    },
    {
      id: 'stats',
      label: 'STATS',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
        </svg>
      ),
    },
    {
      id: 'me',
      label: 'ME',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      ),
    },
  ];

  return (
    <nav
      className="absolute bottom-0 left-0 right-0 pb-6 pt-4 px-8 flex justify-between items-center z-50"
      style={customStyles.glassNav}
    >
      {tabs.slice(0, 2).map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex flex-col items-center gap-1.5 transition-colors ${
            activeTab === tab.id ? 'text-[#1F1B16]' : 'text-[#8F8B85] hover:text-[#D4AF37]'
          }`}
        >
          {tab.icon}
          <span className="text-[10px] font-bold tracking-widest">{tab.label}</span>
        </button>
      ))}

      <div className="relative -top-6">
        <button
          className="w-14 h-14 rounded-full bg-[#1F1B16] flex items-center justify-center text-[#D4AF37] border border-[#D4AF37]/30 transform transition-transform active:scale-95"
          style={{ boxShadow: '0 20px 25px -5px rgba(31, 27, 22, 0.4)' }}
          onClick={() => setActiveTab('add')}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
      </div>

      {tabs.slice(2).map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex flex-col items-center gap-1.5 transition-colors ${
            activeTab === tab.id ? 'text-[#1F1B16]' : 'text-[#8F8B85] hover:text-[#D4AF37]'
          }`}
        >
          {tab.icon}
          <span className="text-[10px] font-bold tracking-widest">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
};

const HoldingCard = ({ holding }) => (
  <div className="flex items-center gap-4 bg-white rounded-xl p-3 shadow-sm border border-stone-100">
    <div className={`w-12 h-12 rounded-lg ${holding.iconBg} flex items-center justify-center flex-shrink-0`}>
      {holding.icon}
    </div>
    <div className="flex-1">
      <div className="flex justify-between mb-0.5">
        <span className="font-serif text-lg text-[#1F1B16]">{holding.name}</span>
        <span className="font-medium text-[#1F1B16]">{holding.value}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-[10px] uppercase tracking-wider text-[#8F8B85] bg-stone-100 px-1.5 py-0.5 rounded">
          {holding.tag}
        </span>
        <span className={`text-xs font-medium ${holding.changeColor}`}>{holding.change}</span>
      </div>
    </div>
  </div>
);

const HomePage = ({ setActiveTab }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [advisorReplyOpen, setAdvisorReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [replySent, setReplySent] = useState(false);
  const [showAllHoldings, setShowAllHoldings] = useState(false);

  const handleReplySend = () => {
    if (replyText.trim()) {
      setReplySent(true);
      setTimeout(() => {
        setAdvisorReplyOpen(false);
        setReplySent(false);
        setReplyText('');
      }, 1500);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div
        className="w-full rounded-b-[40px] px-6 pt-12 pb-20 relative z-10 text-[#F7F5F0]"
        style={{ ...customStyles.darkGradientBg, boxShadow: '0 25px 50px -12px rgba(31, 27, 22, 0.20)' }}
      >
        <header className="flex justify-between items-center mb-10">
          <button
            className="p-2 -ml-2 text-white/80 hover:text-white transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          <div
            className="font-serif text-2xl tracking-wide font-medium"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Neev.
          </div>
          <div className="w-10 h-10 rounded-full border border-[#D4AF37]/30 p-0.5 relative">
            <img
              src="https://ui-avatars.com/api/?name=Arjun+Kapoor&background=1F1B16&color=D4AF37"
              alt="Profile"
              className="w-full h-full rounded-full object-cover"
            />
            <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#D4AF37] rounded-full border-2 border-[#1F1B16]"></div>
          </div>
        </header>

        <div className="flex flex-col items-center mb-8">
          <span className="text-xs uppercase tracking-[0.2em] text-[#8F8B85] mb-2">Total Portfolio</span>
          <div
            className="text-[42px] leading-tight text-[#F7F5F0]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            ₹2,45,00,000
          </div>
          <div className="flex items-center gap-2 mt-2 bg-white/5 px-3 py-1 rounded-full border border-white/10">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
              <polyline points="17 6 23 6 23 12"></polyline>
            </svg>
            <span className="text-sm font-medium text-[#D4AF37]">+8.4%</span>
            <span className="text-xs text-[#8F8B85] ml-1">this month</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-6">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-[#8F8B85] mb-1">Total Yield</span>
            <span className="text-xl" style={{ fontFamily: "'Playfair Display', serif" }}>+₹12.4L</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase tracking-wider text-[#8F8B85] mb-1">Daily Accrual</span>
            <span className="text-xl" style={{ fontFamily: "'Playfair Display', serif" }}>+₹540</span>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto relative z-0 -mt-12 pb-24" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
        {/* Cards Row */}
        <div className="flex overflow-x-auto px-6 gap-4 pb-6 pt-2 snap-x" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
          {/* Neev Reserve Card */}
          <div
            className="min-w-[280px] snap-center bg-[#FDFCF9] rounded-2xl p-5 border border-[#D4AF37]/20 relative overflow-hidden group"
            style={customStyles.cardShadow}
          >
            <div className="absolute right-0 top-0 w-24 h-24 bg-[#D4AF37]/5 rounded-bl-[60px] -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>

            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="w-10 h-10 rounded-full bg-[#1F1B16] flex items-center justify-center text-[#D4AF37]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                  <path d="M2 17l10 5 10-5"></path>
                  <path d="M2 12l10 5 10-5"></path>
                </svg>
              </div>
              <span className="px-2 py-1 bg-[#D4AF37]/10 text-[#8C701B] text-[10px] font-bold uppercase tracking-wider rounded">
                Invite Only
              </span>
            </div>

            <h3 className="text-xl text-[#1F1B16] mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
              Neev Reserve
            </h3>
            <p className="text-xs text-[#8F8B85] mb-4 leading-relaxed">
              Deploy excess capital into high-yield secured instruments.
            </p>

            <div className="flex justify-between items-center">
              <div>
                <span className="block text-[10px] uppercase text-[#8F8B85]">Target APY</span>
                <span className="font-medium text-[#1F1B16]">12.5%</span>
              </div>
              <button
                className="text-white text-xs font-bold px-4 py-2 rounded-full"
                style={{ ...customStyles.goldGradientBg, boxShadow: '0 10px 15px -3px rgba(212, 175, 55, 0.30)' }}
                onClick={() => setActiveTab('invest')}
              >
                INVEST
              </button>
            </div>
          </div>

          {/* Advisor Note Card */}
          <div
            className="min-w-[280px] snap-center bg-[#1F1B16] rounded-2xl p-5 relative overflow-hidden text-[#F7F5F0]"
            style={customStyles.cardShadow}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full border border-white/20 overflow-hidden">
                <img
                  src="https://ui-avatars.com/api/?name=Sarah+W&background=333&color=fff"
                  alt="Advisor"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="text-xs font-medium">Advisor Note</div>
                <div className="text-[10px] text-white/50">Today, 9:41 AM</div>
              </div>
            </div>

            <p
              className="italic text-sm text-white/90 leading-relaxed mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              "Your portfolio outperforms standard savings by ₹1,200 this week. Consider rebalancing."
            </p>

            <button
              className="flex items-center text-[#D4AF37] text-xs font-medium gap-1 cursor-pointer"
              onClick={() => setAdvisorReplyOpen(true)}
            >
              <span>Reply to Sarah</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
        </div>

        {/* Holdings Section */}
        <div className="px-6 mt-2">
          <div className="flex justify-between items-end mb-4 border-b border-[#D4AF37]/20 pb-2">
            <h2 className="text-2xl text-[#1F1B16]" style={{ fontFamily: "'Playfair Display', serif" }}>
              Holdings
            </h2>
            <button
              className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37]"
              onClick={() => setShowAllHoldings(!showAllHoldings)}
            >
              {showAllHoldings ? 'COLLAPSE' : 'VIEW ALL'}
            </button>
          </div>

          <div className="space-y-4">
            {(showAllHoldings ? holdings : holdings).map((holding) => (
              <HoldingCard key={holding.id} holding={holding} />
            ))}
          </div>
        </div>
      </div>

      {/* Menu Overlay */}
      {menuOpen && (
        <div
          className="absolute inset-0 z-40 bg-[#1F1B16]/95 flex flex-col p-8"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          <div className="flex justify-between items-center mb-12">
            <div className="text-2xl tracking-wide font-medium text-[#F7F5F0]">Neev.</div>
            <button
              className="p-2 text-white/80 hover:text-white transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <nav className="flex flex-col gap-6">
            {['Dashboard', 'Portfolio', 'Investments', 'Analytics', 'Settings'].map((item) => (
              <button
                key={item}
                className="text-left text-3xl text-[#F7F5F0]/70 hover:text-[#D4AF37] transition-colors font-serif"
                onClick={() => setMenuOpen(false)}
              >
                {item}
              </button>
            ))}
          </nav>
          <div className="mt-auto text-xs text-[#8F8B85] tracking-widest uppercase">
            Neev Private Wealth © 2024
          </div>
        </div>
      )}

      {/* Advisor Reply Modal */}
      {advisorReplyOpen && (
        <div className="absolute inset-0 z-50 flex items-end">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setAdvisorReplyOpen(false)}
          ></div>
          <div className="relative w-full bg-[#FDFCF9] rounded-t-3xl p-6 z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full border border-[#D4AF37]/30 overflow-hidden">
                <img
                  src="https://ui-avatars.com/api/?name=Sarah+W&background=333&color=fff"
                  alt="Advisor"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="text-xs font-medium text-[#1F1B16]">Reply to Sarah</div>
                <div className="text-[10px] text-[#8F8B85]">Your wealth advisor</div>
              </div>
            </div>
            {replySent ? (
              <div className="text-center py-4">
                <div className="text-[#D4AF37] font-medium text-sm">Message sent!</div>
              </div>
            ) : (
              <>
                <textarea
                  className="w-full border border-[#D4AF37]/20 rounded-xl p-3 text-sm text-[#1F1B16] bg-white resize-none focus:outline-none focus:border-[#D4AF37]/60"
                  rows={3}
                  placeholder="Write your message..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                />
                <button
                  className="mt-3 w-full py-3 rounded-full text-white text-sm font-bold"
                  style={customStyles.goldGradientBg}
                  onClick={handleReplySend}
                >
                  SEND MESSAGE
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const InvestPage = () => (
  <div className="flex-1 overflow-y-auto pb-24 px-6 pt-8">
    <h2
      className="text-3xl text-[#1F1B16] mb-2"
      style={{ fontFamily: "'Playfair Display', serif" }}
    >
      Invest
    </h2>
    <p className="text-xs text-[#8F8B85] uppercase tracking-widest mb-8">Available Opportunities</p>

    <div className="space-y-4">
      {[
        { name: 'Neev Reserve', apy: '12.5%', type: 'Secured Debt', minInvest: '₹5,00,000', badge: 'Invite Only' },
        { name: 'Growth Fund', apy: '18.2%', type: 'Equity', minInvest: '₹2,00,000', badge: 'Open' },
        { name: 'Sovereign Gold', apy: '8.0%', type: 'Gold Bonds', minInvest: '₹50,000', badge: 'Open' },
        { name: 'Real Estate AIF', apy: '15.0%', type: 'Alternative', minInvest: '₹10,00,000', badge: 'Limited' },
      ].map((opp) => (
        <div
          key={opp.name}
          className="bg-white rounded-2xl p-5 border border-stone-100"
          style={customStyles.cardShadow}
        >
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg text-[#1F1B16]" style={{ fontFamily: "'Playfair Display', serif" }}>
              {opp.name}
            </h3>
            <span className="px-2 py-0.5 bg-[#D4AF37]/10 text-[#8C701B] text-[10px] font-bold uppercase tracking-wider rounded">
              {opp.badge}
            </span>
          </div>
          <div className="flex gap-6 mb-4">
            <div>
              <span className="block text-[10px] uppercase text-[#8F8B85]">Target APY</span>
              <span className="font-medium text-[#1F1B16]">{opp.apy}</span>
            </div>
            <div>
              <span className="block text-[10px] uppercase text-[#8F8B85]">Type</span>
              <span className="font-medium text-[#1F1B16]">{opp.type}</span>
            </div>
            <div>
              <span className="block text-[10px] uppercase text-[#8F8B85]">Min. Invest</span>
              <span className="font-medium text-[#1F1B16]">{opp.minInvest}</span>
            </div>
          </div>
          <button
            className="w-full py-2.5 rounded-full text-white text-xs font-bold"
            style={customStyles.goldGradientBg}
          >
            INVEST NOW
          </button>
        </div>
      ))}
    </div>
  </div>
);

const StatsPage = () => (
  <div className="flex-1 overflow-y-auto pb-24 px-6 pt-8">
    <h2
      className="text-3xl text-[#1F1B16] mb-2"
      style={{ fontFamily: "'Playfair Display', serif" }}
    >
      Statistics
    </h2>
    <p className="text-xs text-[#8F8B85] uppercase tracking-widest mb-8">Portfolio Performance</p>

    <div className="grid grid-cols-2 gap-4 mb-6">
      {[
        { label: 'Total Return', value: '+₹12.4L', sub: '+8.4% overall', color: 'text-green-600' },
        { label: 'Daily Gain', value: '+₹540', sub: 'Today', color: 'text-green-600' },
        { label: 'Best Asset', value: 'Pvt. Equity', sub: '+14.2%', color: 'text-[#D4AF37]' },
        { label: 'Months Active', value: '18', sub: 'Since Jan 2023', color: 'text-[#1F1B16]' },
      ].map((stat) => (
        <div
          key={stat.label}
          className="bg-white rounded-2xl p-4 border border-stone-100"
          style={customStyles.cardShadow}
        >
          <span className="block text-[10px] uppercase tracking-wider text-[#8F8B85] mb-1">{stat.label}</span>
          <span className={`block text-xl font-medium ${stat.color}`} style={{ fontFamily: "'Playfair Display', serif" }}>
            {stat.value}
          </span>
          <span className="block text-xs text-[#8F8B85] mt-0.5">{stat.sub}</span>
        </div>
      ))}
    </div>

    <div className="bg-white rounded-2xl p-5 border border-stone-100 mb-6" style={customStyles.cardShadow}>
      <h3 className="text-base font-medium text-[#1F1B16] mb-4">Allocation</h3>
      <div className="space-y-3">
        {[
          { name: 'Neev Protect', pct: 49, color: '#1F1B16' },
          { name: 'Private Equity', pct: 35, color: '#D4AF37' },
          { name: 'Gold Bonds', pct: 16, color: '#8C701B' },
        ].map((item) => (
          <div key={item.name}>
            <div className="flex justify-between mb-1">
              <span className="text-xs text-[#1F1B16]">{item.name}</span>
              <span className="text-xs text-[#8F8B85]">{item.pct}%</span>
            </div>
            <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{ width: `${item.pct}%`, backgroundColor: item.color }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const MePage = () => (
  <div className="flex-1 overflow-y-auto pb-24">
    <div
      className="w-full px-6 pt-12 pb-10 text-[#F7F5F0] flex flex-col items-center"
      style={customStyles.darkGradientBg}
    >
      <div className="w-20 h-20 rounded-full border-2 border-[#D4AF37]/50 p-1 mb-4">
        <img
          src="https://ui-avatars.com/api/?name=Arjun+Kapoor&background=1F1B16&color=D4AF37"
          alt="Profile"
          className="w-full h-full rounded-full object-cover"
        />
      </div>
      <h2 className="text-2xl font-medium mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
        Arjun Kapoor
      </h2>
      <p className="text-xs text-[#8F8B85] uppercase tracking-widest">Premium Member</p>
    </div>

    <div className="px-6 pt-6">
      <div className="space-y-3">
        {[
          { label: 'Account Details', icon: '👤' },
          { label: 'KYC & Documents', icon: '📄' },
          { label: 'Notifications', icon: '🔔' },
          { label: 'Security', icon: '🔒' },
          { label: 'Help & Support', icon: '💬' },
          { label: 'Sign Out', icon: '🚪' },
        ].map((item) => (
          <button
            key={item.label}
            className="w-full flex items-center justify-between bg-white rounded-xl px-4 py-3 border border-stone-100 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">{item.icon}</span>
              <span className="text-sm font-medium text-[#1F1B16]">{item.label}</span>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8F8B85" strokeWidth="2">
              <path d="M9 18l6-6-6-6"></path>
            </svg>
          </button>
        ))}
      </div>
    </div>
  </div>
);

const AddModal = ({ onClose }) => {
  const [amount, setAmount] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (amount && selectedType) {
      setSubmitted(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    }
  };

  return (
    <div className="absolute inset-0 z-50 flex items-end">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
      <div className="relative w-full bg-[#FDFCF9] rounded-t-3xl p-6 z-10">
        <div className="w-10 h-1 bg-stone-200 rounded-full mx-auto mb-6"></div>
        <h3 className="text-xl text-[#1F1B16] mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
          Quick Invest
        </h3>
        <p className="text-xs text-[#8F8B85] mb-6">Add funds to your portfolio</p>

        {submitted ? (
          <div className="text-center py-4">
            <div className="text-[#D4AF37] font-medium">Investment initiated!</div>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <label className="block text-[10px] uppercase tracking-widest text-[#8F8B85] mb-2">
                Select Product
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['Neev Reserve', 'Growth Fund', 'Gold Bonds', 'Neev Protect'].map((type) => (
                  <button
                    key={type}
                    className={`py-2 px-3 rounded-xl text-xs font-medium border transition-colors ${
                      selectedType === type
                        ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#8C701B]'
                        : 'border-stone-200 bg-white text-[#1F1B16]'
                    }`}
                    onClick={() => setSelectedType(type)}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-[10px] uppercase tracking-widest text-[#8F8B85] mb-2">
                Amount (₹)
              </label>
              <input
                type="number"
                className="w-full border border-[#D4AF37]/20 rounded-xl p-3 text-sm text-[#1F1B16] bg-white focus:outline-none focus:border-[#D4AF37]/60"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <button
              className="w-full py-3 rounded-full text-white text-sm font-bold"
              style={customStyles.goldGradientBg}
              onClick={handleSubmit}
            >
              CONFIRM INVESTMENT
            </button>
          </>
        )}
      </div>
    </div>
  );
};

const App = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&display=swap');
      .no-scrollbar::-webkit-scrollbar { display: none; }
      .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      body { margin: 0; font-family: 'Inter', sans-serif; background-color: #E6E2D8; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    if (activeTab === 'add') {
      setShowAddModal(true);
      setActiveTab('home');
    }
  }, [activeTab]);

  const renderPage = () => {
    switch (activeTab) {
      case 'invest':
        return <InvestPage />;
      case 'stats':
        return <StatsPage />;
      case 'me':
        return <MePage />;
      default:
        return <HomePage setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen w-full"
      style={{ backgroundColor: '#E6E2D8', fontFamily: "'Inter', sans-serif" }}
    >
      <div
        className="relative w-full h-screen bg-[#F7F5F0] overflow-hidden flex flex-col max-w-md mx-auto sm:rounded-[20px]"
        style={{ ...customStyles.outerShadow, maxHeight: '100vh' }}
      >
        {renderPage()}
        <NavBar activeTab={activeTab} setActiveTab={setActiveTab} />
        {showAddModal && <AddModal onClose={() => setShowAddModal(false)} />}
      </div>
    </div>
  );
};

export default App;
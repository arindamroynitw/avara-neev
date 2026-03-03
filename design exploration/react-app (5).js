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
  textureGrain: {
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")`,
  },
};

const NavBar = ({ activeTab, setActiveTab }) => {
  const navItems = [
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
      {navItems.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className="flex flex-col items-center gap-1 p-2 group"
          >
            <div className="relative" style={{ color: isActive ? '#1C1915' : '#8C7B65' }}>
              {item.icon}
              {isActive && (
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#1C1915] rounded-full" />
              )}
            </div>
            <span
              className="text-[9px] font-bold tracking-widest uppercase"
              style={{ color: isActive ? '#1C1915' : '#8C7B65' }}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

const ConciergeCard = () => {
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [showChat, setShowChat] = useState(false);

  const handleSend = () => {
    if (message.trim()) {
      setChatMessages([...chatMessages, { text: message, from: 'user' }]);
      setMessage('');
      setShowChat(true);
      setTimeout(() => {
        setChatMessages(prev => [...prev, {
          text: "Thank you for your message. I'll look into that right away.",
          from: 'ai'
        }]);
      }, 1000);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#E5E0D5] mb-6 flex flex-col relative overflow-hidden">
      <div className="absolute right-0 top-0 w-24 h-24 bg-gradient-to-br from-[#D4AF37]/5 to-transparent rounded-bl-full pointer-events-none" />
      <div className="p-5 flex gap-4 items-start">
        <div className="relative shrink-0">
          <div className="w-10 h-10 rounded-full p-[2px] bg-gradient-to-br from-[#D4AF37] to-[#E5E0D5]">
            <img
              src="https://ui-avatars.com/api/?name=Arjun&background=1C1915&color=D4AF37"
              alt="Concierge"
              className="w-full h-full rounded-full object-cover border-2 border-white"
            />
          </div>
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-baseline mb-1">
            <h4 className="font-bold text-lg text-[#1C1915]" style={customStyles.fontSerifDisplay}>AI Concierge</h4>
            <span className="text-[9px] text-[#8C7B65] font-semibold uppercase tracking-wider">Active Now</span>
          </div>
          <p className="text-[13px] text-[#5C554B] leading-relaxed italic">
            "Good morning Arjun. Any travel plans this month? It may affect your idle cash strategy."
          </p>
        </div>
      </div>

      {showChat && chatMessages.length > 0 && (
        <div className="px-5 pb-2 space-y-2 max-h-32 overflow-y-auto">
          {chatMessages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`text-xs px-3 py-2 rounded-2xl max-w-[80%] ${
                  msg.from === 'user'
                    ? 'bg-[#1C1915] text-[#F9F7F2]'
                    : 'bg-[#F0EDE6] text-[#5C554B] italic'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="px-5 pb-5 mt-2">
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-[#F9F7F2] border border-[#E5E0D5] rounded-full py-2.5 pl-4 pr-12 text-xs focus:outline-none focus:border-[#D4AF37]/50"
          />
          <button
            onClick={handleSend}
            className="absolute right-1.5 w-8 h-8 bg-[#D4AF37] rounded-full flex items-center justify-center shadow-sm hover:bg-[#B8860B] transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

const OpportunitiesSection = ({ onInvest }) => {
  return (
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

      <div
        className="bg-[#F0EDE6] rounded-[24px] overflow-hidden relative min-h-[180px] group cursor-pointer transition-transform hover:scale-[1.02]"
        onClick={onInvest}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(45deg, transparent 25%, rgba(212,175,55,0.05) 25%, rgba(212,175,55,0.05) 50%, transparent 50%, transparent 75%, rgba(212,175,55,0.05) 75%, rgba(212,175,55,0.05) 100%)',
            backgroundSize: '20px 20px',
          }}
        />
        <div className="absolute right-0 bottom-0 w-32 h-32 border-[20px] border-[#D4AF37]/10 rounded-full translate-x-1/3 translate-y-1/3" />
        <div className="relative p-6 h-full flex flex-col justify-between z-10">
          <div>
            <span className="inline-block px-2 py-1 bg-[#D4AF37] text-white text-[10px] font-bold tracking-widest uppercase rounded mb-3">Exclusive</span>
            <h3 className="text-3xl leading-none text-[#1C1915] mb-1" style={customStyles.fontSerifDisplay}>Private Reserve</h3>
            <p className="text-[#5C554B] text-xs font-medium max-w-[60%]">Deploy excess capital into high-yield instruments.</p>
          </div>
          <div className="flex items-center gap-3 mt-6">
            <button className="bg-[#1C1915] text-[#F9F7F2] px-6 py-3 rounded-full text-xs font-bold tracking-widest uppercase shadow-lg group-hover:bg-[#D4AF37] transition-colors">
              Invest Now
            </button>
            <span className="text-xs italic text-[#8C7B65]" style={customStyles.fontSerifDisplay}>7.2% APY</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const HoldingsSection = ({ onViewAll }) => {
  const holdings = [
    {
      id: 1,
      icon: <span className="font-bold text-[#D4AF37] text-lg italic" style={customStyles.fontSerifDisplay}>Nr</span>,
      iconBg: 'bg-[#2C2824]',
      name: 'Neev Reserve',
      amount: '₹12.4L',
      tag: 'INSTITUTIONAL • INSTANT',
      yield: '+7.2%',
    },
    {
      id: 2,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5C554B" strokeWidth="1.5">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
      iconBg: 'bg-[#F0EDE6] border border-[#E5E0D5]',
      name: 'Neev Protect',
      amount: '₹8.2L',
      tag: 'WEALTH • T+1',
      yield: '+8.5%',
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-baseline mb-4 px-1 border-b border-[#E5E0D5] pb-2">
        <h3 className="text-2xl text-[#1C1915]" style={customStyles.fontSerifDisplay}>Holdings</h3>
        <button onClick={onViewAll} className="text-[10px] font-bold text-[#B8860B] tracking-widest hover:text-[#1C1915] transition-colors">VIEW ALL</button>
      </div>
      <div className="space-y-3">
        {holdings.map((h) => (
          <div key={h.id} className="flex items-center p-3 hover:bg-white rounded-xl transition-colors group cursor-pointer">
            <div className={`w-12 h-12 rounded-xl ${h.iconBg} flex items-center justify-center shrink-0 shadow-sm`}>
              {h.icon}
            </div>
            <div className="ml-4 flex-1">
              <div className="flex justify-between items-center mb-0.5">
                <h4 className="font-bold text-[#1C1915]">{h.name}</h4>
                <span className="text-sm font-bold text-[#1C1915]">{h.amount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[11px] text-[#8C7B65] font-medium tracking-wide">{h.tag}</span>
                <span className="text-[11px] text-green-600 bg-green-50 px-1.5 py-0.5 rounded font-bold">{h.yield}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const InvestModal = ({ isOpen, onClose }) => {
  const [amount, setAmount] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (amount.trim()) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setAmount('');
        onClose();
      }, 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-[100] flex items-end justify-center" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="bg-[#F9F7F2] w-full rounded-t-[28px] p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl text-[#1C1915]" style={customStyles.fontSerifDisplay}>Private Reserve</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-[#F0EDE6] flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5C554B" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="bg-[#F0EDE6] rounded-2xl p-4 mb-4">
          <p className="text-xs text-[#8C7B65] mb-1">Annual Percentage Yield</p>
          <p className="text-3xl font-bold text-[#D4AF37]" style={customStyles.fontSerifDisplay}>7.2% APY</p>
          <p className="text-xs text-[#5C554B] mt-1">Deploy excess capital into high-yield instruments.</p>
        </div>
        {submitted ? (
          <div className="text-center py-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p className="text-[#1C1915] font-bold">Investment Initiated!</p>
            <p className="text-xs text-[#8C7B65] mt-1">Your investment is being processed.</p>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <label className="text-xs text-[#8C7B65] font-semibold uppercase tracking-wider mb-2 block">Investment Amount</label>
              <input
                type="number"
                placeholder="Enter amount in ₹"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-white border border-[#E5E0D5] rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-[#D4AF37]/50"
              />
            </div>
            <button
              onClick={handleSubmit}
              className="w-full bg-[#1C1915] text-[#F9F7F2] py-3.5 rounded-full text-xs font-bold tracking-widest uppercase shadow-lg hover:bg-[#D4AF37] transition-colors"
            >
              Confirm Investment
            </button>
          </>
        )}
      </div>
    </div>
  );
};

const AllHoldingsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const allHoldings = [
    { id: 1, name: 'Neev Reserve', amount: '₹12.4L', tag: 'INSTITUTIONAL • INSTANT', yield: '+7.2%', color: '#2C2824', icon: 'Nr' },
    { id: 2, name: 'Neev Protect', amount: '₹8.2L', tag: 'WEALTH • T+1', yield: '+8.5%', color: '#F0EDE6', shield: true },
    { id: 3, name: 'Neev Growth', amount: '₹3.9L', tag: 'EQUITY • T+3', yield: '+12.1%', color: '#1C1915', icon: 'Ng' },
  ];

  return (
    <div className="absolute inset-0 z-[100] flex flex-col" style={{ background: '#F9F7F2' }}>
      <div className="bg-[#1C1915] pt-12 pb-8 px-6" style={customStyles.textureGrain}>
        <div className="flex justify-between items-center">
          <button onClick={onClose} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <h3 className="text-xl text-[#F9F7F2]" style={customStyles.fontSerifDisplay}>All Holdings</h3>
          <div className="w-10" />
        </div>
      </div>
      <div className="flex-1 p-5 overflow-y-auto space-y-3">
        {allHoldings.map((h) => (
          <div key={h.id} className="flex items-center p-4 bg-white rounded-xl shadow-sm">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: h.color }}
            >
              {h.shield ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5C554B" strokeWidth="1.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              ) : (
                <span className="font-bold text-[#D4AF37] text-lg italic" style={customStyles.fontSerifDisplay}>{h.icon}</span>
              )}
            </div>
            <div className="ml-4 flex-1">
              <div className="flex justify-between items-center mb-0.5">
                <h4 className="font-bold text-[#1C1915]">{h.name}</h4>
                <span className="text-sm font-bold text-[#1C1915]">{h.amount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[11px] text-[#8C7B65] font-medium tracking-wide">{h.tag}</span>
                <span className="text-[11px] text-green-600 bg-green-50 px-1.5 py-0.5 rounded font-bold">{h.yield}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const NotificationsPanel = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const notifications = [
    { id: 1, title: 'Yield Credited', body: '₹540 accrual added to your Neev Reserve.', time: '2m ago' },
    { id: 2, title: 'New Opportunity', body: 'Private Reserve: 7.2% APY now available.', time: '1h ago' },
    { id: 3, title: 'Market Update', body: 'Your portfolio grew 8.4% this month.', time: '3h ago' },
  ];

  return (
    <div className="absolute inset-0 z-[100] flex flex-col" style={{ background: '#F9F7F2' }}>
      <div className="bg-[#1C1915] pt-12 pb-8 px-6" style={customStyles.textureGrain}>
        <div className="flex justify-between items-center">
          <button onClick={onClose} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <h3 className="text-xl text-[#F9F7F2]" style={customStyles.fontSerifDisplay}>Notifications</h3>
          <div className="w-10" />
        </div>
      </div>
      <div className="flex-1 p-5 space-y-3 overflow-y-auto">
        {notifications.map((n) => (
          <div key={n.id} className="bg-white rounded-xl p-4 border border-[#E5E0D5]">
            <div className="flex justify-between items-baseline mb-1">
              <h4 className="font-bold text-[#1C1915] text-sm">{n.title}</h4>
              <span className="text-[10px] text-[#8C7B65]">{n.time}</span>
            </div>
            <p className="text-xs text-[#5C554B]">{n.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const MenuPanel = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const menuItems = ['Dashboard', 'Portfolio', 'Transactions', 'Analytics', 'Settings', 'Support'];

  return (
    <div className="absolute inset-0 z-[100] flex flex-col" style={{ background: '#1C1915', ...customStyles.textureGrain }}>
      <div className="pt-12 pb-8 px-6">
        <div className="flex justify-between items-center mb-12">
          <div className="text-2xl tracking-wide font-bold text-[#F9F7F2]" style={customStyles.fontSerifDisplay}>NEEV.</div>
          <button onClick={onClose} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item}
              onClick={onClose}
              className="w-full text-left px-4 py-4 text-[#F9F7F2] text-2xl border-b border-white/5 hover:text-[#D4AF37] transition-colors"
              style={customStyles.fontSerifDisplay}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const InvestPage = () => (
  <div className="flex-1 flex flex-col items-center justify-center p-6">
    <div className="text-center">
      <h2 className="text-3xl text-[#1C1915] mb-3" style={customStyles.fontSerifDisplay}>Invest</h2>
      <p className="text-sm text-[#8C7B65] mb-8">Discover premium investment opportunities curated for you.</p>
      <div className="space-y-4">
        {[
          { name: 'Private Reserve', apy: '7.2%', risk: 'Low' },
          { name: 'Equity Growth', apy: '12.1%', risk: 'High' },
          { name: 'Balanced Fund', apy: '9.4%', risk: 'Medium' },
        ].map((fund) => (
          <div key={fund.name} className="bg-white rounded-2xl p-4 border border-[#E5E0D5] text-left">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-[#1C1915]">{fund.name}</h3>
              <span className="text-[#D4AF37] font-bold">{fund.apy}</span>
            </div>
            <p className="text-xs text-[#8C7B65] mt-1">Risk: {fund.risk}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const ActivityPage = () => (
  <div className="flex-1 flex flex-col p-6">
    <h2 className="text-3xl text-[#1C1915] mb-6" style={customStyles.fontSerifDisplay}>Activity</h2>
    <div className="space-y-3">
      {[
        { type: 'Credit', desc: 'Yield accrual — Neev Reserve', amount: '+₹540', date: 'Today' },
        { type: 'Debit', desc: 'Investment — Neev Protect', amount: '-₹1.2L', date: 'Yesterday' },
        { type: 'Credit', desc: 'Dividend — Private Reserve', amount: '+₹3,200', date: '3 days ago' },
        { type: 'Credit', desc: 'Yield accrual — Neev Reserve', amount: '+₹520', date: '1 week ago' },
      ].map((tx, idx) => (
        <div key={idx} className="bg-white rounded-xl p-4 border border-[#E5E0D5] flex justify-between items-center">
          <div>
            <p className="text-xs font-bold text-[#8C7B65] uppercase tracking-wide">{tx.type}</p>
            <p className="text-sm text-[#1C1915] font-medium mt-0.5">{tx.desc}</p>
            <p className="text-[10px] text-[#8C7B65] mt-0.5">{tx.date}</p>
          </div>
          <span className={`font-bold text-sm ${tx.type === 'Credit' ? 'text-green-600' : 'text-red-500'}`}>{tx.amount}</span>
        </div>
      ))}
    </div>
  </div>
);

const PrivatePage = () => (
  <div className="flex-1 flex flex-col items-center justify-center p-6">
    <div className="text-center">
      <div className="w-20 h-20 rounded-full border-2 border-[#D4AF37]/30 flex items-center justify-center mx-auto mb-6 bg-[#1C1915]">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.5">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      </div>
      <h2 className="text-3xl text-[#1C1915] mb-2" style={customStyles.fontSerifDisplay}>Private Vault</h2>
      <p className="text-sm text-[#8C7B65] mb-6">Your exclusive private banking services and privileged access.</p>
      <div className="space-y-3">
        {['Wealth Advisory', 'Estate Planning', 'Private Credit', 'Family Office'].map((item) => (
          <div key={item} className="bg-[#1C1915] text-[#F9F7F2] rounded-xl p-4 flex justify-between items-center">
            <span className="text-sm font-medium">{item}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const HomePage = ({ onInvest, onViewAll }) => (
  <div className="h-full overflow-y-auto pb-28 px-5" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
    <ConciergeCard />
    <OpportunitiesSection onInvest={onInvest} />
    <HoldingsSection onViewAll={onViewAll} />
    <div className="h-8" />
  </div>
);

const App = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [investModalOpen, setInvestModalOpen] = useState(false);
  const [allHoldingsOpen, setAllHoldingsOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,400&family=Manrope:wght@200;300;400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'invest': return <InvestPage />;
      case 'activity': return <ActivityPage />;
      case 'private': return <PrivatePage />;
      default: return (
        <HomePage
          onInvest={() => setInvestModalOpen(true)}
          onViewAll={() => setAllHoldingsOpen(true)}
        />
      );
    }
  };

  return (
    <div
      className="bg-[#E5E0D5] flex justify-center items-center min-h-screen p-4"
      style={customStyles.fontSansBody}
    >
      <div className="w-[400px] h-[867px] bg-[#F9F7F2] rounded-[20px] shadow-2xl overflow-hidden relative flex flex-col" style={{ color: '#262118' }}>

        {/* Header */}
        <div
          className="bg-[#1C1915] text-[#F9F7F2] pt-12 pb-16 px-6 relative rounded-b-[40px] z-0"
          style={customStyles.textureGrain}
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37] opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

          <div className="flex justify-between items-center mb-8 relative z-10">
            <button
              onClick={() => setMenuOpen(true)}
              className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#D4AF37]">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <div className="text-2xl tracking-wide font-bold" style={customStyles.fontSerifDisplay}>NEEV.</div>
            <button
              onClick={() => setNotificationsOpen(true)}
              className="w-10 h-10 rounded-full bg-[#2C2824] flex items-center justify-center relative border border-[#D4AF37]/30"
            >
              <span className="absolute top-2 right-2.5 w-1.5 h-1.5 bg-[#D4AF37] rounded-full shadow-[0_0_8px_#D4AF37]" />
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
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
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

        {/* Content */}
        <div className="flex-1 -mt-8 relative z-10 flex flex-col overflow-hidden">
          {renderContent()}
        </div>

        {/* Nav */}
        <NavBar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Modals */}
        <InvestModal isOpen={investModalOpen} onClose={() => setInvestModalOpen(false)} />
        <AllHoldingsModal isOpen={allHoldingsOpen} onClose={() => setAllHoldingsOpen(false)} />
        <NotificationsPanel isOpen={notificationsOpen} onClose={() => setNotificationsOpen(false)} />
        <MenuPanel isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      </div>
    </div>
  );
};

export default App;
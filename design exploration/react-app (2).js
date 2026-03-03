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

const TypewriterText = ({ text }) => {
  const [displayed, setDisplayed] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i <= text.length) {
        setDisplayed(text.slice(0, i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 50);
    return () => clearInterval(interval);
  }, [text]);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 750);
    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <span style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
      {displayed}
      <span style={{ borderRight: `2px solid #D4AF37`, opacity: showCursor ? 1 : 0, marginLeft: '1px' }}>&nbsp;</span>
    </span>
  );
};

const NavItem = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center gap-1 p-2 group"
    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
  >
    <div className="relative">
      <div style={{ color: active ? '#1C1915' : '#8C7B65', transition: 'color 0.2s' }}>
        {icon}
      </div>
      {active && (
        <span
          className="absolute left-1/2 rounded-full"
          style={{ bottom: '-8px', transform: 'translateX(-50%)', width: '4px', height: '4px', background: '#1C1915', display: 'block' }}
        />
      )}
    </div>
    <span
      className="font-bold tracking-widest uppercase"
      style={{ fontSize: '9px', color: active ? '#1C1915' : '#8C7B65', transition: 'color 0.2s' }}
    >
      {label}
    </span>
  </button>
);

const HoldingItem = ({ icon, name, category, timing, amount, change }) => (
  <div
    className="flex items-center p-3 rounded-xl cursor-pointer"
    style={{ transition: 'background 0.2s' }}
    onMouseEnter={e => e.currentTarget.style.background = '#ffffff'}
    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
  >
    <div className="shrink-0" style={{ width: '48px', height: '48px' }}>
      {icon}
    </div>
    <div className="ml-4 flex-1">
      <div className="flex justify-between items-center" style={{ marginBottom: '2px' }}>
        <h4 className="font-bold" style={{ color: '#1C1915' }}>{name}</h4>
        <span className="text-sm font-bold" style={{ color: '#1C1915' }}>{amount}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="font-medium tracking-wide" style={{ fontSize: '11px', color: '#8C7B65' }}>{category} • {timing}</span>
        <span className="font-bold rounded px-1" style={{ fontSize: '11px', color: '#16a34a', background: '#f0fdf4', paddingTop: '2px', paddingBottom: '2px' }}>{change}</span>
      </div>
    </div>
  </div>
);

const HomePage = () => {
  const [activeNav, setActiveNav] = useState('Home');
  const [inputValue, setInputValue] = useState('');
  const [selectedChip, setSelectedChip] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [investClicked, setInvestClicked] = useState(false);

  const navItems = [
    {
      label: 'Home',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
    },
    {
      label: 'Invest',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
    },
    {
      label: 'Activity',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      ),
    },
    {
      label: 'Private',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      ),
    },
  ];

  const chips = ['Weekend trip', 'International', 'No plans'];

  return (
    <div
      className="w-full h-full flex flex-col overflow-hidden relative"
      style={{ background: '#F9F7F2', fontFamily: "'Manrope', sans-serif", color: '#262118' }}
    >
      {/* Header */}
      <div
        className="text-white relative z-0"
        style={{
          background: '#1C1915',
          paddingTop: '48px',
          paddingBottom: '64px',
          paddingLeft: '24px',
          paddingRight: '24px',
          borderBottomLeftRadius: '40px',
          borderBottomRightRadius: '40px',
          ...customStyles.textureGrain,
        }}
      >
        <div
          className="absolute top-0 right-0 pointer-events-none"
          style={{
            width: '256px',
            height: '256px',
            background: '#D4AF37',
            opacity: 0.05,
            borderRadius: '50%',
            filter: 'blur(48px)',
            transform: 'translateY(-50%) translateX(50%)',
          }}
        />

        {/* Top Bar */}
        <div className="flex justify-between items-center relative" style={{ marginBottom: '32px', zIndex: 10 }}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center justify-center"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'transparent',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '24px', letterSpacing: '0.05em', fontWeight: 700, color: '#F9F7F2' }}>
            NEEV.
          </div>

          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="flex items-center justify-center relative"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: '#2C2824',
              border: '1px solid rgba(212,175,55,0.3)',
              cursor: 'pointer',
            }}
          >
            <span
              className="absolute rounded-full"
              style={{
                top: '8px',
                right: '10px',
                width: '6px',
                height: '6px',
                background: '#D4AF37',
                boxShadow: '0 0 8px #D4AF37',
              }}
            />
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F9F7F2" strokeWidth="1.5">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </button>
        </div>

        {/* Balance */}
        <div className="text-center relative" style={{ zIndex: 10 }}>
          <p className="font-semibold uppercase" style={{ fontSize: '10px', letterSpacing: '0.25em', color: '#8C7B65', marginBottom: '8px' }}>
            Total Liquidity
          </p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '60px', fontWeight: 400, letterSpacing: '-0.02em', ...customStyles.textGoldGradient }}>
            24.50L
          </h1>

          <div className="flex justify-center items-center gap-3" style={{ marginTop: '16px' }}>
            <div
              className="flex items-center gap-2 rounded-full"
              style={{ padding: '6px 12px', background: '#2C2824', border: '1px solid rgba(255,255,255,0.05)' }}
            >
              <div className="rounded-full" style={{ width: '6px', height: '6px', background: '#22c55e' }} />
              <span className="font-medium" style={{ fontSize: '12px', color: '#4ade80' }}>+8.4% YIELD</span>
            </div>
            <div
              className="flex items-center gap-2 rounded-full"
              style={{ padding: '6px 12px', background: '#2C2824', border: '1px solid rgba(255,255,255,0.05)' }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="3">
                <path d="M12 2v20M2 12h20" />
              </svg>
              <span className="font-medium" style={{ fontSize: '12px', color: '#D4AF37' }}>₹540 ACCRUAL</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div
        className="flex-1 relative overflow-y-auto"
        style={{
          marginTop: '-32px',
          zIndex: 10,
          paddingBottom: '112px',
          paddingLeft: '20px',
          paddingRight: '20px',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {/* Concierge Card */}
        <div
          className="bg-white rounded-2xl relative overflow-hidden"
          style={{
            padding: '20px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
            borderLeft: '4px solid #D4AF37',
            borderTop: '1px solid #E5E0D5',
            borderRight: '1px solid #E5E0D5',
            borderBottom: '1px solid #E5E0D5',
            marginBottom: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          {/* Concierge Header */}
          <div className="flex gap-3 items-center">
            <div
              className="shrink-0 rounded-full p-px"
              style={{
                width: '40px',
                height: '40px',
                background: 'linear-gradient(135deg, #D4AF37, #E5E0D5)',
              }}
            >
              <img
                src="https://ui-avatars.com/api/?name=Arjun&background=1C1915&color=D4AF37"
                alt="Concierge"
                className="w-full h-full rounded-full object-cover"
                style={{ border: '2px solid white' }}
              />
            </div>
            <div className="flex flex-col">
              <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: '16px', color: '#1C1915', lineHeight: 1 }}>
                Private Concierge
              </h4>
              <span className="font-semibold uppercase tracking-wider" style={{ fontSize: '9px', color: '#8C7B65' }}>Online</span>
            </div>
          </div>

          {/* Chat Bubble */}
          <div
            className="rounded-2xl p-4"
            style={{
              borderTopLeftRadius: '0',
              background: '#F9F7F2',
              border: '1px solid rgba(229,224,213,0.5)',
            }}
          >
            <p className="font-medium leading-relaxed" style={{ fontSize: '14px', color: '#1C1915' }}>
              <TypewriterText text="Planning any travel this month, Arjun?" />
            </p>
          </div>

          {/* Chips */}
          <div className="flex flex-wrap gap-2">
            {chips.map(chip => (
              <button
                key={chip}
                onClick={() => setSelectedChip(chip)}
                className="rounded-full font-semibold"
                style={{
                  padding: '6px 12px',
                  border: `1px solid ${selectedChip === chip ? '#D4AF37' : 'rgba(212,175,55,0.4)'}`,
                  fontSize: '11px',
                  color: selectedChip === chip ? '#1C1915' : '#5C554B',
                  background: selectedChip === chip ? 'rgba(212,175,55,0.08)' : 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="relative" style={{ marginTop: '4px' }}>
            <input
              type="text"
              placeholder="Type your response..."
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              className="w-full rounded-full"
              style={{
                background: 'rgba(240,237,230,0.5)',
                border: '1px solid #E5E0D5',
                padding: '10px 40px 10px 16px',
                fontSize: '12px',
                outline: 'none',
                transition: 'border-color 0.2s',
                fontFamily: "'Manrope', sans-serif",
              }}
              onFocus={e => (e.target.style.borderColor = '#D4AF37')}
              onBlur={e => (e.target.style.borderColor = '#E5E0D5')}
            />
            <button
              style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#D4AF37',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>

        {/* Opportunities */}
        <div style={{ marginBottom: '32px' }}>
          <div className="flex justify-between items-end px-1" style={{ marginBottom: '16px' }}>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '24px', color: '#1C1915' }}>Opportunities</h3>
            <div className="flex gap-2">
              <button
                className="flex items-center justify-center rounded-full"
                style={{
                  width: '32px',
                  height: '32px',
                  border: '1px solid #D4AF37',
                  background: 'transparent',
                  cursor: 'pointer',
                  opacity: 0.3,
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button
                className="flex items-center justify-center rounded-full"
                style={{
                  width: '32px',
                  height: '32px',
                  background: '#1C1915',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#D4AF37',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>
          </div>

          {/* Opportunity Card */}
          <div
            className="rounded-3xl overflow-hidden relative cursor-pointer"
            style={{
              background: '#F0EDE6',
              minHeight: '180px',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.02)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
          >
            {/* Pattern overlay */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: 'linear-gradient(45deg, transparent 25%, rgba(212,175,55,0.05) 25%, rgba(212,175,55,0.05) 50%, transparent 50%, transparent 75%, rgba(212,175,55,0.05) 75%, rgba(212,175,55,0.05) 100%)',
                backgroundSize: '20px 20px',
              }}
            />
            <div
              className="absolute rounded-full"
              style={{
                right: 0,
                bottom: 0,
                width: '128px',
                height: '128px',
                border: '20px solid rgba(212,175,55,0.1)',
                transform: 'translate(33%, 33%)',
              }}
            />
            <div
              className="absolute rounded-full"
              style={{
                right: 0,
                bottom: 0,
                width: '192px',
                height: '192px',
                border: '1px solid rgba(212,175,55,0.2)',
                transform: 'translate(33%, 33%)',
              }}
            />

            <div
              className="relative flex flex-col justify-between h-full"
              style={{ padding: '24px', zIndex: 10, minHeight: '180px' }}
            >
              <div>
                <span
                  className="inline-block rounded font-bold tracking-widest uppercase"
                  style={{ padding: '4px 8px', background: '#D4AF37', color: 'white', fontSize: '10px', marginBottom: '12px' }}
                >
                  Exclusive
                </span>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '30px', lineHeight: 1, color: '#1C1915', marginBottom: '4px' }}>
                  Private Reserve
                </h3>
                <p className="font-medium" style={{ color: '#5C554B', fontSize: '12px', maxWidth: '60%' }}>
                  Deploy excess capital into high-yield instruments.
                </p>
              </div>

              <div className="flex items-center gap-3" style={{ marginTop: '24px' }}>
                <button
                  onClick={() => setInvestClicked(!investClicked)}
                  className="rounded-full font-bold tracking-widest uppercase"
                  style={{
                    background: investClicked ? '#D4AF37' : '#1C1915',
                    color: '#F9F7F2',
                    padding: '12px 24px',
                    fontSize: '12px',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.2)',
                    transition: 'background 0.2s',
                  }}
                >
                  {investClicked ? 'Invested!' : 'Invest Now'}
                </button>
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', color: '#8C7B65', fontSize: '12px' }}>
                  7.2% APY
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Holdings */}
        <div>
          <div
            className="flex justify-between items-baseline px-1"
            style={{ marginBottom: '16px', borderBottom: '1px solid #E5E0D5', paddingBottom: '8px' }}
          >
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '24px', color: '#1C1915' }}>Holdings</h3>
            <a
              href="#"
              className="font-bold tracking-widest"
              style={{ fontSize: '10px', color: '#B8860B', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.target.style.color = '#1C1915')}
              onMouseLeave={e => (e.target.style.color = '#B8860B')}
            >
              VIEW ALL
            </a>
          </div>

          <div className="space-y-3">
            <HoldingItem
              icon={
                <div
                  className="flex items-center justify-center rounded-xl"
                  style={{ width: '48px', height: '48px', background: '#2C2824', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
                >
                  <span style={{ fontFamily: "'Cormorant Garamond', serif", color: '#D4AF37', fontSize: '18px', fontStyle: 'italic' }}>Nr</span>
                </div>
              }
              name="Neev Reserve"
              category="INSTITUTIONAL"
              timing="INSTANT"
              amount="₹12.4L"
              change="+7.2%"
            />
            <HoldingItem
              icon={
                <div
                  className="flex items-center justify-center rounded-xl"
                  style={{ width: '48px', height: '48px', background: '#F0EDE6', border: '1px solid #E5E0D5' }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5C554B" strokeWidth="1.5">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
              }
              name="Neev Protect"
              category="WEALTH"
              timing="T+1"
              amount="₹8.2L"
              change="+8.5%"
            />
          </div>
        </div>

        <div style={{ height: '32px' }} />
      </div>

      {/* Bottom Nav */}
      <nav
        className="absolute flex justify-between items-center"
        style={{
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '90%',
          ...customStyles.glassPanel,
          borderRadius: '9999px',
          padding: '8px 24px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          zIndex: 50,
        }}
      >
        {navItems.map(item => (
          <NavItem
            key={item.label}
            icon={item.icon}
            label={item.label}
            active={activeNav === item.label}
            onClick={() => setActiveNav(item.label)}
          />
        ))}
      </nav>

      {/* Menu Modal */}
      {menuOpen && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.5)', zIndex: 100 }}
          onClick={() => setMenuOpen(false)}
        >
          <div
            className="rounded-2xl p-6"
            style={{ background: '#1C1915', width: '80%', maxWidth: '300px' }}
            onClick={e => e.stopPropagation()}
          >
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", color: '#D4AF37', fontSize: '24px', marginBottom: '16px' }}>Menu</h2>
            {['Dashboard', 'Portfolio', 'Transactions', 'Settings', 'Help'].map(item => (
              <button
                key={item}
                onClick={() => setMenuOpen(false)}
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  padding: '12px 0',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                  background: 'none',
                  border: 'none',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                  color: '#F9F7F2',
                  fontSize: '14px',
                  fontFamily: "'Manrope', sans-serif",
                  cursor: 'pointer',
                }}
              >
                {item}
              </button>
            ))}
            <button
              onClick={() => setMenuOpen(false)}
              style={{
                marginTop: '16px',
                background: '#D4AF37',
                color: '#1C1915',
                border: 'none',
                borderRadius: '9999px',
                padding: '10px 24px',
                fontFamily: "'Manrope', sans-serif",
                fontWeight: 700,
                cursor: 'pointer',
                fontSize: '12px',
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Notification Modal */}
      {notifOpen && (
        <div
          className="absolute inset-0 flex items-start justify-center"
          style={{ background: 'rgba(0,0,0,0.4)', zIndex: 100, paddingTop: '80px' }}
          onClick={() => setNotifOpen(false)}
        >
          <div
            className="rounded-2xl p-5"
            style={{ background: '#F9F7F2', width: '85%', maxWidth: '320px' }}
            onClick={e => e.stopPropagation()}
          >
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", color: '#1C1915', fontSize: '20px', marginBottom: '12px' }}>Notifications</h2>
            {[
              { title: 'Yield Credited', desc: '₹540 accrual added to Neev Reserve', time: '2m ago' },
              { title: 'Market Update', desc: 'Portfolio up +8.4% this week', time: '1h ago' },
              { title: 'New Opportunity', desc: 'Private Reserve now accepting deposits', time: '3h ago' },
            ].map((n, i) => (
              <div key={i} style={{ borderBottom: i < 2 ? '1px solid #E5E0D5' : 'none', paddingBottom: '12px', marginBottom: '12px' }}>
                <div className="flex justify-between">
                  <span style={{ fontWeight: 700, fontSize: '13px', color: '#1C1915' }}>{n.title}</span>
                  <span style={{ fontSize: '10px', color: '#8C7B65' }}>{n.time}</span>
                </div>
                <p style={{ fontSize: '12px', color: '#5C554B', marginTop: '2px' }}>{n.desc}</p>
              </div>
            ))}
            <button
              onClick={() => setNotifOpen(false)}
              style={{
                background: '#1C1915',
                color: '#F9F7F2',
                border: 'none',
                borderRadius: '9999px',
                padding: '8px 20px',
                fontFamily: "'Manrope', sans-serif",
                fontWeight: 700,
                cursor: 'pointer',
                fontSize: '11px',
              }}
            >
              Dismiss All
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const App = () => {
  useEffect(() => {
    const link = document.createElement('link');
    link.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,400&family=Manrope:wght@200;300;400;500;600;700&display=swap";
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    const style = document.createElement('style');
    style.textContent = `
      * { box-sizing: border-box; }
      body { margin: 0; padding: 0; }
      ::-webkit-scrollbar { display: none; }
      * { -ms-overflow-style: none; scrollbar-width: none; }
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
        className="min-h-screen flex justify-center items-center p-4"
        style={{ background: '#E5E0D5', fontFamily: "'Manrope', sans-serif" }}
      >
        <div
          style={{
            width: '400px',
            height: '867px',
            borderRadius: '20px',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
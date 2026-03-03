import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const customStyles = {
  fontSerifDisplay: {
    fontFamily: "'Cormorant Garamond', serif",
  },
  fontSansBody: {
    fontFamily: "'Manrope', sans-serif",
  },
  textureGrain: {
    backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E\")",
  },
  glassPanel: {
    background: 'rgba(255, 253, 248, 0.85)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    borderTop: '1px solid rgba(212, 175, 55, 0.2)',
  },
};

const InstrumentRow = ({ color, label, percentage }) => (
  <div className="flex justify-between items-center p-4 rounded-xl bg-[#F0EDE6]">
    <div className="flex items-center gap-3">
      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }}></div>
      <span className="text-sm font-medium">{label}</span>
    </div>
    <span className="text-sm font-bold">{percentage}</span>
  </div>
);

const PrivateReservePage = () => {
  const [investmentValue, setInvestmentValue] = useState(50);
  const [activeTab, setActiveTab] = useState('1Y');
  const [confirmPressed, setConfirmPressed] = useState(false);

  const minInvestment = 100000;
  const maxInvestment = 2000000;
  const investmentAmount = minInvestment + ((maxInvestment - minInvestment) * investmentValue) / 100;
  const estimatedReturn = Math.round(investmentAmount * 0.072);
  const totalValue = investmentAmount + estimatedReturn;

  const formatINR = (amount) => {
    return '₹' + amount.toLocaleString('en-IN');
  };

  const handleConfirm = () => {
    setConfirmPressed(true);
    setTimeout(() => setConfirmPressed(false), 200);
  };

  return (
    <div
      className="w-full h-full max-w-[400px] max-h-[867px] bg-[#F9F7F2] rounded-[20px] shadow-2xl overflow-hidden relative flex flex-col"
      style={customStyles.fontSansBody}
    >
      {/* Header */}
      <div
        className="bg-[#1C1915] text-[#F9F7F2] pt-12 pb-8 px-6 relative"
        style={customStyles.textureGrain}
      >
        <div className="flex justify-between items-center relative z-10">
          <button className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"></path>
            </svg>
          </button>
          <div className="text-xl tracking-wide" style={customStyles.fontSerifDisplay}>PRIVATE RESERVE</div>
          <button className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13"></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-32" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
        {/* Stats Section */}
        <div
          className="p-6 bg-[#1C1915] text-white rounded-b-[40px]"
          style={customStyles.textureGrain}
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#8C7B65] font-bold">Projected Yield</span>
              <div className="text-4xl text-[#D4AF37]" style={customStyles.fontSerifDisplay}>
                7.20% <span className="text-lg text-[#8C7B65]">p.a.</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase tracking-widest text-[#8C7B65] font-bold">Risk Rating</span>
              <div className="flex items-center gap-1 mt-1 justify-end">
                <div className="w-3 h-1 bg-[#D4AF37] rounded-full"></div>
                <div className="w-3 h-1 bg-[#D4AF37] rounded-full"></div>
                <div className="w-3 h-1 bg-[#2C2824] rounded-full border border-white/10"></div>
                <span className="text-[11px] font-bold ml-1">MODERATE</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#2C2824] p-4 rounded-2xl border border-white/5">
              <p className="text-[10px] text-[#8C7B65] font-bold uppercase tracking-widest mb-1">Lock-in</p>
              <p className="text-sm font-semibold">90 Days</p>
            </div>
            <div className="bg-[#2C2824] p-4 rounded-2xl border border-white/5">
              <p className="text-[10px] text-[#8C7B65] font-bold uppercase tracking-widest mb-1">Liquidity</p>
              <p className="text-sm font-semibold">Monthly Window</p>
            </div>
          </div>
        </div>

        {/* Historical Performance */}
        <div className="px-6 py-8">
          <div className="flex justify-between items-end mb-6">
            <h3 className="text-2xl" style={customStyles.fontSerifDisplay}>Historical Performance</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('1Y')}
                className={`text-[10px] font-bold px-2 py-1 rounded transition-colors ${activeTab === '1Y' ? 'bg-[#1C1915] text-[#D4AF37]' : 'text-[#8C7B65]'}`}
              >
                1Y
              </button>
              <button
                onClick={() => setActiveTab('ALL')}
                className={`text-[10px] font-bold px-2 py-1 rounded transition-colors ${activeTab === 'ALL' ? 'bg-[#1C1915] text-[#D4AF37]' : 'text-[#8C7B65]'}`}
              >
                ALL
              </button>
            </div>
          </div>

          <div className="h-32 w-full relative">
            <svg viewBox="0 0 400 100" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#D4AF37', stopOpacity: 1 }}></stop>
                  <stop offset="100%" style={{ stopColor: '#D4AF37', stopOpacity: 0 }}></stop>
                </linearGradient>
              </defs>
              <path
                d="M0 80 Q 50 75, 100 60 T 200 40 T 300 25 T 400 10"
                fill="none"
                stroke="#D4AF37"
                strokeWidth="3"
              ></path>
              <path
                d="M0 80 Q 50 75, 100 60 T 200 40 T 300 25 T 400 10 V 100 H 0 Z"
                fill="url(#grad)"
                opacity="0.2"
              ></path>
              <circle cx="400" cy="10" r="4" fill="#D4AF37"></circle>
            </svg>
            <div className="flex justify-between mt-4 text-[10px] font-bold text-[#8C7B65] uppercase tracking-widest">
              <span>JAN 23</span>
              <span>JUL 23</span>
              <span>JAN 24</span>
            </div>
          </div>
        </div>

        {/* Earnings Projector */}
        <div className="mx-6 p-6 bg-white rounded-[24px] border border-[#E5E0D5] shadow-sm">
          <h3 className="text-xl mb-4" style={customStyles.fontSerifDisplay}>Project Your Earnings</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-[10px] font-bold text-[#8C7B65] uppercase tracking-widest">Investment Amount</label>
                <span className="text-sm font-bold">{formatINR(Math.round(investmentAmount))}</span>
              </div>
              <input
                type="range"
                className="w-full h-1.5 bg-[#E5E0D5] rounded-lg appearance-none cursor-pointer"
                style={{ accentColor: '#1C1915' }}
                min="0"
                max="100"
                value={investmentValue}
                onChange={(e) => setInvestmentValue(Number(e.target.value))}
              />
            </div>

            <div className="pt-4 border-t border-[#F0EDE6] flex justify-between items-center">
              <div>
                <p className="text-[10px] text-[#8C7B65] font-bold uppercase tracking-widest">Est. Return (1Y)</p>
                <p className="text-lg font-bold text-[#1C1915]">{formatINR(estimatedReturn)}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-[#8C7B65] font-bold uppercase tracking-widest">Total Value</p>
                <p className="text-lg font-bold text-[#B8860B]">{formatINR(totalValue)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Instrument Breakdown */}
        <div className="px-6 py-8">
          <h3 className="text-2xl mb-4" style={customStyles.fontSerifDisplay}>Instrument Breakdown</h3>
          <div className="space-y-4">
            <InstrumentRow color="#D4AF37" label="Corporate Debt" percentage="65%" />
            <InstrumentRow color="#1C1915" label="Market Linked Debentures" percentage="25%" />
            <InstrumentRow color="#8C7B65" label="Cash Reserve" percentage="10%" />
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div
        className="absolute bottom-0 left-0 right-0 p-6 pb-10 z-50"
        style={customStyles.glassPanel}
      >
        <div className="flex gap-4 items-center">
          <div className="flex-1">
            <p className="text-[10px] text-[#8C7B65] font-bold uppercase tracking-widest">Min. Investment</p>
            <p className="text-lg font-bold text-[#1C1915]">₹1,00,000</p>
          </div>
          <button
            onClick={handleConfirm}
            className="bg-[#1C1915] text-[#F9F7F2] px-8 py-4 rounded-full text-xs font-bold tracking-[0.2em] uppercase shadow-2xl transition-all"
            style={{ transform: confirmPressed ? 'scale(0.95)' : 'scale(1)' }}
          >
            CONFIRM INVESTMENT
          </button>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,400&family=Manrope:wght@200;300;400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    const style = document.createElement('style');
    style.textContent = `
      .hide-scroll::-webkit-scrollbar { display: none; }
      .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 18px; height: 18px; border-radius: 50%; background: #1C1915; cursor: pointer; }
      input[type=range]::-moz-range-thumb { width: 18px; height: 18px; border-radius: 50%; background: #1C1915; cursor: pointer; border: none; }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(link);
      document.head.removeChild(style);
    };
  }, []);

  return (
    <Router basename="/">
      <div className="bg-[#E5E0D5] flex justify-center items-center min-h-screen p-4" style={customStyles.fontSansBody}>
        <Routes>
          <Route path="/" element={<PrivateReservePage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
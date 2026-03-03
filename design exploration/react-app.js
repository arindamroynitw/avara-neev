import React, { useState, useEffect, useRef } from 'react';

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
  chatBubbleAI: {
    background: '#FFFFFF',
    border: '1px solid #E5E0D5',
    borderBottomLeftRadius: '4px',
  },
  chatBubbleUser: {
    background: '#1C1915',
    color: '#F9F7F2',
    borderBottomRightRadius: '4px',
  },
  textureGrain: {
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")`,
  },
  goldGlow: {
    boxShadow: '0 0 8px #D4AF37',
  },
};

const TypingIndicator = () => (
  <div className="flex gap-2 items-center" style={{ color: '#8C7B65' }}>
    <div className="flex gap-1">
      <div
        className="w-1 h-1 rounded-full animate-bounce"
        style={{ backgroundColor: '#8C7B65', animationDelay: '0s' }}
      ></div>
      <div
        className="w-1 h-1 rounded-full animate-bounce"
        style={{ backgroundColor: '#8C7B65', animationDelay: '0.2s' }}
      ></div>
      <div
        className="w-1 h-1 rounded-full animate-bounce"
        style={{ backgroundColor: '#8C7B65', animationDelay: '0.4s' }}
      ></div>
    </div>
    <span className="text-[10px] italic">Concierge is checking flight insurance options...</span>
  </div>
);

const AIAvatar = () => (
  <div
    className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center"
    style={{
      backgroundColor: '#1C1915',
      border: '1px solid rgba(212,175,55,0.3)',
    }}
  >
    <span style={{ ...customStyles.fontSerifDisplay, color: '#D4AF37', fontSize: '12px' }}>N</span>
  </div>
);

const AIMessage = ({ children }) => (
  <div className="flex gap-3 max-w-[85%]">
    <AIAvatar />
    <div
      className="p-4 rounded-2xl text-sm leading-relaxed"
      style={{ ...customStyles.chatBubbleAI, color: '#5C554B' }}
    >
      {children}
    </div>
  </div>
);

const UserMessage = ({ text, time }) => (
  <div className="flex flex-col items-end gap-1 self-end max-w-[85%]">
    <div className="p-4 rounded-2xl text-sm leading-relaxed" style={customStyles.chatBubbleUser}>
      {text}
    </div>
    {time && (
      <span className="text-[9px] mr-1" style={{ color: '#8C7B65' }}>
        {time}
      </span>
    )}
  </div>
);

const ActionButton = ({ children, onClick }) => (
  <button
    onClick={onClick}
    className="px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white"
    style={{ border: '1px solid #D4AF37', color: '#B8860B' }}
  >
    {children}
  </button>
);

const NavButton = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className="text-[10px] font-bold uppercase tracking-widest"
    style={
      active
        ? {
            color: '#1C1915',
            borderBottom: '2px solid #D4AF37',
            paddingBottom: '4px',
          }
        : {
            color: '#8C7B65',
            opacity: 0.5,
          }
    }
  >
    {label}
  </button>
);

const App = () => {
  const [inputValue, setInputValue] = useState('');
  const [activeTab, setActiveTab] = useState('Concierge');
  const [messages, setMessages] = useState([
    { id: 1, type: 'ai', text: 'Good morning, Arjun. Your portfolio is currently optimized for liquidity.' },
    {
      id: 2,
      type: 'user',
      text: "I'm planning a trip to Japan next month. How should I adjust my cash reserves?",
      time: '10:12 AM',
    },
    {
      id: 3,
      type: 'ai',
      hasActions: true,
      text: null,
    },
    { id: 4, type: 'typing' },
  ]);
  const [showProjections, setShowProjections] = useState(false);
  const [showFX, setShowFX] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const link = document.createElement('link');
    link.href =
      'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,400&family=Manrope:wght@200;300;400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, showProjections, showFX]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    const newMessage = {
      id: Date.now(),
      type: 'user',
      text: inputValue,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev.filter((m) => m.type !== 'typing'), newMessage, { id: Date.now() + 1, type: 'typing' }]);
    setInputValue('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen p-4"
      style={{ ...customStyles.fontSansBody, backgroundColor: '#E5E0D5', color: '#262118' }}
    >
      <div
        className="w-full h-full rounded-[20px] shadow-2xl overflow-hidden relative flex flex-col"
        style={{
          maxWidth: '400px',
          maxHeight: '867px',
          height: '867px',
          backgroundColor: '#F9F7F2',
        }}
      >
        {/* Header */}
        <div
          className="text-[#F9F7F2] pt-10 pb-10 px-6 relative rounded-b-[32px] z-20 shadow-lg"
          style={{ backgroundColor: '#1C1915', ...customStyles.textureGrain }}
        >
          <div className="flex justify-between items-center mb-6 relative z-10">
            <button
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#D4AF37"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
            <div
              className="text-xl tracking-wide font-bold"
              style={customStyles.fontSerifDisplay}
            >
              NEEV.
            </div>
            <button
              className="w-8 h-8 rounded-full flex items-center justify-center relative"
              style={{
                backgroundColor: '#2C2824',
                border: '1px solid rgba(212,175,55,0.3)',
              }}
            >
              <span
                className="absolute top-1.5 right-1.5 w-1 h-1 rounded-full"
                style={{ backgroundColor: '#D4AF37', ...customStyles.goldGlow }}
              ></span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#F9F7F2"
                strokeWidth="1.5"
              >
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              </svg>
            </button>
          </div>

          <div className="flex items-center justify-between relative z-10">
            <div>
              <p
                className="text-[9px] uppercase mb-0.5 font-semibold"
                style={{ letterSpacing: '0.2em', color: '#8C7B65' }}
              >
                Total Liquidity
              </p>
              <h1
                className="text-4xl font-normal tracking-tight"
                style={{ ...customStyles.fontSerifDisplay, ...customStyles.textGoldGradient }}
              >
                24.50L
              </h1>
            </div>
            <div className="flex flex-col items-end gap-1">
              <div
                className="px-2 py-1 rounded-full flex items-center gap-1.5"
                style={{
                  backgroundColor: '#2C2824',
                  border: '1px solid rgba(255,255,255,0.05)',
                }}
              >
                <div className="w-1 h-1 rounded-full bg-green-500"></div>
                <span className="text-[9px] font-bold text-green-400">+8.4% YIELD</span>
              </div>
              <span
                className="text-[9px] font-medium tracking-wider"
                style={{ color: '#D4AF37' }}
              >
                ₹540 ACCRUAL TODAY
              </span>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          <div
            className="flex-1 overflow-y-auto p-6 flex flex-col gap-6"
            style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
          >
            {/* AI Welcome Message */}
            <AIMessage>
              Good morning, Arjun. Your portfolio is currently optimized for liquidity.
            </AIMessage>

            {/* User Message */}
            <UserMessage
              text="I'm planning a trip to Japan next month. How should I adjust my cash reserves?"
              time="10:12 AM"
            />

            {/* AI Response with Actions */}
            <div className="flex gap-3 max-w-[85%]">
              <AIAvatar />
              <div
                className="p-4 rounded-2xl text-sm leading-relaxed space-y-3"
                style={{ ...customStyles.chatBubbleAI, color: '#5C554B' }}
              >
                <p>
                  Exciting! Based on your typical luxury travel spend, I recommend setting aside{' '}
                  <span className="font-bold" style={{ color: '#1C1915' }}>
                    ₹4.5L
                  </span>{' '}
                  in your Neev Reserve for instant access.
                </p>
                <p>
                  Shall I trigger a partial redemption from the Growth Fund now to ensure the cash
                  is settled before your departure?
                </p>

                {showProjections && (
                  <div
                    className="mt-2 p-3 rounded-xl text-xs space-y-1"
                    style={{ backgroundColor: '#F9F7F2', border: '1px solid #E5E0D5' }}
                  >
                    <p className="font-bold" style={{ color: '#1C1915' }}>
                      Projection Summary
                    </p>
                    <p>Estimated spend: ₹3.8L – ₹4.5L</p>
                    <p>Post-trip reserve: ₹19.5L – ₹20.2L</p>
                    <p style={{ color: '#D4AF37' }}>Yield impact: Minimal (&lt;0.1%)</p>
                  </div>
                )}

                {showFX && (
                  <div
                    className="mt-2 p-3 rounded-xl text-xs space-y-1"
                    style={{ backgroundColor: '#F9F7F2', border: '1px solid #E5E0D5' }}
                  >
                    <p className="font-bold" style={{ color: '#1C1915' }}>
                      FX Impact Analysis
                    </p>
                    <p>JPY/INR: 0.56 (current)</p>
                    <p>Estimated forex cost: ₹12,500</p>
                    <p style={{ color: '#D4AF37' }}>Tip: Load Forex card 2 weeks early for better rates</p>
                  </div>
                )}

                <div className="flex flex-wrap gap-2 pt-2">
                  <ActionButton onClick={() => setShowProjections((p) => !p)}>
                    {showProjections ? 'Hide Projections' : 'Show Projections'}
                  </ActionButton>
                  <ActionButton onClick={() => setShowFX((p) => !p)}>
                    {showFX ? 'Hide FX Impact' : 'Calculate FX Impact'}
                  </ActionButton>
                </div>
              </div>
            </div>

            {/* Additional messages */}
            {messages
              .filter((m) => m.id > 4)
              .map((msg) =>
                msg.type === 'user' ? (
                  <UserMessage key={msg.id} text={msg.text} time={msg.time} />
                ) : msg.type === 'typing' ? (
                  <TypingIndicator key={msg.id} />
                ) : (
                  <AIMessage key={msg.id}>{msg.text}</AIMessage>
                )
              )}

            {/* Typing Indicator */}
            {messages.some((m) => m.type === 'typing') && messages[messages.length - 1].id <= 4 && (
              <TypingIndicator />
            )}

            <div ref={messagesEndRef}></div>
          </div>

          {/* Input Area */}
          <div
            className="p-4 pt-10"
            style={{
              background: 'linear-gradient(to top, #F9F7F2 0%, #F9F7F2 70%, transparent 100%)',
            }}
          >
            <div className="relative flex items-center">
              <div
                className="w-full rounded-full flex items-center p-1.5 pr-2 pl-4 shadow-sm"
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5E0D5',
                }}
              >
                <input
                  type="text"
                  placeholder="Message your concierge..."
                  className="bg-transparent flex-1 text-sm outline-none"
                  style={{ color: '#1C1915' }}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <div className="flex gap-2">
                  <button
                    className="w-9 h-9 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: '#F9F7F2', color: '#5C554B' }}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                      <line x1="12" y1="19" x2="12" y2="23"></line>
                      <line x1="8" y1="23" x2="16" y2="23"></line>
                    </svg>
                  </button>
                  <button
                    className="w-9 h-9 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: '#1C1915', color: '#D4AF37' }}
                    onClick={handleSend}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Nav */}
            <div className="flex justify-between px-8 pt-4 pb-2">
              {['Holdings', 'Concierge', 'Private'].map((tab) => (
                <NavButton
                  key={tab}
                  label={tab}
                  active={activeTab === tab}
                  onClick={() => setActiveTab(tab)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
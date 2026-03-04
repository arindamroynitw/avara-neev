import React from 'react';
import { colors, fonts, glass, easing } from '../../styles/tokens';
import { useApp } from '../../context/AppContext';
import ModeIndicator from './ModeIndicator';

const tabs = [
  {
    id: 'home',
    label: 'Home',
    icon: (active) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? colors.dark : colors.muted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    id: 'invest',
    label: 'Invest',
    icon: (active) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? colors.dark : colors.muted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    id: 'activity',
    label: 'Activity',
    icon: (active) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? colors.dark : colors.muted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    id: 'you',
    label: 'You',
    icon: (active) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? colors.dark : colors.muted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
];

export default function TabBar() {
  const { state, dispatch } = useApp();
  const { activeTab } = state;
  const inChatMode = state.surfaceResponse.active || state.rmChat?.open;

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 40px)',
        maxWidth: '350px',
        ...glass,
        borderRadius: '28px',
        padding: '8px 16px',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        zIndex: 100,
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        transition: `all 300ms ${easing.spring}`,
      }}
    >
      {inChatMode && <ModeIndicator />}
      {tabs.map(tab => {
        const isActive = !inChatMode && activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => dispatch({ type: 'SET_TAB', payload: tab.id })}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '3px',
              padding: '6px 8px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              position: 'relative',
              transition: `all 300ms ${easing.spring}`,
            }}
          >
            {tab.icon(isActive)}
            <span
              style={{
                fontFamily: fonts.sans,
                fontSize: '0.5625rem',
                fontWeight: 700,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: isActive ? colors.dark : colors.muted,
              }}
            >
              {tab.label}
            </span>
            {isActive && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '0',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '4px',
                  height: '4px',
                  borderRadius: '50%',
                  background: colors.gold,
                }}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}

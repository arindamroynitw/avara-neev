import React from 'react';
import { colors, fonts, easing } from '../../styles/tokens';
import { useApp } from '../../context/AppContext';
import { snapshots } from '../../context/snapshots';

const stages = [
  { key: 'fresh', label: 'Fresh (Zero State)' },
  { key: 'month1', label: 'Month 1' },
  { key: 'month3', label: 'Month 3' },
  { key: 'month6', label: 'Month 6' },
  { key: 'month9', label: 'Month 9+' },
];

export default function DemoControls() {
  const { state, dispatch, showToast } = useApp();
  const { demo } = state;

  if (!demo.panelOpen) return null;

  const handleStageSelect = (stage) => {
    const snapshot = snapshots[stage];
    if (snapshot) {
      dispatch({ type: 'LOAD_SNAPSHOT', payload: snapshot });
      dispatch({ type: 'SET_DEMO_STAGE', payload: stage });
      showToast(`Loaded: ${stages.find(s => s.key === stage)?.label}`);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(28, 25, 21, 0.85)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        animation: `fadeIn 200ms ${easing.standard} both`,
      }}
      onClick={() => dispatch({ type: 'TOGGLE_DEMO_PANEL' })}
    >
      <div
        style={{
          background: colors.dark,
          borderRadius: '24px 24px 0 0',
          padding: '24px',
          width: '100%',
          maxWidth: '390px',
          animation: `slideUp 300ms ${easing.spring} both`,
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ fontFamily: fonts.sans, fontSize: '0.875rem', fontWeight: 600, color: colors.light }}>
            Demo Controls
          </div>
          <button
            onClick={() => dispatch({ type: 'TOGGLE_DEMO_PANEL' })}
            style={{
              minWidth: '44px', minHeight: '44px', borderRadius: '50%',
              background: colors.darkMid, border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={colors.light} strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div style={{ fontFamily: fonts.sans, fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: colors.muted, marginBottom: '12px' }}>
          LIFECYCLE STAGE
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {stages.map(stage => (
            <button
              key={stage.key}
              onClick={() => handleStageSelect(stage.key)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 16px', borderRadius: '12px',
                background: demo.currentStage === stage.key ? colors.darkMid : 'transparent',
                border: demo.currentStage === stage.key ? `1px solid ${colors.gold}` : `1px solid rgba(255,255,255,0.1)`,
                cursor: 'pointer',
                transition: `all 200ms ${easing.standard}`,
              }}
            >
              <span style={{ fontFamily: fonts.sans, fontSize: '0.8125rem', fontWeight: 500, color: demo.currentStage === stage.key ? colors.gold : colors.light }}>
                {stage.label}
              </span>
              {demo.currentStage === stage.key && (
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: colors.gold }} />
              )}
            </button>
          ))}
        </div>

        <button
          onClick={() => {
            dispatch({ type: 'RESET_ALL' });
            dispatch({ type: 'TOGGLE_DEMO_PANEL' });
            showToast('Reset to onboarding');
          }}
          style={{
            width: '100%', marginTop: '16px', padding: '12px', borderRadius: '12px',
            background: 'transparent', border: `1px solid ${colors.error}`,
            fontFamily: fonts.sans, fontSize: '0.625rem', fontWeight: 700,
            letterSpacing: '0.15em', textTransform: 'uppercase', color: colors.error,
            cursor: 'pointer',
          }}
        >
          Reset to Onboarding
        </button>
      </div>
    </div>
  );
}

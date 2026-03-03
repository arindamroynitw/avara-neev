import React from 'react';
import { colors, fonts, typography } from '../../styles/tokens';
import { useApp } from '../../context/AppContext';
import ProfileSection from './ProfileSection';
import ConnectedAccounts from './ConnectedAccounts';
import AboutMe from './AboutMe';
import Preferences from './Preferences';
import VaultSection from './VaultSection';

export default function YouSurface() {
  const { state, dispatch } = useApp();
  const { user, accounts } = state;

  return (
    <div style={{ paddingTop: '8px', paddingBottom: '20px' }}>
      <ProfileSection user={user} />

      <ConnectedAccounts accounts={accounts} />

      <AboutMe user={user} />

      <Preferences user={user} />

      <VaultSection />

      {/* Simulate time advance */}
      {state.lifecycle === 'active' && state.metrics.monthsActive === 0 && (
        <div style={{ padding: '0 20px', marginBottom: '8px' }}>
          <button
            onClick={() => dispatch({ type: 'SIMULATE_TIME_ADVANCE' })}
            style={{
              width: '100%', padding: '12px', borderRadius: '10px',
              background: 'transparent',
              border: `2px dashed ${colors.bone}`,
              fontFamily: fonts.sans, fontSize: '0.75rem', fontWeight: 600,
              color: colors.muted, cursor: 'pointer',
              letterSpacing: '0.05em',
            }}
          >
            Simulate to Month 2
          </button>
        </div>
      )}

      {/* App info footer */}
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ fontFamily: fonts.serif, fontSize: '1rem', fontWeight: 700, letterSpacing: '0.05em', color: colors.dark, marginBottom: '4px' }}>
          neev
        </div>
        <div style={{ fontFamily: fonts.sans, fontSize: '0.6875rem', color: colors.muted, marginBottom: '12px' }}>
          by Avara · v0.1 Demo
        </div>
        <button
          onClick={() => {
            dispatch({ type: 'RESET_ALL' });
            window.localStorage.removeItem('neev-app-state');
          }}
          style={{
            fontFamily: fonts.sans, fontSize: '0.6875rem', color: colors.error,
            background: 'none', border: `1px solid ${colors.error}20`,
            padding: '8px 20px', borderRadius: '8px', cursor: 'pointer',
          }}
        >
          Reset All Data
        </button>
      </div>
    </div>
  );
}

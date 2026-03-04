import React from 'react';
import Card from '../components/shared/Card';
import { colors, fonts, easing } from '../styles/tokens';

export default function ConfirmationCard({
  title, items = [], confirmText = 'Confirm', cancelText = 'Not now',
  action, onConfirm, onCancel, dispatch,
}) {
  const handleConfirm = () => {
    // Dispatch whitelisted action if provided
    if (action && dispatch) {
      const WHITELISTED = ['ACTIVATE_PRODUCT', 'UPDATE_PRODUCT', 'UPDATE_METRICS', 'SET_TAB'];
      if (WHITELISTED.includes(action.type)) {
        dispatch(action);
      }
    }
    if (onConfirm) onConfirm('Confirmed');
  };

  const handleCancel = () => {
    if (onCancel) onCancel('Not now');
  };

  return (
    <Card style={{ borderLeft: `3px solid ${colors.gold}` }}>
      {title && (
        <div style={{ fontFamily: fonts.sans, fontSize: '0.875rem', fontWeight: 600, color: colors.dark, marginBottom: '12px' }}>
          {title}
        </div>
      )}

      {/* Info list */}
      {items.map((item, i) => (
        <div key={i} style={{
          display: 'flex', justifyContent: 'space-between', padding: '8px 0',
          borderTop: i > 0 ? `1px solid ${colors.boneLight}` : 'none',
        }}>
          <span style={{ fontFamily: fonts.sans, fontSize: '0.8125rem', color: colors.muted }}>{item.label}</span>
          <span style={{ fontFamily: fonts.sans, fontSize: '0.8125rem', fontWeight: 600, color: colors.dark }}>{item.value}</span>
        </div>
      ))}

      {/* Buttons */}
      <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
        <button
          onClick={handleCancel}
          style={{
            flex: 1, padding: '10px', borderRadius: '10px',
            border: `1px solid ${colors.bone}`, background: colors.white,
            fontFamily: fonts.sans, fontSize: '0.8125rem', fontWeight: 500,
            color: colors.muted, cursor: 'pointer', transition: `all 200ms ${easing.standard}`,
          }}
        >
          {cancelText}
        </button>
        <button
          onClick={handleConfirm}
          style={{
            flex: 1, padding: '10px', borderRadius: '10px',
            border: `1px solid rgba(212,175,55,0.2)`, background: colors.dark,
            fontFamily: fonts.sans, fontSize: '0.8125rem', fontWeight: 600,
            color: colors.gold, cursor: 'pointer', transition: `all 200ms ${easing.standard}`,
          }}
        >
          {confirmText}
        </button>
      </div>
    </Card>
  );
}

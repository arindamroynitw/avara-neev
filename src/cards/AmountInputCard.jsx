import React, { useState } from 'react';
import Card from '../components/shared/Card';
import { colors, fonts, easing } from '../styles/tokens';
import { formatINR } from '../utils/format';

export default function AmountInputCard({
  title, presets = [50000, 100000, 200000, 500000], min = 10000, max = 2000000,
  default: defaultVal = 100000, currency = '₹', context, onSubmit,
}) {
  const [amount, setAmount] = useState(defaultVal);
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState('');

  const handlePreset = (val) => setAmount(val);

  const handleSlider = (e) => setAmount(parseInt(e.target.value));

  const handleTapAmount = () => {
    setEditing(true);
    setEditText(String(amount));
  };

  const handleEditSubmit = () => {
    const parsed = parseInt(editText.replace(/[^0-9]/g, ''));
    if (!isNaN(parsed) && parsed >= min && parsed <= max) {
      setAmount(parsed);
    }
    setEditing(false);
  };

  const handleConfirm = () => {
    if (onSubmit) {
      onSubmit(`I'd like to invest ${currency}${amount.toLocaleString('en-IN')}`);
    }
  };

  return (
    <Card>
      {title && (
        <div style={{ fontFamily: fonts.sans, fontSize: '0.875rem', fontWeight: 600, color: colors.dark, marginBottom: '16px' }}>
          {title}
        </div>
      )}

      {/* Presets */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
        {presets.map(val => (
          <button
            key={val}
            onClick={() => handlePreset(val)}
            style={{
              padding: '6px 14px', borderRadius: '16px',
              border: `1px solid ${amount === val ? colors.gold : colors.bone}`,
              background: amount === val ? 'rgba(212,175,55,0.08)' : colors.white,
              fontFamily: fonts.sans, fontSize: '0.75rem', fontWeight: 600,
              color: amount === val ? colors.gold : colors.dark,
              cursor: 'pointer', transition: `all 200ms ${easing.standard}`,
            }}
          >
            {formatINR(val)}
          </button>
        ))}
      </div>

      {/* Amount display / edit */}
      <div style={{ textAlign: 'center', marginBottom: '12px' }}>
        {editing ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <span style={{ fontFamily: fonts.serif, fontSize: '1.25rem', color: colors.dark }}>{currency}</span>
            <input
              type="text"
              value={editText}
              onChange={e => setEditText(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleEditSubmit(); }}
              onBlur={handleEditSubmit}
              autoFocus
              style={{
                fontFamily: fonts.serif, fontSize: '1.5rem', fontWeight: 500,
                color: colors.dark, border: 'none', borderBottom: `2px solid ${colors.gold}`,
                outline: 'none', background: 'none', textAlign: 'center', width: '120px',
              }}
            />
          </div>
        ) : (
          <button
            onClick={handleTapAmount}
            style={{
              fontFamily: fonts.serif, fontSize: '1.5rem', fontWeight: 500,
              color: colors.dark, background: 'none', border: 'none', cursor: 'pointer',
              borderBottom: `1px dashed ${colors.bone}`, paddingBottom: '2px',
            }}
          >
            {formatINR(amount)}
          </button>
        )}
      </div>

      {/* Slider */}
      <input
        type="range"
        min={min} max={max} step={10000}
        value={amount}
        onChange={handleSlider}
        style={{ width: '100%', accentColor: colors.gold, marginBottom: '8px' }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: fonts.sans, fontSize: '0.625rem', color: colors.muted }}>
        <span>{formatINR(min)}</span>
        <span>{formatINR(max)}</span>
      </div>

      {/* Submit */}
      <button
        onClick={handleConfirm}
        style={{
          width: '100%', marginTop: '16px', padding: '12px',
          background: colors.dark, color: colors.gold, border: `1px solid rgba(212,175,55,0.2)`,
          borderRadius: '10px', fontFamily: fonts.sans, fontSize: '0.8125rem',
          fontWeight: 600, cursor: 'pointer',
        }}
      >
        Continue with {formatINR(amount)}
      </button>
    </Card>
  );
}

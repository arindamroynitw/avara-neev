import React from 'react';
import { colors, fonts } from '../../styles/tokens';

const zones = [
  { label: 'Cheap', min: 10, max: 16, color: '#4CAF50' },
  { label: 'Fair', min: 16, max: 20, color: colors.gold },
  { label: 'Expensive', min: 20, max: 22, color: '#FF9800' },
  { label: 'Very Expensive', min: 22, max: 28, color: colors.error },
];

export default function PEGauge({ currentPE = 19.5, style }) {
  const minPE = 10;
  const maxPE = 28;
  const position = ((currentPE - minPE) / (maxPE - minPE)) * 100;

  return (
    <div style={style}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
        <span style={{ fontFamily: fonts.sans, fontSize: '0.6875rem', color: colors.muted }}>Nifty PE: {currentPE}</span>
        <span style={{ fontFamily: fonts.sans, fontSize: '0.6875rem', fontWeight: 600, color: zones.find(z => currentPE >= z.min && currentPE < z.max)?.color || colors.muted }}>
          {zones.find(z => currentPE >= z.min && currentPE < z.max)?.label || 'N/A'}
        </span>
      </div>
      <div style={{ position: 'relative', height: '12px', borderRadius: '6px', overflow: 'hidden', display: 'flex' }}>
        {zones.map(zone => (
          <div
            key={zone.label}
            style={{
              flex: zone.max - zone.min,
              background: zone.color,
              opacity: 0.3,
            }}
          />
        ))}
        <div
          style={{
            position: 'absolute',
            left: `${Math.min(Math.max(position, 2), 98)}%`,
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            background: colors.dark,
            border: `2px solid ${colors.gold}`,
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          }}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
        {zones.map(zone => (
          <span key={zone.label} style={{ fontFamily: fonts.sans, fontSize: '0.5rem', color: colors.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {zone.label}
          </span>
        ))}
      </div>
    </div>
  );
}

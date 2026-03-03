import React, { useState } from 'react';
import Card from '../components/shared/Card';
import Label from '../components/shared/Label';
import ShowWorkToggle from '../components/shared/ShowWorkToggle';
import Button from '../components/shared/Button';
import { colors, typography, fonts, easing } from '../styles/tokens';

export default function AccelerateVsNavigateCard({ onChoose }) {
  const [selected, setSelected] = useState(null);

  const options = [
    {
      key: 'navigate',
      name: 'Neev Navigate',
      badge: 'DEFAULT RECOMMENDATION',
      xirr: '13.66%',
      maxDD: '-6.39%',
      description: 'Pure index funds. Same momentum system. Lower fees. 96% of Accelerate\'s returns with zero fund-picking risk.',
      funds: '5 index funds: Nifty 50 + Next 50 + Midcap 150 + S&P 500',
    },
    {
      key: 'accelerate',
      name: 'Neev Accelerate',
      badge: null,
      xirr: '14.20%',
      maxDD: '-6.25%',
      description: 'Curated active funds + momentum rebalancing. Slightly higher potential returns, higher expense ratio.',
      funds: '5 funds: Nifty 50 core + 4 active satellites',
    },
  ];

  return (
    <Card animate style={{ border: `1px solid ${colors.gold}` }}>
      <Label color={colors.gold}>CHOOSE YOUR GROWTH PATH</Label>

      <div style={{ fontFamily: fonts.sans, fontSize: '0.9375rem', color: colors.dark, marginTop: '12px', lineHeight: 1.6, marginBottom: '16px' }}>
        Your Reserve has grown enough to start building diversified equity exposure. Which approach suits you better?
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
        {options.map(opt => (
          <div
            key={opt.key}
            onClick={() => setSelected(opt.key)}
            style={{
              padding: '16px',
              borderRadius: '12px',
              border: selected === opt.key ? `2px solid ${colors.gold}` : `1px solid ${colors.bone}`,
              background: selected === opt.key ? 'rgba(212, 175, 55, 0.05)' : colors.white,
              cursor: 'pointer',
              transition: `all 200ms ${easing.standard}`,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ ...typography.displaySmall, color: colors.dark }}>{opt.name}</div>
              {opt.badge && (
                <span style={{ fontFamily: fonts.sans, fontSize: '0.5rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: colors.gold, background: 'rgba(212,175,55,0.1)', padding: '3px 8px', borderRadius: '4px' }}>
                  {opt.badge}
                </span>
              )}
            </div>
            <div style={{ display: 'flex', gap: '16px', marginBottom: '8px' }}>
              <div>
                <Label small>XIRR</Label>
                <div style={{ fontFamily: fonts.serif, fontSize: '1rem', color: colors.success }}>{opt.xirr}</div>
              </div>
              <div>
                <Label small>MAX DRAWDOWN</Label>
                <div style={{ fontFamily: fonts.serif, fontSize: '1rem', color: colors.error }}>{opt.maxDD}</div>
              </div>
            </div>
            <div style={{ fontFamily: fonts.sans, fontSize: '0.8125rem', color: colors.muted, lineHeight: 1.5 }}>
              {opt.description}
            </div>
          </div>
        ))}
      </div>

      <ShowWorkToggle>
        <div>
          <strong>Why Navigate is the default:</strong><br />
          Of Accelerate's +225 bps over Blind SIP: 171 bps (76%) comes from the shared system
          (allocation + momentum + Reserve cushion), and only 54 bps (24%) comes from active fund selection.
          Navigate captures 96% of Accelerate's returns with zero fund-picking risk.<br /><br />
          <strong>5-year backtest (1L/month, moderate profile):</strong><br />
          Accelerate: 14.20% XIRR, ₹24.16L post-tax gain<br />
          Navigate: 13.66% XIRR, ₹23.08L post-tax gain<br />
          Difference: ₹1.08L over 5 years on 1L/month contributions.
        </div>
      </ShowWorkToggle>

      {selected && (
        <Button variant="primary" onClick={() => onChoose(selected)} style={{ marginTop: '16px' }}>
          Choose {selected === 'navigate' ? 'Navigate' : 'Accelerate'}
        </Button>
      )}
    </Card>
  );
}

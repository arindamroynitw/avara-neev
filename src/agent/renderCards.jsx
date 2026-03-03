import React from 'react';
import Card from '../components/shared/Card';
import Label from '../components/shared/Label';
import GoldDonut from '../components/viz/GoldDonut';
import { colors, fonts, typography } from '../styles/tokens';
import { formatINR, formatCompact, formatPercent } from '../utils/format';
import { calculateDailyEarnings } from '../utils/calculations';

function AgentTextCard({ text }) {
  return (
    <div style={{ fontFamily: fonts.sans, fontSize: '0.9375rem', color: colors.dark, lineHeight: 1.6, padding: '4px 0' }}>
      {text}
    </div>
  );
}

function MetricCard({ label, value, subtitle }) {
  return (
    <Card>
      <Label>{label}</Label>
      <div style={{ fontFamily: fonts.serif, fontSize: '1.5rem', fontWeight: 500, color: colors.dark, marginTop: '8px' }}>
        {value}
      </div>
      {subtitle && (
        <div style={{ fontFamily: fonts.sans, fontSize: '0.8125rem', color: colors.muted, marginTop: '4px' }}>
          {subtitle}
        </div>
      )}
    </Card>
  );
}

function InfoListCard({ title, items }) {
  return (
    <Card>
      <div style={{ fontFamily: fonts.sans, fontSize: '0.875rem', fontWeight: 600, color: colors.dark, marginBottom: '12px' }}>
        {title}
      </div>
      {items?.map((item, i) => (
        <div key={i} style={{
          display: 'flex', justifyContent: 'space-between', padding: '8px 0',
          borderTop: i > 0 ? `1px solid ${colors.boneLight}` : 'none',
        }}>
          <span style={{ fontFamily: fonts.sans, fontSize: '0.8125rem', color: colors.muted }}>{item.label}</span>
          <span style={{ fontFamily: fonts.sans, fontSize: '0.8125rem', fontWeight: 600, color: colors.dark }}>{item.value}</span>
        </div>
      ))}
    </Card>
  );
}

function CalloutCard({ text, type = 'info' }) {
  const bgColors = { info: 'rgba(212,175,55,0.08)', success: 'rgba(76,175,80,0.08)', warning: 'rgba(229,115,115,0.08)' };
  const borderColors = { info: colors.gold, success: colors.success, warning: colors.error };

  return (
    <div style={{
      padding: '12px 16px', borderRadius: '8px',
      background: bgColors[type] || bgColors.info,
      borderLeft: `3px solid ${borderColors[type] || borderColors.info}`,
    }}>
      <div style={{ fontFamily: fonts.sans, fontSize: '0.8125rem', color: colors.dark, lineHeight: 1.5 }}>
        {text}
      </div>
    </div>
  );
}

function ActivateProductCard({ product, amount, productName, dispatch }) {
  const handleActivate = () => {
    if (!dispatch) return;
    const dailyEarnings = calculateDailyEarnings(amount, 7.2);
    dispatch({ type: 'ACTIVATE_PRODUCT', payload: { product, data: { balance: amount, dailyEarnings } } });
    dispatch({ type: 'UPDATE_METRICS', payload: { totalNeevBalance: amount, sweepCount: 1, totalSwept: amount } });
  };

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div style={{ fontFamily: fonts.sans, fontSize: '0.875rem', fontWeight: 600, color: colors.dark }}>
          {productName}
        </div>
        <span style={{ fontFamily: fonts.sans, fontSize: '0.875rem', fontWeight: 600, color: colors.dark }}>
          {formatINR(amount)}
        </span>
      </div>
      <button
        onClick={handleActivate}
        style={{
          width: '100%', background: colors.dark, color: colors.gold,
          padding: '10px', borderRadius: '10px', fontFamily: fonts.sans,
          fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.15em',
          textTransform: 'uppercase', border: `1px solid rgba(212,175,55,0.2)`,
          cursor: 'pointer',
        }}
      >
        Activate →
      </button>
    </Card>
  );
}

function ProductComparisonCard({ products }) {
  if (!products || products.length === 0) return null;
  return (
    <Card>
      <Label>COMPARISON</Label>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(products.length, 3)}, 1fr)`, gap: '12px', marginTop: '12px' }}>
        {products.map((p, i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: fonts.sans, fontSize: '0.75rem', fontWeight: 600, color: colors.dark, marginBottom: '8px' }}>{p.name}</div>
            <div style={{ fontFamily: fonts.serif, fontSize: '1.125rem', fontWeight: 500, color: colors.success }}>{formatPercent(p.yield)}</div>
            <div style={{ fontFamily: fonts.sans, fontSize: '0.625rem', color: colors.muted, marginTop: '4px' }}>{p.risk}</div>
            <div style={{ fontFamily: fonts.sans, fontSize: '0.625rem', color: p.drawdown === 0 ? colors.success : colors.error, marginTop: '2px' }}>
              {p.drawdown === 0 ? 'Zero' : `${p.drawdown}%`} drawdown
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function RiskProfileCard({ product, maxDrawdown, risk, description }) {
  return (
    <Card>
      <Label>RISK PROFILE — {product}</Label>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '12px' }}>
        <div style={{
          flex: 1, height: '8px', borderRadius: '4px', background: colors.boneLight, position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', left: 0, top: 0, height: '100%', borderRadius: '4px',
            width: maxDrawdown === 0 ? '10%' : `${Math.min(Math.abs(maxDrawdown) * 10, 80)}%`,
            background: maxDrawdown === 0 ? colors.success : Math.abs(maxDrawdown) < 5 ? colors.gold : colors.error,
          }} />
        </div>
        <span style={{ fontFamily: fonts.sans, fontSize: '0.75rem', fontWeight: 600, color: colors.dark }}>{risk}</span>
      </div>
      {description && (
        <div style={{ fontFamily: fonts.sans, fontSize: '0.8125rem', color: colors.muted, marginTop: '8px', lineHeight: 1.5 }}>
          {description}
        </div>
      )}
    </Card>
  );
}

function ProjectionCard({ amount, product, annual, monthly }) {
  return (
    <Card>
      <Label>PROJECTION — {product}</Label>
      <div style={{ fontFamily: fonts.sans, fontSize: '0.8125rem', color: colors.muted, marginTop: '8px' }}>
        If you invest {formatINR(amount)}:
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px' }}>
        <div>
          <div style={{ fontFamily: fonts.sans, fontSize: '0.625rem', fontWeight: 600, color: colors.muted, textTransform: 'uppercase' }}>Annual</div>
          <div style={{ fontFamily: fonts.serif, fontSize: '1.25rem', fontWeight: 500, color: colors.success }}>{formatINR(annual)}</div>
        </div>
        <div>
          <div style={{ fontFamily: fonts.sans, fontSize: '0.625rem', fontWeight: 600, color: colors.muted, textTransform: 'uppercase' }}>Monthly</div>
          <div style={{ fontFamily: fonts.serif, fontSize: '1.25rem', fontWeight: 500, color: colors.success }}>{formatINR(monthly)}</div>
        </div>
      </div>
    </Card>
  );
}

function FundBreakdownCard({ funds }) {
  if (!funds || funds.length === 0) return null;
  return (
    <Card>
      <Label>FUND BREAKDOWN</Label>
      {funds.map((fund, i) => (
        <div key={i} style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '8px 0', borderTop: i > 0 ? `1px solid ${colors.boneLight}` : 'none',
        }}>
          <div>
            <div style={{ fontFamily: fonts.sans, fontSize: '0.8125rem', color: colors.dark }}>{fund.name}</div>
            <span style={{ fontFamily: fonts.sans, fontSize: '0.625rem', color: colors.muted }}>{fund.role}</span>
          </div>
          <span style={{ fontFamily: fonts.sans, fontSize: '0.8125rem', fontWeight: 600, color: colors.dark }}>
            {Math.round(fund.weight * 100)}%
          </span>
        </div>
      ))}
    </Card>
  );
}

function AllocationDonutCard({ segments }) {
  if (!segments || segments.length === 0) return null;
  return (
    <Card>
      <Label>ALLOCATION</Label>
      <GoldDonut segments={segments} style={{ marginTop: '12px' }} />
    </Card>
  );
}

function SweepRecommendationCard({ sweepAmount, bankBalance, bufferAmount }) {
  return (
    <Card style={{ borderLeft: `3px solid ${colors.gold}` }}>
      <Label>SWEEP RECOMMENDATION</Label>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: fonts.sans, fontSize: '0.8125rem' }}>
          <span style={{ color: colors.muted }}>Bank balance</span>
          <span style={{ color: colors.dark, fontWeight: 500 }}>{formatINR(bankBalance)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: fonts.sans, fontSize: '0.8125rem' }}>
          <span style={{ color: colors.muted }}>− Buffer</span>
          <span style={{ color: colors.dark, fontWeight: 500 }}>−{formatINR(bufferAmount)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: fonts.sans, fontSize: '0.875rem', borderTop: `1px solid ${colors.boneLight}`, paddingTop: '8px' }}>
          <span style={{ color: colors.gold, fontWeight: 600 }}>Sweep amount</span>
          <span style={{ color: colors.gold, fontWeight: 700 }}>{formatINR(sweepAmount)}</span>
        </div>
      </div>
    </Card>
  );
}

// --- New block types ---

function ChipGridCard({ chips, title }) {
  if (!chips || chips.length === 0) return null;
  return (
    <Card>
      {title && <Label>{title}</Label>}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: title ? '12px' : 0 }}>
        {chips.map((chip, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: colors.boneLight, borderRadius: '10px', padding: '10px 12px',
          }}>
            {chip.emoji && <span style={{ fontSize: '1.125rem' }}>{chip.emoji}</span>}
            <div>
              <div style={{ fontFamily: fonts.serif, fontSize: '1rem', fontWeight: 500, color: colors.dark }}>{chip.stat}</div>
              <div style={{ fontFamily: fonts.sans, fontSize: '0.6875rem', color: colors.muted }}>{chip.label}</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function BreakdownCard({ items, title, total }) {
  if (!items || items.length === 0) return null;
  return (
    <Card>
      {title && <Label>{title}</Label>}
      <div style={{ marginTop: title ? '12px' : 0 }}>
        {items.map((item, i) => (
          <div key={i} style={{
            display: 'flex', justifyContent: 'space-between', padding: '8px 0',
            borderTop: i > 0 ? `1px solid ${colors.boneLight}` : 'none',
          }}>
            <span style={{ fontFamily: fonts.sans, fontSize: '0.8125rem', color: colors.muted }}>{item.label}</span>
            <span style={{ fontFamily: fonts.sans, fontSize: '0.8125rem', fontWeight: 500, color: colors.dark }}>{item.value}</span>
          </div>
        ))}
        {total && (
          <div style={{
            display: 'flex', justifyContent: 'space-between', padding: '10px 0 0',
            borderTop: `2px solid ${colors.bone}`, marginTop: '4px',
          }}>
            <span style={{ fontFamily: fonts.sans, fontSize: '0.875rem', fontWeight: 600, color: colors.gold }}>{total.label || 'Total'}</span>
            <span style={{ fontFamily: fonts.serif, fontSize: '1rem', fontWeight: 600, color: colors.gold }}>{total.value}</span>
          </div>
        )}
      </div>
    </Card>
  );
}

function ProgressCard({ label, percent, subtitle }) {
  const clampedPercent = Math.min(100, Math.max(0, percent));
  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
        <span style={{ fontFamily: fonts.sans, fontSize: '0.8125rem', fontWeight: 600, color: colors.dark }}>{label}</span>
        <span style={{ fontFamily: fonts.serif, fontSize: '1rem', fontWeight: 500, color: colors.gold }}>{clampedPercent}%</span>
      </div>
      <div style={{ width: '100%', height: '8px', borderRadius: '4px', background: colors.boneLight, overflow: 'hidden' }}>
        <div style={{
          height: '100%', borderRadius: '4px', background: colors.gold,
          width: `${clampedPercent}%`, transition: 'width 600ms cubic-bezier(0.16, 1, 0.3, 1)',
        }} />
      </div>
      {subtitle && (
        <div style={{ fontFamily: fonts.sans, fontSize: '0.75rem', color: colors.muted, marginTop: '6px' }}>{subtitle}</div>
      )}
    </Card>
  );
}

function ListCard({ items, title, style: listStyle = 'bullet' }) {
  if (!items || items.length === 0) return null;
  const getMarker = (i) => {
    if (listStyle === 'numbered') return `${i + 1}.`;
    if (listStyle === 'check') return '✓';
    return '•';
  };
  return (
    <Card>
      {title && <div style={{ fontFamily: fonts.sans, fontSize: '0.875rem', fontWeight: 600, color: colors.dark, marginBottom: '10px' }}>{title}</div>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {items.map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
            <span style={{ fontFamily: fonts.sans, fontSize: '0.8125rem', fontWeight: 600, color: colors.gold, flexShrink: 0, width: '16px' }}>
              {getMarker(i)}
            </span>
            <span style={{ fontFamily: fonts.sans, fontSize: '0.8125rem', color: colors.dark, lineHeight: 1.5 }}>
              {typeof item === 'string' ? item : item.text}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

const ALLOWED_BUTTON_ACTIONS = [
  'SET_TAB', 'SET_PRODUCT_DETAIL', 'SET_PROGRAM_PREVIEW', 'CLOSE_CONVERSATION', 'START_DEPLOY_NOW',
];

function ButtonCard({ text, action, dispatch }) {
  const handleClick = () => {
    if (!dispatch || !action) return;
    if (!ALLOWED_BUTTON_ACTIONS.includes(action.type)) return;
    // Close conversation first, then fire the action
    dispatch({ type: 'CLOSE_CONVERSATION' });
    if (action.type !== 'CLOSE_CONVERSATION') {
      setTimeout(() => dispatch(action), 50);
    }
  };

  return (
    <button
      onClick={handleClick}
      style={{
        width: '100%', background: colors.dark, color: colors.gold,
        padding: '12px 16px', borderRadius: '12px', fontFamily: fonts.sans,
        fontSize: '0.8125rem', fontWeight: 600, border: `1px solid rgba(212,175,55,0.2)`,
        cursor: 'pointer', textAlign: 'center', letterSpacing: '0.02em',
      }}
    >
      {text}
    </button>
  );
}

function ComparisonCard({ items, title }) {
  if (!items || items.length === 0) return null;
  return (
    <Card>
      {title && <Label>{title}</Label>}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(items.length, 3)}, 1fr)`, gap: '10px', marginTop: title ? '12px' : 0 }}>
        {items.map((item, i) => (
          <div key={i} style={{
            border: `1px solid ${item.picked ? colors.gold : colors.bone}`,
            borderRadius: '12px', padding: '12px', textAlign: 'center', position: 'relative',
            background: item.picked ? 'rgba(212,175,55,0.04)' : colors.white,
          }}>
            {item.picked && (
              <div style={{
                position: 'absolute', top: '-8px', left: '50%', transform: 'translateX(-50%)',
                background: colors.gold, color: colors.white, fontFamily: fonts.sans,
                fontSize: '0.5625rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px',
                letterSpacing: '0.1em', textTransform: 'uppercase',
              }}>PICKED</div>
            )}
            <div style={{ fontFamily: fonts.sans, fontSize: '0.75rem', fontWeight: 600, color: colors.dark, marginBottom: '6px' }}>{item.name}</div>
            {item.value && <div style={{ fontFamily: fonts.serif, fontSize: '1.125rem', fontWeight: 500, color: colors.gold }}>{item.value}</div>}
            {item.subtitle && <div style={{ fontFamily: fonts.sans, fontSize: '0.6875rem', color: colors.muted, marginTop: '4px' }}>{item.subtitle}</div>}
          </div>
        ))}
      </div>
    </Card>
  );
}

function BeforeAfterCard({ rows, title }) {
  if (!rows || rows.length === 0) return null;
  return (
    <Card>
      {title && <Label>{title}</Label>}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0', marginTop: title ? '12px' : 0 }}>
        <div style={{ fontFamily: fonts.sans, fontSize: '0.625rem', fontWeight: 700, color: colors.muted, textTransform: 'uppercase', letterSpacing: '0.1em', paddingBottom: '8px' }}>Before</div>
        <div style={{ fontFamily: fonts.sans, fontSize: '0.625rem', fontWeight: 700, color: colors.gold, textTransform: 'uppercase', letterSpacing: '0.1em', paddingBottom: '8px' }}>After</div>
        {rows.map((row, i) => (
          <React.Fragment key={i}>
            <div style={{
              padding: '8px 8px 8px 0', borderTop: `1px solid ${colors.boneLight}`,
            }}>
              <div style={{ fontFamily: fonts.sans, fontSize: '0.6875rem', color: colors.muted }}>{row.label}</div>
              <div style={{ fontFamily: fonts.sans, fontSize: '0.8125rem', color: colors.dark, marginTop: '2px' }}>{row.before}</div>
            </div>
            <div style={{
              padding: '8px 0 8px 8px', borderTop: `1px solid ${colors.boneLight}`,
              borderLeft: `1px solid ${colors.boneLight}`,
            }}>
              <div style={{ fontFamily: fonts.sans, fontSize: '0.6875rem', color: colors.muted }}>{row.label}</div>
              <div style={{ fontFamily: fonts.sans, fontSize: '0.8125rem', fontWeight: 600, color: colors.gold, marginTop: '2px' }}>{row.after}</div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </Card>
  );
}

function HighlightNumberCard({ value, label, subtitle }) {
  return (
    <div style={{ padding: '4px 0' }}>
      <span style={{ fontFamily: fonts.serif, fontSize: '1.25rem', fontWeight: 500, color: colors.gold }}>{value}</span>
      <span style={{ fontFamily: fonts.sans, fontSize: '0.8125rem', color: colors.muted, marginLeft: '8px' }}>{label}</span>
      {subtitle && <div style={{ fontFamily: fonts.sans, fontSize: '0.75rem', color: colors.muted, marginTop: '2px' }}>{subtitle}</div>}
    </div>
  );
}

function EmojiStatCard({ items, title }) {
  if (!items || items.length === 0) return null;
  return (
    <Card>
      {title && <Label>{title}</Label>}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: title ? '12px' : 0 }}>
        {items.map((item, i) => (
          <div key={i} style={{
            background: colors.boneLight, borderRadius: '10px', padding: '12px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
          }}>
            <span style={{ fontSize: '1.5rem' }}>{item.emoji}</span>
            <span style={{ fontFamily: fonts.serif, fontSize: '1rem', fontWeight: 500, color: colors.dark }}>{item.stat}</span>
            <span style={{ fontFamily: fonts.sans, fontSize: '0.6875rem', color: colors.muted, textAlign: 'center' }}>{item.label}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function TimelineCard({ events, title }) {
  if (!events || events.length === 0) return null;
  const statusColor = (status) => {
    if (status === 'done') return colors.success;
    if (status === 'current') return colors.gold;
    return colors.bone;
  };
  return (
    <Card>
      {title && <Label>{title}</Label>}
      <div style={{ marginTop: title ? '12px' : 0 }}>
        {events.map((event, i) => (
          <div key={i} style={{ display: 'flex', gap: '12px', position: 'relative' }}>
            {/* Connector line */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '16px', flexShrink: 0 }}>
              <div style={{
                width: '10px', height: '10px', borderRadius: '50%', background: statusColor(event.status),
                border: event.status === 'current' ? `2px solid ${colors.gold}` : 'none',
                boxSizing: 'border-box', flexShrink: 0, marginTop: '4px',
              }} />
              {i < events.length - 1 && (
                <div style={{ width: '2px', flex: 1, background: colors.boneLight, minHeight: '20px' }} />
              )}
            </div>
            <div style={{ paddingBottom: i < events.length - 1 ? '14px' : '0' }}>
              <div style={{
                fontFamily: fonts.sans, fontSize: '0.8125rem',
                fontWeight: event.status === 'current' ? 600 : 400,
                color: event.status === 'upcoming' ? colors.muted : colors.dark,
              }}>{event.label}</div>
              {event.detail && (
                <div style={{ fontFamily: fonts.sans, fontSize: '0.75rem', color: colors.muted, marginTop: '2px' }}>{event.detail}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function ScoreCard({ value, label, maxValue = 100, subtitle }) {
  const clampedValue = Math.min(maxValue, Math.max(0, value));
  const pct = clampedValue / maxValue;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - pct);

  return (
    <Card style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 20px' }}>
      <svg width="100" height="100" viewBox="0 0 100 100">
        {/* Track */}
        <circle cx="50" cy="50" r={radius} fill="none" stroke={colors.boneLight} strokeWidth="6" />
        {/* Fill */}
        <circle
          cx="50" cy="50" r={radius} fill="none" stroke={colors.gold} strokeWidth="6"
          strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
          strokeLinecap="round" transform="rotate(-90 50 50)"
          style={{ transition: 'stroke-dashoffset 800ms cubic-bezier(0.16, 1, 0.3, 1)' }}
        />
        <text x="50" y="46" textAnchor="middle" style={{ fontFamily: fonts.serif, fontSize: '1.5rem', fontWeight: 500 }} fill={colors.dark}>
          {clampedValue}
        </text>
        <text x="50" y="62" textAnchor="middle" style={{ fontFamily: fonts.sans, fontSize: '0.5rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }} fill={colors.muted}>
          / {maxValue}
        </text>
      </svg>
      <div style={{ fontFamily: fonts.sans, fontSize: '0.8125rem', fontWeight: 600, color: colors.dark, marginTop: '8px' }}>{label}</div>
      {subtitle && <div style={{ fontFamily: fonts.sans, fontSize: '0.75rem', color: colors.muted, marginTop: '4px' }}>{subtitle}</div>}
    </Card>
  );
}

export function renderCards(cards, dispatch) {
  if (!cards || !Array.isArray(cards)) return null;

  return cards.map((card, index) => {
    const key = `card-${index}`;
    const style = {
      animation: `cardStagger 350ms ${index * 80}ms both`,
      animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
    };

    switch (card.type) {
      case 'agent-text':
        return <div key={key} style={style}><AgentTextCard {...card.props} /></div>;
      case 'metric':
        return <div key={key} style={style}><MetricCard {...card.props} /></div>;
      case 'info-list':
        return <div key={key} style={style}><InfoListCard {...card.props} /></div>;
      case 'callout':
        return <div key={key} style={style}><CalloutCard {...card.props} /></div>;
      case 'activate-product':
        return <div key={key} style={style}><ActivateProductCard {...card.props} dispatch={dispatch} /></div>;
      case 'product-comparison':
        return <div key={key} style={style}><ProductComparisonCard {...card.props} /></div>;
      case 'risk-profile':
        return <div key={key} style={style}><RiskProfileCard {...card.props} /></div>;
      case 'projection':
        return <div key={key} style={style}><ProjectionCard {...card.props} /></div>;
      case 'fund-breakdown':
        return <div key={key} style={style}><FundBreakdownCard {...card.props} /></div>;
      case 'allocation-donut':
        return <div key={key} style={style}><AllocationDonutCard {...card.props} /></div>;
      case 'sweep-recommendation':
        return <div key={key} style={style}><SweepRecommendationCard {...card.props} /></div>;
      case 'chip-grid':
        return <div key={key} style={style}><ChipGridCard {...card.props} /></div>;
      case 'breakdown':
        return <div key={key} style={style}><BreakdownCard {...card.props} /></div>;
      case 'progress':
        return <div key={key} style={style}><ProgressCard {...card.props} /></div>;
      case 'list':
        return <div key={key} style={style}><ListCard {...card.props} /></div>;
      case 'button':
        return <div key={key} style={style}><ButtonCard {...card.props} dispatch={dispatch} /></div>;
      case 'comparison':
        return <div key={key} style={style}><ComparisonCard {...card.props} /></div>;
      case 'before-after':
        return <div key={key} style={style}><BeforeAfterCard {...card.props} /></div>;
      case 'highlight-number':
        return <div key={key} style={style}><HighlightNumberCard {...card.props} /></div>;
      case 'emoji-stat':
        return <div key={key} style={style}><EmojiStatCard {...card.props} /></div>;
      case 'timeline':
        return <div key={key} style={style}><TimelineCard {...card.props} /></div>;
      case 'score':
        return <div key={key} style={style}><ScoreCard {...card.props} /></div>;
      default:
        // Fallback: render as text
        return (
          <div key={key} style={style}>
            <AgentTextCard text={card.props?.text || card.props?.message || JSON.stringify(card.props)} />
          </div>
        );
    }
  });
}

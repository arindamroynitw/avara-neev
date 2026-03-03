import React, { useCallback } from 'react';
import Card from '../../components/shared/Card';
import Label from '../../components/shared/Label';
import ShowWorkToggle from '../../components/shared/ShowWorkToggle';
import { colors, fonts, typography, easing } from '../../styles/tokens';
import { useApp } from '../../context/AppContext';
import { formatCompact, formatINR } from '../../utils/format';
import { calculateDailyEarnings } from '../../utils/calculations';

function AgentCard({ card, index, onDismiss }) {
  const renderContent = () => {
    switch (card.type) {
      case 'morning-brief':
        return (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <span style={{ fontSize: '1.125rem' }}>☀️</span>
              <Label>MORNING BRIEF</Label>
            </div>
            <div style={{ fontFamily: fonts.sans, fontSize: '0.875rem', color: colors.dark, lineHeight: 1.6 }}>
              {card.props.message}
            </div>
            {card.props.showWork && (
              <ShowWorkToggle>
                <div>{card.props.showWork}</div>
              </ShowWorkToggle>
            )}
          </>
        );

      case 'yield-accrual':
        return (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <span style={{ fontSize: '1.125rem' }}>💰</span>
              <Label>YIELD ACCRUAL</Label>
            </div>
            <div style={{ fontFamily: fonts.sans, fontSize: '0.875rem', color: colors.dark, lineHeight: 1.6 }}>
              {card.props.message}
            </div>
            <div style={{ fontFamily: fonts.serif, fontSize: '1.5rem', fontWeight: 500, color: colors.success, marginTop: '8px' }}>
              +{formatCompact(card.props.amount)}
            </div>
          </>
        );

      case 'milestone':
        return (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <span style={{ fontSize: '1.125rem' }}>🎯</span>
              <Label>MILESTONE</Label>
            </div>
            <div style={{ fontFamily: fonts.sans, fontSize: '0.875rem', color: colors.dark, lineHeight: 1.6 }}>
              {card.props.message}
            </div>
            {card.props.goldMetric && (
              <div style={{ fontFamily: fonts.serif, fontSize: '1.25rem', fontWeight: 500, color: colors.gold, marginTop: '8px' }}>
                {card.props.goldMetric}
              </div>
            )}
          </>
        );

      case 'sweep-confirmation':
        return (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <span style={{ fontSize: '1.125rem' }}>✅</span>
              <Label>SWEEP CONFIRMED</Label>
            </div>
            <div style={{ fontFamily: fonts.sans, fontSize: '0.875rem', color: colors.dark, lineHeight: 1.6 }}>
              {card.props.message}
            </div>
            <div style={{ fontFamily: fonts.serif, fontSize: '1.25rem', fontWeight: 500, color: colors.gold, marginTop: '8px' }}>
              {formatCompact(card.props.amount)} → Neev Reserve
            </div>
          </>
        );

      case 'welcome':
        return (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <span style={{ fontSize: '1.125rem' }}>👋</span>
              <Label>WELCOME</Label>
            </div>
            <div style={{ fontFamily: fonts.sans, fontSize: '0.875rem', color: colors.dark, lineHeight: 1.6 }}>
              {card.props.message}
            </div>
          </>
        );

      case 'deploy-reminder': {
        const missedDaily = calculateDailyEarnings(card.props.sweepAmount || 0, 7.2);
        return (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <span style={{ fontSize: '1.125rem' }}>💰</span>
              <Label>DEPLOY YOUR PLAN</Label>
            </div>
            <div style={{ fontFamily: fonts.sans, fontSize: '0.875rem', color: colors.dark, lineHeight: 1.6 }}>
              Your plan is ready. Deploy {formatINR(card.props.sweepAmount)} to start earning 7.2%.
            </div>
            <div style={{ fontFamily: fonts.sans, fontSize: '0.75rem', color: colors.error, marginTop: '8px' }}>
              You're missing ~{formatINR(missedDaily)}/day in earnings
            </div>
            <button
              onClick={() => dispatch({ type: 'START_DEPLOY_NOW' })}
              style={{
                marginTop: '12px', background: colors.dark, color: colors.gold,
                padding: '10px 20px', borderRadius: '10px', fontFamily: fonts.sans,
                fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.15em',
                textTransform: 'uppercase', border: `1px solid rgba(212,175,55,0.2)`,
                cursor: 'pointer', width: '100%',
              }}
            >
              Deploy now →
            </button>
          </>
        );
      }

      default:
        return (
          <div style={{ fontFamily: fonts.sans, fontSize: '0.875rem', color: colors.dark }}>
            {card.props?.message || 'Agent card'}
          </div>
        );
    }
  };

  return (
    <Card animate delay={index * 80}>
      {renderContent()}
    </Card>
  );
}

export default function AgentCardStack() {
  const { state, dispatch } = useApp();
  const visibleCards = state.agentCards.filter(c => !c.dismissed && !c.expired);

  const handleDismiss = useCallback((id) => {
    dispatch({ type: 'DISMISS_AGENT_CARD', payload: id });
  }, [dispatch]);

  if (visibleCards.length === 0) return null;

  return (
    <div style={{ padding: '16px 20px 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <Label style={{ paddingLeft: '4px' }}>FROM YOUR AGENT</Label>
      {visibleCards.slice(0, 5).map((card, i) => (
        <AgentCard key={card.id} card={card} index={i} onDismiss={handleDismiss} />
      ))}
    </div>
  );
}

import React from 'react';
import { colors, fonts, typography, goldGradient } from '../../styles/tokens';
import { useApp } from '../../context/AppContext';
import { formatCompact } from '../../utils/format';
import ActivityFeed from './ActivityFeed';

class ActivityFeedErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', textAlign: 'center', fontFamily: fonts.sans, fontSize: '0.8125rem', color: colors.muted }}>
          Unable to load activity. Try refreshing.
        </div>
      );
    }
    return this.props.children;
  }
}

export default function ActivitySurface() {
  const { state } = useApp();
  const { activityFeed, metrics } = state;

  return (
    <div style={{ paddingTop: '8px', paddingBottom: '20px' }}>
      {/* Header section */}
      <div style={{ padding: '16px 20px 12px' }}>
        <div style={{
          fontFamily: fonts.sans, fontSize: '0.625rem', fontWeight: 700,
          letterSpacing: '0.15em', textTransform: 'uppercase',
          color: colors.muted, marginBottom: '4px',
        }}>
          ACTIVITY
        </div>
        <div style={{ ...typography.displayMedium, color: colors.dark, marginBottom: '12px' }}>
          Transaction History
        </div>

        {/* Summary strip */}
        {metrics.sweepCount > 0 && (
          <div style={{
            display: 'flex', gap: '16px', padding: '12px 16px',
            background: colors.boneLight, borderRadius: '12px',
          }}>
            <div>
              <div style={{ fontFamily: fonts.sans, fontSize: '0.5625rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: colors.muted }}>
                SWEEPS
              </div>
              <div style={{ fontFamily: fonts.sans, fontSize: '1rem', fontWeight: 700, color: colors.dark }}>
                {metrics.sweepCount}
              </div>
            </div>
            <div style={{ width: '1px', background: colors.bone }} />
            <div>
              <div style={{ fontFamily: fonts.sans, fontSize: '0.5625rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: colors.muted }}>
                TOTAL SWEPT
              </div>
              <div style={{ fontFamily: fonts.sans, fontSize: '1rem', fontWeight: 700, color: colors.dark }}>
                {formatCompact(metrics.totalSwept)}
              </div>
            </div>
            <div style={{ width: '1px', background: colors.bone }} />
            <div>
              <div style={{ fontFamily: fonts.sans, fontSize: '0.5625rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: colors.muted }}>
                EXTRA EARNED
              </div>
              <div style={{ ...goldGradient, fontFamily: fonts.sans, fontSize: '1rem', fontWeight: 700 }}>
                {formatCompact(metrics.extraEarned)}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Feed */}
      <ActivityFeedErrorBoundary>
        <ActivityFeed transactions={activityFeed} />
      </ActivityFeedErrorBoundary>
    </div>
  );
}

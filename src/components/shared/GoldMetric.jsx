import React from 'react';
import { goldGradient, typography } from '../../styles/tokens';
import { useCountUp } from '../../hooks/useCountUp';
import { formatCompact } from '../../utils/format';

export default function GoldMetric({ value, duration = 800, prefix = '', suffix = '', format = true, formatter = formatCompact, style }) {
  const animated = useCountUp(value, duration);
  const displayValue = format ? formatter(animated) : `${prefix}${animated.toLocaleString('en-IN')}${suffix}`;

  return (
    <div
      style={{
        ...typography.heroNumber,
        ...goldGradient,
        ...style,
      }}
    >
      {displayValue}
    </div>
  );
}

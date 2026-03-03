import React from 'react';
import { useApp } from '../../context/AppContext';
import HeroSection from './HeroSection';
import PortfolioSummary from './PortfolioSummary';
import AgentCardStack from './AgentCardStack';
import ZeroState from './ZeroState';

export default function HomeSurface() {
  const { state } = useApp();
  const hasAgentCards = state.agentCards.filter(c => !c.dismissed && !c.expired).length > 0;
  const isZeroState = state.lifecycle === 'zero-state';

  return (
    <div>
      <HeroSection />
      <PortfolioSummary />
      {hasAgentCards ? <AgentCardStack /> : isZeroState ? <ZeroState /> : null}
    </div>
  );
}

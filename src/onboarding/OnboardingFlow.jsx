import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import HookStep from './HookStep';
import PictureStep from './PictureStep';
import PlanStep from './PlanStep';
import CommitmentStep from './CommitmentStep';
import GetStartedStep from './GetStartedStep';

export default function OnboardingFlow() {
  const { state } = useApp();
  const navigate = useNavigate();
  const { currentStep, completed } = state.onboarding;

  useEffect(() => {
    if (completed) {
      navigate('/');
    }
  }, [completed, navigate]);

  switch (currentStep) {
    case 'hook':
      return <HookStep />;
    case 'picture':
      return <PictureStep />;
    case 'plan':
      return <PlanStep />;
    case 'commitment':
      return <CommitmentStep />;
    case 'getStarted':
      return <GetStartedStep />;
    default:
      return <HookStep />;
  }
}

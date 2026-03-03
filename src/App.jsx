import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import AppShell from './components/shell/AppShell';
import DemoControls from './components/shell/DemoControls';
import OnboardingFlow from './onboarding/OnboardingFlow';
import HomeSurface from './surfaces/home/HomeSurface';
import InvestSurface from './surfaces/invest/InvestSurface';
import ActivitySurface from './surfaces/activity/ActivitySurface';
import YouSurface from './surfaces/you/YouSurface';

function OnboardingRoute() {
  const { dispatch } = useApp();

  useEffect(() => {
    dispatch({ type: 'RESET_ALL' });
  }, [dispatch]);

  return (
    <>
      <OnboardingFlow />
      <DemoControls />
    </>
  );
}

function AppContent() {
  const { state } = useApp();
  const { activeTab, onboarding, lifecycle } = state;

  // During onboarding, show onboarding flow (no shell chrome)
  if (!onboarding.completed && lifecycle === 'onboarding') {
    return (
      <>
        <OnboardingFlow />
        <DemoControls />
      </>
    );
  }

  const renderTab = () => {
    switch (activeTab) {
      case 'home': return <HomeSurface />;
      case 'invest': return <InvestSurface />;
      case 'activity': return <ActivitySurface />;
      case 'you': return <YouSurface />;
      default: return <HomeSurface />;
    }
  };

  return (
    <>
      <AppShell>{renderTab()}</AppShell>
      <DemoControls />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Routes>
        <Route path="/onboarding" element={<OnboardingRoute />} />
        <Route path="/*" element={<AppContent />} />
      </Routes>
    </AppProvider>
  );
}

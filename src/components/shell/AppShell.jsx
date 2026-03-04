import React from 'react';
import { colors } from '../../styles/tokens';
import { useApp } from '../../context/AppContext';
import Header from './Header';
import TabBar from './TabBar';
import InputBar from './InputBar';
import SurfaceResponseView from './SurfaceResponseView';
import RMChatView from './RMChatView';
import DeployNowOverlay from './DeployNowOverlay';
import FlowOverlay from '../../flows/FlowOverlay';
import Toast from '../shared/Toast';

export default function AppShell({ children }) {
  const { state } = useApp();
  const showChrome = state.onboarding.completed;
  const surfaceActive = state.surfaceResponse.active;

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '390px',
        minHeight: '100dvh',
        background: colors.light,
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {showChrome && <Header />}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          paddingBottom: showChrome ? '140px' : '0',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {surfaceActive ? <SurfaceResponseView /> : children}
      </div>
      {showChrome && !state.rmChat.open && <InputBar />}
      {showChrome && <TabBar />}
      {state.rmChat.open && <RMChatView />}
      {state.deployNow?.active && <DeployNowOverlay />}
      {state.activeFlow && <FlowOverlay />}
      <Toast />
    </div>
  );
}

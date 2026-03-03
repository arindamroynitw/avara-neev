import React from 'react';
import { colors } from '../../styles/tokens';
import { useApp } from '../../context/AppContext';
import Header from './Header';
import TabBar from './TabBar';
import InputBar from './InputBar';
import ConversationOverlay from './ConversationOverlay';
import DeployNowOverlay from './DeployNowOverlay';
import Toast from '../shared/Toast';

export default function AppShell({ children }) {
  const { state } = useApp();
  const conversationOpen = state.conversation.open;
  const showChrome = state.onboarding.completed;

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
        {children}
      </div>
      {showChrome && !conversationOpen && <InputBar />}
      {showChrome && <TabBar receded={conversationOpen} />}
      <ConversationOverlay />
      {state.deployNow?.active && <DeployNowOverlay />}
      <Toast />
    </div>
  );
}

import React, { Suspense } from 'react';
import { useApp } from '../context/AppContext';
import Shimmer from '../components/shared/Shimmer';

const DeployFlow = React.lazy(() => import('./DeployFlow'));
const TransferFlow = React.lazy(() => import('./TransferFlow'));
const WithdrawFlow = React.lazy(() => import('./WithdrawFlow'));
const ProductActivateFlow = React.lazy(() => import('./ProductActivateFlow'));
const RebalanceFlow = React.lazy(() => import('./RebalanceFlow'));

const flowComponents = {
  deploy: DeployFlow,
  transfer: TransferFlow,
  withdraw: WithdrawFlow,
  activate: ProductActivateFlow,
  rebalance: RebalanceFlow,
};

export default function FlowOverlay() {
  const { state } = useApp();
  const activeFlow = state.activeFlow;

  if (!activeFlow) return null;

  const FlowComponent = flowComponents[activeFlow.flow];

  if (!FlowComponent) {
    return null;
  }

  return (
    <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}><Shimmer width="100%" height="200px" /></div>}>
      <FlowComponent />
    </Suspense>
  );
}

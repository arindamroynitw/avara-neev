/**
 * Simulated async delays for mocked operations.
 */
export function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const delays = {
  otpSend: () => delay(1000 + Math.random() * 500),
  otpVerify: () => delay(1500 + Math.random() * 500),
  panVerify: () => delay(1500 + Math.random() * 1000),
  aadhaarVerify: () => delay(2000 + Math.random() * 500),
  bankVerify: () => delay(1500 + Math.random() * 500),
  aaConnect: () => delay(2500 + Math.random() * 500),
  mandateSetup: () => delay(1500 + Math.random() * 500),
  sweepExecute: () => delay(2000 + Math.random() * 1000),
  agentThink: () => delay(800 + Math.random() * 400),
  deployConnect: () => delay(700 + Math.random() * 200),
  deployTransfer: () => delay(900 + Math.random() * 200),
  deployAllocate: () => delay(700 + Math.random() * 200),
  deployConfirm: () => delay(500 + Math.random() * 200),
};

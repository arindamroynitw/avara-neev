import React, { useState, useCallback } from 'react';
import { colors, fonts, typography, grainTexture } from '../styles/tokens';
import AgentText from '../components/shared/AgentText';
import Card from '../components/shared/Card';
import Shimmer from '../components/shared/Shimmer';
import { delays } from '../utils/mockDelays';
import { useApp } from '../context/AppContext';

const MOCK_ACCOUNTS = [
  { id: 'hdfc-1', bank: 'HDFC Bank', maskedNumber: '****4523', status: 'active', balance: 524000 },
  { id: 'axis-1', bank: 'Axis Bank', maskedNumber: '****7891', status: 'active', balance: 300000 },
];

const BANK_LOGOS = {
  'HDFC Bank': 'https://logo.clearbit.com/hdfcbank.com',
  'Axis Bank': 'https://logo.clearbit.com/axisbank.com',
};

function VerificationStep({ label, status, children }) {
  return (
    <Card style={{ marginBottom: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: children && status === 'pending' ? '12px' : '0' }}>
        <span style={{ fontFamily: fonts.sans, fontSize: '0.875rem', fontWeight: 500, color: colors.dark }}>{label}</span>
        {status === 'verified' && (
          <span style={{ fontFamily: fonts.sans, fontSize: '0.75rem', fontWeight: 600, color: colors.success }}>Verified ✓</span>
        )}
        {status === 'verifying' && (
          <Shimmer width="80px" height="16px" />
        )}
      </div>
      {children && status === 'pending' && children}
    </Card>
  );
}

export default function CommitmentStep() {
  const { dispatch } = useApp();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [pan, setPan] = useState('');
  const [aaOtp, setAaOtp] = useState('');
  const [selectedBanks, setSelectedBanks] = useState({ hdfc: true, axis: true });
  const [substep, setSubstep] = useState('phone'); // phone | otp | pan | aa | aaOtp | aaDiscovery | done
  const [verifying, setVerifying] = useState(false);

  const simulateVerify = useCallback(async (delayFn, nextStep, commitmentKey) => {
    setVerifying(true);
    await delayFn();
    dispatch({ type: 'SET_COMMITMENT_DATA', payload: { [commitmentKey]: true } });
    setVerifying(false);
    setSubstep(nextStep);
  }, [dispatch]);

  const handlePhoneSubmit = useCallback(async () => {
    if (phone.length < 10) return;
    dispatch({ type: 'SET_COMMITMENT_DATA', payload: { phone: `+91 ${phone}` } });
    setVerifying(true);
    await delays.otpSend();
    setVerifying(false);
    setSubstep('otp');
  }, [phone, dispatch]);

  const handleOtpSubmit = useCallback(() => {
    simulateVerify(delays.otpVerify, 'pan', 'otpVerified');
  }, [simulateVerify]);

  const handlePanSubmit = useCallback(() => {
    simulateVerify(delays.panVerify, 'aa', 'panVerified');
  }, [simulateVerify]);

  const handleAAConnect = useCallback(() => {
    simulateVerify(delays.aaConnect, 'aaOtp', 'aaConnected');
  }, [simulateVerify]);

  const handleAAOtpSubmit = useCallback(() => {
    simulateVerify(delays.otpVerify, 'aaDiscovery', 'aaOtpVerified');
  }, [simulateVerify]);

  const handleBankSelection = useCallback(() => {
    const selected = MOCK_ACCOUNTS.filter(
      (_, i) => (i === 0 ? selectedBanks.hdfc : selectedBanks.axis)
    );
    dispatch({ type: 'SET_ACCOUNTS', payload: selected });
    setSubstep('done');
  }, [selectedBanks, dispatch]);

  const handleComplete = useCallback(() => {
    dispatch({ type: 'SET_ONBOARDING_STEP', payload: 'getStarted' });
  }, [dispatch]);

  const anyBankSelected = selectedBanks.hdfc || selectedBanks.axis;

  const inputStyle = {
    flex: 1, fontFamily: fonts.sans, fontSize: '0.875rem', color: colors.dark,
    border: `1px solid ${colors.bone}`, borderRadius: '8px', padding: '10px 14px',
    outline: 'none', background: colors.white,
  };

  const ctaStyle = {
    width: '100%', marginTop: '8px', background: colors.dark, color: colors.gold,
    padding: '12px', borderRadius: '12px', fontFamily: fonts.sans, fontSize: '0.625rem',
    fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase',
    border: `1px solid rgba(212,175,55,0.2)`, cursor: 'pointer',
  };

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: colors.dark, padding: '52px 24px 24px', position: 'relative', ...grainTexture }}>
        <div style={{ position: 'absolute', top: 0, right: 0, width: '200px', height: '200px', background: colors.gold, opacity: 0.05, borderRadius: '50%', filter: 'blur(60px)', transform: 'translate(30%, -50%)', pointerEvents: 'none' }} />
        <div style={{ ...typography.brandMark, color: colors.light, marginBottom: '16px', position: 'relative', zIndex: 1 }}>neev</div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <AgentText
            text={substep === 'done' ? "Accounts linked. Now let's put your idle cash to work." : "Let's get you set up. This takes about 3 minutes."}
            animate={false}
            style={{ color: colors.light }}
          />
        </div>
      </div>

      <div style={{ flex: 1, background: colors.light, padding: '20px', paddingBottom: '40px', overflowY: 'auto' }}>
        {/* Phone */}
        <VerificationStep
          label={['pan', 'aa', 'aaOtp', 'aaDiscovery', 'done'].includes(substep) && phone ? `+91 ${phone.slice(0,5)} ${phone.slice(5)}` : 'Phone Number'}
          status={substep === 'phone' ? 'pending' : substep === 'otp' ? 'verifying' : 'verified'}
        >
          <div style={{ display: 'flex', gap: '8px' }}>
            <span style={{ fontFamily: fonts.sans, fontSize: '0.875rem', color: colors.muted, padding: '10px 0' }}>+91</span>
            <input type="tel" value={phone} onChange={e => setPhone(e.target.value.replace(/[^0-9]/g, '').slice(0, 10))} placeholder="98765 43210" style={inputStyle} />
          </div>
          <button onClick={handlePhoneSubmit} disabled={phone.length < 10} style={{ ...ctaStyle, opacity: phone.length < 10 ? 0.5 : 1 }}>Send OTP →</button>
        </VerificationStep>

        {/* OTP */}
        {['otp', 'pan', 'aa', 'aaOtp', 'aaDiscovery', 'done'].includes(substep) && (
          <VerificationStep label="OTP Verification" status={substep === 'otp' ? (verifying ? 'verifying' : 'pending') : 'verified'}>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              {[0,1,2,3,4,5].map(i => (
                <input key={i} type="text" inputMode="numeric" maxLength={1}
                  value={otp[i] || ''}
                  onChange={e => {
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    const newOtp = otp.split(''); newOtp[i] = val; setOtp(newOtp.join(''));
                    if (val && e.target.nextElementSibling) e.target.nextElementSibling.focus();
                  }}
                  style={{ width: '40px', height: '44px', textAlign: 'center', fontFamily: fonts.sans, fontSize: '1.125rem', fontWeight: 600, border: `1px solid ${colors.bone}`, borderRadius: '8px', outline: 'none', background: colors.white, color: colors.dark }}
                />
              ))}
            </div>
            <button onClick={handleOtpSubmit} disabled={otp.length < 6} style={{ ...ctaStyle, opacity: otp.length < 6 ? 0.5 : 1 }}>Verify →</button>
          </VerificationStep>
        )}

        {/* PAN */}
        {['pan', 'aa', 'aaOtp', 'aaDiscovery', 'done'].includes(substep) && (
          <VerificationStep label="PAN Verification" status={substep === 'pan' ? (verifying ? 'verifying' : 'pending') : 'verified'}>
            <input type="text" value={pan} onChange={e => setPan(e.target.value.toUpperCase().slice(0, 10))} placeholder="ABCDE1234F" style={{ ...inputStyle, width: '100%' }} />
            <button onClick={handlePanSubmit} disabled={pan.length < 10} style={{ ...ctaStyle, opacity: pan.length < 10 ? 0.5 : 1 }}>Verify PAN →</button>
          </VerificationStep>
        )}

        {/* AA Consent */}
        {['aa', 'aaOtp', 'aaDiscovery', 'done'].includes(substep) && (
          <VerificationStep label="Account Aggregator" status={substep === 'aa' ? (verifying ? 'verifying' : 'pending') : 'verified'}>
            <div style={{ fontFamily: fonts.sans, fontSize: '0.8125rem', color: colors.muted, marginBottom: '8px', lineHeight: 1.5 }}>
              Connect your bank so I can automatically detect idle cash each month.
            </div>
            <div style={{ fontFamily: fonts.sans, fontSize: '0.75rem', color: colors.muted, marginBottom: '12px' }}>
              <div>✓ Bank balance &nbsp; ✓ Salary credits &nbsp; ✓ Major outflows</div>
              <div style={{ marginTop: '4px' }}>✗ Individual purchases &nbsp; ✗ UPI details</div>
            </div>
            <button onClick={handleAAConnect} style={ctaStyle}>Connect via Sahamati →</button>
          </VerificationStep>
        )}

        {/* AA OTP */}
        {['aaOtp', 'aaDiscovery', 'done'].includes(substep) && (
          <VerificationStep label="AA Verification" status={substep === 'aaOtp' ? (verifying ? 'verifying' : 'pending') : 'verified'}>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              {[0,1,2,3,4,5].map(i => (
                <input key={`aa-${i}`} type="text" inputMode="numeric" maxLength={1}
                  value={aaOtp[i] || ''}
                  onChange={e => {
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    const newOtp = aaOtp.split(''); newOtp[i] = val; setAaOtp(newOtp.join(''));
                    if (val && e.target.nextElementSibling) e.target.nextElementSibling.focus();
                  }}
                  style={{ width: '40px', height: '44px', textAlign: 'center', fontFamily: fonts.sans, fontSize: '1.125rem', fontWeight: 600, border: `1px solid ${colors.bone}`, borderRadius: '8px', outline: 'none', background: colors.white, color: colors.dark }}
                />
              ))}
            </div>
            <button onClick={handleAAOtpSubmit} disabled={aaOtp.length < 6} style={{ ...ctaStyle, opacity: aaOtp.length < 6 ? 0.5 : 1 }}>Verify →</button>
          </VerificationStep>
        )}

        {/* AA Discovery */}
        {['aaDiscovery', 'done'].includes(substep) && (
          <VerificationStep label="Accounts Found" status={substep === 'aaDiscovery' ? 'pending' : 'verified'}>
            <div style={{ fontFamily: fonts.sans, fontSize: '0.8125rem', fontWeight: 600, color: colors.dark, marginBottom: '12px' }}>
              We found 2 bank accounts
            </div>
            {MOCK_ACCOUNTS.map((acc, i) => {
              const key = i === 0 ? 'hdfc' : 'axis';
              const checked = selectedBanks[key];
              return (
                <div
                  key={acc.id}
                  onClick={() => setSelectedBanks(prev => ({ ...prev, [key]: !prev[key] }))}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '12px', borderRadius: '10px', marginBottom: '8px',
                    background: checked ? 'rgba(212,175,55,0.06)' : colors.white,
                    border: `1px solid ${checked ? 'rgba(212,175,55,0.3)' : colors.bone}`,
                    cursor: 'pointer', transition: 'all 0.2s ease',
                  }}
                >
                  <img
                    src={BANK_LOGOS[acc.bank]}
                    alt={acc.bank}
                    onError={e => { e.target.style.display = 'none'; e.target.nextElementSibling.style.display = 'flex'; }}
                    style={{ width: '36px', height: '36px', borderRadius: '10px', objectFit: 'contain' }}
                  />
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '10px', display: 'none',
                    background: colors.boneLight, alignItems: 'center', justifyContent: 'center',
                    fontFamily: fonts.sans, fontSize: '0.5rem', fontWeight: 700, color: colors.dark,
                  }}>
                    {acc.bank.split(' ')[0]}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: fonts.sans, fontSize: '0.8125rem', fontWeight: 600, color: colors.dark }}>
                      {acc.bank}
                    </div>
                    <div style={{ fontFamily: fonts.sans, fontSize: '0.6875rem', color: colors.muted }}>
                      {acc.maskedNumber}
                    </div>
                  </div>
                  <div style={{
                    width: '22px', height: '22px', borderRadius: '6px',
                    border: `2px solid ${checked ? colors.gold : colors.bone}`,
                    background: checked ? colors.gold : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.2s ease',
                  }}>
                    {checked && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={colors.dark} strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                    )}
                  </div>
                </div>
              );
            })}
            <button onClick={handleBankSelection} disabled={!anyBankSelected} style={{ ...ctaStyle, opacity: anyBankSelected ? 1 : 0.5 }}>
              Link selected accounts →
            </button>
          </VerificationStep>
        )}

        {/* Done */}
        {substep === 'done' && (
          <Card animate style={{ marginTop: '8px', textAlign: 'center' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: colors.dark, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={colors.gold} strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <div style={{ ...typography.displaySmall, color: colors.dark, marginBottom: '8px' }}>Accounts linked</div>
            <div style={{ fontFamily: fonts.sans, fontSize: '0.8125rem', color: colors.muted, marginBottom: '20px', lineHeight: 1.5 }}>
              Your bank accounts are connected and verified. Now let's put your idle cash to work.
            </div>
            <button onClick={handleComplete} style={{ width: '100%', background: colors.dark, color: colors.gold, padding: '14px', borderRadius: '12px', fontFamily: fonts.sans, fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', border: `1px solid rgba(212,175,55,0.2)`, cursor: 'pointer' }}>
              Let's get started →
            </button>
          </Card>
        )}
      </div>
    </div>
  );
}

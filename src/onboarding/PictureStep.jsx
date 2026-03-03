import React, { useState, useCallback } from 'react';
import { colors, fonts, typography, grainTexture } from '../styles/tokens';
import { formatCompact } from '../utils/format';
import AgentText from '../components/shared/AgentText';
import Card from '../components/shared/Card';
import QuickReplyChips from '../components/shared/QuickReplyChips';
import { useApp } from '../context/AppContext';

const outflowFields = [
  { key: 'rent', label: 'Rent', helper: 'Monthly rent or housing' },
  { key: 'sips', label: 'SIPs', helper: 'Existing mutual fund SIPs' },
  { key: 'emi', label: 'EMIs', helper: 'Car, personal, or other loan EMIs' },
  { key: 'other', label: 'Average expenses', helper: 'Groceries, utilities, subscriptions, etc.' },
];

function QuestionCard({ question, children, animate, delay = 0 }) {
  return (
    <Card animate={animate} delay={delay} style={{ marginBottom: '12px' }}>
      <div style={{ fontFamily: fonts.sans, fontSize: '0.9375rem', color: colors.dark, marginBottom: '16px', lineHeight: 1.5 }}>
        {question}
      </div>
      {children}
    </Card>
  );
}

export default function PictureStep() {
  const { state, dispatch } = useApp();
  const [currentQ, setCurrentQ] = useState(0);
  const [salary, setSalary] = useState(180000);
  const [salaryDate, setSalaryDate] = useState(null);
  const [outflows, setOutflows] = useState({ rent: '', sips: '', emi: '', other: '' });
  const [outflowStep, setOutflowStep] = useState(0);
  const [upcoming, setUpcoming] = useState(null);
  const [showLiquidityFollowup, setShowLiquidityFollowup] = useState(false);
  const [liquidityAmount, setLiquidityAmount] = useState(null);

  const handleNext = useCallback((overrideExpense) => {
    if (currentQ < 3) {
      setCurrentQ(currentQ + 1);
    } else {
      const totalOutflows = Object.values(outflows).reduce((sum, v) => sum + (parseInt(v) || 0), 0);
      dispatch({
        type: 'SET_PICTURE_DATA',
        payload: {
          monthlySalary: salary,
          salaryDate: salaryDate || 1,
          outflows: totalOutflows,
          outflowBreakdown: {
            rent: parseInt(outflows.rent) || 0,
            sips: parseInt(outflows.sips) || 0,
            emi: parseInt(outflows.emi) || 0,
            other: parseInt(outflows.other) || 0,
          },
          upcomingExpense: upcoming === 'nothing' ? 0 : (overrideExpense ?? liquidityAmount ?? 50000),
        },
      });
      dispatch({ type: 'SET_ONBOARDING_STEP', payload: 'plan' });
    }
  }, [currentQ, salary, salaryDate, outflows, upcoming, liquidityAmount, dispatch]);

  const handleOutflowContinue = useCallback(() => {
    if (outflowStep < outflowFields.length - 1) {
      setOutflowStep(outflowStep + 1);
    } else {
      handleNext();
    }
  }, [outflowStep, handleNext]);

  const handleUpcomingSelect = useCallback((v) => {
    setUpcoming(v);
    if (v === 'nothing') {
      setTimeout(() => handleNext(0), 300);
    } else {
      setShowLiquidityFollowup(true);
    }
  }, [handleNext]);

  const handleLiquiditySelect = useCallback((amount) => {
    setLiquidityAmount(amount);
    setTimeout(() => handleNext(amount), 300);
  }, [handleNext]);

  const currentField = outflowFields[outflowStep];

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      <div style={{
        background: colors.dark, padding: '52px 24px 24px', position: 'relative', ...grainTexture,
      }}>
        <div style={{ position: 'absolute', top: 0, right: 0, width: '200px', height: '200px', background: colors.gold, opacity: 0.05, borderRadius: '50%', filter: 'blur(60px)', transform: 'translate(30%, -50%)', pointerEvents: 'none' }} />
        <div style={{ ...typography.brandMark, color: colors.light, marginBottom: '16px', position: 'relative', zIndex: 1 }}>neev</div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <AgentText text="Let me understand your money flow." animate={false} style={{ color: colors.light }} />
        </div>
        {/* Progress dots */}
        <div style={{ display: 'flex', gap: '6px', marginTop: '16px', position: 'relative', zIndex: 1 }}>
          {[0, 1, 2, 3].map(i => (
            <div key={i} style={{
              width: i <= currentQ ? '24px' : '8px', height: '4px',
              borderRadius: '2px', background: i <= currentQ ? colors.gold : 'rgba(255,255,255,0.2)',
              transition: 'all 300ms ease',
            }} />
          ))}
        </div>
      </div>

      <div style={{ flex: 1, background: colors.light, padding: '20px', paddingBottom: '40px', overflowY: 'auto' }}>
        {/* Q1: Monthly salary */}
        {currentQ >= 0 && (
          <QuestionCard question="What's your approximate monthly take-home?" animate delay={0}>
            <div style={{ marginBottom: '8px' }}>
              <div style={{ fontFamily: fonts.serif, fontSize: '1.5rem', color: colors.dark, textAlign: 'center', marginBottom: '12px' }}>
                {formatCompact(salary)}/month
              </div>
              <input
                type="range"
                min={50000} max={500000} step={10000}
                value={salary}
                onChange={e => setSalary(parseInt(e.target.value))}
                style={{ width: '100%', accentColor: colors.gold }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: fonts.sans, fontSize: '0.625rem', color: colors.muted }}>
                <span>₹50K</span><span>₹5L</span>
              </div>
            </div>
            {currentQ === 0 && (
              <button onClick={handleNext} style={{ width: '100%', marginTop: '12px', background: colors.dark, color: colors.gold, padding: '12px', borderRadius: '12px', fontFamily: fonts.sans, fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', border: `1px solid rgba(212,175,55,0.2)`, cursor: 'pointer' }}>
                Continue
              </button>
            )}
          </QuestionCard>
        )}

        {/* Q2: Salary date */}
        {currentQ >= 1 && (
          <QuestionCard question="When does salary typically land?" animate delay={currentQ === 1 ? 0 : undefined}>
            <QuickReplyChips
              options={[
                { label: 'Last day', value: 'last' },
                { label: '1st', value: '1' },
                { label: '2nd', value: '2' },
                { label: '7th', value: '7' },
              ]}
              selected={salaryDate}
              onSelect={v => { setSalaryDate(v); if (currentQ === 1) setTimeout(handleNext, 300); }}
            />
          </QuestionCard>
        )}

        {/* Q3: Step-by-step outflows */}
        {currentQ >= 2 && (
          <QuestionCard question="What are your big monthly outflows?" animate delay={currentQ === 2 ? 0 : undefined}>
            {/* Summary chips for previously entered values */}
            {outflowStep > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                {outflowFields.slice(0, outflowStep).map(f => (
                  <div key={f.key} style={{
                    fontFamily: fonts.sans, fontSize: '0.75rem', color: colors.dark,
                    background: colors.boneLight, borderRadius: '16px', padding: '6px 12px',
                  }}>
                    {f.label}: {formatCompact(parseInt(outflows[f.key]) || 0)}
                  </div>
                ))}
              </div>
            )}

            {/* Current field */}
            <div key={outflowStep} style={{ animation: 'fadeUp 300ms ease both' }}>
              <div style={{ fontFamily: fonts.sans, fontSize: '0.875rem', fontWeight: 600, color: colors.dark, marginBottom: '4px' }}>
                {currentField.label}
              </div>
              <div style={{ fontFamily: fonts.sans, fontSize: '0.75rem', color: colors.muted, marginBottom: '10px' }}>
                {currentField.helper}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', border: `1px solid ${colors.bone}`, borderRadius: '8px', padding: '10px 14px', marginBottom: '12px' }}>
                <span style={{ color: colors.muted, fontSize: '0.9375rem', marginRight: '6px' }}>₹</span>
                <input
                  type="text" inputMode="numeric"
                  value={outflows[currentField.key]}
                  onChange={e => setOutflows({ ...outflows, [currentField.key]: e.target.value.replace(/[^0-9]/g, '') })}
                  placeholder="0"
                  autoFocus
                  style={{ flex: 1, fontFamily: fonts.sans, fontSize: '1rem', color: colors.dark, border: 'none', outline: 'none', background: 'none' }}
                />
              </div>
            </div>

            {/* Outflow progress dots */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginBottom: '12px' }}>
              {outflowFields.map((_, i) => (
                <div key={i} style={{
                  width: '8px', height: '8px', borderRadius: '50%',
                  background: i <= outflowStep ? colors.gold : colors.bone,
                  transition: 'background 300ms ease',
                }} />
              ))}
            </div>

            {currentQ === 2 && (
              <button onClick={handleOutflowContinue} style={{ width: '100%', background: colors.dark, color: colors.gold, padding: '12px', borderRadius: '12px', fontFamily: fonts.sans, fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', border: `1px solid rgba(212,175,55,0.2)`, cursor: 'pointer' }}>
                Continue
              </button>
            )}
          </QuestionCard>
        )}

        {/* Q4: Upcoming expenses */}
        {currentQ >= 3 && (
          <QuestionCard question="Anything big coming up in the next 3 months?" animate delay={0}>
            <QuickReplyChips
              options={[
                { label: 'Travel', value: 'travel' },
                { label: 'Purchase', value: 'purchase' },
                { label: 'Wedding', value: 'wedding' },
                { label: 'Nothing', value: 'nothing' },
              ]}
              selected={upcoming}
              onSelect={handleUpcomingSelect}
            />
            {/* Liquidity follow-up */}
            {showLiquidityFollowup && upcoming && upcoming !== 'nothing' && (
              <div style={{ marginTop: '16px', animation: 'fadeUp 300ms ease both' }}>
                <div style={{ fontFamily: fonts.sans, fontSize: '0.875rem', color: colors.dark, marginBottom: '12px', lineHeight: 1.5 }}>
                  How much would you like to keep liquid for {upcoming.charAt(0).toUpperCase() + upcoming.slice(1)}?
                </div>
                <QuickReplyChips
                  options={[
                    { label: '₹25K', value: 25000 },
                    { label: '₹50K', value: 50000 },
                    { label: '₹1L', value: 100000 },
                    { label: '₹2L', value: 200000 },
                  ]}
                  selected={liquidityAmount}
                  onSelect={handleLiquiditySelect}
                />
              </div>
            )}
          </QuestionCard>
        )}
      </div>
    </div>
  );
}

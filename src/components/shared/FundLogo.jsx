import React from 'react';
import { colors, fonts } from '../../styles/tokens';
import { getFundLogo, FUND_LOGOS } from '../../data/products';

export default function FundLogo({ fundName, size = 28 }) {
  const logoUrl = getFundLogo(fundName);
  const houseKey = Object.keys(FUND_LOGOS).find(key => fundName.includes(key));
  const fallbackLetter = houseKey ? houseKey[0] : fundName[0];

  if (!logoUrl) {
    return (
      <div style={{
        width: size, height: size, borderRadius: 8,
        background: colors.boneLight, display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        fontFamily: fonts.sans, fontSize: size * 0.4, fontWeight: 700, color: colors.dark,
        flexShrink: 0,
      }}>
        {fallbackLetter}
      </div>
    );
  }

  return (
    <div style={{ width: size, height: size, position: 'relative', flexShrink: 0 }}>
      <img
        src={logoUrl}
        alt={fundName}
        onError={e => {
          e.target.style.display = 'none';
          e.target.nextElementSibling.style.display = 'flex';
        }}
        style={{
          width: size, height: size, borderRadius: 8,
          objectFit: 'contain', display: 'block',
        }}
      />
      <div style={{
        width: size, height: size, borderRadius: 8,
        background: colors.boneLight, display: 'none',
        alignItems: 'center', justifyContent: 'center',
        fontFamily: fonts.sans, fontSize: size * 0.4, fontWeight: 700, color: colors.dark,
        position: 'absolute', top: 0, left: 0,
      }}>
        {fallbackLetter}
      </div>
    </div>
  );
}

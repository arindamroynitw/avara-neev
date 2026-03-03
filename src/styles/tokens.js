// Neev Design System — Gold/Cream Luxury Palette

export const colors = {
  dark: '#1C1915',
  darkMid: '#2C2824',
  muted: '#8C7B65',
  light: '#F9F7F2',
  bone: '#E5E0D5',
  boneLight: '#F0EDE6',
  goldLight: '#F0D588',
  gold: '#D4AF37',
  goldDark: '#B8860B',
  success: '#4CAF50',
  error: '#E57373',
  white: '#FFFFFF',
};

export const goldGradient = {
  background: 'linear-gradient(135deg, #F0D588 0%, #D4AF37 50%, #B8860B 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};

export const goldGradientBg = 'linear-gradient(135deg, #F0D588 0%, #D4AF37 50%, #B8860B 100%)';

export const fonts = {
  serif: "'Cormorant Garamond', serif",
  sans: "'Manrope', sans-serif",
};

export const typography = {
  heroNumber: {
    fontFamily: fonts.serif,
    fontSize: '2.8rem',
    fontWeight: 300,
    lineHeight: 1.1,
  },
  displayLarge: {
    fontFamily: fonts.serif,
    fontSize: '2rem',
    fontWeight: 500,
    lineHeight: 1.1,
  },
  displayMedium: {
    fontFamily: fonts.serif,
    fontSize: '1.5rem',
    fontWeight: 500,
    lineHeight: 1.2,
  },
  displaySmall: {
    fontFamily: fonts.serif,
    fontSize: '1.25rem',
    fontWeight: 500,
    lineHeight: 1.2,
  },
  body: {
    fontFamily: fonts.sans,
    fontSize: '0.875rem',
    fontWeight: 400,
    lineHeight: 1.5,
  },
  bodySmall: {
    fontFamily: fonts.sans,
    fontSize: '0.8125rem',
    fontWeight: 400,
    lineHeight: 1.5,
  },
  label: {
    fontFamily: fonts.sans,
    fontSize: '0.625rem',
    fontWeight: 700,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
  },
  labelSmall: {
    fontFamily: fonts.sans,
    fontSize: '0.5625rem',
    fontWeight: 700,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
  },
  brandMark: {
    fontFamily: fonts.serif,
    fontSize: '1.5rem',
    fontWeight: 700,
    letterSpacing: '0.05em',
  },
};

export const glass = {
  background: 'rgba(255, 253, 248, 0.7)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
};

export const card = {
  background: colors.white,
  border: `1px solid ${colors.bone}`,
  borderRadius: '16px',
  boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
};

export const spacing = {
  cardPadding: '20px',
  cardGap: '12px',
  screenPaddingH: '20px',
  screenPaddingBottom: '140px',
  sectionGap: '16px',
};

export const easing = {
  spring: 'cubic-bezier(0.16, 1, 0.3, 1)',
  springBounce: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  easeOut: 'cubic-bezier(0.33, 0, 0.67, 0)',
  standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
};

export const grainTexture = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")`,
};

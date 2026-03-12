export const theme = {
  colors: {
    background: '#071018',
    backgroundAlt: '#0A1621',
    surface: '#0F1D29',
    surfaceAlt: '#142635',
    surfaceRaised: '#1A3042',
    primary: '#D8B26A',
    primarySoft: 'rgba(216, 178, 106, 0.16)',
    accent: '#5CC7B2',
    accentSoft: 'rgba(92, 199, 178, 0.14)',
    success: '#52D493',
    successSoft: 'rgba(82, 212, 147, 0.14)',
    danger: '#FF7A6B',
    dangerSoft: 'rgba(255, 122, 107, 0.14)',
    text: '#F5EFE5',
    textMuted: '#99A8B5',
    textSubtle: '#6F8090',
    border: '#233748',
    warning: '#E7B765',
    warningSoft: 'rgba(231, 183, 101, 0.16)',
    cardStroke: 'rgba(255, 255, 255, 0.06)',
    shadow: 'rgba(0, 0, 0, 0.45)',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 40,
  },
  radius: {
    sm: 8,
    md: 12,
    lg: 20,
    xl: 28,
    pill: 999,
  },
};

type TColorsType = keyof typeof theme.colors;
export type TTheme = typeof theme;

export type { TColorsType };

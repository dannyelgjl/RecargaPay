export const theme = {
  colors: {
    textDefault: '#343A40',
    transparent: 'transparent',

    brandPrimaryDarkest: '#5F2A0B',
    brandPrimaryMedium: '#FF6900',
    brandPrimaryDark: '#622490',
    brandPrimaryLight: '#F8C9AD',
    brandPrimaryLightest: '#FFE0CD',

    brandSecondaryDarkest: '#534C42',
    brandSecondaryDark: '#757575',
    brandSecondaryMedium: '#F0EDF5',
    brandSecondaryLight: '#EEEEEE',
  },
  fonts: {
    Frutiger_Roman: 'Frutiger-Roman',
    Roboto_100Thin_Italic: 'Roboto-ThinItalic',
    Roboto_300Light: 'Roboto-Light',
    Roboto_300Light_Italic: 'Roboto-LightItalic',
    Roboto_400Regular: 'Roboto-Regular',
    Roboto_400Italic: 'Roboto-Italic',
    Roboto_500Medium: 'Roboto-Medium',
    Roboto_500Medium_Italic: 'Roboto-MediumItalic',
    Roboto_700Bold: 'Roboto-Bold',
    Roboto_700Bold_Italic: 'Roboto-BoldItalic',
    Roboto_900Black: 'Roboto-Black',
    Roboto_900Black_Italic: 'Roboto-BlackItalic',
  },
};

type TColorsType = keyof typeof theme.colors;
export type TTheme = typeof theme;

export type { TColorsType };

import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const BackgroundOverlay = styled.View`
  position: absolute;
  inset: 0;
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
`;

export const SafeArea = styled(SafeAreaView)`
  flex: 1;
  padding: 18px 22px 22px;
`;

export const ScrollArea = styled.ScrollView.attrs(() => ({
  contentContainerStyle: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  showsVerticalScrollIndicator: false,
  bounces: false,
}))`
  flex: 1;
`;

export const GlowTop = styled.View`
  position: absolute;
  width: 280px;
  height: 280px;
  border-radius: 140px;
  background-color: ${({ theme }) => theme.colors.primarySoft};
  top: -120px;
  right: -110px;
`;

export const GlowBottom = styled.View`
  position: absolute;
  width: 260px;
  height: 260px;
  border-radius: 130px;
  background-color: ${({ theme }) => theme.colors.accentSoft};
  bottom: -120px;
  left: -100px;
`;

export const TopArea = styled.View`
  align-items: center;
  margin-top: 10px;
`;

export const LockCapsule = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  border-radius: ${({ theme }) => theme.radius.pill}px;
  background-color: rgba(15, 29, 41, 0.82);
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.cardStroke};
`;

export const LockSymbol = styled.Text`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 13px;
  font-weight: 700;
`;

export const LockText = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
`;

export const Content = styled.View`
  align-items: center;
  margin-top: 44px;
`;

export const Title = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  font-size: 34px;
  font-weight: 800;
  letter-spacing: -1px;
  margin-bottom: 12px;
`;

export const Subtitle = styled.Text`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 15px;
  line-height: 22px;
  text-align: center;
  padding: 0 12px;
  margin-bottom: 18px;
`;

export const HintPill = styled.View`
  padding: 10px 14px;
  border-radius: ${({ theme }) => theme.radius.pill}px;
  background-color: ${({ theme }) => theme.colors.primarySoft};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.cardStroke};
  margin-bottom: 26px;
`;

export const HintText = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.4px;
`;

export const IndicatorsRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 14px;
`;

export const Indicator = styled.View<{ $filled: boolean }>`
  width: 14px;
  height: 14px;
  border-radius: 7px;
  border-width: 1px;
  border-color: ${({ theme, $filled }) =>
    $filled ? theme.colors.primary : theme.colors.textSubtle};
  background-color: ${({ theme, $filled }) =>
    $filled ? theme.colors.primary : 'transparent'};
`;

export const ErrorText = styled.Text`
  color: ${({ theme }) => theme.colors.danger};
  font-size: 14px;
  margin-top: 18px;
  text-align: center;
`;

export const KeypadShell = styled.View`
  width: 100%;
  max-width: 420px;
  align-self: center;
  background-color: rgba(15, 29, 41, 0.82);
  border: 1px solid ${({ theme }) => theme.colors.cardStroke};
  border-radius: ${({ theme }) => theme.radius.xl}px;
  padding: 18px 14px 10px;
  shadow-color: ${({ theme }) => theme.colors.shadow};
  shadow-offset: 0px 16px;
  shadow-opacity: 0.24;
  shadow-radius: 26px;
  elevation: 10;

  margin-top: 8px;
`;

export const Keypad = styled.View`
  width: 100%;
  align-self: center;
`;

export const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
`;

export const DigitButton = styled.Pressable`
  width: 31.5%;
  max-width: 96px;
  min-height: 72px;
  aspect-ratio: 1.14;
  border-radius: 28px;
  background-color: ${({ theme }) => theme.colors.surfaceAlt};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.cardStroke};
  align-items: center;
  justify-content: center;
`;

export const DigitText = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  font-size: 38px;
  font-weight: 700;
  line-height: 42px;
`;

export const LettersText = styled.Text`
  color: ${({ theme }) => theme.colors.textSubtle};
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1.6px;
  margin-top: 2px;
`;

export const Spacer = styled.View`
  width: 31.5%;
  max-width: 96px;
  min-height: 72px;
  aspect-ratio: 1.14;
`;

export const BottomActionWrapper = styled.View`
  width: 31.5%;
  max-width: 96px;
  min-height: 72px;
  aspect-ratio: 1.14;
  align-items: center;
  justify-content: center;
`;

export const BottomActionButton = styled.Pressable`
  padding: 10px 6px;
  align-items: center;
  justify-content: center;
`;

export const BottomActionText = styled.Text`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 16px;
  font-weight: 600;
`;

export const BottomActionTextHidden = styled(BottomActionText)`
  opacity: 0;
`;

export const FooterRow = styled.View`
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 0 8px;
  margin-top: 4px;
`;

export const FooterText = styled.Text`
  color: ${({ theme }) => theme.colors.textSubtle};
  font-size: 14px;
  font-weight: 500;
`;

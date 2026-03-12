import styled from 'styled-components/native';
import { useStatusBarHeight } from '../../utils/useStatusBarHeight/useStatusBarHeight';

export const Container = styled.ScrollView`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
  padding: ${useStatusBarHeight}px 22px 22px 22px;
`;

export const Content = styled.View`
  margin-top: 8px;
  padding-bottom: ${({ theme }) => theme.spacing.xxl}px;
`;

export const BackgroundLayer = styled.View`
  position: absolute;
  inset: 0;
`;

export const GlowTop = styled.View`
  position: absolute;
  width: 260px;
  height: 260px;
  border-radius: 130px;
  background-color: ${({ theme }) => theme.colors.primarySoft};
  top: -100px;
  right: -80px;
`;

export const GlowBottom = styled.View`
  position: absolute;
  width: 240px;
  height: 240px;
  border-radius: 120px;
  background-color: ${({ theme }) => theme.colors.accentSoft};
  bottom: -120px;
  left: -80px;
`;

export const Eyebrow = styled.Text`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.1px;
  margin-bottom: 10px;
`;

export const Title = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  font-size: 30px;
  font-weight: 800;
  letter-spacing: -0.8px;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

export const Amount = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  font-size: 40px;
  font-weight: 800;
  letter-spacing: -1.2px;
`;

export const SummaryCard = styled.View`
  background-color: ${({ theme }) => theme.colors.surfaceRaised};
  border: 1px solid ${({ theme }) => theme.colors.cardStroke};
  border-radius: ${({ theme }) => theme.radius.xl}px;
  padding: ${({ theme }) => theme.spacing.lg}px;
  margin-top: ${({ theme }) => theme.spacing.lg}px;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
  overflow: hidden;
  shadow-color: ${({ theme }) => theme.colors.shadow};
  shadow-offset: 0px 18px;
  shadow-opacity: 0.28;
  shadow-radius: 26px;
  elevation: 10;
`;

export const SummaryGlow = styled.View`
  position: absolute;
  width: 160px;
  height: 160px;
  border-radius: 80px;
  background-color: ${({ theme }) => theme.colors.primarySoft};
  top: -40px;
  right: -32px;
`;

export const SummaryFooter = styled.View`
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.sm}px;
  margin-top: ${({ theme }) => theme.spacing.md}px;
`;

export const SummaryPill = styled.View<{ $tone: 'status' | 'type' }>`
  padding: 8px 12px;
  border-radius: ${({ theme }) => theme.radius.pill}px;
  background-color: ${({ theme, $tone }) =>
    $tone === 'status' ? theme.colors.accentSoft : theme.colors.primarySoft};
`;

export const SummaryPillText = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  font-size: 12px;
  font-weight: 700;
  text-transform: capitalize;
  letter-spacing: 0.4px;
`;

export const Card = styled.View`
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.cardStroke};
  border-radius: ${({ theme }) => theme.radius.xl}px;
  padding: ${({ theme }) => theme.spacing.lg}px;
  shadow-color: ${({ theme }) => theme.colors.shadow};
  shadow-offset: 0px 12px;
  shadow-opacity: 0.18;
  shadow-radius: 18px;
  elevation: 6;
`;

export const Row = styled.View`
  padding: ${({ theme }) => theme.spacing.md}px 0;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.cardStroke};
`;

export const Label = styled.Text`
  color: ${({ theme }) => theme.colors.textSubtle};
  font-size: 12px;
  letter-spacing: 0.7px;
  text-transform: uppercase;
  margin-bottom: 6px;
`;

export const Value = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  font-size: 16px;
  font-weight: 600;
`;

export const StatusText = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  font-size: 16px;
  text-align: center;
`;

export const StatusContainer = styled.View`
  flex: 1;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xl}px;
`;

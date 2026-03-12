import styled from 'styled-components/native';

export const Card = styled.View`
  background-color: ${({ theme }) => theme.colors.surfaceRaised};
  border: 1px solid ${({ theme }) => theme.colors.cardStroke};
  padding: ${({ theme }) => theme.spacing.lg}px;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
  border-radius: ${({ theme }) => theme.radius.xl}px;
  overflow: hidden;
  shadow-color: ${({ theme }) => theme.colors.shadow};
  shadow-offset: 0px 18px;
  shadow-opacity: 0.32;
  shadow-radius: 30px;
  elevation: 12;
`;

export const GlowTop = styled.View`
  position: absolute;
  width: 180px;
  height: 180px;
  border-radius: 90px;
  background-color: ${({ theme }) => theme.colors.primarySoft};
  top: -48px;
  right: -24px;
`;

export const GlowBottom = styled.View`
  position: absolute;
  width: 140px;
  height: 140px;
  border-radius: 70px;
  background-color: ${({ theme }) => theme.colors.accentSoft};
  bottom: -54px;
  left: -22px;
`;

export const HeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

export const Label = styled.Text`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 13px;
  letter-spacing: 1.2px;
  text-transform: uppercase;
`;

export const Value = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  font-size: 38px;
  font-weight: 800;
  letter-spacing: -1.2px;
`;

export const SecurityPill = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
  background-color: rgba(7, 16, 24, 0.42);
  border: 1px solid ${({ theme }) => theme.colors.cardStroke};
  padding: 8px 12px;
  border-radius: ${({ theme }) => theme.radius.pill}px;
`;

export const SecurityDot = styled.View`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.primary};
`;

export const SecurityText = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  font-size: 12px;
  font-weight: 600;
`;

export const FooterRow = styled.View`
  margin-top: ${({ theme }) => theme.spacing.md}px;
  padding-top: ${({ theme }) => theme.spacing.md}px;
  border-top-width: 1px;
  border-top-color: ${({ theme }) => theme.colors.cardStroke};
`;

export const Footnote = styled.Text`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 13px;
`;

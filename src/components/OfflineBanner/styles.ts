import styled from 'styled-components/native';

export const Container = styled.View`
  flex-direction: row;
  align-items: stretch;
  background-color: ${({ theme }) => theme.colors.surfaceAlt};
  border: 1px solid ${({ theme }) => theme.colors.cardStroke};
  border-radius: ${({ theme }) => theme.radius.lg}px;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
  overflow: hidden;
`;

export const AccentBar = styled.View`
  width: 6px;
  background-color: ${({ theme }) => theme.colors.warning};
`;

export const Content = styled.View`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.md}px;
`;

export const Label = styled.Text`
  color: ${({ theme }) => theme.colors.warning};
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin-bottom: 4px;
`;

export const Text = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  font-size: 13px;
  line-height: 18px;
`;

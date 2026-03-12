import styled from 'styled-components/native';

import type { TransactionStatus, TransactionType } from './types';

export const Container = styled.Pressable`
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.md}px;
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.cardStroke};
  border-radius: ${({ theme }) => theme.radius.lg}px;
  padding: ${({ theme }) => theme.spacing.md}px;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
  min-height: 102px;
  shadow-color: ${({ theme }) => theme.colors.shadow};
  shadow-offset: 0px 12px;
  shadow-opacity: 0.16;
  shadow-radius: 20px;
  elevation: 6;
`;

export const IconWrap = styled.View<{ $type: TransactionType }>`
  width: 48px;
  height: 48px;
  border-radius: 24px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme, $type }) =>
    $type === 'credit' ? theme.colors.successSoft : theme.colors.primarySoft};
  border-width: 1px;
  border-color: ${({ theme, $type }) =>
    $type === 'credit' ? theme.colors.success : theme.colors.primary};
`;

export const IconText = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  font-size: 20px;
  font-weight: 700;
`;

export const Content = styled.View`
  flex: 1;
`;

export const TopRow = styled.View`
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md}px;
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
`;

export const MetaRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing.sm}px;
  gap: ${({ theme }) => theme.spacing.md}px;
`;

export const Title = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  font-size: 16px;
  font-weight: 600;
  flex: 1;
`;

export const Subtitle = styled.Text`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 13px;
  line-height: 18px;
`;

export const DateText = styled.Text`
  color: ${({ theme }) => theme.colors.textSubtle};
  font-size: 12px;
`;

export const AmountChip = styled.View<{ $type: TransactionType }>`
  background-color: ${({ theme, $type }) =>
    $type === 'credit' ? theme.colors.successSoft : theme.colors.primarySoft};
  padding: 8px 10px;
  border-radius: ${({ theme }) => theme.radius.pill}px;
  align-items: flex-end;
`;

export const Amount = styled.Text<{ $type: TransactionType }>`
  color: ${({ theme, $type }) =>
    $type === 'credit' ? theme.colors.success : theme.colors.primary};
  font-size: 14px;
  font-weight: 700;
`;

export const StatusPill = styled.View<{ $status: TransactionStatus }>`
  padding: 6px 10px;
  border-radius: ${({ theme }) => theme.radius.pill}px;
  background-color: ${({ theme, $status }) => {
    if ($status === 'completed') return theme.colors.accentSoft;
    if ($status === 'pending') return theme.colors.warningSoft;
    return theme.colors.dangerSoft;
  }};
`;

export const StatusText = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  font-size: 11px;
  font-weight: 700;
  text-transform: capitalize;
  letter-spacing: 0.4px;
`;

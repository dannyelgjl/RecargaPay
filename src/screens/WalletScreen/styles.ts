import React from 'react';
import { FlatList, type FlatListProps } from 'react-native';
import styled from 'styled-components/native';
import type { TransactionItem } from '../../store/wallet/slice/walletSlice';

type TransactionsListProps = FlatListProps<TransactionItem>;

const BaseTransactionsList = React.forwardRef<
  FlatList<TransactionItem>,
  TransactionsListProps
>((props, ref) =>
  React.createElement(
    FlatList as React.ComponentType<
      TransactionsListProps & React.RefAttributes<FlatList<TransactionItem>>
    >,
    {
      ...props,
      ref,
    },
  ),
);

BaseTransactionsList.displayName = 'BaseTransactionsList';

export const TransactionsList = styled(
  BaseTransactionsList,
).attrs<TransactionsListProps>(() => ({
  contentContainerStyle: {
    padding: 20,
    paddingBottom: 40,
  },
}))``;

export const SafeArea = styled.SafeAreaView`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const BackgroundLayer = styled.View`
  position: absolute;
  inset: 0;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const GlowTop = styled.View`
  position: absolute;
  width: 280px;
  height: 280px;
  border-radius: 140px;
  background-color: ${({ theme }) => theme.colors.primarySoft};
  top: -110px;
  right: -80px;
`;

export const GlowBottom = styled.View`
  position: absolute;
  width: 320px;
  height: 320px;
  border-radius: 160px;
  background-color: ${({ theme }) => theme.colors.accentSoft};
  bottom: -150px;
  left: -120px;
`;

export const CenteredContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.spacing.lg}px;
`;

export const LoadingText = styled.Text`
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: ${({ theme }) => theme.spacing.md}px;
  font-size: 16px;
`;

export const HeaderBlock = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

export const Eyebrow = styled.Text`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  margin-bottom: 10px;
`;

export const HeaderTitle = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  font-size: 34px;
  font-weight: 800;
  line-height: 40px;
  letter-spacing: -1.1px;
  margin-bottom: 10px;
`;

export const HeaderDescription = styled.Text`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 15px;
  line-height: 22px;
`;

export const ErrorText = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  font-size: 18px;
  font-weight: 700;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

export const ErrorDetail = styled.Text`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 14px;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
  text-align: center;
`;

export const RetryButton = styled.Pressable`
  background-color: ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => theme.spacing.sm}px
    ${({ theme }) => theme.spacing.lg}px;
  border-radius: ${({ theme }) => theme.radius.md}px;
`;

export const RetryButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: 600;
`;

export const MetaCard = styled.View`
  background-color: ${({ theme }) => theme.colors.surfaceAlt};
  border: 1px solid ${({ theme }) => theme.colors.cardStroke};
  border-radius: ${({ theme }) => theme.radius.lg}px;
  padding: ${({ theme }) => theme.spacing.lg}px;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
  gap: ${({ theme }) => theme.spacing.sm}px;
  shadow-color: ${({ theme }) => theme.colors.shadow};
  shadow-offset: 0px 12px;
  shadow-opacity: 0.14;
  shadow-radius: 18px;
  elevation: 4;
`;

export const MetaRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md}px;
`;

export const MetaLabel = styled.Text`
  color: ${({ theme }) => theme.colors.textSubtle};
  font-size: 12px;
  letter-spacing: 0.6px;
  text-transform: uppercase;
`;

export const MetaValue = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  font-weight: 600;
  flex: 1;
  text-align: right;
`;

export const SectionHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

export const SectionTitle = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.4px;
`;

export const SectionCaption = styled.Text`
  color: ${({ theme }) => theme.colors.textSubtle};
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.8px;
`;

export const EmptyText = styled.Text`
  color: ${({ theme }) => theme.colors.textMuted};
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing.xl}px;
  font-size: 15px;
`;

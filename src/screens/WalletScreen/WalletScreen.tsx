import React from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  type ListRenderItemInfo,
} from 'react-native';

import { BalanceCard } from '../../components/BalanceCard/BalanceCard';
import { OfflineBanner } from '../../components/OfflineBanner/OfflineBanner';
import { TransactionRow } from '../../components/TransactionRow/TransactionRow';
import * as S from './styles';
import type { WalletListData, WalletScreenProps } from './types';
import { useContainer } from './useContainer';
import { useI18n } from '../../i18n';
import type { TransactionItem } from '../../store/wallet/slice/walletSlice';

export function WalletScreen(_: WalletScreenProps) {
  const { t } = useI18n();
  const {
    balance,
    deviceLanguage,
    error,
    handleListScroll,
    handlePressTransaction,
    handleRefresh,
    isConnected,
    isInitialLoading,
    isOfflineSnapshot,
    isRefreshing,
    lastSyncedAt,
    shouldShowRetry,
    transactions,
  } = useContainer();

  if (isInitialLoading) {
    return (
      <S.CenteredContainer>
        <ActivityIndicator size="large" />
        <S.LoadingText>{t('wallet.loading')}</S.LoadingText>
      </S.CenteredContainer>
    );
  }

  if (shouldShowRetry) {
    return (
      <S.CenteredContainer>
        <S.ErrorText>{t('wallet.loadErrorTitle')}</S.ErrorText>
        <S.ErrorDetail>{error}</S.ErrorDetail>
        <S.RetryButton onPress={handleRefresh}>
          <S.RetryButtonText>{t('common.retry')}</S.RetryButtonText>
        </S.RetryButton>
      </S.CenteredContainer>
    );
  }

  return (
    <S.SafeArea>
      <S.BackgroundLayer>
        <S.GlowTop />
        <S.GlowBottom />
      </S.BackgroundLayer>

      <S.TransactionsList
        data={transactions}
        keyExtractor={(item: TransactionItem) => item.id}
        initialNumToRender={12}
        maxToRenderPerBatch={12}
        updateCellsBatchingPeriod={32}
        removeClippedSubviews
        windowSize={7}
        onScrollBeginDrag={handleListScroll}
        getItemLayout={(_data: WalletListData, index: number) => ({
          length: 96,
          offset: 96 * index,
          index,
        })}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
        ListHeaderComponent={
          <>
            <S.HeaderBlock>
              <S.Eyebrow>{t('wallet.headerEyebrow')}</S.Eyebrow>
              <S.HeaderTitle>{t('wallet.headerTitle')}</S.HeaderTitle>
              <S.HeaderDescription>
                {t('wallet.headerDescription')}
              </S.HeaderDescription>
            </S.HeaderBlock>
            <OfflineBanner
              visible={Boolean(
                isOfflineSnapshot || (!isConnected && balance !== null),
              )}
              lastSyncedAt={lastSyncedAt}
              isConnected={isConnected}
            />
            <BalanceCard balance={balance} />
            <S.MetaCard>
              <S.MetaRow>
                <S.MetaLabel>{t('wallet.systemLanguage')}</S.MetaLabel>
                <S.MetaValue>{deviceLanguage}</S.MetaValue>
              </S.MetaRow>
              <S.MetaRow>
                <S.MetaLabel>{t('wallet.lastSync')}</S.MetaLabel>
                <S.MetaValue>
                  {lastSyncedAt
                    ? new Date(lastSyncedAt).toLocaleString()
                    : t('wallet.notSyncedYet')}
                </S.MetaValue>
              </S.MetaRow>
            </S.MetaCard>
            <S.SectionHeader>
              <S.SectionTitle>{t('wallet.transactions')}</S.SectionTitle>
              <S.SectionCaption>
                {t('wallet.itemsCount', { count: transactions.length })}
              </S.SectionCaption>
            </S.SectionHeader>
          </>
        }
        renderItem={({ item }: ListRenderItemInfo<TransactionItem>) => (
          <TransactionRow
            item={item}
            onPress={() => handlePressTransaction(item)}
          />
        )}
        ListEmptyComponent={<S.EmptyText>{t('wallet.empty')}</S.EmptyText>}
      />
    </S.SafeArea>
  );
}

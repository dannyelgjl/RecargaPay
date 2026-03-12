import React from 'react';

import { formatCurrency, formatDate } from '../../utils/formats/formats';
import * as S from './styles';
import type { TransactionDetailScreenProps } from './types';
import { useContainer } from './useContainer';
import { useI18n } from '../../i18n';

export function TransactionDetailScreen(props: TransactionDetailScreenProps) {
  const { formatLocale, t } = useI18n();
  const { detailError, handleTouchStart, isDetailLoading, transaction } =
    useContainer(props);

  if (isDetailLoading && !transaction) {
    return (
      <S.Container>
        <S.StatusContainer>
          <S.StatusText>{t('detail.loading')}</S.StatusText>
        </S.StatusContainer>
      </S.Container>
    );
  }

  if (detailError && !transaction) {
    return (
      <S.Container>
        <S.StatusContainer>
          <S.StatusText>{detailError}</S.StatusText>
        </S.StatusContainer>
      </S.Container>
    );
  }

  if (!transaction) {
    return (
      <S.Container>
        <S.StatusContainer>
          <S.StatusText>{t('detail.notAvailableOffline')}</S.StatusText>
        </S.StatusContainer>
      </S.Container>
    );
  }

  return (
    <S.Container onTouchStart={handleTouchStart}>
      <S.BackgroundLayer>
        <S.GlowTop />
        <S.GlowBottom />
      </S.BackgroundLayer>

      <S.Content>
        <S.Eyebrow>{t('detail.eyebrow')}</S.Eyebrow>

        <S.SummaryCard>
          <S.SummaryGlow />
          <S.Title>{transaction.title}</S.Title>
          <S.Amount>
            {formatCurrency(transaction.amount, formatLocale)}
          </S.Amount>
          <S.SummaryFooter>
            <S.SummaryPill $tone="status">
              <S.SummaryPillText>
                {t(`transaction.status.${transaction.status}`)}
              </S.SummaryPillText>
            </S.SummaryPill>
            <S.SummaryPill $tone="type">
              <S.SummaryPillText>
                {t(`transaction.type.${transaction.type}`)}
              </S.SummaryPillText>
            </S.SummaryPill>
          </S.SummaryFooter>
        </S.SummaryCard>

        <S.Card>
          <S.Row>
            <S.Label>{t('detail.description')}</S.Label>
            <S.Value>{transaction.description}</S.Value>
          </S.Row>
          <S.Row>
            <S.Label>{t('detail.date')}</S.Label>
            <S.Value>{formatDate(transaction.createdAt, formatLocale)}</S.Value>
          </S.Row>
          <S.Row>
            <S.Label>{t('detail.reference')}</S.Label>
            <S.Value>{transaction.reference}</S.Value>
          </S.Row>
          <S.Row>
            <S.Label>{t('detail.category')}</S.Label>
            <S.Value>{transaction.category}</S.Value>
          </S.Row>
          <S.Row>
            <S.Label>{t('detail.recipient')}</S.Label>
            <S.Value>{transaction.recipient}</S.Value>
          </S.Row>
        </S.Card>
      </S.Content>
    </S.Container>
  );
}

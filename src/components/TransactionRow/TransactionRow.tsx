import React, { memo } from 'react';

import { formatDate, formatCurrency } from '../../utils/formats/formats';
import { useI18n } from '../../i18n';
import * as S from './styles';
import type { TransactionRowProps } from './types';

function TransactionRowComponent({ item, onPress }: TransactionRowProps) {
  const { formatLocale, t } = useI18n();

  return (
    <S.Container onPress={onPress}>
      <S.IconWrap $type={item.type}>
        <S.IconText>{item.type === 'credit' ? '+' : '-'}</S.IconText>
      </S.IconWrap>

      <S.Content>
        <S.TopRow>
          <S.Title numberOfLines={1}>{item.title}</S.Title>
          <S.AmountChip $type={item.type}>
            <S.Amount $type={item.type}>
              {formatCurrency(item.amount, formatLocale)}
            </S.Amount>
          </S.AmountChip>
        </S.TopRow>

        <S.Subtitle numberOfLines={1}>{item.description}</S.Subtitle>

        <S.MetaRow>
          <S.StatusPill $status={item.status}>
            <S.StatusText>
              {t(`transaction.status.${item.status}`)}
            </S.StatusText>
          </S.StatusPill>
          <S.DateText>{formatDate(item.createdAt, formatLocale)}</S.DateText>
        </S.MetaRow>
      </S.Content>
    </S.Container>
  );
}

export const TransactionRow = memo(TransactionRowComponent);

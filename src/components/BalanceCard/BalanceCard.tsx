import React from 'react';

import { formatCurrency } from '../../utils/formats/formats';
import { useI18n } from '../../i18n';
import * as S from './styles';
import type { IBalanceCardProps } from './types';

export function BalanceCard({ balance }: IBalanceCardProps) {
  const { formatLocale, t } = useI18n();

  return (
    <S.Card>
      <S.GlowTop />
      <S.GlowBottom />
      <S.HeaderRow>
        <S.Label>{t('wallet.balanceLabel')}</S.Label>
        <S.SecurityPill>
          <S.SecurityDot />
          <S.SecurityText>{t('wallet.balanceProtected')}</S.SecurityText>
        </S.SecurityPill>
      </S.HeaderRow>
      <S.Value>
        {balance === null ? '--' : formatCurrency(balance, formatLocale)}
      </S.Value>
      <S.FooterRow>
        <S.Footnote>{t('wallet.balanceFootnote')}</S.Footnote>
      </S.FooterRow>
    </S.Card>
  );
}

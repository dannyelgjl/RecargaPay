import React from 'react';

import { useI18n } from '../../i18n';
import * as S from './styles';
import type { OfflineBannerProps } from './types';

export function OfflineBanner({
  visible,
  lastSyncedAt,
  isConnected,
}: OfflineBannerProps) {
  const { t } = useI18n();

  if (!visible) return null;

  return (
    <S.Container>
      <S.AccentBar />
      <S.Content>
        <S.Label>
          {isConnected
            ? t('wallet.offlineLabelSyncing')
            : t('wallet.offlineLabelOffline')}
        </S.Label>
        <S.Text>
          {isConnected
            ? t('wallet.offlineMessageSyncing')
            : t('wallet.offlineMessageOffline')}
          {lastSyncedAt ? ` • ${new Date(lastSyncedAt).toLocaleString()}` : ''}
        </S.Text>
      </S.Content>
    </S.Container>
  );
}

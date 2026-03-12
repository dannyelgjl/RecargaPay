import React from 'react';

import { KEYS, PIN_LENGTH } from './mock';
import type { UnlockScreenProps } from './types';
import * as S from './styles';
import { useContainer } from './useContainer';
import { useI18n } from '../../i18n';

export function UnlockScreen(_props: UnlockScreenProps) {
  const { t } = useI18n();
  const {
    canDelete,
    error,
    handleCancel,
    handleDelete,
    handlePressDigit,
    isSubmitting,
    pin,
  } = useContainer();

  return (
    <S.Container>
      <S.BackgroundOverlay />
      <S.GlowTop />
      <S.GlowBottom />

      <S.SafeArea>
        <S.ScrollArea>
          <S.TopArea>
            <S.LockCapsule>
              <S.LockSymbol>◎</S.LockSymbol>
              <S.LockText>{t('pin.secureWallet')}</S.LockText>
            </S.LockCapsule>
          </S.TopArea>

          <S.Content>
            <S.Title>{t('unlock.title')}</S.Title>
            <S.Subtitle>{t('unlock.subtitle')}</S.Subtitle>
            <S.HintPill>
              <S.HintText>{t('unlock.hint')}</S.HintText>
            </S.HintPill>

            <S.IndicatorsRow>
              {Array.from({ length: PIN_LENGTH }).map((_, index) => {
                const filled = index < pin.length;
                return <S.Indicator key={index} $filled={filled} />;
              })}
            </S.IndicatorsRow>

            {!!error && <S.ErrorText>{error}</S.ErrorText>}
          </S.Content>

          <S.KeypadShell>
            <S.Keypad>
              {KEYS.map((row, rowIndex) => (
                <S.Row key={rowIndex}>
                  {row.map((keyItem, colIndex) => {
                    if (
                      keyItem.type === 'action' &&
                      keyItem.value === 'empty'
                    ) {
                      return <S.Spacer key={`${rowIndex}-${colIndex}`} />;
                    }

                    if (
                      keyItem.type === 'action' &&
                      keyItem.value === 'delete'
                    ) {
                      return (
                        <S.BottomActionWrapper key={`${rowIndex}-${colIndex}`}>
                          {canDelete ? (
                            <S.BottomActionButton onPress={handleDelete}>
                              <S.BottomActionText>
                                {t('common.delete')}
                              </S.BottomActionText>
                            </S.BottomActionButton>
                          ) : (
                            <S.BottomActionButton onPress={handleCancel}>
                              <S.BottomActionText>
                                {t('common.cancel')}
                              </S.BottomActionText>
                            </S.BottomActionButton>
                          )}
                        </S.BottomActionWrapper>
                      );
                    }

                    return (
                      <S.DigitButton
                        key={`${rowIndex}-${colIndex}`}
                        onPress={() => handlePressDigit(keyItem.value)}
                        disabled={isSubmitting}
                      >
                        <S.DigitText>{keyItem.value}</S.DigitText>
                        {!!keyItem.letters && (
                          <S.LettersText>{keyItem.letters}</S.LettersText>
                        )}
                      </S.DigitButton>
                    );
                  })}
                </S.Row>
              ))}
            </S.Keypad>
          </S.KeypadShell>

          <S.FooterRow>
            <S.FooterText>{t('unlock.footerLeft')}</S.FooterText>
            <S.FooterText>
              {canDelete
                ? t('unlock.footerSecureInput')
                : t('unlock.footerCancel')}
            </S.FooterText>
          </S.FooterRow>
        </S.ScrollArea>
      </S.SafeArea>
    </S.Container>
  );
}

import React from 'react';

import { KEYS, PIN_LENGTH } from './mock';
import * as S from './styles';
import type { CreatePinScreenProps } from './types';
import { useContainer } from './useContainer';
import { useI18n } from '../../i18n';

export function CreatePinScreen(props: CreatePinScreenProps) {
  const { t } = useI18n();
  const { canDelete, handleDelete, handlePressDigit, pin } =
    useContainer(props);

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
            <S.Title>{t('create.title')}</S.Title>
            <S.Subtitle>{t('create.subtitle')}</S.Subtitle>
            <S.HintPill>
              <S.HintText>{t('create.hint')}</S.HintText>
            </S.HintPill>

            <S.IndicatorsRow>
              {Array.from({ length: PIN_LENGTH }).map((_, index) => {
                const filled = index < pin.length;
                return <S.Indicator key={index} $filled={filled} />;
              })}
            </S.IndicatorsRow>
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
                            <S.BottomActionButton disabled>
                              <S.BottomActionTextHidden>
                                {t('common.delete')}
                              </S.BottomActionTextHidden>
                            </S.BottomActionButton>
                          )}
                        </S.BottomActionWrapper>
                      );
                    }

                    return (
                      <S.DigitButton
                        key={`${rowIndex}-${colIndex}`}
                        onPress={() => handlePressDigit(keyItem.value)}
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
            <S.FooterText>{t('create.footerLeft')}</S.FooterText>
            <S.FooterText>{t('create.footerRight')}</S.FooterText>
          </S.FooterRow>
        </S.ScrollArea>
      </S.SafeArea>
    </S.Container>
  );
}

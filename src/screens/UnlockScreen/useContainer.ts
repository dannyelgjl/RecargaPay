import { Alert } from 'react-native';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { unlockWithPin } from '../../services/auth/authService';
import { selectFailedAttempts } from '../../store/auth/selector/authSelector';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { PIN_LENGTH } from './mock';
import { useI18n } from '../../i18n';

export const useContainer = () => {
  const dispatch = useAppDispatch();
  const failedAttempts = useAppSelector(selectFailedAttempts);
  const { t } = useI18n();

  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canDelete = useMemo(() => pin.length > 0, [pin]);

  const handlePressDigit = (digit: string) => {
    if (isSubmitting || pin.length >= PIN_LENGTH) {
      return;
    }

    setError('');
    setPin(prev => `${prev}${digit}`);
  };

  const handleDelete = () => {
    if (isSubmitting) {
      return;
    }

    setError('');
    setPin(prev => prev.slice(0, -1));
  };

  const handleCancel = () => {
    Alert.alert(
      t('unlock.alertTitle'),
      t('unlock.alertMessage'),
    );
  };

  const handleSubmit = useCallback(
    async (finalPin: string) => {
      try {
        setIsSubmitting(true);
        const result = await dispatch(unlockWithPin(finalPin)).unwrap();

        if (!result.success) {
          setError(
            t('unlock.errorIncorrectAttempts', {
              attempts: failedAttempts + 1,
            }),
          );
          setPin('');
        }
      } catch {
        setError(t('unlock.errorUnable'));
        setPin('');
      } finally {
        setIsSubmitting(false);
      }
    },
    [dispatch, failedAttempts, t],
  );

  useEffect(() => {
    if (pin.length === PIN_LENGTH) {
      handleSubmit(pin);
    }
  }, [handleSubmit, pin]);

  return {
    canDelete,
    error,
    handleCancel,
    handleDelete,
    handlePressDigit,
    isSubmitting,
    pin,
  };
};

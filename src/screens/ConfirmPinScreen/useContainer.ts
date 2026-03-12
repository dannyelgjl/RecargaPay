import { selectPendingPin } from '../../store/auth/selector/authSelector';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { createPin } from '../../services/auth/authService';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { PIN_LENGTH } from './mock';
import { useI18n } from '../../i18n';

export const useContainer = () => {
  const dispatch = useAppDispatch();
  const pendingPin = useAppSelector(selectPendingPin);
  const { t } = useI18n();

  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canDelete = useMemo(() => pin.length > 0, [pin]);

  const handlePressDigit = (digit: string) => {
    if (isSubmitting) return;
    if (pin.length >= PIN_LENGTH) return;

    setError(null);
    setPin(prev => `${prev}${digit}`);
  };

  const handleDelete = () => {
    if (isSubmitting) return;
    setError(null);
    setPin(prev => prev.slice(0, -1));
  };

  const handleConfirm = useCallback(
    async (finalPin: string) => {
      if (!pendingPin) {
        setError(t('confirm.errorMissingState'));
        setPin('');
        return;
      }

      if (finalPin !== pendingPin) {
        setError(t('confirm.errorMismatch'));
        setPin('');
        return;
      }

      try {
        setIsSubmitting(true);
        await dispatch(createPin(finalPin)).unwrap();
      } catch {
        setError(t('confirm.errorUnableSave'));
        setPin('');
      } finally {
        setIsSubmitting(false);
      }
    },
    [dispatch, pendingPin, t],
  );

  useEffect(() => {
    if (pin.length === PIN_LENGTH) {
      handleConfirm(pin);
    }
  }, [handleConfirm, pin]);

  return {
    error,
    pin,
    canDelete,
    handlePressDigit,
    handleDelete,
    isSubmitting,
  };
};

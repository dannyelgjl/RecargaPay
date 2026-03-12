import { useEffect, useMemo, useState } from 'react';

import { setPendingPin } from '../../store/auth/slice/authSlice';
import { useAppDispatch } from '../../store/hooks';
import { PIN_LENGTH } from './mock';
import type { CreatePinScreenProps } from './types';

export const useContainer = ({ navigation }: CreatePinScreenProps) => {
  const dispatch = useAppDispatch();
  const [pin, setPin] = useState('');

  const canDelete = useMemo(() => pin.length > 0, [pin]);

  const handlePressDigit = (digit: string) => {
    if (pin.length >= PIN_LENGTH) {
      return;
    }

    setPin(prev => `${prev}${digit}`);
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
  };

  useEffect(() => {
    if (pin.length === PIN_LENGTH) {
      dispatch(setPendingPin(pin));
      navigation.navigate('ConfirmPin');
    }
  }, [dispatch, navigation, pin]);

  return {
    canDelete,
    handleDelete,
    handlePressDigit,
    pin,
  };
};

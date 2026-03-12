import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import styled from 'styled-components/native';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import {
  selectIsUnlocked,
  selectHasPin,
  selectIsBootstrapped,
} from '../store/auth/selector/authSelector';
import { CreatePinScreen } from '../screens/CreatePinScreen';
import { ConfirmPinScreen } from '../screens/ConfirmPinScreen/ConfirmPinScreen';
import { UnlockScreen } from '../screens/UnlockScreen/UnlockScreen';
import { WalletScreen } from '../screens/WalletScreen/WalletScreen';
import { TransactionDetailScreen } from '../screens/TransactionDetailScreen/TransactionDetailScreen';
import { useSessionGuard } from '../services/auth/useSessionGuard';
import { bootstrapAuth } from '../services/auth/authService';
import { RootStackParamList } from './types';
import { analytics } from '../feature/analytics/analytics';
import { useI18n } from '../i18n';

const Stack = createNativeStackNavigator<RootStackParamList>();

function SplashScreen() {
  const { t } = useI18n();

  return (
    <Splash>
      <SplashText>{t('root.loadingWallet')}</SplashText>
    </Splash>
  );
}

export function RootNavigator() {
  const dispatch = useAppDispatch();

  const isBootstrapped = useAppSelector(selectIsBootstrapped);
  const hasPin = useAppSelector(selectHasPin);
  const isUnlocked = useAppSelector(selectIsUnlocked);

  useSessionGuard();

  useEffect(() => {
    analytics.track({ name: 'app_opened' });
    dispatch(bootstrapAuth());
  }, [dispatch]);

  if (!isBootstrapped) {
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!hasPin ? (
        <>
          <Stack.Screen name="CreatePin" component={CreatePinScreen} />
          <Stack.Screen name="ConfirmPin" component={ConfirmPinScreen} />
        </>
      ) : !isUnlocked ? (
        <Stack.Screen name="Unlock" component={UnlockScreen} />
      ) : (
        <>
          <Stack.Screen name="Wallet" component={WalletScreen} />
          <Stack.Screen
            name="TransactionDetail"
            component={TransactionDetailScreen}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
const Splash = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.background};
`;

const SplashText = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  font-size: 16px;
`;

import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from './auth/slice/authSlice';
import { walletReducer } from './wallet/slice/walletSlice';
import { connectivityReducer } from './connectivity/slice/connectivitySlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    wallet: walletReducer,
    connectivity: connectivityReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

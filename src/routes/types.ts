import { ParamListBase } from '@react-navigation/native';

export interface RootStackParamList extends ParamListBase {
  CreatePin: undefined;
  ConfirmPin: undefined;
  Unlock: undefined;
  Wallet: undefined;
  TransactionDetail: { transactionId: string };
}

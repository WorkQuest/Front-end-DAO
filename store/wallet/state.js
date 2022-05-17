import { TokenSymbols } from '~/utils/enums';

export default () => ({
  transactions: [],
  transactionsCount: 0,
  isWalletConnected: false,
  callbackLayout: 'default',
  isOnlyConfirm: false, // for confirm password layout
  selectedToken: TokenSymbols.WQT,
  balance: { WQT: { balance: 0, fullBalance: 0, decimals: 18 } },
});

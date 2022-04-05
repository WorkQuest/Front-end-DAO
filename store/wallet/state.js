import { TokenSymbols } from '~/utils/enums';

export default () => ({
  userWalletAddressInBech32: null,
  transactions: [],
  transactionsCount: 0,
  isWalletConnected: false,
  callbackLayout: 'default',
  isOnlyConfirm: false, // for confirm password layout
  selectedToken: TokenSymbols.WUSD,
  balance: {
    WQT: {
      balance: 0, // Display balance
      fullBalance: 0,
    },
    WUSD: {
      balance: 0,
      fullBalance: 0,
    },
  },

  isChairpersonRole: false,
  chairpersonRoleHash: null,
});

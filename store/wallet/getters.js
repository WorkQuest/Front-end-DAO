export default {
  getUserWalletAddressInBech32: (state) => state.userWalletAddressInBech32,
  getTransactions: (state) => state.transactions,
  getTransactionsCount: (state) => state.transactionsCount,
  getIsWalletConnected: (state) => state.isWalletConnected,
  getCallbackLayout: (state) => state.callbackLayout,
  getIsOnlyConfirm: (state) => state.isOnlyConfirm,
  getBalanceData: (state) => state.balance,
  getSelectedToken: (state) => state.selectedToken,

  isChairpersonRole: (state) => state.isChairpersonRole,
  chairpersonRoleHash: (state) => state.chairpersonRoleHash,
};

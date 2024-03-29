export default {
  getTransactions: (state) => state.transactions,
  getTransactionsCount: (state) => state.transactionsCount,
  getIsWalletConnected: (state) => state.isWalletConnected,
  getCallbackLayout: (state) => state.callbackLayout,
  getIsOnlyConfirm: (state) => state.isOnlyConfirm,
  getBalanceData: (state) => state.balance,
  getBalanceWQT: (state) => state.balance.WQT.balance,
  getSelectedToken: (state) => state.selectedToken,
  getSelectedNetwork: (state) => state.selectedNetwork,
  getPendingHashLink: (state) => state.pendingHashLink,
};

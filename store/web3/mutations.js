export default {
  setWalletIsConnected(state, payload) {
    state.walletIsConnected = payload;
  },
  setIsChairpersonRole(state, payload) {
    state.isChairpersonRole = payload;
  },
  setChairpersonRoleHash(state, payload) {
    state.chairpersonRoleHash = payload;
  },
};

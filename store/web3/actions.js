import {
  connectToMetamask, handleMetamaskStatus, getIsHandlingStatus, disconnect, getAccount,
} from '~/utils/web3';

export default {
  async connectMetamask({ commit, dispatch }, isReconnection = false) {
    const connectRes = await connectToMetamask();
    if (connectRes.ok) {
      commit('setWalletIsConnected', true);
      if (!getIsHandlingStatus()) {
        handleMetamaskStatus(() => { dispatch('reconnectMetamask'); });
      }
    }
  },
  async reconnectMetamask({ dispatch }) {
    await dispatch('disconnect');
    await dispatch('connectMetamask', true);
  },
  async disconnect({ commit }) {
    disconnect();
    commit('setWalletIsConnected', false);
  },
  getAccount() {
    return getAccount();
  },
};

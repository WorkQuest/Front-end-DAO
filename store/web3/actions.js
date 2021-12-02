import {
  connectToMetamask,
  handleMetamaskStatus,
  getIsHandlingStatus,
  disconnect,
  getAccount,
  addProposal,
  getChainIdByChain,
  goToChain,
} from '~/utils/web3';
import modals from '~/store/modals/modals';

export default {
  async chainIsCompareToCurrent({ dispatch }, chain) {
    return +getChainIdByChain(chain) === +getAccount().chainId;
  },
  async goToChain({ commit }, { chain }) {
    return await goToChain(chain);
  },
  async checkMetamaskStatus({ getters, dispatch }, chain) {
    if (!getters.getWalletIsConnected) {
      if (typeof window.ethereum === 'undefined') {
        this.ShowModal({
          key: modals.status,
          img: '~assets/img/ui/cardHasBeenAdded.svg',
          title: 'Please install Metamask!',
          subtitle: 'Please click install...',
          button: 'Install',
          type: 'installMetamask',
        });
      } else {
        const connected = await dispatch('connectMetamask');
        if (connected) await dispatch('goToChain', { chain });
      }
    }
  },
  async connectMetamask({ commit, dispatch }, isReconnection = false) {
    const connectRes = await connectToMetamask();
    if (connectRes.ok) {
      commit('setWalletIsConnected', true);
      if (!getIsHandlingStatus()) {
        handleMetamaskStatus(() => { dispatch('reconnectMetamask'); });
      }
      return true;
    }
    return false;
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

  /* Proposals */
  async addProposal({ commit }, { address, description }) {
    return await addProposal(address, description);
  },
};

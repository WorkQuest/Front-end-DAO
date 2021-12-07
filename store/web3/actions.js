import {
  connectToMetamask,
  handleMetamaskStatus,
  getIsHandlingStatus,
  disconnect,
  getAccount,
  addProposal,
  getChainIdByChain,
  goToChain, getProposals, getProposalInfoById, doVote, delegate, getBalance, getVoteThreshold, getVotes, getReceipt,
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

  /* WQToken */
  async getBalance() {
    return await getBalance();
  },
  async delegate({ commit }, { address, amount }) {
    return await delegate(address, amount);
  },

  /* Proposals */
  async addProposal({ commit }, description) {
    return await addProposal(description);
  },
  async getProposals({ commit }, { offset, limit }) {
    return await getProposals(offset, limit);
  },
  async getProposalInfoById({ commit }, id) {
    return await getProposalInfoById(id);
  },
  async doVote({ commit }, { id, value }) {
    return await doVote(id, value);
  },
  async getVoteThreshold() { // minimum delegate amount
    return await getVoteThreshold();
  },
  async getVotes({ commit }, address) { // delegated to address
    return await getVotes(address);
  },
  async getReceipt({ commit }, { id, accountAddress }) {
    return await getReceipt(id, accountAddress);
  },
};

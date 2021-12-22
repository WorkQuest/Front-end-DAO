import {
  connectToMetamask,
  handleMetamaskStatus,
  getIsHandlingStatus,
  disconnect,
  getAccount,
  addProposal,
  getChainIdByChain,
  goToChain,
  getProposalInfoById,
  doVote,
  delegate,
  getBalance,
  getVoteThreshold,
  getVotes,
  getReceipt,
  getProposalThreshold,
  executeVoting,
  getChairpersonHash,
  hasRole,
  undelegate,
  voteResults,
} from '~/utils/web3';
import modals from '~/store/modals/modals';
import { error, success } from '~/utils/success-error';
import { errorCodes } from '~/utils/enums';

export default {
  async chainIsCompareToCurrent({ dispatch }, chain) {
    return +getChainIdByChain(chain) === +getAccount().chainId;
  },
  async goToChain({ commit }, chain) {
    return await goToChain(chain);
  },
  // mobile browser check
  // false - desktop, true - mobile && !metamask
  checkIsMobileMetamaskNeed() {
    if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      return false;
    }
    if (typeof window.ethereum === 'undefined') {
      return true;
    }
    return false;
  },
  async checkMetamaskStatus({ getters, dispatch, commit }, chain) {
    if (typeof window.ethereum === 'undefined') {
      this.ShowModal({
        key: modals.status,
        title: 'Please install Metamask!',
        subtitle: 'Please click install...',
        button: 'Install',
        type: 'installMetamask',
      });
      return error(errorCodes.MetamaskIsNotInstalled);
    }
    const connectionRes = await dispatch('connectMetamask');
    if (connectionRes?.code === errorCodes.WrongChainId) {
      if (!chain) return success();
      const rightChain = await dispatch('chainIsCompareToCurrent', chain);
      if (rightChain) {
        return success();
      }
      const switchChainRes = await dispatch('goToChain', chain);
      if (switchChainRes.ok) {
        await dispatch('connectMetamask');
        return success();
      }
      commit('setWalletIsConnected', false);
      return error(errorCodes.WrongChainId);
    }
    if (connectionRes.ok) {
      commit('setWalletIsConnected', true);
      return success();
    }
    return error(connectionRes.code);
  },
  async connectMetamask({ commit, dispatch }) {
    const connectRes = await connectToMetamask();
    if (connectRes.ok) {
      commit('setAccount', connectRes.result);
      commit('setWalletIsConnected', true);
      if (!getIsHandlingStatus()) {
        handleMetamaskStatus(() => { dispatch('reconnectMetamask'); });
      }
    }
    return connectRes;
  },
  async reconnectMetamask({ dispatch }) {
    await dispatch('disconnect');
    await dispatch('connectMetamask');
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
  async undelegate({ commit }) {
    return await undelegate();
  },

  /* Proposals */
  async addProposal({ commit }, { description, nonce }) {
    return await addProposal(description, nonce);
  },
  async getProposalInfoById({ commit }, id) {
    return await getProposalInfoById(id);
  },
  async doVote({ commit }, { id, value }) {
    return await doVote(id, value);
  },
  async getVoteThreshold() {
    return await getVoteThreshold();
  },
  async getProposalThreshold() {
    return await getProposalThreshold();
  },
  async getVotes({ commit }, address) { // how much delegated to address
    return await getVotes(address);
  },
  async getReceipt({ commit }, { id, accountAddress }) {
    return await getReceipt(id, accountAddress);
  },
  async executeVoting({ commit }, id) {
    return await executeVoting(id);
  },
  async voteResults({ commit }, id) {
    return await voteResults(id);
  },
  async isChairpersonRole({ commit, getters }) {
    if (!getters.chairpersonRoleHash) {
      const chairpersonHash = await getChairpersonHash();
      commit('setChairpersonRoleHash', chairpersonHash.result);
    }
    const res = await hasRole(getters.chairpersonRoleHash);
    commit('setIsChairpersonRole', res.result);
  },
};

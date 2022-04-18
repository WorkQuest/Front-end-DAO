import BigNumber from 'bignumber.js';
import {
  disconnect,
  getBalance,
  getContractFeeData,
  getIsWalletConnected,
  getStyledAmount,
  getTransferFeeData,
  getWalletAddress,
  transfer,
  transferToken,
  fetchWalletContractData,
  delegate,
  undelegate,
  getDelegates,
  addProposal,
  getProposalInfoById,
  doVote,
  getVoteThreshold,
  getReceipt,
  executeVoting,
  voteResults,
  getChairpersonHash,
  hasRole,
  getProposalThreshold,
  connectWallet,
} from '~/utils/wallet';
import abi from '~/abi/index';
import { errorCodes, TokenSymbols } from '~/utils/enums';
import { error, success } from '~/utils/success-error';

export default {
  async getTransactions({ commit }, params) {
    try {
      const res = await this.$axios({
        url: `/account/${getWalletAddress()}/transactions`,
        baseURL: process.env.WQ_EXPLORER,
        params,
      });
      commit('setTransactions', res.data.result.transactions);
      commit('setTransactionsCount', res.data.result.count);
    } catch (e) {
      commit('setTransactions', []);
      commit('setTransactionsCount', 0);
    }
  },
  async checkPassword({ commit }, password) {
    try {
      const res = await this.$axios.$post('/v1/auth/validate-password', { password });
      return res?.result?.isValid;
    } catch (e) {
      return false;
    }
  },
  confirmPassword({ commit, getters }, { nuxt, callbackLayout }) {
    if (callbackLayout) commit('setCallbackLayout', callbackLayout);
    commit('setIsOnlyConfirm', true);
    nuxt.setLayout('confirmPassword');
  },
  /**
     * Check wallet is connected
     * @returns boolean
     */
  checkWalletConnected({ commit, getters }, { nuxt, callbackLayout }) {
    const connected = getIsWalletConnected();
    commit('setIsOnlyConfirm', false);
    if (!connected) {
      if (callbackLayout) commit('setCallbackLayout', callbackLayout);
      else nuxt.setLayout('confirmPassword');
    } else commit('setIsWalletConnected', true);
  },
  /**
     * Connect wallet with password
     * Use when checkWalletConnected from confirmPassword modal
     * @param commit
     * @param getters
     * @param userAddress
     * @param userPassword
     */
  connectWallet({ commit }, { userWalletAddress, userPassword }) {
    const res = connectWallet(userWalletAddress, userPassword);
    if (res?.ok) commit('setIsWalletConnected', true);
    return res;
  },
  disconnect() {
    disconnect();
  },
  setSelectedToken({ commit }, token) {
    commit('setSelectedToken', token);
  },

  async getBalance({ commit }) {
    const res = await getBalance();
    commit('setBalance', {
      symbol: TokenSymbols.WUSD,
      balance: res.ok ? res.result.balance : 0,
      fullBalance: res.ok ? res.result.fullBalance : 0,
    });
  },
  async getBalanceWQT({ commit }, userAddress) {
    const res = await fetchWalletContractData(
      'balanceOf',
      abi.ERC20,
      process.env.WORKNET_WQT_TOKEN,
      [userAddress],
    );
    commit('setBalance', {
      symbol: TokenSymbols.WQT,
      balance: res ? getStyledAmount(res) : 0,
      fullBalance: res ? getStyledAmount(res, true) : 0,
    });
  },
  /**
     * Send transfer
     * @param recipient
     * @param value
     */
  async transfer({ commit }, { recipient, value }) {
    return await transfer(recipient, value);
  },
  async getTransferFeeData({ commit }, { recipient, value }) {
    return await getTransferFeeData(recipient, value);
  },
  /**
     * Send transfer for WQT token
     * @param commit
     * @param recipient
     * @param value
     */
  async transferWQT({ commit }, { recipient, value }) {
    return await transferToken(recipient, value);
  },
  /**
     * Get Fee Data from contract method
     * @param commit
     * @param method
     * @param _abi
     * @param contractAddress
     * @param data - Array []
     * @param recipient
     * @param amount - decimal value
     * @returns {Promise<{result: *, ok: boolean}|{msg: string, code: number, data: null, ok: boolean}|undefined>}
     */
  async getContractFeeData({ commit }, {
    method, _abi, contractAddress, data, recipient, amount,
  }) {
    return await getContractFeeData(method, _abi, contractAddress, data, recipient, amount);
  },

  /** Investors */
  /**
     * Get votes
     * @param commit
     * @param addresses - Array [address, ...]
     */
  async getVotesByAddresses({ commit }, addresses) {
    try {
      const res = await fetchWalletContractData('getVotes', abi.WQToken, process.env.WORKNET_WQT_TOKEN, [addresses]);
      return success(res);
    } catch (e) {
      console.error('getVotes');
      return error(errorCodes.GetVotes, e.message, e);
    }
  },
  async frozenBalance({ commit }, { address }) {
    try {
      const res = await fetchWalletContractData(
        'freezed',
        abi.WQToken,
        process.env.WORKNET_WQT_TOKEN,
        [address],
      );
      commit('user/setFrozenBalance', new BigNumber(res).shiftedBy(-18), { root: true });
      return success(res);
    } catch (e) {
      return error(errorCodes.Undelegate, e.message, e);
    }
  },
  async getDelegates({ commit, dispatch, rootGetters }) {
    const res = await getDelegates();
    if (res.ok) {
      const address = !+res.result ? null : res.result.toLowerCase();
      let votingPowerArray = null;
      let user = null;
      if (address) {
        votingPowerArray = await dispatch('getVotesByAddresses', [address]);
        if (address === rootGetters['user/getUserWalletAddress']) user = rootGetters['user/getUserData'];
        else user = await dispatch('user/getUserByWalletAddress', address, { root: true });
      }
      const delegatedData = user ? {
        ...user,
        investorAddress: address,
        voting: votingPowerArray ? getStyledAmount(votingPowerArray.result[0]) : null,
        fullName: `${user.firstName || ''} ${user.lastName || ''}`,
      } : null;
      commit(
        'investors/setDelegatedToUser', delegatedData, { root: true },
      );
    } else {
      commit('investors/setDelegatedToUser', null, { root: true });
    }
  },
  async delegate({ commit }, { toAddress, amount }) {
    return await delegate(toAddress, amount);
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
  async getProposalThreshold({ commit }) {
    const { result } = await getProposalThreshold();
    commit('setProposalThreshold', result, { root: true });
    return result;
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
    if (!getters.isChairpersonRole) {
      const chairpersonHash = await getChairpersonHash();
      commit('setChairpersonRoleHash', chairpersonHash.result);
    }
    const res = await hasRole(getters.chairpersonRoleHash);
    commit('setIsChairpersonRole', res.result);
  },
};

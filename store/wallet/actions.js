import BigNumber from 'bignumber.js';
import converter from 'bech32-converting';
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
  connectWallet,
  sendWalletTransaction,
} from '~/utils/wallet';
import {
  errorCodes, TokenMap, TokenSymbols, WorknetTokenAddresses,
} from '~/utils/enums';
import { error, success } from '~/utils/success-error';
import { ERC20, WQVoting } from '~/abi/index';
import ENV from '~/utils/addresses';

/**
 * @property $nuxt
 * @property setLayout
 */
export default {
  async getTransactions({ commit }, params) {
    try {
      const { investorAddress } = params;
      delete params.investorAddress;
      const res = await this.$axios({
        url: `/account/${investorAddress ?? getWalletAddress()}/transactions`,
        baseURL: ENV.WQ_EXPLORER,
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
  confirmPassword({ commit, getters }, { callbackLayout }) {
    if (callbackLayout) commit('setCallbackLayout', callbackLayout);
    commit('setIsOnlyConfirm', true);
    $nuxt.setLayout('confirmPassword');
  },
  /**
     * Check wallet is connected
     * @returns boolean
     */
  checkWalletConnected({ commit, getters }, { callbackLayout }) {
    const connected = getIsWalletConnected();
    commit('setIsOnlyConfirm', false);
    if (!connected) {
      if (callbackLayout) commit('setCallbackLayout', callbackLayout);
      else $nuxt.setLayout('confirmPassword');
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
  async fetchCommonTokenInfo({ commit }) {
    try {
      const tokens = await Promise.all(WorknetTokenAddresses.map(async (address) => await Promise.all([
        fetchWalletContractData('symbol', ERC20, address),
        fetchWalletContractData('decimals', ERC20, address),
      ])));
      tokens.forEach((item) => commit('setCommonTokenData', item));
    } catch (e) {
      console.error('wallet/fetchCommonTokenInfo');
    }
  },
  setSelectedToken({ commit }, token) {
    commit('setSelectedToken', token);
  },

  async getBalance({ commit }) {
    const res = await getBalance();
    commit('setBalance', {
      symbol: TokenSymbols.WQT,
      balance: res.ok ? res.result.balance : 0,
      fullBalance: res.ok ? res.result.fullBalance : 0,
    });
  },
  async getTokenBalance({ commit, getters, dispatch }, tokenSymbol) {
    const res = await fetchWalletContractData(
      'balanceOf',
      ERC20,
      TokenMap[tokenSymbol],
      [getWalletAddress()],
    );
    if (!getters.getBalanceData[tokenSymbol]) {
      await dispatch('fetchCommonTokenInfo');
    }
    const { decimals } = getters.getBalanceData[tokenSymbol];
    commit('setBalance', {
      symbol: tokenSymbol,
      balance: res ? getStyledAmount(res, false, decimals) : 0,
      fullBalance: res ? getStyledAmount(res, true, decimals) : 0,
    });
  },
  /**
     * Send transfer
     * @param recipient
     * @param value
     */
  async transfer({ _ }, { recipient, value }) {
    return await transfer(recipient, value);
  },
  async getTransferFeeData({ _ }, { recipient, value }) {
    return await getTransferFeeData(recipient, value);
  },
  /**
     * Send transfer for WUSD token
     * @param commit
     * @param recipient
     * @param value
     */
  async transferWUSD({ _ }, { recipient, value }) {
    return await transferToken(recipient, value);
  },
  /**
     * Get Fee Data from contract method
     * @param commit
     * @param method
     * @param _abi
     * @param abi
     * @param contractAddress
     * @param data - Array []
     * @param recipient
     * @param amount - decimal value
     * @returns {Promise<{result: *, ok: boolean}|{msg: string, code: number, data: null, ok: boolean}|undefined>}
     */
  async getContractFeeData({ _ }, {
    method, abi, contractAddress, data, recipient, amount,
  }) {
    return await getContractFeeData(method, abi, contractAddress, data, recipient, amount);
  },

  /** Investors */
  /**
     * Get votes
     * @param commit
     * @param addresses - Array [address, ...]
     */
  async getVotesByAddresses({ _ }, addresses) {
    try {
      const res = await fetchWalletContractData('getVotes', WQVoting, ENV.WORKNET_VOTING, [addresses]);
      return success(res);
    } catch (e) {
      console.error('getVotes');
      return error(errorCodes.GetVotes, e.message, e);
    }
  },
  async updateFrozenBalance({ commit, getters }) {
    try {
      const res = await fetchWalletContractData(
        'frozed',
        WQVoting,
        ENV.WORKNET_VOTING,
        [getWalletAddress()],
      );
      commit('user/setFrozenBalance', res
        ? new BigNumber(res.toString()).shiftedBy(-getters.getBalanceData.WQT.decimals).toString()
        : '0', { root: true });
      return success(res);
    } catch (e) {
      return error(errorCodes.Undelegate, e.message, e);
    }
  },
  // Кому делегированы токены юзера
  async getDelegates({ commit, dispatch, rootGetters }) {
    try {
      const res = await fetchWalletContractData(
        'delegates',
        WQVoting,
        ENV.WORKNET_VOTING,
        [getWalletAddress()],
      );
      const address = !+res ? null : res.toLowerCase();
      if (!res || !address) {
        commit('investors/setDelegatedToUser', null, { root: true });
        return;
      }
      let user = null;
      const votingPowerArray = await dispatch('getVotesByAddresses', [address]);
      if (address === rootGetters['user/getUserWalletAddress']) user = rootGetters['user/getUserData'];
      else user = await dispatch('user/getUserByWalletAddress', address, { root: true });
      commit('investors/setDelegatedToUser', {
        ...user,
        investorAddress: converter('wq').toBech32(address),
        voting: votingPowerArray ? getStyledAmount(votingPowerArray.result[0]) : null,
        fullName: $nuxt.UserName(user?.firstName, user?.lastName),
      }, { root: true });
    } catch (e) {
      console.error('wallet/getDelegates', e);
    }
  },
  async delegate({ getters }, { toAddress, amount }) {
    try {
      amount = new BigNumber(amount).shiftedBy(getters.getBalanceData.WQT.decimals).toString();
      const res = await sendWalletTransaction('delegate', {
        abi: WQVoting,
        address: ENV.WORKNET_VOTING,
        data: [toAddress],
        value: amount,
      });
      return success(res);
    } catch (e) {
      console.error('wallet/delegate', e);
      return error(errorCodes.Delegate, e.message, e);
    }
  },
  async undelegate({ _ }) {
    try {
      const res = await sendWalletTransaction('undelegate', {
        abi: WQVoting,
        address: ENV.WORKNET_VOTING,
      });
      return success(res);
    } catch (e) {
      console.error('wallet/undelegate ', e);
      return error(errorCodes.Undelegate, e.message, e);
    }
  },
};

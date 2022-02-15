import {
  connectWallet, connectWithMnemonic,
  disconnect, getBalance, getContractFeeData,
  getIsWalletConnected, getStyledAmount,
  getTransferFeeData, getWalletAddress, GetWalletProvider,
  transfer,
  transferToken,
} from '~/utils/wallet';
import abi from '~/abi/index';
import { TokenSymbols } from '~/utils/enums';
import { fetchContractData } from '~/utils/web3';

export default {
  async getTransactions({ commit }, params) {
    try {
      const res = await this.$axios({ url: `/account/${getWalletAddress()}/txs`, baseURL: process.env.WQ_EXPLORER, params });
      commit('setTransactions', res.data.result.txs);
      commit('setTransactionsCount', res.data.result.count);
    } catch (e) {
      commit('setTransactions', []);
      commit('setTransactionsCount', 0);
    }
  },
  async checkPassword({ commit }, password) {
    try {
      const res = await this.$axios.$post('/v1/auth/validate-password', { password });
      if (res.ok) {
        return res.result.isValid;
      }
      return false;
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
   */
  checkWalletConnected({ commit, getters }, { nuxt, callbackLayout, userAddress }) {
    const connected = getIsWalletConnected();
    commit('setIsOnlyConfirm', false);
    if (!connected) {
      if (userAddress) {
        if (connectWithMnemonic(userAddress)) {
          commit('setIsWalletConnected', true);
          return;
        }
      }
      if (callbackLayout) commit('setCallbackLayout', callbackLayout);
      nuxt.setLayout('confirmPassword');
    } else {
      commit('setIsWalletConnected', true);
    }
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
    const res = await fetchContractData(
      'balanceOf',
      abi.ERC20,
      process.env.WQT_TOKEN,
      [userAddress],
      GetWalletProvider(),
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
};

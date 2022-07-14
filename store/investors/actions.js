import { getStyledAmount } from '~/utils/wallet';

export default {
  async getInvestors({ commit, dispatch, rootGetters }, config) {
    try {
      if (!config.q.length) delete config.q;

      const { result } = await this.$axios.$get('/v1/dao/profile/users', { params: { ...config, walletRequired: true } });

      // for my profile
      const userData = rootGetters['user/getUserData'];
      const userWalletAddress = rootGetters['user/getUserWalletAddress'];

      const addresses = result.users.map((user) => user.wallet?.address).filter((n) => n);
      addresses.unshift(userWalletAddress);

      const votes = await dispatch('wallet/getVotesByAddresses', addresses, { root: true });
      result.users.unshift({
        ...userData,
        investorAddress: userWalletAddress,
        voting: getStyledAmount(votes.result[addresses.indexOf(userWalletAddress)]),
      });
      result.users.forEach((user) => {
        user.investorAddress = user.wallet?.address ? user.wallet.address : '';
        user.voting = user.wallet?.address ? getStyledAmount(votes.result[addresses.indexOf(user.wallet.address)]) : '';
      });
      commit('setInvestors', result);
    } catch (e) {
      commit('setInvestors', { list: [], count: 0 });
    }
  },
  setLastPage({ commit }, page) {
    commit('setLastPage', page);
  },
};

import { getStyledAmount } from '~/utils/wallet';

export default {
  async getInvestors({ commit, dispatch }, config) {
    try {
      if (!config.q.length) delete config.q;
      const { result } = await this.$axios.$get('/v1/profile/users', { params: { ...config, walletRequired: true } });
      const addresses = result.users.map((user) => user.wallet?.address).filter((n) => n);
      const votes = await dispatch('wallet/getVotesByAddresses', addresses, { root: true });
      result.users.forEach((user) => {
        user.fullName = `${user.firstName || ''} ${user.lastName || ''}`;
        user.investorAddress = user.wallet?.address ? user.wallet.address : '';
        user.voting = user.wallet?.address ? `${getStyledAmount(votes.result[addresses.indexOf(user.wallet.address)])} WQT` : '';
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

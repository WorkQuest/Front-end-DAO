import {
  error,
  success,
} from '~/utils/success-error';

/**
 * @property $axiosOracle - axios instance of oracle
 */
export default {
  async getCurrentTokensPrices({ commit }) {
    try {
      const { result } = await this.$axiosOracle.$get('/oracle/sign-price/tokens');
      commit('setCurrentPrices', result);
      return success(result);
    } catch (e) {
      return error();
    }
  },
};

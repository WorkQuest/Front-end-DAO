export default {
  async createAccessTokenBackend({ commit }) {
    try {
      const { result } = await this.$axios.$get('/v1/sumsub/create-access-token');
      commit('setAccessTokenBackend', result);
      return result;
    } catch (e) {
      return null;
    }
  },
};

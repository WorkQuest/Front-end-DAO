export default {
  async createProposal({ commit }, payload) {
    try {
      await this.$axios.$post('', payload);
    } catch (e) {
      console.error(e.message);
    }
  },
  async getProposals({ commit }, { offset, limit }) {
    try {
      const result = await this.$axios.$get('', {
        params: {
          limit,
          offset,
        },
      });
      commit('setCards', result.cards);
      commit('setCardsCount', result.count);
    } catch (e) {
      console.error(e.message);
    }
  },
  updateFilters({ commit }, payload) {
    commit('setFilters', payload);
  },
};

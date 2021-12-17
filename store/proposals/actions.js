import { error, success } from '~/utils/success-error';
import { errorCodes } from '~/utils/enums';

export default {
  setProposalThreshold({ commit }, payload) {
    commit('setProposalThreshold', payload);
  },
  async createProposal({ commit }, payload) {
    try {
      return await this.$axios.$post('v1/proposal/create', payload);
    } catch (e) {
      console.error(e.message);
      return error(errorCodes.CreateProposal, e.message, e);
    }
  },
  async getProposals({ commit }, { offset, limit }) {
    try {
      const result = await this.$axios.$get('v1/proposal', {
        params: {
          limit,
          offset,
        },
      });
      console.log(result.proposal);
      commit('setCards', result.proposal);
      commit('setCardsCount', result.count);
    } catch (e) {
      console.error(e.message);
    }
  },
  async getProposal({ commit }, proposalId) {
    try {
      const { result } = await this.$axios.$get(`v1/proposal/${proposalId}`);
      console.log('single proposal', result);
      return success(result);
    } catch (e) {
      console.error(e.message);
      return error(errorCodes.GetProposal, e.message, e);
    }
  },
  updateFilters({ commit }, payload) {
    commit('setFilters', payload);
  },
};

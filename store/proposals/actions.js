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
      return error(errorCodes.CreateProposal, e.message, e);
    }
  },
  async getProposals({ commit }, params) {
    try {
      const result = await this.$axios.$get('v1/proposal', { params });
      commit('setCards', result.proposal);
      commit('setCardsCount', result.count);
    } catch (e) {
      console.error(e.message);
    }
  },
  async getProposal({ commit }, {
    proposalId, params,
  }) {
    try {
      const { result } = await this.$axios.$get(`v1/proposal/${proposalId}`, { params });
      return success(result);
    } catch (e) {
      console.error(e.message);
      return error(errorCodes.GetProposal, e.message, e);
    }
  },
  async getProposalVotes({ commit }, { proposalId, params }) {
    try {
      const res = await this.$axios.$get(`v1/votings/${proposalId}`, { params });
      return success(res);
    } catch (e) {
      console.error(e.message);
      return error(errorCodes.GetProposal, e.message, e);
    }
  },
  updateFilters({ commit }, payload) {
    commit('setFilters', payload);
  },
};

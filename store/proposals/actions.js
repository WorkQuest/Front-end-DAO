import { error, success } from '~/utils/success-error';
import { errorCodes } from '~/utils/enums';
import { fetchWalletContractData, sendWalletTransaction } from '~/utils/wallet';
import { WQVoting } from '~/abi';

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
      const result = await this.$axios.$get('v1/proposals', { params });
      commit('setCards', result.proposals);
      commit('setCardsCount', result.count);
    } catch (e) {
      console.error(e.message);
    }
  },
  async getProposal({ commit }, { proposalId }) {
    try {
      const { result } = await this.$axios.$get(`v1/proposal/${proposalId}`);
      return success(result);
    } catch (e) {
      console.error(e.message);
      return error(errorCodes.GetProposal, e.message, e);
    }
  },
  async getProposalVotes({ commit }, { proposalId, params }) {
    try {
      const res = await this.$axios.$get(`v1/proposal/${proposalId}/votes`, { params });
      return success(res);
    } catch (e) {
      return error(errorCodes.GetProposal, e.message, e);
    }
  },
  updateFilters({ commit }, payload) {
    commit('setFilters', payload);
  },

  /** Contracts */
  async getProposalThreshold({ commit }) {
    try {
      const res = await fetchWalletContractData('proposalThreshold', WQVoting, process.env.WORKNET_VOTING);
      commit('setProposalThreshold', res);
    } catch (e) {
      console.error('wallet/getProposalThreshold');
    }
  },
  async addProposal({ commit }, { description, nonce }) {
    try {
      const res = await sendWalletTransaction('addProposal', {
        abi: WQVoting,
        address: process.env.WORKNET_VOTING,
        data: [nonce, description.toString()],
      });
      return success(res);
    } catch (e) {
      return error(errorCodes.AddProposal, e.message, e);
    }
  },
};

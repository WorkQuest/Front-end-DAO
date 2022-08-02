import BigNumber from 'bignumber.js';
import { error, success } from '~/utils/success-error';
import { errorCodes } from '~/utils/enums';
import {
  fetchWalletContractData,
  getWalletAddress,
  sendWalletTransaction,
} from '~/utils/wallet';
import { WQVoting } from '~/abi';
import ENV from '~/utils/addresses';

export default {
  setProposalThreshold({ commit }, payload) {
    commit('setProposalThreshold', payload);
  },
  async createProposal({ _ }, payload) {
    try {
      return await this.$axios.$post('v1/proposal/create', payload);
    } catch (e) {
      console.error('proposals/createProposal');
      return error(errorCodes.CreateProposal, e.message, e);
    }
  },
  async getProposals({ commit }, params) {
    try {
      const result = await this.$axios.$get('v1/proposals', { params });
      commit('setCards', result.proposals);
      commit('setCardsCount', result.count);
    } catch (e) {
      console.error('proposals/getProposals');
    }
  },
  async getProposal({ _ }, { proposalId }) {
    try {
      const { result } = await this.$axios.$get(`v1/proposal/${proposalId}`);
      return success(result);
    } catch (e) {
      console.error('proposals/getProposal');
      return error(errorCodes.GetProposal, e.message, e);
    }
  },
  async getProposalVotes({ _ }, { proposalId, params }) {
    try {
      const res = await this.$axios.$get(`v1/proposal/${proposalId}/votes`, { params });
      return success(res);
    } catch (e) {
      console.error('proposals/getProposalVotes');
      return error(errorCodes.GetProposal, e.message, e);
    }
  },
  updateFilters({ commit }, payload) {
    commit('setFilters', payload);
  },

  /** Contracts */
  async getVotesByAddresses({ _ }, addresses) {
    try {
      const res = await fetchWalletContractData('getVotes', WQVoting, ENV.WORKNET_VOTING, [addresses]);
      return success(res);
    } catch (e) {
      console.error('getVotes');
      return error(errorCodes.GetVotes, e.message, e);
    }
  },

  async getVotingPeriod({ _ }) {
    try {
      const res = await fetchWalletContractData('votingPeriod', WQVoting, ENV.WORKNET_VOTING);
      return success(res);
    } catch (e) {
      console.error('getVotingPeriod', e);
      return error(errorCodes.GetVotingPeriod, e.message, e);
    }
  },

  async getPastVotes({ _ }, proposalBlockNumber) {
    try {
      const res = await fetchWalletContractData(
        'getPastVotes',
        WQVoting,
        ENV.WORKNET_VOTING,
        [getWalletAddress(), proposalBlockNumber],
      );
      return success(res);
    } catch (e) {
      console.error('proposals/getPastVotes');
      return error();
    }
  },
  async getProposalThreshold({ commit }) {
    try {
      const res = await fetchWalletContractData('proposalThreshold', WQVoting, ENV.WORKNET_VOTING);
      commit('setProposalThreshold', res);
    } catch (e) {
      console.error('wallet/getProposalThreshold');
    }
  },
  async addProposal({ _ }, { description, nonce }) {
    try {
      const res = await sendWalletTransaction('addProposal', {
        abi: WQVoting,
        address: ENV.WORKNET_VOTING,
        data: [nonce, description.toString()],
      });
      return success(res);
    } catch (e) {
      console.error('proposals/addProposal');
      return error(errorCodes.AddProposal, e.message, e);
    }
  },
  async getProposalInfoById({ _ }, id) {
    try {
      const res = await fetchWalletContractData('proposals', WQVoting, ENV.WORKNET_VOTING, [id]);
      return success(res);
    } catch (e) {
      console.error('proposals/getProposalInfoById');
      return error(errorCodes.GetProposal, e.message, e);
    }
  },
  async doVote({ _ }, { id, value }) {
    try {
      const res = await sendWalletTransaction('doVote', {
        abi: WQVoting,
        address: ENV.WORKNET_VOTING,
        data: [id, value],
      });
      return success(res);
    } catch (e) {
      console.error('proposals/doVote');
      return error(errorCodes.VoteProposal, e.message, e);
    }
  },
  async getVoteThreshold({ rootGetters }) {
    try {
      const result = await fetchWalletContractData('voteThreshold', WQVoting, ENV.WORKNET_VOTING);
      return success(new BigNumber(result.toString()).shiftedBy(-rootGetters['wallet/getBalanceData'].WQT.decimals).toString());
    } catch (e) {
      console.error('proposals/getVoteThreshold');
      return error(errorCodes.GetVoteThreshold, e.message, e);
    }
  },
  async getReceipt({ _ }, { id, accountAddress }) {
    try {
      const result = await fetchWalletContractData('getReceipt', WQVoting, ENV.WORKNET_VOTING, [+id, accountAddress]);
      return success(result);
    } catch (e) {
      return error(errorCodes.GetReceipt, e.message, e);
    }
  },
  async voteResults({ _ }, id) {
    try {
      const result = await fetchWalletContractData('voteResults', WQVoting, ENV.WORKNET_VOTING, [id]);
      return success(result);
    } catch (e) {
      console.error('proposals/voteResults');
      return error(errorCodes.VoteResults, e.message, e);
    }
  },

  async getChairpersonHash({ _ }) {
    try {
      const result = await fetchWalletContractData('CHAIRPERSON_ROLE', WQVoting, ENV.WORKNET_VOTING);
      return success(result);
    } catch (e) {
      console.error('proposals/getChairpersonHash');
      return error(errorCodes.GetChairpersonHash, e.message, e);
    }
  },
  async executeVoting({ _ }, id) {
    try {
      const result = await sendWalletTransaction('executeVoting', {
        abi: WQVoting,
        address: ENV.WORKNET_VOTING,
        data: [id],
      });
      return success(result);
    } catch (e) {
      console.error('proposals/executeVoting');
      return error(errorCodes.ExecuteVoting, e.message, e);
    }
  },
  async isChairpersonRole({ commit, getters }) {
    try {
      if (!getters.isChairpersonRole) {
        const chairpersonHash = await fetchWalletContractData('CHAIRPERSON_ROLE', WQVoting, ENV.WORKNET_VOTING);
        commit('setChairpersonRoleHash', chairpersonHash);
      }
      const result = await fetchWalletContractData('hasRole', WQVoting, ENV.WORKNET_VOTING, [getters.chairpersonRoleHash, getWalletAddress()]);
      commit('setIsChairpersonRole', result);
    } catch (e) {
      console.error('proposals/isChairpersonRole');
    }
  },
};

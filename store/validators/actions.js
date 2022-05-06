import converter from 'bech32-converting';
import { error, success } from '~/utils/success-error';
import { getAddressFromConsensusPub } from '~/utils/wallet';

const baseURL = `${process.env.WQ_PROVIDER}/api`;
export default {
  async getValidators({ commit, dispatch }, { status, limit, offset }) {
    try {
      const nodeApi = this.$axios.create({ baseURL });
      const config = {
        params: {
          'pagination.count_total': true,
          'pagination.limit': limit,
          'pagination.offset': offset,
          status,
        },
      };
      const res = await nodeApi.$get('/cosmos/staking/v1beta1/validators', config);
      const { validators } = res;

      // slots count & missed blocks for all validators
      const infoRes = await Promise.all([
        ...validators.map((item) => dispatch('getSlotsCount', item.operator_address)),
        ...validators.map((item) => dispatch('getMissedBlocks', item.consensus_pubkey.key)),
      ]);
      for (let i = 0; i < validators.length; i += 1) {
        validators[i].slots = infoRes[i].result;
        validators[i].missedBlocks = infoRes[i + validators.length].result;
      }

      commit('setValidatorsList', validators);
      commit('setValidatorsCount', Number(res.pagination.total));
    } catch (e) {
      console.error('validators/getValidators');
    }
  },
  async getMissedBlocks({ commit }, consensusPubKey) {
    try {
      const validatorAddress = converter('wqvalcons').toBech32(getAddressFromConsensusPub(consensusPubKey));
      const nodeApi = this.$axios.create({ baseURL });
      const res = await nodeApi.$get(`/cosmos/slashing/v1beta1/signing_infos/${validatorAddress}`);
      return success(res.val_signing_info.missed_blocks_counter);
    } catch (e) {
      console.error('validators/getMissedBlocks');
      return error();
    }
  },
  async getSlotsCount({ commit }, validatorAddress) {
    try {
      const nodeApi = this.$axios.create({ baseURL });
      const { pagination } = await nodeApi.$get(`/cosmos/staking/v1beta1/validators/${validatorAddress}/delegations`);
      return success(pagination.total);
    } catch (e) {
      console.error('validators/getSlotsCount');
      return error();
    }
  },
  async getValidatorByAddress({ commit, dispatch }, validatorAddress) {
    try {
      const nodeApi = this.$axios.create({ baseURL });
      const { validator } = await nodeApi.$get(`/cosmos/staking/v1beta1/validators/${validatorAddress}`);
      commit('setValidatorData', validator);
      return success();
    } catch (e) {
      console.error('validators/getValidatorByAddress');
      return error();
    }
  },
  // Сколько делегировали
  async getDelegatedDataForValidator({ _ }, { validatorAddress, userWalletAddress }) {
    try {
      const nodeApi = this.$axios.create({ baseURL });
      const res = await nodeApi.$get(`/cosmos/staking/v1beta1/validators/${validatorAddress}/delegations/${userWalletAddress}`);
      return success(res);
    } catch (e) {
      return error();
    }
  },

  // Send tx
  async broadcast({ commit }, { signedTxBytes, broadCastMode = 'BROADCAST_MODE_SYNC' }) {
    try {
      const nodeApi = this.$axios.create({ baseURL: `${baseURL}/cosmos/tx/v1beta1/txs` });
      return await nodeApi.$post('', {
        tx_bytes: signedTxBytes,
        mode: broadCastMode,
      }, {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (e) {
      console.error('wallet/broadcast');
      return error();
    }
  },
};

import converter from 'bech32-converting';
import axios from 'axios';
import { error, success } from '~/utils/success-error';
import { getAddressFromConsensusPub } from '~/utils/wallet';
import ENV from '~/utils/addresses';

const nodeApi = axios.create({ baseURL: `${ENV.WQ_PROVIDER}/api` });

export default {
  async getValidators({ commit, dispatch }, { status, limit, offset }) {
    try {
      const { data } = await nodeApi.get('/cosmos/staking/v1beta1/validators', {
        params: {
          'pagination.count_total': true,
          'pagination.limit': limit,
          'pagination.offset': offset,
          status,
        },
      });
      const { validators } = data;

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
      commit('setValidatorsCount', Number(data.pagination.total));
    } catch (e) {
      console.error('validators/getValidators');
    }
  },
  async getMissedBlocks({ _ }, consensusPubKey) {
    try {
      const validatorAddress = converter('wqvalcons').toBech32(getAddressFromConsensusPub(consensusPubKey));
      const { data } = await nodeApi.get(`/cosmos/slashing/v1beta1/signing_infos/${validatorAddress}`);
      return success(data.val_signing_info.missed_blocks_counter);
    } catch (e) {
      console.error('validators/getMissedBlocks');
      return error();
    }
  },
  async getStakingParams({ commit }) {
    try {
      const { data } = await nodeApi.get('/cosmos/staking/v1beta1/params');
      commit('setStakingParams', data.params);
    } catch (e) {
      console.error('validators/getMissedBlocks');
    }
  },
  async getSlotsCount({ _ }, validatorAddress) {
    try {
      const { data } = await nodeApi.get(`/cosmos/staking/v1beta1/validators/${validatorAddress}/delegations`);
      return success(data.pagination.total);
    } catch (e) {
      console.error('validators/getSlotsCount');
      return error();
    }
  },
  async getValidatorByAddress({ commit, dispatch }, validatorAddress) {
    try {
      const { data } = await nodeApi.get(`/cosmos/staking/v1beta1/validators/${validatorAddress}`);
      commit('setValidatorData', data.validator);
      return success();
    } catch (e) {
      console.error('validators/getValidatorByAddress');
      return error();
    }
  },
  // Сколько делегировали
  async getDelegatedDataForValidator({ _ }, { validatorAddress, userWalletAddress }) {
    try {
      const { data } = await nodeApi.get(`/cosmos/staking/v1beta1/validators/${validatorAddress}/delegations/${userWalletAddress}`);
      return success(data);
    } catch (e) {
      return error();
    }
  },

  // Send tx
  async broadcast({ _ }, { signedTxBytes, broadCastMode = 'BROADCAST_MODE_SYNC' }) {
    try {
      const { data } = await nodeApi.post('/cosmos/tx/v1beta1/txs', {
        tx_bytes: signedTxBytes,
        mode: broadCastMode,
      }, {
        headers: { 'Content-Type': 'application/json' },
      });
      return data;
    } catch (e) {
      console.error('wallet/broadcast');
      return error();
    }
  },
  async simulate(_, { signedTxBytes, broadCastMode = 'BROADCAST_MODE_SYNC' }) {
    try {
      const { data } = await nodeApi.post('/cosmos/tx/v1beta1/simulate', {
        tx_bytes: signedTxBytes,
        mode: broadCastMode,
      }, {
        headers: { 'Content-Type': 'application/json' },
      });
      return data;
    } catch (e) {
      console.error('wallet/broadcast');
      return error(e?.response?.data?.code, e?.response?.data?.message);
    }
  },
};

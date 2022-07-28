import converter from 'bech32-converting';
import BigNumber from 'bignumber.js';
import { error, success } from '~/utils/success-error';
import { getAddressFromConsensusPub } from '~/utils/wallet';

/**
 * @property $axiosNode - axios instance of node api
 */
export default {
  async getValidators({ commit, dispatch }, { status, limit, offset }) {
    try {
      const { validators, pagination } = await this.$axiosNode.$get('/cosmos/staking/v1beta1/validators', {
        params: {
          'pagination.count_total': true,
          'pagination.limit': limit,
          'pagination.offset': offset,
          status,
        },
      });

      // slots count & missed blocks for all validators
      const infoRes = await Promise.all([
        ...validators.map((item) => dispatch('getSlotsCount', item.operator_address)),
        ...validators.map((item) => dispatch('getMissedBlocks', item.consensus_pubkey.key)),
      ]);
      for (let i = 0; i < validators.length; i += 1) {
        validators[i].min_self_delegation = new BigNumber(validators[i].min_self_delegation).shiftedBy(-18).toString();
        validators[i].slots = infoRes[i].result;
        validators[i].missedBlocks = infoRes[i + validators.length].result;
      }

      commit('setValidatorsList', validators);
      commit('setValidatorsCount', Number(pagination.total));
    } catch (e) {
      console.error('validators/getValidators', e);
    }
  },
  async getMissedBlocks({ _ }, consensusPubKey) {
    try {
      const validatorAddress = converter('wqvalcons').toBech32(getAddressFromConsensusPub(consensusPubKey));
      const { val_signing_info } = await this.$axiosNode.$get(`/cosmos/slashing/v1beta1/signing_infos/${validatorAddress}`);
      return success(val_signing_info.missed_blocks_counter);
    } catch (e) {
      console.error('validators/getMissedBlocks');
      return error();
    }
  },
  async getStakingParams({ commit }) {
    try {
      const { params } = await this.$axiosNode.$get('/cosmos/staking/v1beta1/params');
      commit('setStakingParams', params);
    } catch (e) {
      console.error('validators/getMissedBlocks');
    }
  },
  async getSlotsCount({ _ }, validatorAddress) {
    try {
      const { pagination } = await this.$axiosNode.$get(`/cosmos/staking/v1beta1/validators/${validatorAddress}/delegations`);
      return success(pagination.total);
    } catch (e) {
      console.error('validators/getSlotsCount');
      return error();
    }
  },
  async getValidatorByAddress({ commit, dispatch }, validatorAddress) {
    try {
      const { validator } = await this.$axiosNode.$get(`/cosmos/staking/v1beta1/validators/${validatorAddress}`);
      validator.min_self_delegation = new BigNumber(validator.min_self_delegation).shiftedBy(-18).toString();
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
      const res = await this.$axiosNode.$get(`/cosmos/staking/v1beta1/validators/${validatorAddress}/delegations/${userWalletAddress}`);
      return success(res);
    } catch (e) {
      return error();
    }
  },
  async getRewardsForValidator({ _ }, { validatorAddress, userWalletAddress }) {
    try {
      const res = await this.$axiosNode.$get(`/cosmos/distribution/v1beta1/delegators/${userWalletAddress}/rewards/${validatorAddress}`);
      return success(res);
    } catch (e) {
      return error();
    }
  },

  // Send tx
  async broadcast({ _ }, { signedTxBytes, broadCastMode = 'BROADCAST_MODE_SYNC' }) {
    try {
      return await this.$axiosNode.$post('/cosmos/tx/v1beta1/txs', {
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
  async simulate({ _ }, { signedTxBytes, broadCastMode = 'BROADCAST_MODE_SYNC' }) {
    try {
      return await this.$axiosNode.$post('/cosmos/tx/v1beta1/simulate', {
        tx_bytes: signedTxBytes,
        mode: broadCastMode,
      }, {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (e) {
      console.error('wallet/broadcast');
      return error(e?.response?.data?.code, e?.response?.data?.message);
    }
  },
};

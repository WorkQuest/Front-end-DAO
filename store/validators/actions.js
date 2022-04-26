import { error, success } from '~/utils/success-error';

const baseURL = `${process.env.WQ_PROVIDER}/api`;
export default {

  // Сколько делегировал я валидатору
  // https://dev-node-nyc3.workquest.co/api/cosmos/staking/v1beta1/validators/ethmvaloper1r9n7xttnufe02qyh02yjjvgzez9c0zcdyzk02h/delegations/ethm10fanzq0ksuptyfhcx3wecnekldqk2xw88yvpah

  async getValidators({ commit, dispatch }, isBonded) {
    try {
      const nodeApi = this.$axios.create({ baseURL });
      const config = isBonded ? { params: { status: 'BOND_STATUS_BONDED' } } : null;
      const res = await nodeApi.$get('/cosmos/staking/v1beta1/validators', config);

      const { validators } = res;

      // slots
      const slotsRes = await dispatch('getSlotsCount', validators.map((item) => item.operator_address));
      console.log('slots', slotsRes);

      // missed blocks
      // const list = await Promise.all(this.validatorsList.map((item) => this.$store.dispatch(
      //   'validators/getMissedBlocks',
      //   this.ConvertToBech32('ethmvalcons', this.ConvertToHex('ethmvaloper', item.operator_address)), // TODO not works
      // )));
      // console.log('list', list);

      commit('setValidatorsList', validators);
      commit('setValidatorsCount', Number(res.pagination.total));
      console.log(res);
    } catch (e) {
      console.error('getValidators', e);
    }
  },
  async getMissedBlocks({ commit }, validatorAddress) {
    try {
      const nodeApi = this.$axios.create({ baseURL });
      const res = await nodeApi.$get(`/cosmos/slashing/v1beta1/signing_infos/${validatorAddress}`);
      return success(res.val_signing_info);
    } catch (e) {
      console.error(e);
      return error();
    }
  },
  async getSlotsCount({ commit }, validatorAddress) {
    try {
      const nodeApi = this.$axios.create({ baseURL });
      const { pagination } = await nodeApi.$get(`/cosmos/staking/v1beta1/validators/${validatorAddress}/delegations`);
      return success(pagination.total);
    } catch (e) {
      return error();
    }
  },
  async getValidatorByAddress({ commit }, validatorAddress) {
    try {
      const nodeApi = this.$axios.create({ baseURL });
      const { validator } = await nodeApi.$get(`/cosmos/staking/v1beta1/validators/${validatorAddress}`);
      commit('setValidatorData', validator);
      return success();
    } catch (e) {
      return error();
    }
  },
  async getDelegatedDataForValidator({ commit, root }, { validatorAddress, userWalletAddress }) {
    try {
      const nodeApi = this.$axios.create({ baseURL });
      const res = await nodeApi.$get(`/cosmos/staking/v1beta1/validators/${validatorAddress}/delegations/${userWalletAddress}`);
      return success(res);
    } catch (e) {
      console.error('validators/getDelegatedDataForValidator');
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
      console.error('wallet/broadcast', e);
      return error();
    }
  },
};

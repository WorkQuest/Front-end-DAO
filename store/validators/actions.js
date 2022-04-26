import { error, success } from '~/utils/success-error';

export default {

  // Сколько делегировал я валидатору
  // https://dev-node-nyc3.workquest.co/api/cosmos/staking/v1beta1/validators/ethmvaloper1r9n7xttnufe02qyh02yjjvgzez9c0zcdyzk02h/delegations/ethm10fanzq0ksuptyfhcx3wecnekldqk2xw88yvpah

  async getValidators({ commit }, isBonded) {
    try {
      const nodeApi = this.$axios.create({ baseURL: `${process.env.WQ_PROVIDER}/api` });
      const config = isBonded ? { params: { status: 'BOND_STATUS_BONDED' } } : null;
      const res = await nodeApi.$get('/cosmos/staking/v1beta1/validators', config);
      commit('setValidatorsList', res.validators);
      commit('setValidatorsCount', Number(res.pagination.total));
      console.log(res);
    } catch (e) {
      console.error('getValidators', e);
    }
  },
  async getSlotsCount({ commit }, validatorAddress) {
    try {
      const nodeApi = this.$axios.create({ baseURL: `${process.env.WQ_PROVIDER}/api` });
      const { pagination } = await nodeApi.$get(`/cosmos/staking/v1beta1/validators/${validatorAddress}/delegations`);
      return success(pagination.total);
    } catch (e) {
      return error();
    }
  },
  async getValidatorByAddress({ commit }, validatorAddress) {
    try {
      const nodeApi = this.$axios.create({ baseURL: `${process.env.WQ_PROVIDER}/api` });
      const { validator } = await nodeApi.$get(`/cosmos/staking/v1beta1/validators/${validatorAddress}`);
      commit('setValidatorData', validator);
      return success();
    } catch (e) {
      return error();
    }
  },
  async broadcast({ commit }, { signedTxBytes, broadCastMode = 'BROADCAST_MODE_SYNC' }) {
    try {
      const nodeApi = this.$axios.create({ baseURL: `${process.env.WQ_PROVIDER}/api/cosmos/tx/v1beta1/txs` });
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

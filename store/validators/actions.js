import { error } from '~/utils/success-error';

const nodeUrl = `${process.env.WQ_PROVIDER}/api`; // 'https://dev-node-nyc3.workquest.co/api';
export default {
  async getValidators({ commit }) {
    try {
      const nodeApi = this.$axios.create({
        baseURL: `${nodeUrl}/cosmos/staking/v1beta1/validators`,
      });
      const res = await nodeApi.$get('', {
        // params: {
        //   status: 'BOND_STATUS_BONDED',
        // },
      });
      commit('setValidatorsList', res.validators);
      console.log(res);
    } catch (e) {
      console.error('getValidators', e);
    }
  },
  async broadcast({ commit }, { signedTxBytes, broadCastMode = 'BROADCAST_MODE_SYNC' }) {
    try {
      const nodeApi = this.$axios.create({
        baseURL: `${nodeUrl}/cosmos/tx/v1beta1/txs`,
      });
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

export default {
  async getValidators({ commit }) {
    try {
      const nodeApi = this.$axios.create({
        baseURL: 'https://dev-node-nyc3.workquest.co/api/cosmos/staking/v1beta1/validators',
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
};

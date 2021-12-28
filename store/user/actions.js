import { error } from '~/utils/success-error';

export default {
  async registerWallet({ commit }, payload) {
    try {
      return await this.$axios.$post('/v1/auth/register/wallet', payload);
    } catch (e) {
      return error(e.response.data.code, e.response.data.message);
    }
  },
  async signIn({ commit, dispatch }, payload) {
    try {
      const response = await this.$axios.$post('/v1/auth/login', payload);
      commit('setNewTokens', response.result);
      await dispatch('getUserData');
      return response;
    } catch (e) {
      return error(e.response.data.code, e.response.data.message);
    }
  },
  async signUp({ commit }, payload) {
    try {
      const response = await this.$axios.$post('/v1/auth/dao/register', payload);
      commit('setNewTokens', response.result);
      return response;
    } catch (e) {
      return error();
    }
  },
  async confirm({ commit }, payload) {
    commit('setOldTokens', { access: this.$cookies.get('access'), refresh: this.$cookies.get('refresh') });
    this.$cookies.set('role', payload.role);
    return await this.$axios.$post('/v1/auth/confirm-email', payload);
  },
  async getUserData({ commit }) {
    const response = await this.$axios.$get('/v1/profile/me');
    commit('setUserData', response.result);
    return response;
  },
  async getSpecialUserData({ commit }, id) {
    const response = await this.$axios.$get(`/v1/profile/${id}`);
    commit('setSpecialUserData', response.result);
    return response.result;
  },
  async getAllUserData({ commit }, config) {
    try {
      if (!config.q.length) delete config.q;
      const { result } = await this.$axios.$get('/v1/profile/users', { params: { ...config } });
      result.users.forEach((user) => {
        user.fullName = `${user.firstName || ''} ${user.lastName || ''}`;
        user.investorAddress = '****************';
        user.voting = '';
        user.undelegate = 'Undelegate';
        user.delegate = 'Delegate';
      });
      commit('setUsersData', result);
    } catch (e) {
      console.log(e);
    }
  },
  async setUserRole({ commit }) {
    const response = await this.$axios.$post('/v1/profile/set-role');
    commit('setUserRole', response.result);
    return response;
  },
  async logout({ commit }) {
    commit('logOut');
  },
  async refreshTokens({ commit }) {
    const response = await this.$axios.$post('/v1/auth/refresh-tokens');
    commit('setNewTokens', response.result);
    return response;
  },
  async setCurrentPosition({ commit }, payload) {
    commit('setCurrentUserPosition', payload);
  },
  async editUserPassword({ commit }, payload) {
    const response = await this.$axios.$put('/v1/profile/change-password', payload);
    commit('setUserPassword', response.result);
    return response;
  },
  async imageType({ commit }, payload) {
    const response = await this.$axios.$post('/v1/storage/get-upload-link', payload);
    commit('setImageType', response.result);
    return response;
  },
  async setImage({ commit }, { url, formData, type }) {
    try {
      const response = await this.$axios.$put(url, formData, {
        headers: {
          'Content-Type': type,
          'x-amz-acl': 'public-read',
        },
      });
      commit('setImage', response.result);
      return response;
    } catch (e) {
      return console.log(e);
    }
  },
  async changeProfile({ commit }, payload) {
    commit('changeProfile', payload);
  },
  async editProfile({ commit }, { config, method }) {
    try {
      const { result, ok } = await this.$axios.$put(method, config);
      commit('setUserData', result);
      return ok;
    } catch (e) {
      return console.log(e);
    }
  },
  async getUploadFileLink({ commit }, config) {
    const { result } = await this.$axios.$post('/v1/storage/get-upload-link', config);
    return result;
  },
  async uploadFile({ commit }, payload) {
    await this.$axios.$put(payload.url, payload.data, {
      headers: {
        'Content-Type': payload.contentType,
        'x-amz-acl': 'public-read',
      },
    });
  },
};

export default {
  async signIn({ commit, dispatch }, payload) {
    const response = await this.$axios.$post('/v1/auth/login', payload);
    commit('setNewTokens', response.result);
    await dispatch('getUserData');
    return response;
  },
  async signUp({ commit }, payload) {
    const response = await this.$axios.$post('/v1/auth/register', payload);
    commit('setNewTokens', response.result);
    return response;
  },
  async confirm({ commit }, payload) {
    commit('setOldTokens', { access: this.$cookies.get('access'), refresh: this.$cookies.get('refresh') });
    this.$cookies.set('role', payload.role);
    const response = await this.$axios.$post('/v1/auth/confirm-email', payload);
    return response;
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
      const query = config.q ? `limit=${config.limit}&offset=${config.offset}&q=${config.q}` : `limit=${config.limit}&offset=${config.offset}`;
      const { result } = await this.$axios.$get(`/v1/profile/users?${query}`);
      let userName = '';
      result.users.forEach((user) => {
        userName = `${user.firstName || ''} ${user.lastName || ''}`;
        if (userName.length > 16) {
          user.name = userName.substring(0, userName.length - (userName.length - 16));
          user.name += '...';
        } else {
          user.name = userName;
        }
        user.investorAddress = '0xnf8o29837hrvbn42o37hsho3b74thb3';
        user.stake = '126,613,276';
        user.slots = '147';
        user.voting = '127 millions';
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

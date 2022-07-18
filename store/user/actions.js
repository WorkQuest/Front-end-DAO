import { success, error } from '~/utils/success-error';
import { connectWithMnemonic } from '~/utils/wallet';
import { accessLifetime } from '~/utils/constants/cookiesLifetime';

export default {
  async signIn({ commit, dispatch }, payload) {
    try {
      const { email, password, isRememberMeSelected } = payload;
      const response = await this.$axios.$post('/v1/auth/login', {
        email,
        password,
      });
      const {
        access, refresh, social, userStatus,
      } = response.result;
      commit('setTokens', {
        refresh: isRememberMeSelected ? refresh : null,
        access,
        social,
        userStatus,
      });
      return response;
    } catch (e) {
      return error(e.response.data.code, e.response.data.msg);
    }
  },
  async registerWallet({ commit }, payload) {
    try {
      return await this.$axios.$post('/v1/auth/register/wallet', payload);
    } catch (e) {
      return error(e.response.data.code, e.response.data.msg);
    }
  },
  async signUp({ commit }, payload) {
    try {
      const response = await this.$axios.$post('/v1/auth/dao/register', payload);
      commit('setTokens', response.result);
      return response;
    } catch (e) {
      return error();
    }
  },
  async resendEmail(_, { email }) {
    try {
      const { result } = await this.$axios.$post('/v1/auth/dao/resend-email', { email });
      return success(result);
    } catch (e) {
      console.error('Error in user/resendEmail: ', e);
      return error();
    }
  },
  async confirm({ commit }, payload) {
    commit('setTokens', { access: this.$cookies.get('access'), refresh: this.$cookies.get('refresh') });
    this.$cookies.set('role', payload.role, { path: '/', maxAge: accessLifetime });
    return await this.$axios.$post('/v1/auth/confirm-email', payload);
  },
  async getUserData({ commit }) {
    try {
      const response = await this.$axios.$get('/v1/profile/me');
      const { result } = response;
      commit('setUserData', result);
      if (result.wallet?.address) connectWithMnemonic(result.wallet.address);
      return response;
    } catch (e) {
      console.error(e);
      return false;
    }
  },
  async getSpecialUserData({ commit }, id) {
    try {
      const { result } = await this.$axios.$get(`/v1/profile/${id}`);
      return result;
    } catch (e) {
      return false;
    }
  },
  async getUserByWalletAddress({ commit }, address) {
    try {
      const { result } = await this.$axios.$get(`/v1/profile/wallet/${address}`);
      return result;
    } catch (e) {
      return null;
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
    commit('setTokens', response.result);
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
    try {
      const { result } = await this.$axios.$post('/v1/storage/get-upload-link', config);
      return result;
    } catch (e) {
      return null;
    }
  },
  async uploadFile({ commit }, payload) {
    try {
      await this.$axios.$put(payload.url, payload.data, {
        headers: {
          'Content-Type': payload.contentType,
          'x-amz-acl': 'public-read',
        },
      });
    } catch (e) {
      console.error('user/uploadFile');
    }
  },
  async confirmEnable2FA({ commit }, payload) {
    try {
      const response = await this.$axios.$post('/v1/totp/confirm', payload);
      commit('setEnable2FA', response.result);
      commit('setTwoFAStatus', true);
      return response;
    } catch (e) {
      return {
        ok: e.response.data.ok,
        code: e.response.data.code,
        msg: e.response.data.msg,
        data: e.response.data.data,
      };
    }
  },
  async disable2FA({ commit }, payload) {
    try {
      const response = await this.$axios.$post('/v1/totp/disable', payload);
      commit('setDisable2FA', response.result);
      commit('setTwoFAStatus', false);
      return response;
    } catch (e) {
      return {
        ok: e.response.data.ok,
        code: e.response.data.code,
        msg: e.response.data.msg,
        data: e.response.data.data,
      };
    }
  },
  async enable2FA({ commit }, payload) {
    try {
      const response = await this.$axios.$post('/v1/totp/enable', payload);
      commit('setTwoFACode', response.result);
      return response;
    } catch (e) {
      return {
        ok: e.response.data.ok,
        code: e.response.data.code,
        msg: e.response.data.msg,
        data: e.response.data.data,
      };
    }
  },
  async validateTOTP({ commit }, payload) {
    try {
      const response = await this.$axios.$post('/v1/auth/session/current/validate-totp', payload);
      return response.result.isValid;
    } catch (e) {
      console.log('user/validateTOTP');
      return false;
    }
  },
  async sendReport(_, payload) {
    try {
      const { ok } = await this.$axios.$post('/v1/report/send', payload);
      return ok;
    } catch (e) {
      console.log('user/sendReport');
      return false;
    }
  },
};

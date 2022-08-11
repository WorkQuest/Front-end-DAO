import { success, error } from '~/utils/success-error';
import { accessLifetime } from '~/utils/constants/cookiesLifetime';
import { Path, UserStatuses } from '~/utils/enums';

export default {
  async signIn({ commit }, { email, password, isRememberMeSelected }) {
    try {
      const {
        result: {
          access, refresh, social, userStatus, address,
        },
      } = await this.$axios.$post('/v1/auth/login', {
        email,
        password,
      });

      commit('setTokens', {
        refresh: isRememberMeSelected ? refresh : null,
        access,
        social,
        userStatus,
      });

      return success({
        access, refresh, social, userStatus, address,
      });
    } catch (e) {
      console.error('user/signIn', e);
      return error(e.code, e.msg);
    }
  },
  async registerWallet({ _ }, payload) {
    try {
      return await this.$axios.$post('/v1/auth/register/wallet', payload);
    } catch (e) {
      console.error('user/registerWallet', e);
      return error(e.code, e.msg);
    }
  },
  async signUp({ commit }, payload) {
    try {
      const response = await this.$axios.$post('/v1/auth/dao/register', payload);
      commit('setTokens', { access: response.result.access });
      return response;
    } catch (e) {
      return error();
    }
  },
  async resendEmail({ _ }, { email }) {
    try {
      const { result } = await this.$axios.$post('/v1/auth/dao/resend-email', { email });
      return success(result);
    } catch (e) {
      console.error('Error in user/resendEmail: ', e);
      return error();
    }
  },
  async confirm({ _ }, payload) {
    try {
      const res = await this.$axios.$post('/v1/auth/confirm-email', payload);
      this.$cookies.set('role', payload.role, {
        path: Path.ROOT,
        maxAge: accessLifetime,
      });
      this.$cookies.set('userStatus', UserStatuses.NeedSetRole, {
        path: Path.ROOT,
        maxAge: accessLifetime,
      });
      return res;
    } catch (e) {
      return error();
    }
  },
  async getUserData({ commit }) {
    try {
      const response = await this.$axios.$get('/v1/profile/me');
      const { result } = response;
      commit('setUserData', result);
      return response;
    } catch (e) {
      console.error(e);
      return false;
    }
  },
  async getSpecialUserData({ _ }, id) {
    try {
      const { result } = await this.$axios.$get(`/v1/profile/${id}`);
      return result;
    } catch (e) {
      return false;
    }
  },
  async getUserByWalletAddress({ _ }, address) {
    try {
      const { result } = await this.$axios.$get(`/v1/profile/wallet/${address}`);
      return result;
    } catch (e) {
      return null;
    }
  },
  async setUserRole({ commit }, payload) {
    try {
      const response = await this.$axios.$post('/v1/profile/set-role', payload);
      commit('setUserRole', response.result);
      return response;
    } catch (e) {
      return error();
    }
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
  async getUploadFileLink({ _ }, config) {
    try {
      const { result } = await this.$axios.$post('/v1/storage/get-upload-link', config);
      return result;
    } catch (e) {
      return null;
    }
  },
  async uploadFile({ _ }, payload) {
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
      console.error('user/confirmEnable2FA', e);
      return error(e.code, e.msg, e.data);
    }
  },
  async disable2FA({ commit }, payload) {
    try {
      const response = await this.$axios.$post('/v1/totp/disable', payload);
      commit('setDisable2FA', response.result);
      commit('setTwoFAStatus', false);
      return response;
    } catch (e) {
      console.error('user/disable2FA', e);
      return error(e.code, e.msg, e.data);
    }
  },
  async enable2FA({ commit }, payload) {
    try {
      const response = await this.$axios.$post('/v1/totp/enable', payload);
      commit('setTwoFACode', response.result);
      return response;
    } catch (e) {
      console.error('user/enable2FA', e);
      return error(e.code, e.msg, e.data);
    }
  },
  async validateTOTP({ _ }, payload) {
    try {
      const response = await this.$axios.$post('/v1/auth/session/current/validate-totp', payload);
      return response.result.isValid;
    } catch (e) {
      console.log('user/validateTOTP');
      return false;
    }
  },
  async sendReport({ _ }, payload) {
    try {
      const { ok } = await this.$axios.$post('/v1/report/send', payload);
      return ok;
    } catch (e) {
      console.log('user/sendReport');
      return false;
    }
  },
};

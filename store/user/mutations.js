/* eslint-disable no-param-reassign */

import { accessLifetime, refreshLifetime } from '~/utils/constants/cookiesLifetime';
import { Path } from '~/utils/enums';

export default {
  setFrozenBalance(state, data) {
    state.frozenBalance = data;
  },
  setLang(state, data) {
    state.currentLang = data;
  },
  setTokens(state, {
    access, refresh, social, userStatus,
  }) {
    state.tokens.access = access;
    state.tokens.refresh = refresh;

    this.$cookies.set('access', access, { path: Path.ROOT, maxAge: accessLifetime });
    this.$cookies.set('refresh', refresh, { path: Path.ROOT, maxAge: refreshLifetime });
    this.$cookies.set('socialNetwork', social, { path: Path.ROOT, maxAge: accessLifetime });
    if (userStatus) {
      this.$cookies.set('userStatus', userStatus, { path: Path.ROOT, maxAge: accessLifetime });
    }
  },
  setUserData(state, data) {
    state.userData = { ...state.userData, ...data };
  },
  setUserRole(state, data) {
    state.userRole = data;
  },
  logOut(state) {
    this.$cookies.remove('access');
    this.$cookies.remove('refresh');
    this.$cookies.remove('status');
    this.$cookies.remove('userStatus');
    this.$cookies.remove('role');
    this.$cookies.remove('userLogin');
    this.$cookies.remove('socialNetwork');

    const redirectTo = sessionStorage.getItem('redirectTo');
    sessionStorage.clear();
    if (redirectTo) sessionStorage.setItem('redirectTo', redirectTo);

    state.userData = {};
    state.tokens = { access: null, refresh: null };
  },
  setCurrentUserPosition(state, data) {
    state.currentUserPosition = data;
  },
  setUserPassword(state, data) {
    state.userDataPassword = data;
  },
  setImage(state, data) {
    state.userData.avatar.url = data;
  },
  setTwoFAStatus(state, data) {
    state.userData.totpIsActive = data;
  },
  setTwoFACode(state, data) {
    state.twoFACode = data;
  },
  setEnable2FA(state, data) {
    state.userEnable2FA = data;
  },
  setDisable2FA(state, data) {
    state.userDisable2FA = data;
  },
};

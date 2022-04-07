/* eslint-disable no-param-reassign */

export default {
  setFreezedBalance(state, data) {
    state.freezedBalance = data;
  },
  setLang(state, data) {
    state.currentLang = data;
  },
  setTokens(state, {
    access, refresh, social, userStatus,
  }) {
    state.tokens.access = access;
    state.tokens.refresh = refresh;
    this.$cookies.set('socialNetwork', social, { path: '/' });
    this.$cookies.set('access', access, { path: '/' });
    this.$cookies.set('refresh', refresh, { path: '/' });
    if (userStatus) {
      this.$cookies.set('userStatus', userStatus, { path: '/' });
    }
  },
  setUserData(state, data) {
    state.userData = data;
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
    sessionStorage.clear();
    state.userData = {};
    state.tokens = { access: '', refresh: '' };
  },
  setCurrentUserPosition(state, data) {
    state.currentUserPosition = data;
  },
  setUserPassword(state, data) {
    state.userDataPassword = data;
  },
  setImageType(state, data) {
    state.imageLink = data;
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

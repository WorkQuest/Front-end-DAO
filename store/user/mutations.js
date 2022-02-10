/* eslint-disable no-param-reassign */

export default {
  setOldTokens(state, { access, refresh }) {
    state.tokens.access = access;
    state.tokens.refresh = refresh;
    this.$cookies.set('access', access, { path: '/' });
    this.$cookies.set('refresh', refresh, { path: '/' });
  },
  setNewTokens(state, { access, refresh }) {
    state.tokens.access = access;
    state.tokens.refresh = refresh;
    this.$cookies.set('access', access, { path: '/' });
    this.$cookies.set('refresh', refresh, { path: '/' });
  },
  setUserData(state, data) {
    state.userData = data;
  },
  setUsersData(state, data) {
    state.usersData = data;
  },
  setSpecialUserData(state, data) {
    state.specialUserData = data;
  },
  setUserRole(state, data) {
    state.userRole = data;
  },
  logOut(state) {
    this.$cookies.remove('access');
    this.$cookies.remove('refresh');
    this.$cookies.remove('status');
    this.$cookies.remove('role');
    state.userData = {};
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

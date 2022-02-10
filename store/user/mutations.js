/* eslint-disable no-param-reassign */

export default {
  setTokens(state, payload) {
    const { access, refresh } = payload;
    state.tokens.access = access;
    state.tokens.refresh = refresh;
    this.$cookies.set('access', access, { path: '/' });
    this.$cookies.set('refresh', refresh, { path: '/' });
    if (payload.userStatus) { this.$cookies.set('userStatus', payload.userStatus, { path: '/' }); }
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
};

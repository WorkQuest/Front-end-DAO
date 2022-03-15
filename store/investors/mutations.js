/* eslint-disable no-param-reassign */

export default {
  setInvestors(state, { count, users }) {
    state.investors = {
      count,
      list: users,
    };
  },
  setInvestor(state, user) {
    state.investor = user;
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
  changeProfile(state, data) {
    state.isProfileEdit = data;
  },
  setLastPage(state, page) {
    state.lastPage = page;
  },
  setDelegatedToUser(state, data) {
    state.delegatedToUser = data;
  },
};

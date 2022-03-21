/* eslint-disable no-param-reassign */

export default {
  setInvestors(state, { count, users }) {
    state.investors = {
      count,
      list: users,
    };
  },
  setLastPage(state, page) {
    state.lastPage = page;
  },
  setDelegatedToUser(state, data) {
    state.delegatedToUser = data;
  },
};

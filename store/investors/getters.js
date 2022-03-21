export default {
  getInvestorsList: (state) => state.investors.list,
  getInvestorsCount: (state) => state.investors.count,
  getLastPage: (state) => state.lastPage,
  getDelegatedToUser: (state) => state.delegatedToUser,
};

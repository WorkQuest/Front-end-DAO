export default () => ({
  proposalThreshold: null,
  cards: [],
  cardsCount: 0,
  filters: {
    lastPage: 1,
    search: '',
    sortVoteStatus: 0,
    isDescending: true,
  },

  // TODO: remove
  isChairpersonRole: false,
  chairpersonRoleHash: null,
});

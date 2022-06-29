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

  // TODO: check it, logic for chair person will be here
  isChairpersonRole: false,
  chairpersonRoleHash: null,
});

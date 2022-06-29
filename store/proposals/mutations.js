export default {
  setProposalThreshold(state, payload) {
    state.proposalThreshold = payload;
  },
  setCards(state, payload) {
    state.cards = payload;
  },
  setCardsCount(state, payload) {
    state.cardsCount = payload;
  },
  setFilters(state, payload) {
    state.filters = payload;
  },

  // TODO: check it, logic for chair person will be here
  setIsChairpersonRole(state, payload) {
    state.isChairpersonRole = payload;
  },
  setChairpersonRoleHash(state, payload) {
    state.chairpersonRoleHash = payload;
  },
};

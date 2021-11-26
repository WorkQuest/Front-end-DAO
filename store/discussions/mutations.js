export default {
  setDiscussions(state, data) {
    state.discussions = data.discussions;
    state.discussionCount = data.count;
  },
  setUsersLikesOnComment(state, data) {
    state.usersLikesOnComment = data;
  },
  setUsersSubCommentsOnComment(state, data) {
    state.usersSubCommentsOnComment = data;
  },
  setPeopleListWhoLikeDiscussion(state, data) {
    state.peopleListWhoLikeDiscussion = data;
  },
  setRootComments(state, data) {
    state.rootComments = data;
  },
};

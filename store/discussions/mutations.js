export default {
  setCurrentDiscussion(state, data) {
    state.currentDiscussion = data;
  },
  setDiscussions(state, value) {
    state.discussions = value;
  },
  setDiscussionsCount(state, value) {
    state.discussionsCount = value;
  },
  setUsersLikesOnComment(state, data) {
    state.usersLikesOnComment = data;
  },
  subCommentLevel2(state, data) {
    state.subCommentLevel2 = data;
  },
  subCommentLevel3(state, data) {
    state.subCommentLevel2 = data;
  },
  subCommentLevel4(state, data) {
    state.subCommentLevel2 = data;
  },
  subCommentLevel5(state, data) {
    state.subCommentLevel2 = data;
  },
  setPeopleListWhoLikeDiscussion(state, data) {
    state.peopleListWhoLikeDiscussion = data;
  },
  setRootComments(state, data) {
    state.rootComments = data;
  },
};

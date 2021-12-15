export default {
  setCurrentDiscussion(state, data) {
    state.currentDiscussion = data;
  },
  setDiscussions(state, data) {
    state.discussions = data.discussions;
    state.discussionCount = data.count;
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

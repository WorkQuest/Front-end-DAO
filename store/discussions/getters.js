export default {
  getCurrentDiscussion: (state) => state.currentDiscussion,
  getDiscussions: (state) => state.discussions,
  getUsersLikesOnComment: (state) => state.usersLikesOnComment,
  getUsersSubCommentsOnComment: (state) => state.usersSubCommentsOnComment,
  getPeopleListWhoLikeDiscussion: (state) => state.peopleListWhoLikeDiscussion,
  getRootComments: (state) => state.rootComments,
};

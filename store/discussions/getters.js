export default {
  getCurrentDiscussionAuthorData: (state) => state.currentDiscussion?.author,
  getCurrentDiscussionAuthorAvatarUrl: (state) => state.currentDiscussion?.author?.avatar?.url || null,
  getCurrentDiscussion: (state) => state.currentDiscussion,
  getDiscussions: (state) => state.discussions,
  getUsersLikesOnComment: (state) => state.usersLikesOnComment,
  getUsersSubCommentsOnComment: (state) => state.usersSubCommentsOnComment,
  getPeopleListWhoLikeDiscussion: (state) => state.peopleListWhoLikeDiscussion,
  getRootComments: (state) => state.rootComments,
};

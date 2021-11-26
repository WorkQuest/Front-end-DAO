export default {
  getCurrentDiscussionAuthorData: (state) => state.currentDiscussion?.author,
  getCurrentDiscussionAuthorFirstName: (state) => state.currentDiscussion?.author.firstName,
  getCurrentDiscussionAuthorLastName: (state) => state.currentDiscussion?.author.lastName,
  getCurrentDiscussionAuthorAvatarUrl: (state) => state.currentDiscussion?.author?.avatar?.url,
  getCurrentDiscussion: (state) => state.currentDiscussion,
  getDiscussions: (state) => state.discussions,
  getUsersLikesOnComment: (state) => state.usersLikesOnComment,
  getUsersSubCommentsOnComment: (state) => state.usersSubCommentsOnComment,
  getPeopleListWhoLikeDiscussion: (state) => state.peopleListWhoLikeDiscussion,
  getRootComments: (state) => state.rootComments,
};

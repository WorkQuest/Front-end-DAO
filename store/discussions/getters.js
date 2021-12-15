export default {
  getCurrentDiscussionAuthorData: (state) => state.currentDiscussion?.author,
  getCurrentDiscussionAuthorAvatarUrl: (state) => state.currentDiscussion?.author?.avatar?.url || null,
  getCurrentDiscussion: (state) => state.currentDiscussion,
  getDiscussions: (state) => state.discussions,
  getUsersLikesOnComment: (state) => state.usersLikesOnComment,
  getSubCommentsLevel2: (state) => state.subCommentLevel2,
  getSubCommentsLevel3: (state) => state.subCommentLevel3,
  getSubCommentsLevel4: (state) => state.subCommentLevel4,
  getSubCommentsLevel5: (state) => state.subCommentLevel5,
  getPeopleListWhoLikeDiscussion: (state) => state.peopleListWhoLikeDiscussion,
  getRootComments: (state) => state.rootComments,
};

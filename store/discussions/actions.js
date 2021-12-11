export default {
  async getDiscussions({ commit }, additionalValue) {
    try {
      const response = await this.$axios.$get(`/v1/discussions?${additionalValue || 'limit=8'}`);
      commit('setDiscussions', response.result);
      return response.result;
    } catch (e) {
      return console.log(e);
    }
  },
  async getCurrentDiscussion({ commit }, discussionId) {
    try {
      const response = await this.$axios.$get(`/v1/discussion/${discussionId}`);
      commit('setCurrentDiscussion', response.result);
      return response.result;
    } catch (e) {
      return console.log(e);
    }
  },
  async createDiscussion({ commit }, payload) {
    try {
      const response = await this.$axios.$post('/v1/discussion/create', payload);
      commit('setCurrentDiscussion', response.result);
      return response.result;
    } catch (e) {
      return console.log(e);
    }
  },
  async sendCommentOnDiscussion({ commit }, { discussionId, payload }) {
    try {
      const response = await this.$axios.$post(`/v1/discussion/${discussionId}/comment/send`, payload);
      return response.result;
    } catch (e) {
      return console.log(e);
    }
  },
  async getUsersSubCommentsOnComment({ commit }, commentId) {
    try {
      const response = await this.$axios.$get(`/v1/discussion/comment/${commentId}/sub-comments`);
      commit('setUsersSubCommentsOnComment', response.result);
      return response.result;
    } catch (e) {
      return console.log(e);
    }
  },
  async changeLikeOnDiscussion({ commit }, { id, method }) {
    try {
      if (method === 'delete') {
        const response = await this.$axios.$delete(`/v1/discussion/${id}/like`);
        return response.result;
      }
      const response = await this.$axios.$post(`/v1/discussion/${id}/like`);
      return response.result;
    } catch (e) {
      return console.log(e);
    }
  },
  // TODO: Удалить методы
  async deleteLikeOnDiscussion({ commit }, discussionId) {
    try {
      const response = await this.$axios.$delete(`/v1/discussion/${discussionId}/like`);
      return response.result;
    } catch (e) {
      return console.log(e);
    }
  },
  async addLikeOnDiscussion({ commit }, discussionId) {
    try {
      const response = await this.$axios.$post(`/v1/discussion/${discussionId}/like`);
      return response.result;
    } catch (e) {
      return console.log(e);
    }
  },
  async getRootComments({ commit }, { discussionId, additionalValue }) {
    try {
      const response = await this.$axios.$get(`/v1/discussion/${discussionId}/root-comments?${additionalValue || 'limit=4'}`);
      commit('setRootComments', response.result);
      return response.result;
    } catch (e) {
      return console.log(e);
    }
  },
  async addLikeOnComment({ commit }, commentId) {
    try {
      const response = await this.$axios.$post(`/v1/discussion/comment/${commentId}/like`);
      return response.result;
    } catch (e) {
      return console.log(e);
    }
  },
  async deleteLikeOnComment({ commit }, commentId) {
    try {
      const response = await this.$axios.$delete(`/v1/discussion/comment/${commentId}/like`);
      return response.result;
    } catch (e) {
      return console.log(e);
    }
  },
  // TODO: Интегрировать методы
  async getPeopleListWhoLikeDiscussion({ commit }, discussionId) {
    try {
      const response = await this.$axios.$get(`/v1/discussion/comment/${discussionId}/usersLikes`);
      commit('setPeopleListWhoLikeDiscussion', response.result);
      return response.result;
    } catch (e) {
      return console.log(e);
    }
  },
  async getUsersLikesOnComment({ commit }, commentId) {
    try {
      const response = await this.$axios.$get(`/v1/discussion/comment/${commentId}/usersLikes`);
      commit('setUsersLikesOnComment', response.result);
      return response.result;
    } catch (e) {
      return console.log(e);
    }
  },
};

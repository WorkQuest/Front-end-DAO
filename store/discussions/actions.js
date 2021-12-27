import { error, success } from '~/utils/success-error';

export default {
  async getAllDiscussions({ commit }, queries) {
    try {
      if (!queries.q) delete queries.q;
      const { result } = await this.$axios.$get('/v1/discussions', {
        params: { ...queries },
      });
      commit('setDiscussions', result.discussions);
      commit('setDiscussionsCount', result.count);
      return result;
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
      return success(response.result);
    } catch (e) {
      console.log(e);
      return error();
    }
  },
  async sendCommentOnDiscussion({ commit }, { id, payload }) {
    try {
      const response = await this.$axios.$post(`/v1/discussion/${id}/comment/send`, payload);
      return response.result;
    } catch (e) {
      return console.log(e);
    }
  },
  async getSubCommentsLevel({ commit }, { id, additionalValue }) {
    try {
      const response = await this.$axios.$get(`/v1/discussion/comment/${id}/sub-comments?${additionalValue || 'limit=5'}`);
      return response.result;
    } catch (e) {
      return console.log(e);
    }
  },

  async toggleLikeOnComment({ commit }, { id, like }) {
    try {
      let response = '';
      if (like) response = await this.$axios.$post(`/v1/discussion/comment/${id}/like`);
      if (!like) response = await this.$axios.$delete(`/v1/discussion/comment/${id}/like`);
      return response.result;
    } catch (e) {
      return console.log(e);
    }
  },

  async toggleStarOnDiscussion({ commit }, { id, like }) {
    try {
      if (like) await this.$axios.$post(`/v1/discussion/${id}/star`);
      else await this.$axios.$delete(`/v1/discussion/${id}/star`);
      return true;
    } catch (e) {
      return console.log(e);
    }
  },

  async toggleLikeOnDiscussion({ commit }, { id, like }) {
    try {
      if (like) await this.$axios.$post(`/v1/discussion/${id}/like`);
      else await this.$axios.$delete(`/v1/discussion/${id}/like`);
      return true;
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

import { error, success } from '~/utils/success-error';

export default {
  async setDiscussionDocuments({ commit }, data) {
    commit('setDiscussionDocuments', data);
    return data;
  },
  async setDiscussionImages({ commit }, data) {
    commit('setDiscussionImages', data);
    return data;
  },
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
      const { result } = await this.$axios.$get(`/v1/discussion/${discussionId}`);
      commit('setCurrentDiscussion', result);
      return result;
    } catch (e) {
      return console.log(e);
    }
  },
  async createDiscussion({ commit }, payload) {
    try {
      const { result } = await this.$axios.$post('/v1/discussion/create', payload);
      commit('setCurrentDiscussion', result);
      return success(result);
    } catch (e) {
      console.log(e);
      return error();
    }
  },
  async sendCommentOnDiscussion({ _ }, { id, payload }) {
    try {
      const { result } = await this.$axios.$post(`/v1/discussion/${id}/comment/send`, payload);
      return result;
    } catch (e) {
      return console.log(e);
    }
  },
  async getSubCommentsLevel({ _ }, { id, additionalValue }) {
    try {
      const response = await this.$axios.$get(`/v1/discussion/comment/${id}/sub-comments?${additionalValue || 'limit=5'}`);
      return response.result;
    } catch (e) {
      return console.log(e);
    }
  },

  async toggleLikeOnComment({ _ }, { id, like }) {
    try {
      let response = '';
      if (like) response = await this.$axios.$post(`/v1/discussion/comment/${id}/like`);
      if (!like) response = await this.$axios.$delete(`/v1/discussion/comment/${id}/like`);
      return response.result;
    } catch (e) {
      return console.log(e);
    }
  },

  async toggleStarOnDiscussion({ _ }, { id, like }) {
    try {
      if (like) await this.$axios.$post(`/v1/discussion/${id}/star`);
      else await this.$axios.$delete(`/v1/discussion/${id}/star`);
      return true;
    } catch (e) {
      return console.log(e);
    }
  },

  async toggleLikeOnDiscussion({ _ }, { id, like }) {
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
      const { result } = await this.$axios.$get(`/v1/discussion/${discussionId}/root-comments?${additionalValue || 'limit=4'}`);
      commit('setRootComments', result);
      return result;
    } catch (e) {
      return console.log(e);
    }
  },

  async getPeopleListWhoLikeDiscussion({ commit }, discussionId) {
    try {
      const { result } = await this.$axios.$get(`/v1/discussion/comment/${discussionId}/usersLikes`);
      commit('setPeopleListWhoLikeDiscussion', result);
      return result;
    } catch (e) {
      return console.log(e);
    }
  },
  async getUsersLikesOnComment({ commit }, commentId) {
    try {
      const { result } = await this.$axios.$get(`/v1/discussion/comment/${commentId}/usersLikes`);
      commit('setUsersLikesOnComment', result);
      return result;
    } catch (e) {
      return console.log(e);
    }
  },
};

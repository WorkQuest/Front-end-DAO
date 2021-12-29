<template>
  <div class="comment">
    <div class="comment__field comment_sub">
      <div class="comment__user user">
        <img
          :src="data && data.author && data.author.avatar && data.author.avatar.url ? data.author.avatar.url : require('~/assets/img/app/avatar_empty.png')"
          alt="userAvatar"
          class="user__avatar"
          @click="toInvestor(data.author.id)"
        >
        <div
          class="user__name"
          @click="toInvestor(data.author.id)"
        >
          {{ authorName(data) }}
        </div>
        <div class="user__date">
          {{ $moment(data.createdAt).startOf('minute').fromNow() }}
        </div>
      </div>
      <base-files
        v-if="documents.length"
        class="comment__files"
        :items="documents"
      />
      <base-images
        v-if="images.length"
        class="comment__images"
        mode="images"
        :items="images"
        :is-show-download="false"
      />
      <div class="comment__description">
        {{ data.text }}
      </div>
      <div class="comment__bottom bottom">
        <base-btn
          class="bottom__btn"
          mode="blue"
          @click="toggleReply"
        >
          {{ !isReply ? $t('discussions.reply') : $t('discussions.cancel') }}
        </base-btn>
        <base-btn
          v-if="data.amountSubComments > 0"
          class="bottom__btn"
          @click="toggleShowSubComments(data)"
        >
          {{ !filterComments(subComments, data.id).length ? $t('discussions.show') : $t('discussions.hide') }}
        </base-btn>
        <div class="bottom__panel">
          <base-btn
            class="bottom__like"
            mode="like"
          >
            <span
              :class="{'bottom__like_chosen': data.commentLikes.length > 0}"
              class="icon-heart_fill bottom__like"
              @click="toggleLikeOnComment(data)"
            />
          </base-btn>
          <div class="bottom__counter bottom__counter_right">
            {{ data.amountLikes }}
          </div>
        </div>
      </div>
      <comment-footer
        v-if="isReply"
        :comment="data"
      />
    </div>
    <comment-field
      v-for="(sub) in filterComments(subComments, data.id)"
      :key="sub.id"
      class="comment comment__container subcomment subcomment__field"
      :data="sub"
      :array="filterComments(subComments, data.id)"
    />
    <base-btn
      v-if="isShowBtnMoreComments"
      class="subcomment__btn"
      @click="loadMoreSubsPrev(data.rootCommentId)"
    >
      {{ $t('discussions.comments.showMoreComments') }}
    </base-btn>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Comment',
  props: {
    data: {
      type: Object,
      default: null,
    },
    array: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      showSubs: false,
      subCommentsOnPage: 5,
      isReply: false,
      subComments: [],
      count: 1,
      documents: [],
      images: [],
    };
  },
  computed: {
    ...mapGetters({
      currentDiscussion: 'discussions/getCurrentDiscussion',
    }),
    isShowBtnMoreComments() {
      return this.array[this.array.length - 1].id === this.data.id
          && this.array[this.array.length - 1].rootComment.amountSubComments > this.subCommentsOnPage
          && this.array.length !== this.array[this.array.length - 1].rootComment.amountSubComments;
    },
  },
  async mounted() {
    await this.filterMediaToTypes();
  },
  methods: {
    async getRootComments() {
      this.$parent.getRootComments();
    },
    async filterMediaToTypes() {
      this.documents = this.data.medias.filter((file) => file.contentType === 'application/msword' || file.contentType === 'application/pdf');
      this.images = this.data.medias.filter((file) => file.contentType === 'image/jpeg' || file.contentType === 'image/png');
    },
    toggleShowSubComments(comment) {
      this.showSubs = false;
      if (!this.filterComments(this.subComments, comment.id).length || this.showSubs) {
        this.loadSubs(comment.id);
      }
      this.clearSubs();
    },
    async loadMoreSubsPrev(rootId) {
      this.$parent.increaseCounter();
      this.$parent.loadMoreSubs(rootId);
    },
    increaseCounter() {
      this.count += 1;
    },
    async loadMoreSubs(rootId) {
      const additionalValue = `limit=${this.subCommentsOnPage * this.count}`;
      const res = await this.$store.dispatch('discussions/getSubCommentsLevel', { id: rootId, additionalValue });
      if (this.subComments.length > 0) this.subComments = [];
      return this.subComments.push(...res.comments);
    },
    async loadSubs(rootId) {
      const res = await this.$store.dispatch('discussions/getSubCommentsLevel', { id: rootId });
      if (this.subComments.length > 0) this.subComments = [];
      return this.subComments.push(...res.comments);
    },
    clearSubs() {
      this.subComments = [];
    },
    filterComments(subComments, rootId) {
      return subComments.filter((item) => item.rootCommentId === rootId);
    },
    toggleReply() {
      this.isReply = !this.isReply;
    },
    authorName(item) {
      if (item && item.author) return `${item.author.firstName} ${item.author.lastName}`;
      return this.$t('user.nameless');
    },
    toInvestor(authorId) {
      this.$router.push(`/investors/${authorId}`);
    },
    async toggleLikeOnComment(comment) {
      if (comment) {
        if (Object.keys(comment.commentLikes).length === 0) {
          await this.$store.dispatch('discussions/toggleLikeOnComment', { id: comment.id, like: true });
          if (comment.rootCommentId) this.$parent.loadSubs(comment.rootCommentId);
          else if (!comment.rootCommentId) this.$parent.getRootComments();
        } if (Object.keys(comment.commentLikes).length > 0) {
          await this.$store.dispatch('discussions/toggleLikeOnComment', { id: comment.id, like: false });
          if (comment.rootCommentId) this.$parent.loadSubs(comment.rootCommentId);
          else if (!comment.rootCommentId) this.$parent.getRootComments();
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.hide {
  visibility: hidden;
}
.comment {
  animation: show  1s 1;
  padding: 0 0 0 15px;
  display: flex;
  &__container {
    display: flex;
    flex-direction: column;
  }
  &__field {
    width: 100%;
    background: #FFFFFF;
    border-radius: 8px;
  }
  &__user {
    margin: 20px 0 0 20px;
  }
  &__bottom {
    margin: 25px 20px 25px 30px;
  }
  &__images {
    margin-left: 20px;
  }
  &__files {
    margin-left: 20px;
  }
  &__description {
    @include text-usual;
    color: #7C838D;
    align-self: stretch;
    margin: 20px 20px 25px 20px;
    overflow-wrap: break-word;
    word-break: break-all;
    width: 100%;
    display: flex;
  }
  &_sub {
    margin-left: 15px;
  }
}
.subcomment {
  &__field {
    display: flex;
    flex-direction: column;
  }
  &__btn {
    @include text-usual;
    justify-self: center;
    background: transparent;
    margin-left: auto;
    margin-right: auto;
    color: $blue;
    width: 190px;
    height: 33px;
    border-radius: 6px;
    border: none;
    outline: none;
    &:hover {
      background: transparent;
      color: #103D7C;
    }
  }
}
.user {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  &__avatar {
    flex: 0 0 0 32px;
    width: 32px;
    height: 32px;
    left: 0;
    top: 0;
    border-radius: 50%;
    cursor: pointer;
    object-fit: cover;
  }
  &__name {
    @include text-usual;
    color: #1D2127;
    padding: 0 10px 0 10px;
    cursor: pointer;
  }
  &__date {
    font-size: 12px;
    line-height: 130%;
    color: #AAB0B9;
  }
}
.bottom {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  a.nuxt-link-active {
    text-decoration: none;
  }
  &__panel {
    display: flex;
    align-items: center;
    justify-items: right;
    width: 100%;
  }
  &__btn {
    @include text-usual;
    background: transparent;
    color: $blue;
    width: 190px;
    height: 33px;
    border-radius: 6px;
    border: none;
    outline: none;
    &:hover {
      background: transparent;
      color: #103D7C;
    }
  }
  &__like {
    margin-left: auto;
    margin-top: 0;
    color: #E9EDF2;
    font-size: 22px;
    transition: 0.5s;
    &:hover {
      color: #0083C7;
    }
    &_chosen {
      color: #0083C7;
      &:hover {
        color: #E9EDF2;
      }
    }
  }
  &__counter {
    font-size: 14px;
    line-height: 18px;
    color: #1D2127;
    margin: 0 22px 0 8px;
    cursor: pointer;
    &_right {
      margin: 7px 7px 7px 0;
    }
  }
}
</style>

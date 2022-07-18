<template>
  <div
    :id="data.id"
    class="comment"
  >
    <div class="comment__field comment_sub">
      <div class="comment__user user">
        <img
          :src="avatarUrl"
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
        <div class="bottom__left">
          <base-btn
            v-if="data.level !== 4"
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
        </div>
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
          <button
            v-if="showReportBtn"
            class="bottom__like"
          >
            <span
              class="icon-warning_outline bottom__like"
              @click="showReportModal"
            />
          </button>
        </div>
      </div>
      <comment-footer
        v-if="isReply"
        :is-reply.sync="isReply"
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
import modals from '~/store/modals/modals';

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
      userData: 'user/getUserData',
    }),
    avatarUrl() {
      if (this.data.author.avatar && this.data.author.avatar.url) {
        return this.data.author.avatar.url;
      }
      return require('~/assets/img/app/avatar_empty.png');
    },
    showReportBtn() {
      const { id: authorId } = this.data.author;
      const { id: userID } = this.userData;
      return authorId !== userID;
    },
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
      this.SetLoader(true);
      this.showSubs = false;
      if (!this.filterComments(this.subComments, comment.id).length || this.showSubs) {
        this.loadSubs(comment.id);
      }
      this.clearSubs();
      this.SetLoader(false);
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
      this.SetLoader(true);
      const res = await this.$store.dispatch('discussions/getSubCommentsLevel', { id: rootId });
      if (this.subComments.length > 0) this.subComments = [];
      this.SetLoader(false);
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
      return this.UserName(item?.author?.firstName, item?.author?.lastName);
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
    showReportModal() {
      const { author, id: entityId } = this.data;
      this.ShowModal({
        key: modals.reports,
        title: `${author.firstName} ${author.lastName}`,
        entityId,
        entityType: 'DiscussionComment',
      });
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
  margin-left: 30px;
  display: flex;
  &:first-child {
    margin: 0;
  }
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
    margin: 20px 0 20px 20px;
    overflow-wrap: break-word;
    word-break: break-all;
    display: flex;
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
    transition: .5s;
    &:hover {
      background: $blue;
      color: $white;
    }
  }
}
.user {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  &__avatar {
    flex: 0 0 32px;
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
  &__left {
    display: flex;
  }
  &__panel {
    display: flex;
    align-items: center;
    justify-items: right;
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
    transition: .5s;
    &:first-child {
      width: 90px;
      margin-right: 5px;
    }
    &:hover {
      background: $blue;
      color: $white;
    }
  }
  &__like {
    width: 40px;
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
@include _480 {
  .comment {
    margin-left: 10px;
    align-items: flex-end;
    &__field {
      max-width: 300px;
    }

    &__description {
      word-break: break-word;
    }

    &__user {
      margin: 10px 0 0 10px;
      display: grid;
      max-width: 320px;
      grid-template-columns: max-content 200px;
      gap: 0;
      grid-template-areas:
    "user__avatar user__name"
    "user__date . "
    }
    &__bottom {
      margin: 15px 10px 15px 10px;
      flex-direction: column;
      align-items: end;
    }
  }

  .bottom {
    &__btn {
      width: max-content;
      padding: 0 10px;
      justify-content: end;
    }
  }
}
</style>

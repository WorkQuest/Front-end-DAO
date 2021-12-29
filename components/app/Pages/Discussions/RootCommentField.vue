<template>
  <div class="comment">
    <div class="comment__field">
      <div class="comment__user user">
        <img
          :src="comment && comment.author && comment.author.avatar && comment.author.avatar.url ? comment.author.avatar.url : require('~/assets/img/app/avatar_empty.png')"
          alt="userAvatar"
          class="user__avatar"
          @click="toInvestor(comment.author.id)"
        >
        <div
          class="user__name"
          @click="toInvestor(comment.author.id)"
        >
          {{ authorName(comment) }}
        </div>
        <div class="user__date">
          {{ $moment(comment.createdAt).startOf('minute').fromNow() }}
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
        {{ comment.text }}
      </div>
      <div class="comment__bottom bottom">
        <base-btn
          v-if="comment.amountSubComments > 0"
          class="comment__btn"
          @click="toggleShowSubComments(comment)"
        >
          {{ !filterComments(subComments, comment.id).length && comment.amountSubComments > 0 ? $t('discussions.show') : $t('discussions.hide') }}
        </base-btn>
        <div class="bottom bottom__footer">
          <div class="bottom__footer">
            <div class="bottom__comment">
              <img
                src="~assets/img/ui/comment.svg"
                alt=""
              >
            </div>
            <div class="bottom__counter">
              {{ comment.amountSubComments }}
            </div>
            <button class="bottom__like">
              <span
                :class="{'bottom__like_chosen' : comment.commentLikes.length > 0}"
                class="icon-heart_fill bottom__like"
                @click="toggleLikeOnComment(comment)"
              />
            </button>
            <div class="bottom__counter bottom__counter_right">
              {{ comment.amountLikes }}
            </div>
          </div>
        </div>
      </div>
      <comment-field
        v-for="(sub) in filterComments(subComments, comment.id)"
        :key="sub.id"
        class="comment comment__subcomment subcomment subcomment__field"
        :data="sub"
        :array="filterComments(subComments, comment.id)"
      />
    </div>
    <comment-footer :comment="comment" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'RootCommentField',
  props: {
    comment: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      showSubs: false,
      subCommentsOnPage: 5,
      comments: [],
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
  },
  async mounted() {
    await this.filterMediaToTypes();
  },
  methods: {
    async filterMediaToTypes() {
      this.documents = this.comment.medias.filter((file) => file.contentType === 'application/msword' || file.contentType === 'application/pdf');
      this.images = this.comment.medias.filter((file) => file.contentType === 'image/jpeg' || file.contentType === 'image/png');
    },
    clearSubs() {
      this.subComments = [];
    },
    toggleShowSubComments(comment) {
      this.showSubs = false;
      if (!this.filterComments(this.subComments, comment.id).length || this.showSubs) {
        this.loadSubs(comment.id);
      }
      this.clearSubs();
    },
    async toggleLikeOnComment(comment) {
      await this.$store.dispatch('discussions/toggleLikeOnComment', { id: comment.id, like: comment && !Object.keys(comment.commentLikes).length > 0 });
      await this.getRootComments();
    },
    async getRootComments() {
      this.$parent.getRootComments();
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
    filterComments(subComments, rootId) {
      return subComments.filter((item) => item.rootCommentId === rootId);
    },
    authorName(item) {
      if (item && item.author) return `${item.author.firstName} ${item.author.lastName}`;
      return this.$t('user.nameless');
    },
    toInvestor(authorId) {
      this.$router.push(`/investors/${authorId}`);
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
  padding: 0 30px 0 0;
  display: flex;
  &__subcomment {
    display: flex;
    flex-direction: column;
  }
  &__field {
    width: 100%;
    background: #FFFFFF;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
  }
  &__images {
    margin-left: 20px;
  }
  &__files {
    margin-left: 20px;
  }
  &__user {
    margin: 20px 0 0 20px;
  }
  &__bottom {
    margin: 25px 20px 25px 30px;
  }
  &__btn {
    @include text-usual;
    background: transparent;
    color: $blue;
    width: 160px;
    height: 33px;
    border-radius: 6px;
    border: none;
    outline: none;
    &:hover {
      background: transparent;
      color: #103D7C;
    }
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
    flex-direction: row;
    align-items: center;
  }
  &__btn {
    @include text-usual;
    width: 80px;
    height: 33px;
    border-radius: 6px;
    border: none;
    outline: none;
  }
  &__comment {
    height: 18px;
    width: 18px;
    cursor: pointer;
  }
  &__counter {
    font-size: 14px;
    line-height: 18px;
    color: #1D2127;
    margin: 0 22px 0 8px;
    cursor: pointer;
    &_right {
      margin: 7px;
    }
  }
  &__footer {
    display: flex;
    align-items: center;
    margin-left: auto;
  }
  &__like {
    width: 40px;
    margin-left: auto;
    margin-top: 5px;
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
}
</style>

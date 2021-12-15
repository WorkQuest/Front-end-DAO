<template>
  <div
    class="comment"
  >
    <div
      class="comment__field"
      :class="`comment_sub${level}`"
    >
      <div class="comment__user user">
        <img
          :src="authorAvatarSrc(data)"
          alt="userAvatar"
          class="user__avatar"
          @click="toInvestor(data.author.id)"
        >
        <div
          class="user__name"
          @click="toInvestor(data.author.id)"
        >
          {{ authorFirstName(data) }}
          {{ authorLastName(data) }}
        </div>
        <div class="user__date">
          {{ $moment(data.updatedAt).format('Do MMMM YYYY, hh:mm a') }}
        </div>
      </div>
      <div class="comment__description">
        {{ data.text }}
      </div>
      <div
        class="comment__bottom bottom"
      >
        <base-btn
          v-if="level !== 5"
          class="bottom__btn"
          mode="blue"
          @click="toggleReply"
        >
          {{ !isReply ? $t('discussions.reply') : $t('discussions.cancel') }}
        </base-btn>
        <!--        <base-btn-->
        <!--          v-if="data.amountSubComments > 0"-->
        <!--          class="bottom__btn"-->
        <!--          mode="blue"-->
        <!--          @click="switchCommentLevel(data, level)"-->
        <!--        >-->
        <!--          {{ data ? $t('discussions.hide') : $t('discussions.show') }}-->
        <!--        </base-btn>-->
        <div class="bottom__panel">
          <base-btn
            class="bottom__like"
            mode="like"
          >
            <span
              :class="{'bottom__like_chosen': data.commentLikes.length > 0}"
              class="icon-heart_fill bottom__like"
              @click="toggleLikeOnComment(data, level)"
            />
          </base-btn>
          <div class="bottom__counter bottom__counter_right">
            {{ data.amountLikes }}
          </div>
        </div>
      </div>
      <div
        v-if="isReply"
        class="answers__footer footer"
      >
        <span class="icon-link footer__chain" />
        <input
          v-model="subCommentInput"
          class="footer__input"
          :placeholder="$t('discussions.input')"
        >
        <span
          class="icon-send footer__arrow"
          @click="addSubCommentResponse(data, level)"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Comment',
  props: {
    data: {
      type: Object,
      default: null,
    },
    level: {
      type: Number,
      default: 1,
    },
    discussionId: {
      type: String,
      default: () => '',
    },
  },
  data() {
    return {
      isReply: false,
      subCommentInput: '',
    };
  },
  methods: {
    authorAvatarSrc(item) {
      console.log(this.data);
      if (item && item.author.avatar.url) return item.author.avatar.url;
      return require('~/assets/img/app/avatar_empty.png');
    },
    toggleReply() {
      this.isReply = !this.isReply;
    },
    authorFirstName(item) {
      if (item && item.author.firstName) return item.author.firstName;
      return this.$t('user.nameless');
    },
    authorLastName(item) {
      if (item && item.author.lastName) return item.author.lastName;
      return '';
    },
    toInvestor(authorId) {
      this.$router.push(`/investors/${authorId}`);
    },
    // async switchCommentLevel(comment, level) {
    //   console.log(level);
    //   console.log(comment);
    //   if (!comment) {
    //     if (comment.rootCommentId) this.$parent.loadSubs(comment.rootCommentId, level);
    //     if (!comment.rootCommentId) this.$parent.loadSubs(comment.id, level);
    //   } if (comment) {
    //     this.$parent.clearSubs(level);
    //   }
    // },
    async addSubCommentResponse(comment, level) {
      const { discussionId } = this;
      const payload = {
        rootCommentId: comment.rootCommentId,
        text: this.subCommentInput,
        medias: [],
      };
      await this.$store.dispatch('discussions/sendCommentOnDiscussion', { discussionId, payload });
      if (comment.rootCommentId) this.$parent.loadSubs(comment.rootCommentId, level);
      this.isReply = false;
      this.subCommentInput = '';
    },
    async toggleLikeOnComment(comment, level) {
      if (comment && Object.keys(comment.commentLikes).length > 0) {
        await this.$store.dispatch('discussions/toggleLikeOnComment', { id: comment.id, like: false });
        if (comment.rootCommentId) this.$parent.loadSubs(comment.rootCommentId, level);
        else if (!comment.rootCommentId) this.$parent.getRootComments();
      } if (comment && Object.keys(comment.commentLikes).length === 0) {
        await this.$store.dispatch('discussions/toggleLikeOnComment', { id: comment.id, like: true });
        if (comment.rootCommentId) this.$parent.loadSubs(comment.rootCommentId, level);
        else if (!comment.rootCommentId) this.$parent.getRootComments();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.comment {
  padding: 10px;
  display: flex;
  margin-bottom: 10px;
  &__field {
    width: 1080px;
    background: #FFFFFF;
    border-radius: 8px;
    padding: 20px 40px 0 20px;
    margin: 0 20px 0 10px;
  }
  &__description {
    @include text-usual;
    color: #7C838D;
    align-self: stretch;
    margin: 25px 0 25px 0;
  }
  &__footer {
    margin-top: 20px;
    margin-bottom: 20px;
  }
  &_sub2 {
   margin-left: 20px;
  }
  &_sub3 {
   margin-left: 40px;
  }
  &_sub4 {
   margin-left: 60px;
  }
  &_sub5 {
   margin-left: 80px;
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
  }
  &__btn {
    @include text-usual;
    width: 80px;
    height: 33px;
    border-radius: 6px;
    border: none;
    outline: none;
  }
  &__like {
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
}
.footer {
  display: flex;
  &__input {
    @include text-usual;
    width: 1040px;
    height: 40px;
    background: #F7F8FA;
    border-radius: 6px;
    border: none;
    padding: 10px 20px 10px 15px;
    margin: 0 10px 20px 10px;
  }
  &__chain {
    display: flex;
    width: 40px;
    height: 40px;
    background: #F7F8FA;
    border-radius: 6px;
    align-items: center;
    justify-content: center;
    color: #000000;
    font-size: 25px;
    cursor: pointer;
  }
  &__arrow {
    display: flex;
    width: 40px;
    height: 40px;
    background: #F7F8FA;
    border-radius: 6px;
    align-items: center;
    justify-content: center;
    font-size: 25px;
    color: #0083C7;
    cursor: pointer;
  }
}
</style>

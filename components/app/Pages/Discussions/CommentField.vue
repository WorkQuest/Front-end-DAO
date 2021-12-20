<template>
  <!-- Level2 -->
  <div class="comment">
    <div
      class="comment__field"
      :class="`comment_sub${level}`"
    >
      <div class="comment__user user">
        <img
          :src="data && data.author.avatar && data.author.avatar.url ? data.author.avatar.url : require('~/assets/img/app/avatar_empty.png')"
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
      <div class="comment__description">
        {{ data.text }}
      </div>
      <div class="comment__bottom bottom">
        <base-btn
          v-if="level !== 5"
          class="bottom__btn"
          mode="blue"
          @click="toggleReply"
        >
          {{ !isReply ? $t('discussions.reply') : $t('discussions.cancel') }}
        </base-btn>
        <base-btn
          v-if="data.amountSubComments > 0"
          class="bottom__btn"
          @click="!filterComments(sub3Comments, data.id).length ? loadSubs(data.id) : clearSubs()"
        >
          {{ !filterComments(sub3Comments, data.id).length ? $t('discussions.show') : $t('discussions.hide') }}
        </base-btn>
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
      <validation-observer
        v-slot="{handleSubmit, validated, passed, invalid}"
      >
        <!--  Bottom -->
        <div
          v-if="isReply"
          class="comment__footer footer"
        >
          <base-btn
            class="footer__btn"
            :disabled="!validated || !passed || invalid"
          >
            <template v-slot:left>
              <span class="icon-link footer__chain" />
            </template>
          </base-btn>
          <base-field
            v-model="subCommentInput"
            class="footer__input"
            :placeholder="$t('discussions.input')"
            rules="required|text-response"
            :name="$t('discussions.response')"
            mode="comment-field"
          />
          <base-btn
            class="footer__btn"
            :disabled="!validated || !passed || invalid"
            @click="handleSubmit(addSubCommentResponse(data, 2))"
          >
            <template v-slot:left>
              <span class="icon-send footer__arrow" />
            </template>
          </base-btn>
        </div>
      </validation-observer>
    </div>
    <div
      v-for="(sub3) in filterComments(sub3Comments, data.id)"
      :key="sub3.id"
      class="footer comment__container subcomment"
    >
      <comment-field2
        class="subcomment__field subcomment_lvl3"
        :data="sub3"
        :array="filterComments(sub3Comments, data.id)"
        :level="3"
      />
    </div>
    <base-btn
      v-if="isShowBtnMoreComments"
      class="subcomment__btn"
      @click="loadMoreSubs2(data.rootCommentId)"
    >
      Show more comments
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
    level: {
      type: [Number, String],
      default: 2,
    },
    discussionId: {
      type: String,
      default: () => '',
    },
  },
  data() {
    return {
      subCommentsOnPage: 5,
      isReply: false,
      subCommentInput: '',
      sub3Comments: [],
      count: 1,
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
  methods: {
    async loadMoreSubs2(rootId) {
      this.$parent.increaseCounter();
      this.$parent.loadMoreSubs(rootId);
    },
    increaseCounter() {
      this.count += 1;
    },
    async loadMoreSubs(rootId) {
      const additionalValue = `limit=${this.subCommentsOnPage * this.count}`;
      const res = await this.$store.dispatch('discussions/getSubCommentsLevel', { id: rootId, additionalValue });
      if (this.sub3Comments.length > 0) this.sub3Comments = [];
      return this.sub3Comments.push(...res.comments);
    },
    async loadSubs(rootId) {
      const res = await this.$store.dispatch('discussions/getSubCommentsLevel', { id: rootId });
      if (this.sub3Comments.length > 0) this.sub3Comments = [];
      return this.sub3Comments.push(...res.comments);
    },
    clearSubs() {
      this.sub3Comments = [];
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
    async addSubCommentResponse(comment, level) {
      const payload = {
        rootCommentId: comment.id,
        text: this.subCommentInput,
        medias: [],
      };
      await this.$store.dispatch('discussions/sendCommentOnDiscussion', { id: this.currentDiscussion.id, payload });
      await this.$parent.loadSubs(comment.rootCommentId, level);
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
  padding: 0 30px 0 0;
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
  &__footer {
    height: 40px;
    display: grid;
    grid-template-columns: 1fr 11fr 1fr;
    margin: 20px;
    align-items: center;
  }
  &_sub2 {
    //background: #8D96A2;
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
.footer {
  display: flex;
  &__input {
    @include text-usual;
    width: 100%;
    height: 40px;
    border-radius: 6px;
    border: none;
    padding: 10px 15px 10px 15px;
    margin: 0 0 20px 0;
  }
  &__chain {
    padding: 0 0 0 5px;
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
  &__btn {
    width: 40px;
    height: 40px;
    background: #F7F8FA;
    cursor: pointer;
    &:hover {
      background: #F7F8FA;
    }
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
    padding: 0 0 0 10px;
  }
}
</style>
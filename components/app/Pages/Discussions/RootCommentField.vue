<template>
  <div class="comment">
    <div
      class="comment__field"
      :class="`comment_sub1`"
    >
      <div class="comment__user user">
        <img
          :src="authorAvatarSrc(comment)"
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
          {{ $moment(comment.updatedAt).format('Do MMMM YYYY, hh:mm a') }}
        </div>
      </div>
      <div class="comment__description">
        {{ comment.text }}
      </div>
      <div class="comment__bottom bottom">
        <!--        TODO: Исправить логику и стиль кнопки-->
        <button
          v-if="!filterComments(sub2Comments, comment.id).length && comment.amountSubComments > 0"
          class="comment__btn"
          @click="loadSubs(comment.id, 2)"
        >
          Show comments
        </button>
        <!-- RootComment panel -->
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
      <!--      TODO: Comments-->
      <div
        v-for="(sub2) in filterComments(sub2Comments, comment.id)"
        :key="sub2.id"
        class="comment__subcomment subcomment"
      >
        <comment-field
          class="subcomment__field subcomment_lvl2"
          :data="sub2"
          :level="2"
        />
        <button
          v-if="!filterComments(sub3Comments, sub2.id).length && sub2.amountSubComments > 0"
          class="comment__btn"
          @click="loadSubs(sub2.id, 3)"
        >
          Show comments
        </button>
        <div
          v-for="(sub3) in filterComments(sub3Comments, sub2.id)"
          :key="sub3.id"
        >
          <comment-field
            class="subcomment__field subcomment_lvl3"
            :data="sub3"
            :level="3"
          />
          <button
            v-if="!filterComments(sub4Comments, sub3.id).length && sub3.amountSubComments > 0"
            class="comment__btn"
            @click="loadSubs(sub3.id, 4)"
          >
            Show comments
          </button>
          <span
            v-for="(sub4) in filterComments(sub4Comments, sub3.id)"
            :key="sub4.id"
          >
            <comment-field
              class="subcomment__field subcomment_lvl4"
              :data="sub4"
              :level="4"
            />
            <button
              v-if="!filterComments(sub5Comments, sub4.id).length && sub4.amountSubComments > 0"
              class="comment__btn"
              @click="loadSubs(sub4.id, 5)"
            >
              Show comments
            </button>
            <span
              v-for="(sub5) in filterComments(sub5Comments, sub4.id)"
              :key="sub5.id"
            >
              <comment-field
                class="subcomment__field subcomment_lvl5"
                :data="sub5"
                :level="5"
              />
            </span>
          </span>
        </div>
      </div>
      <div
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
          @click="addSubCommentResponse(comment, 2)"
        />
      </div>
    </div>
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
      comments: [],
      sub2Comments: [],
      sub3Comments: [],
      sub4Comments: [],
      sub5Comments: [],
      subCommentInput: '',
    };
  },
  computed: {
    ...mapGetters({
      currentDiscussion: 'discussions/getCurrentDiscussion',
    }),
  },
  methods: {
    async addSubCommentResponse(comment, level) {
      if (!comment.rootCommentId) {
        const payload = {
          rootCommentId: comment.id,
          text: this.subCommentInput,
          medias: [],
        };
        await this.$store.dispatch('discussions/sendCommentOnDiscussion', { id: this.currentDiscussion.id, payload });
        await this.loadSubs(comment.id, level);
      } else {
        const payload = {
          rootCommentId: comment.id,
          text: this.subCommentInput,
          medias: [],
        };
        await this.$store.dispatch('discussions/sendCommentOnDiscussion', { id: this.currentDiscussion.id, payload });
        await this.loadSubs(comment.rootCommentId, level);
        this.isReply = false;
        this.subCommentInput = '';
      }
    },
    async toggleLikeOnComment(comment) {
      if (comment && Object.keys(comment.commentLikes).length > 0) {
        await this.$store.dispatch('discussions/toggleLikeOnComment', { id: comment.id, like: false });
      } if (comment && Object.keys(comment.commentLikes).length === 0) {
        await this.$store.dispatch('discussions/toggleLikeOnComment', { id: comment.id, like: true });
      }
      await this.getRootComments();
    },
    async getCurrentDiscussion() {
      await this.$store.dispatch('discussions/getCurrentDiscussion', this.discussionId);
    },
    async addRootCommentResponse() {
      const payload = {
        text: this.opinion,
        medias: [],
      };
      await this.$store.dispatch('discussions/sendCommentOnDiscussion', { id: this.currentDiscussion.id, payload });
      this.isAddComment = false;
      this.opinion = '';
      await this.getRootComments();
    },
    async getRootComments() {
      this.$parent.getRootComments();
    },
    clearSubs(level) {
      if (level === 2) this.sub2Comments = [];
      if (level === 3) this.sub3Comments = [];
      if (level === 4) this.sub4Comments = [];
      if (level === 5) this.sub5Comments = [];
    },
    async loadSubs(rootId, level) {
      const res = await this.$store.dispatch('discussions/getSubCommentsLevel', { id: rootId });
      if (level === 2) {
        if (this.sub2Comments.length > 0) this.sub2Comments = [];
        return this.sub2Comments.push(...res.comments);
      } if (level === 3) {
        if (this.sub3Comments.length > 0) this.sub3Comments = [];
        return this.sub3Comments.push(...res.comments);
      } if (level === 4) {
        if (this.sub4Comments.length > 0) this.sub3Comments = [];
        return this.sub4Comments.push(...res.comments);
      } if (level === 5) {
        if (this.sub5Comments.length > 0) this.sub4Comments = [];
        return this.sub5Comments.push(...res.comments);
      } return '';
    },
    filterComments(subComments, rootId) {
      return subComments.filter((item) => item.rootCommentId === rootId);
    },
    authorAvatarSrc(item) {
      if (item && item.author.avatar.url) return item.author.avatar.url;
      return require('~/assets/img/app/avatar_empty.png');
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
.comment {
  padding: 10px;
  display: flex;
  margin-bottom: 10px;
  &__field {
    width: 100%;
    background: #FFFFFF;
    border-radius: 8px;
    padding: 20px 20px 0 20px;
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
    background: #8D96A2;
    margin-left: 30px;
  }
  &_sub3 {
    background: #707379;
    margin-left: 50px;
  }
  &_sub4 {
    background: #505052;
    margin-left: 70px;
  }
  &_sub5 {
    background: #37373a;
    margin-left: 90px;
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

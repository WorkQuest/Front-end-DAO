<template>
  <!-- Level1 -->
  <div class="comment">
    <div
      class="comment__field"
    >
      <div class="comment__user user">
        <img
          :src="comment && comment.author.avatar.url ? comment.author.avatar.url : require('~/assets/img/app/avatar_empty.png')"
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
      <div class="comment__description">
        {{ comment.text }}
      </div>
      <div class="comment__bottom bottom">
        <base-btn
          class="comment__btn"
          @click="!filterComments(sub2Comments, comment.id).length ? loadSubs(comment.id) : clearSubs()"
        >
          {{ !filterComments(sub2Comments, comment.id).length && comment.amountSubComments > 0 ? $t('discussions.show') : $t('discussions.hide') }}
        </base-btn>
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
      <!--  Comments -->
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
      </div>
    </div>
    <validation-observer
      v-slot="{handleSubmit, validated, passed, invalid}"
    >
      <!--  Bottom -->
      <div
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
          @click="handleSubmit(addSubCommentResponse(comment, 2))"
        >
          <template v-slot:left>
            <span class="icon-send footer__arrow" />
          </template>
        </base-btn>
      </div>
    </validation-observer>
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
      subCommentInput: '',
    };
  },
  computed: {
    ...mapGetters({
      currentDiscussion: 'discussions/getCurrentDiscussion',
    }),
  },
  methods: {
    clearSubs() {
      this.sub2Comments = [];
    },
    async addSubCommentResponse(comment, level) {
      if (!comment.rootCommentId) {
        const payload = {
          rootCommentId: comment.id,
          text: this.subCommentInput,
          medias: [],
        };
        await this.$store.dispatch('discussions/sendCommentOnDiscussion', { id: this.currentDiscussion.id, payload });
        await this.loadSubs(comment.id, level);
        this.subCommentInput = '';
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
      await this.$store.dispatch('discussions/toggleLikeOnComment', { id: comment.id, like: comment && !Object.keys(comment.commentLikes).length > 0 });
      await this.getRootComments();
    },
    async getRootComments() {
      this.$parent.$parent.getRootComments();
    },
    // TODO: Протестить метод
    // async loadSubs(rootId, level) {
    //   const res = await this.$store.dispatch('discussions/getSubCommentsLevel', { id: rootId });
    //   const obj = {
    //     2: this.sub2Comments,
    //     3: this.sub3Comments,
    //     4: this.sub4Comments,
    //     5: this.sub5Comments,
    //   };
    //   if (obj[level].length > 0) obj[level] = [];
    //   return obj[level].push(...res.comments);
    // },
    async loadSubs(rootId) {
      const res = await this.$store.dispatch('discussions/getSubCommentsLevel', { id: rootId });
      if (this.sub2Comments.length > 0) this.sub2Comments = [];
      return this.sub2Comments.push(...res.comments);
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
.comment {
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
  &__footer {
    height: 40px;
    display: grid;
    grid-template-columns: 1fr 11fr 1fr;
    margin: 20px;
    align-items: center;
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

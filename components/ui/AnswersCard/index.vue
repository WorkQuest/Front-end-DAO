<template>
  <div class="answers">
    <div class="answers__field">
      <div class="answers__user user">
        <img
          :src="item.author.avatar ?
            item.author.avatar.url : require('~/assets/img/app/avatar_empty.png')"
          alt="userAvatar"
          class="user__avatar"
          @click="toInvestor(item.author.id)"
        >
        <div
          class="user__name"
          @click="toInvestor(item.author.id)"
        >
          {{ item.author.firstName ?
            item.author.firstName : this.$t('user.nameless') }}
          {{ item.author.lastName ? item.author.lastName : '' }}
        </div>
        <div class="user__date">
          {{ $moment(item.updatedAt).format('Do MMMM YYYY, hh:mm a') }}
        </div>
      </div>
      <div class="answers__description">
        {{ item.text }}
      </div>
      <div class="answers__bottom bottom">
        <base-btn
          v-if="!isReply"
          class="bottom__btn"
          mode="blue"
          @click="toggleReply"
        >
          {{ $t('discussions.reply') }}
        </base-btn>
        <base-btn
          v-else
          class="bottom__btn"
          mode="blue"
          @click="toggleReply"
        >
          {{ $t('discussions.cancel') }}
        </base-btn>
        <div class="bottom__panel">
          <base-btn
            class="bottom__like"
            mode="like"
          >
            <span
              :class="{'bottom__like_choosen': item.commentLikes.length > 0}"
              class="icon-heart_fill bottom__like"
              @click="toggleLikeOnComment(item)"
            />
          </base-btn>
          <div class="bottom__counter bottom__counter_right">
            {{ item.amountLikes }}
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
          @click="addSubCommentResponse(item.id)"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';

export default {
  props: {
    item: {
      type: Object,
      default: () => {
      },
    },
  },
  data() {
    return {
      isReply: false,
      subCommentInput: '',
    };
  },
  computed: {
    ...mapGetters({
      currentDiscussion: 'discussions/getCurrentDiscussion',
    }),
  },
  methods: {
    toInvestor(authorId) {
      this.$router.push(`/investors/${authorId}`);
    },
    async addSubCommentResponse(rootCommentId) {
      const discussionId = this.currentDiscussion.id;
      const payload = {
        rootCommentId,
        text: this.subCommentInput,
        medias: [],
      };
      await this.$store.dispatch('discussions/sendCommentOnDiscussion', { discussionId, payload });
      this.isReply = false;
    },
    async toggleLikeOnComment(comment) {
      if (comment && Object.keys(comment.commentLikes).length === 0) {
        await this.$store.dispatch('discussions/addLikeOnComment', comment.id);
      } else if (comment && Object.keys(comment.commentLikes).length > 0) {
        await this.$store.dispatch('discussions/deleteLikeOnComment', comment.id);
      }
      await this.$store.dispatch('discussions/getUsersSubCommentsOnComment', comment.id);
    },
    toggleReply() {
      this.isReply = !this.isReply;
    },
  },
};

</script>
<style lang="scss" scoped>

.answers {
  &__field {
    width: 1080px;
    background: #FFFFFF;
    border-radius: 8px;
    padding: 20px 40px 0 20px;
    margin: 20px 20px 15px 80px;
  }
  &__description {
    @include text-usual;
    color: #7C838D;
    align-self: stretch;
    margin: 20px 0 25px 0;
  }
  &__footer {
    margin-top: 20px;
    margin-bottom: 20px;
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
    &_choosen {
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

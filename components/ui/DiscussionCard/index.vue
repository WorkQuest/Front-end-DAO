<template>
  <div class="discussion">
    <div class="discussion__user user">
      <img
        :src="item.author && item.author.avatar ? item.author.avatar.url : require('~/assets/img/app/avatar_empty.png')"
        alt="userAvatar"
        class="user__avatar"
        @click="toInvestor(item.author.id)"
      >
      <span
        class="user__name"
        @click="toInvestor(item.author.id)"
      >
        {{ getAuthorName(item) }}
      </span>
      <button class="user__star">
        <img
          :src="require(`~/assets/img/ui/star_${isFavorite ? 'checked' : 'simple'}.svg`)"
          alt="favorite"
          @click="toggleFavorite(item.id)"
        >
      </button>
    </div>
    <div class="discussion__title">
      {{ cropTxt(item.title, 30) }}
    </div>
    <div class="discussion__date">
      {{ $moment(item.createdAt).format('Do MMMM YYYY, hh:mm a') }}
    </div>
    <hr class="discussion__line">
    <div class="description discussion__description">
      <div class="description__title">
        {{ $t('discussions.descriptionTitle') }}
      </div>
      <div class="description__item">
        {{ cropTxt(item.description) }}
      </div>
    </div>
    <div class="bottom discussion__bottom">
      <div class="bottom__footer">
        <nuxt-link
          :to="`/discussions/${item.id}`"
          class="footer__link link"
        >
          <div class="link__text">
            {{ $t('discussions.read') }}
          </div>
          <div class="link__arrow">
            <span class="icon-short_right link__arrow" />
          </div>
        </nuxt-link>
      </div>
      <div class="bottom__footer">
        <button class="bottom__comment">
          <img
            src="~assets/img/ui/comment.svg"
            alt="comment"
          >
        </button>
        <div class="bottom__counter">
          {{ item.amountComments }}
        </div>
        <button class="bottom__like">
          <span
            class="icon-heart_fill bottom__like"
            :class="{'bottom__like_chosen': isLiked}"
            @click="toggleLikeOnDiscussion(item.id)"
          />
        </button>
        <div class="bottom__counter bottom__counter_right">
          {{ amountLikes }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    item: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      amountLikes: 0,
      isLiked: false,
      isHovering: false,
      isFavorite: false,
    };
  },
  mounted() {
    this.amountLikes = this.item.amountLikes;
    this.isLiked = !!Object.keys(this.item.liked || {}).length;
    this.isFavorite = !!Object.keys(this.item.star || {}).length;
  },
  methods: {
    authorAvatarSrc(item) {
      if (item && item.author.avatar.url) return item.author.avatar.url;
      return require('~/assets/img/app/avatar_empty.png');
    },
    getAuthorName(item) {
      const { firstName, lastName } = item && item.author;
      if (firstName || lastName) return `${firstName} ${lastName}`;
      return this.$t('user.nameless');
    },
    toInvestor(authorId) {
      this.$router.push(`/investors/${authorId}`);
    },
    async toggleFavorite(discussionId) {
      await this.$store.dispatch('discussions/toggleStarOnDiscussion', {
        id: discussionId,
        like: !this.isFavorite,
      });
      this.isFavorite = !this.isFavorite;
    },
    async toggleLikeOnDiscussion(discussionId) {
      await this.$store.dispatch('discussions/toggleLikeOnDiscussion', {
        id: discussionId,
        like: !this.isLiked,
      });
      this.amountLikes = !this.isLiked ? this.amountLikes + 1 : this.amountLikes - 1;
      this.isLiked = !this.isLiked;
    },
    cropTxt(str, maxLength = 80) {
      if (str.length > maxLength) str = `${str.slice(0, maxLength)}...`;
      return str;
    },
  },
};
</script>
<style lang="scss" scoped>
.discussion {
  width: 100%;
  height: 100%;
  background: #FFFFFF;
  border-radius: 8px;
  padding: 20px;
  &__title {
    font-weight: 600;
    font-size: 24px;
    line-height: 32px;
    margin: 18px 0 10px 0;
  }
  &__date {
    font-size: 14px;
    line-height: 130%;
    margin-bottom: 20px;
    color: #AAB0B9;
  }
  &__line {
    margin-top: 20px;
  }
}
.user {
    display: flex;
    align-items: center;
    &__name {
      font-size: 16px;
      line-height: 130%;
      color: #1D2127;
      padding: 10px;
      cursor: pointer;
    }
    &__avatar {
      flex: 0 0 0 32px;
      width: 32px;
      height: 32px;
      left: 0;
      top: 0;
      border-radius: 50%;
      cursor: pointer;
    }
    &__star {
      margin-left: auto;
      width: 20px;
      height: 20px;
    }
  }
.description {
  &__item {
    font-size: 16px;
    line-height: 130%;
    color: #7C838D;
    align-self: stretch;
    margin-bottom: 20px;
  }
  &__title {
    font-size: 18px;
    line-height: 130%;
    font-weight: 600;
    margin: 20px 0 10px 0;
  }
}
.bottom {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    &__footer {
      display: flex;
      align-items: center;
      justify-content: center;
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
      }
    }
    &__arrow {
      margin-top: 10px;
      margin-left: auto;
      margin-right: 7px;
      text-align: center;
      font-size: 25px;
      color: #0083C7;
    }
    &__comment {
      height: 18px;
      width: 18px;
      margin-top: 5px;
      cursor: default;
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
.link {
  display: flex;
  justify-content: center;
  text-align: center;
  align-items: center;
  text-decoration: none;
  &__text {
  margin: 7px 14px 7px 10px;
  font-size: 16px;
  line-height: 130%;
  }
  &__arrow {
    margin-top: 4px;
    font-size: 25px;
    color: #0083C7;
  }
}
</style>

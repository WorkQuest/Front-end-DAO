<template>
  <div class="discussion">
    <div class="discussion__user user">
      <img
        src="~assets/img/icons/userAvatar.svg"
        alt="userAvatar"
        class="user__avatar"
      >
      <span class="user__name">
        {{ item.userName }}
      </span>
      <button class="user__star" >
            <img
            @click='toggleFavorite'
            v-if='!isFavorite'
            src="~assets/img/ui/star_simple.svg"
            alt="simpleStar">
            <img
            @click='toggleFavorite'
            v-else
            src="~assets/img/ui/star_checked.svg"
            alt="checkedStar">
      </button>
    </div>
    <div class="discussion__title">
        {{ item.title }}
    </div>
    <div class="discussion__date">
      {{ item.date }}
    </div>
    <hr class="discussion__line">
    <div class="description discussion__description">
    <div class="description__title">
      {{ $t('discussions.descriptionTitle') }}
    </div>
    <div class="description__item">
      {{ item.description }}
    </div>
    </div>
    <div class="bottom discussion__bottom">
      <div class="bottom__footer">
        <nuxt-link to="/discussions/_id"
                   class="bottom__link link">
          <div class="link__text">{{ $t('discussions.read') }}</div>
          <div class="link__arrow"><span class="icon-short_right" /></div>
        </nuxt-link>
      </div>
      <div class="bottom__footer">
        <button class="bottom__comment">
          <img
            src="~assets/img/ui/comment.svg"
            alt=""
          >
        </button>
      <div class="bottom__counter">
        {{ item.commentCounter }}
      </div>
      <button class= "bottom__like">
              <span  @click='toggleLiked'
              v-if="!isLiked"
              class= "icon-heart_fill bottom__like"
              />
              <span @click='toggleLiked'
              v-else
              class= "icon-heart_fill bottom__like bottom__like_choosen"
              />
        </button>
      <div class="bottom__counter bottom__counter_right">
        {{ item.likeCounter }}
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
      isFavorite: false,
      isLiked: false,
    };
  },
  methods: {
    toggleFavorite() {
      this.isFavorite = !this.isFavorite;
    },
    toggleLiked() {
      this.isLiked = !this.isLiked;
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
    margin: 20px 0px 10px 0px;
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
    }
    &__avatar {
      flex: 0 0 0 32px;
      width: 32px;
      height: 32px;
      left: 0px;
      top: 0px;
      border-radius: 50%;
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
    margin: 20px 0px 10px 0px;
  }
}
.bottom {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    &__link{
      color: #0083C7;
    }
    &__footer {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    &__like {
      margin-left: auto;
      margin-top: 5px;
      color: #E9EDF2;
      &_choosen{
        color: #0083C7;
      }
    }
    &__arrow {
      margin-top: 10px;
      margin-left: auto;
      margin-right: 7px;
      text-align: center;
    }
    &__comment {
      height: 18px;
      width: 18px;
      margin-top: 5px;
    }
    &__counter {
      font-size: 14px;
      line-height: 18px;
      color: #1D2127;
      margin: 0px 22px 0px 8px;
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
  &__text{
  margin: 7px 14px 7px 10px;
  font-size: 16px;
  line-height: 130%;
  }
  &__arrow{
    margin-top: 8px;
  }
}
.icon-short_right:before {
  font-size: 25px;
  color: #0083C7;
}
.icon-heart_fill:before {
  font-size: 22px;
}

</style>

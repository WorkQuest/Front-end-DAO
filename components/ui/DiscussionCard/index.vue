<template>
  <div class="discussion">
    <div class="user">
      <img
        src="~assets/img/icons/userAvatar.svg"
        alt=""
        class="user__avatar"
      >
      <span class="user__name">
        {{ item.userName }}
      </span>
      <div class="user__star">
        <img
            src="~assets/img/ui/star_simple.svg"
            alt="">
      </div>
    </div>
    <div class="discussion__title">
        {{ item.title }}
    </div>
    <div class="discussion__date">
      {{ item.date }}
    </div>
    <hr class="discussion__line">
    <div class="description">
    <div class="description__title">
      {{ $t('discussions.descriptionTitle') }}
    </div>
    <div class="description__item">
      {{ item.description }}
    </div>
    </div>
    <div class="bottom">
      <div class="bottom__footer">
      <div class="bottom__link">
        <nuxt-link to="/">
          {{ $t('discussions.read') }}
        </nuxt-link>
      </div>
        <button class="bottom__arrow" >  <span class ="icon-short_right" /> </button>
      </div>
      <div class="bottom__footer">
      <div class="bottom__comment">
        <button>
          <img
            src="~assets/img/ui/comment.svg"
            alt=""
          >
        </button>
      </div>
      <div class="bottom__counter">
        {{ item.commentCounter }}
      </div>
      <button class= "bottom__like">
        <span class= "icon-heart_fill" />
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
    a.nuxt-link-active {
      text-decoration: none;
    }
    &__footer {
      display: flex;
      align-items: center;
    }
    &__link {
      font-size: 16px;
      line-height: 130%;
      color: #0083C7;
      align-items: center;
      margin: 7px 14px 7px 10px;
    }
    &__like {
      margin-left: auto;
    }
    &__arrow {
      margin-top: 10px;
      margin-left: auto;
      margin-right: 7px;
    }
    &__comment {
      height: 18px;
      width: 18px;
    }
    &__counter {
      font-size: 14px;
      line-height: 18px;
      color: #1D2127;
      margin: 0px 22px 0px 8px;
      &_right {
        margin: 7px;
      }
    }
  }
.icon-short_right:before {
  color:  #0083C7;
  font-size: 25px;
}
.icon-heart_fill:before{
  font-size: 22px;
  color: #E9EDF2;
}
</style>

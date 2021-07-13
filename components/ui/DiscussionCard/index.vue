<template>
  <div class="discussion">
    <div class="discussion__user">
      <img
        src="~assets/img/icons/userAvatar.svg"
        alt=""
        class="discussion__user-image"
      >
      <span class="discussion__user-name">
        {{ item.userName }}
      </span>
      <div
        class="discussion__user-star"
      >
        <img
          src="~assets/img/ui/star_simple.svg"
          alt=""
        >
      </div>
    </div>
    <div class="discussion__title">
      <h4>
        {{ item.title }}
      </h4>
    </div>
    <div class="discussion__date">
      {{ item.date }}
    </div>
    <hr class="discussion__line">
    <div class="discussion__description-title">
      <h5>
        Description
      </h5>
    </div>
    <div class="discussion__description">
      {{ item.description }}
    </div>
    <div class="discussion__bottom">
      <div class="discussion__bottom-link">
        <nuxt-link to="/">
          Read completely
        </nuxt-link>
        <button>  <span class="discussion__bottom-link icon-short_right" /> </button>
      </div>
      <div class="discussion__bottom-comment">
        <button>
          <img
            src="~assets/img/ui/comment.svg"
            alt=""
          >
        </button>
      </div>
      <div class="discussion__bottom-numbers">
        {{ item.commentCounter }}
      </div>
      <button>
        <span class="discussion__bottom icon-heart_fill" />
      </button>
      <div class="discussion__bottom-counter">
        {{ item.likeCounter }}
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
  &__user {
    display: flex;
    align-items: center;
  }
  &__user-name {
    font-size: 16px;
    line-height: 130%;
    color: #1D2127;
    padding: 10px;
  }
  &__user-image {
    flex: 0 0 0 32px;
    width: 32px;
    height: 32px;
    left: 0px;
    top: 0px;
    border-radius: 50%;
  }
  &__user-star {
    margin-left: auto;
    width: 20px;
    height: 20px;
  }
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
  &__description-title {
    font-size: 18px;
    line-height: 130%;
    font-weight: 600;
    margin: 20px 0px 10px 0px;
  }
  &__description {
    font-size: 16px;
    line-height: 130%;
    color: #7C838D;
    align-self: stretch;
    margin-bottom: 20px;
  }
  &__bottom {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  &__bottom-link {
    flex: 130px;
    font-size: 16px;
    line-height: 130%;
    color: #0083C7;
    margin: 7px 14px 7px 10px;
  }
  &__bottom-arrow {
    color: #0083C7;
  }
  &__bottom-comment {
    height: 18px;
    width: 18px;
  }
  &__bottom-numbers {
    font-size: 14px;
    line-height: 18px;
    color: #1D2127;
    margin: 0px 22px 0px 8px;
  }
  &__bottom-counter {
    font-size: 14px;
    line-height: 18px;
    margin: 7px;
    color: #1D2127;
  }
}
.icon-short_right:before {
  color:  #0083C7;
  font-size: 16px;
  margin-top: 10px;
  margin-left: auto;
  margin-right: 7px;
}
.icon-heart_fill:before{
  font-size: 22px;
  color: #E9EDF2;
  margin-left: auto;
}
</style>

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
      <img
        src="~assets/img/ui/star_simple.svg"
        alt=""
        class="discussion__user-star"
      >
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
        <div class="discussion__bottom-link-text">
          <nuxt-link to="/">
            Read completely
          </nuxt-link>
        </div>
        <div class="discussion__bottom-link-arrow">
          <img
            src="~assets/img/ui/arrowRight.svg"
            alt=""
          >
        </div>
      </div>
      <div class="discussion__bottom-feedback">
        <div class="discussion__bottom-feedback-comment">
          <img
            src="~assets/img/ui/comment.svg"
            alt=""
          >
        </div>
        <div class="discussion__bottom-feedback-comment-counter">
          50
        </div>
        <div class="discussion__bottom-feedback-like">
          <img
            src="~assets/img/ui/like.svg"
            alt=""
          >
        </div>
        <div class="discussion__bottom-feedback-like-counter">
          50
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
  &__user {
    display: flex;
    align-items: center;
    &-name {
      font-size: 16px;
      line-height: 130%;
      font-style: normal;
      font-weight: normal;
      color: #1D2127;
      padding: 10px;
    }
    &-image {
      flex: 0 0 0 32px;
      width: 32px;
      height: 32px;
      left: 0px;
      top: 0px;
      border-radius: 50%;
    }
    &-star{
      margin-left: auto;
      width: 20px;
      height: 20px;
    }
  }
  &__title {
    font-weight: 600;
    font-size: 24px;
    line-height: 32px;
    margin: 25.5px 0px 10px 0px;
    }
  &__date{
    font-size: 14px;
    line-height: 130%;
    margin-bottom: 20px;
    color: #AAB0B9;
    }
  &__line{
    margin-top: 20px;
    }
  &__description-title{
    font-size: 18px;
    line-height: 130%;
    font-weight: 600;
    margin: 20px 0px  10px 0px;
   }
  &__description{
    font-family: Inter;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 130%;
    color: #7C838D;
    align-self: stretch;
    margin-bottom: 20px;
  }
  &__bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    &-link {
      display: flex;
      align-items: center;
      &-text {
        flex: 0 0 auto;
        font-size: 16px;
        line-height: 130%;
        color: #0083C7;
        margin: 6.5px 14px 6.5px 10px;
        }
      &-arrow {
        height: 12px;
        width: 16px;
        padding-top: 2px;
      }
    }
    &-feedback{
      display: flex;
      align-items: center;
    &-comment{
      height: 18px;
      width: 18px;
    }
    &-comment-counter{
      font-size: 14px;
      line-height: 18.2px;
      color: #1D2127;
      margin-left: 8px;
    }
    &-like{
      height: 18px;
      width: 20px;
      margin-left: 22px;
    }
    &-like-counter{
      font-size: 14px;
      line-height: 18.2px;
      margin-left: 7px;
      color: #1D2127;
    }}
  }
  }
</style>

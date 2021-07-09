<template>
  <div class="discussion">
    <img
      src="~assets/img/icons/userAvatar.jpg"
      alt=""
      class="discussion__image"
    >
    <span class="discussion__userName">
      {{ item.userName }}
    </span>
    <div class="discussion__title">
      {{ item.title }}
    </div>
    <div class="discussion__date">
      {{ item.date }}
    </div>
    <hr class="discussion__line">
    <div class="discussion__description-title">
      Description
    </div>
    <div class="discussion__description">
      {{ item.description }}
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
  width: 580px;
  height: 406px;
  background: #FFFFFF;
  border-radius: 8px;
  padding: 20px;
  border: red 3px solid;
  margin: 10px;
  &__userName{
    font-size: 16px;
    line-height: 130%;
    font-style: normal;
    font-weight: normal;
    color: #1D2127;
    }
  &__image{

    width: 32px;
    height: 32px;
    left: 0px;
    top: 0px;
    }
  &__title {
    font-weight: 600;
    font-size: 24px;
    line-height: 32px;
    margin-top: 25.5px;
    }
  &__date{
    font-size: 14px;
    line-height: 130%;
    margin-top: 10px;
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
    margin-top: 20px;
   }
  }
</style>

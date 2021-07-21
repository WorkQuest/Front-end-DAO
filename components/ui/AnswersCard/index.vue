<template>
  <div class="answers answers__field">
    <div class="answers__user user">
      <img
        src="~assets/img/icons/userAvatar.svg"
        alt=""
        class="user__image"
      >
      <div class="user__name">
        {{ item.userName }}
      </div>
      <div class="user__date">
        {{ item.date }}
      </div>
    </div>
    <div class="answers__description">
      {{ item.description }}
    </div>
    <div class="answers__bottom bottom">
      <button class="bottom__btn ">
        {{ $t('discussions.reply') }}
      </button>
      <div class="bottom__panel">
        <button class="bottom__like">
          <span class="icon-heart_fill bottom__like" />
          <!--              <span class="icon-heart_fill bottom__like bottom__like_choosen" />-->
        </button>
        <div class="bottom__counter bottom__counter_right">
          {{ item.likeCounter }}
        </div>
      </div>
    </div>
    <button class="answers__btn ">
      {{ $t('discussions.moreComments') }}
    </button>
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

.answers{
  &__field{
    width: 1080px;
    height: 206px;
    background: #FFFFFF;
    border-radius: 8px;
    padding-right: 40px;
    margin: 20px 20px 15px 80px;
  }
  &__description{
    @include text-usual;
    color: #7C838D;
    align-self: stretch;
    margin: 20px 0px 25px 0px;
  }
  &__btn {
    @include text-usual;
    color: #0083C7;
    align-items: center;
    width: 150px;
    height: 33px;
    border-radius: 6px;
     }:hover{
     background: #0A7EEA;
     color: white;
    }
}
.user{
  display: flex;
  justify-content: flex-start;
  align-items: center;
  &__avatar{
    flex: 0 0 0 32px;
    width: 32px;
    height: 32px;
    left: 0px;
    top: 0px;
    border-radius: 50%;
  }
  &__name{
    @include text-usual;
    color: #1D2127;
    padding: 0px 10px 0px 10px;
  }
  &__date{
    font-size: 12px;
    line-height: 130%;
    color: #AAB0B9;
  }
  &__star {
    margin-left: auto;
    width: 20px;
    height: 20px;
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
    color: #0083C7;
    align-items: center;
    width: 150px;
    height: 33px;
    border-radius: 6px;
  }:hover{
     background: #0A7EEA;
     color: white;
   }
  &__like {
    margin-left: auto;
    margin-top: 5px;
    color: #E9EDF2;
    font-size: 22px;
    &_choosen{
      color: #0083C7;
    }
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
    margin: 0px 22px 0px 8px;
    cursor: pointer;
    &_right {
      margin: 7px;
    }
  }
  &__footer {
    display: flex;
    align-items: center;
  }
  &__arrow {
    margin-top: 10px;
    margin-left: auto;
    margin-right: 7px;
  }
}
.footer{
  display: flex;
  &__input{
    @include text-usual;
    width: 1040px;
    height: 40px;
    background: #F7F8FA;
    border-radius: 6px;
    border: none;
    padding: 10px 20px 10px 15px;
    margin: 0px 10px 0px 10px;
  }
  &__chain{
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
  &__arrow{
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

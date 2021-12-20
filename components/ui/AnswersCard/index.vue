<template>
  <div class="answers">
    <div class="answers__field">
      <div class="answers__user user">
        <img
          src="~assets/img/ui/avatar.svg"
          alt=""
          class="user__avatar"
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
        <base-btn
          v-if="!isReplay"
          class="bottom__btn"
          mode="blue"
          @click="toggleReplay"
        >
          {{ $t('discussions.reply') }}
        </base-btn>
        <base-btn
          v-else
          class="bottom__btn"
          mode="blue"
          @click="toggleReplay"
        >
          {{ $t('discussions.cancel') }}
        </base-btn>
        <div class="bottom__panel">
          <button class="bottom__like">
            <span
              v-if="!isVote"
              class="icon-heart_fill bottom__like"
              @click="toggleVote"
            />
            <span
              v-else
              class="icon-heart_fill bottom__like bottom__like_choosen"
              @click="toggleVote"
            />
          </button>
          <div class="bottom__counter bottom__counter_right">
            {{ item.likeCounter }}
          </div>
        </div>
      </div>
      <div
        v-if="isReplay"
        class="answers__footer footer"
      >
        <span class="icon-link footer__chain" />
        <input
          class="footer__input"
          :placeholder="$t('discussions.input')"
        >
        <span class="icon-send footer__arrow" />
      </div>
    </div>
  </div>
</template>
<script>
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
      isReplay: false,
      isVote: false,
    };
  },
  methods: {
    toggleReplay() {
      this.isReplay = !this.isReplay;
    },
    toggleVote() {
      this.isVote = !this.isVote;
    },
  },
};

</script>
<style lang="scss" scoped>

.answers{
  &__field{
    width: 1080px;
    background: #FFFFFF;
    border-radius: 8px;
    padding: 20px 40px 0px 20px;
    margin: 20px 20px 15px 80px;
  }
  &__description{
    @include text-usual;
    color: #7C838D;
    align-self: stretch;
    margin: 20px 0px 25px 0px;
  }
  &__footer{
    margin-top: 20px;
    margin-bottom: 20px;
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
}
.bottom {
  display: flex;
  gap: 10px;
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
    &_choosen{
      color: #0083C7;
    }
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
    margin: 0px 10px 20px 10px;
  }
  &__chain{
    display: flex;
    padding: 0 10px;
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
    padding: 0 10px;
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
@include _1199 {
  .answers {
    &__field {
      width: 80vw;
    }
  }
}
@include _575 {
  .answers {
    &__field {
      margin: 20px 20px 15px 50px;
    }
  }
}
@include _380 {
  .answers {
    &__field {
      padding: 10px 20px 0px 10px;
      margin: 10px 10px 5px 30px;
    }
  }
}
</style>

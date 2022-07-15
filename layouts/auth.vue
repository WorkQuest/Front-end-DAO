<template>
  <div class="template">
    <div class="template__container">
      <div class="template__left">
        <div class="template__content">
          <nuxt />
        </div>
      </div>
      <div class="template__right">
        <div
          class="template__logo"
          @click="toMain()"
        >
          <img
            src="~assets/img/app/logo_white.svg"
            alt="WorkQuest"
          >
          <span>{{ $t('signIn.workQuest') }}</span>
        </div>
        <span class="template__text">{{ $t('signIn.desc') }}</span>
      </div>
    </div>
    <transition name="fade">
      <loader v-if="isLoading" />
    </transition>
    <ctm-modal />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { Path, UserStatuses } from '~/utils/enums';
import { getIsWalletConnected } from '~/utils/wallet';
import { accessLifetime } from '~/utils/constants/cookiesLifetime';

export default {
  scrollToTop: true,
  name: 'AuthLayout',
  computed: {
    ...mapGetters({
      isLoading: 'main/getIsLoading',
      userData: 'user/getUserData',
    }),
  },
  async beforeMount() {
    const { access, refresh, userStatus } = this.$route.query;
    if (access && refresh && userStatus) {
      this.$store.commit('user/setTokens', {
        access, refresh, userStatus, social: true,
      });
      await this.$store.dispatch('user/getUserData');
      // To set role or assign wallet
      if (+userStatus === UserStatuses.NeedSetRole || !this.userData?.wallet?.address) {
        this.$cookies.set('userLogin', true, { path: '/', maxAge: accessLifetime });
        await this.$router.push(Path.ROLE);
        return;
      }
      // To import mnemonic for login
      if (+userStatus === UserStatuses.Confirmed && !getIsWalletConnected()) {
        await this.$router.push(Path.SIGN_IN);
        return;
      }
      await this.$store.dispatch('user/getStatistic');
      await this.$store.dispatch('user/getNotifications');
      await this.$router.push(Path.PROPOSALS);
    }
  },
  methods: {
    toMain() {
      this.$router.push(Path.SIGN_IN);
    },
  },
};
</script>

<style lang="scss" scoped>
.template {
  &__container {
    min-height: 100vh;
    width: 100%;
    background: #FFFFFF;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }
  &__left {
    display: grid;
    max-width: 470px;
    width: 100%;
    justify-self: flex-end;
    margin-right: 130px;
  }
  &__logo {
    display: flex;
    align-items: center;
    cursor: pointer;
    margin: 15px;
    span {
      margin-left: 10px;
      font-family: 'Inter', sans-serif;
      font-style: normal;
      font-weight: bold;
      font-size: 23px;
      line-height: 130%;
      color: #ffffff;
    }
  }
  &__text {
    margin: 20px;
    width: 60%;

    font-style: normal;
    font-weight: 700;
    font-size: 75px;
    line-height: 130%;
    color: #FFFFFF;
  }
  &__content {
    display: grid;
    align-items: center;
  }
  &__right {
    display: grid;
    align-items: flex-start;
    flex-direction: column;
    background-image: url("~assets/img/app/auth_bg.png");
    background-position: right;
    background-repeat: no-repeat;
    background-size: cover;
    background-position-x: center;
  }
  &__long {
    justify-self: flex-end;
  }
  &__slogan {
    font-family: 'Inter', sans-serif;
    font-style: normal;
    font-weight: bold;
    font-size: 55px;
    line-height: 130%;
    color: #FFFFFF;
    padding: 100px 0 0 100px;
    white-space: pre-line;
  }
}
@include _1300 {
  .template {
    &__slogan {
      padding: 50px 0 0 50px;
    }
    &__long {
      display: none;
    }
  }
}

@include _1199 {
  .template {
    &__text {
      font-size: 70px;
    }
    &__container {
      grid-template-columns: 1fr;
      grid-template-rows: repeat(2, 1fr);
    }
    &__left {
      margin: 0;
      max-width: initial;
      justify-self: initial;
      padding: 0px 10px;
    }
    &__content {
      margin: 0 auto;
      width: 100%;
      align-items: center;
      padding-top: 30px;
    }
    &__right {
      grid-row: 1/2;
      grid-column: 1/3;
      max-width: 100vw;
    }
    &__slogan {
      font-size: 32px;
    }
    &__logo {
      padding-left: 39%;
    }
  }
}
@include _575 {
  .template {
    &__container {
      grid-template-rows: 300px auto;
    }
    &__logo {
      padding: 0;
    }
    &__text {
      width: auto;
      margin: 0 10px;
      font-size: 45px;
    }
    &__left {
      padding: 0 10px 30px;
    }
  }
}
@include _380 {
  .template {
    &__container {
      grid-template-rows: 180px auto;
    }
    &__text {
      font-size: 35px;
    }
    &__content {
      padding-top: 15px;
    }
    &__logo {
      align-items: flex-start;
      span {
        font-size: 20px;
        margin-left: 0;
        margin-top:5px;
      }
    }
  }
}
@include _350() {
  .template {
    &__logo {
      span {
        font-size: 18px;
      }
    }
    &__left {
      max-width: calc(100vw - 10px);
    }
  }
}
</style>

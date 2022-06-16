<template>
  <div class="auth">
    <ValidationObserver
      v-if="step === $options.WalletState.Default"
      v-slot="{ handleSubmit }"
      class="auth__container"
      tag="div"
    >
      <div class="auth__text auth__text_title">
        <span>{{ $t('signIn.title') }}</span>
      </div>
      <div class="auth__text auth__text_simple">
        <span>{{ $t('signIn.account') }}</span>
        <nuxt-link
          class="auth__text auth__text_link"
          data-selector="ACTION-BTN-TO-REGISTRATION"
          to="/sign-up"
        >
          {{ $t('signIn.regs') }}
        </nuxt-link>
      </div>
      <form
        class="auth__fields"
        action=""
        @submit.prevent="handleSubmit(signIn)"
      >
        <base-field
          v-model="model.email"
          class="auth__input"
          rules="required|email"
          :name="$t('signUp.email')"
          :placeholder="$t('signUp.email')"
          mode="icon"
          autocomplete="username"
          data-selector="EMAIL"
        >
          <template v-slot:left>
            <img
              src="~assets/img/icons/email.svg"
              alt=""
            >
          </template>
        </base-field>
        <base-field
          v-model="model.password"
          class="auth__input"
          :placeholder="$t('signUp.password')"
          mode="icon"
          :name="$t('signUp.password')"
          autocomplete="current-password"
          rules="required_if|min:8"
          type="password"
          vid="confirmation"
          data-selector="PASSWORD"
        >
          <template v-slot:left>
            <img
              src="~assets/img/icons/password.svg"
              alt=""
            >
          </template>
        </base-field>
        <div class="auth__tools">
          <base-checkbox
            v-model="isRememberMeSelected"
            name="remember"
            :label="$t('signIn.remember')"
          />
          <div
            class="auth__text auth__text_link"
            data-selector="ACTION-BTN-FORGOT-PASSWORD"
            @click="showRestoreModal()"
          >
            {{ $t('signIn.forgot') }}
          </div>
        </div>
        <div class="auth__action">
          <base-btn
            :disabled="isLoading"
            selector="LOGIN"
          >
            {{ $t('signIn.login') }}
          </base-btn>
          <base-btn
            v-if="!hiddenResend"
            class="auth__resend"
            :class="{auth__resend_hidden : disableResend && hiddenResend}"
            data-selector="RESEND-LETTER"
            :disabled="disableResend"
            type="button"
            @click="resendLetter"
          >
            {{ `${$t('signIn.resend')} ${resendTimer}` }}
          </base-btn>
        </div>
        <div class="auth__text auth__text_wrap">
          {{ $t('signIn.or') }}
        </div>
      </form>
      <div class="auth__social">
        <div class="auth__text auth__text_dark">
          {{ $t('signIn.loginWith') }}
        </div>
        <div class="auth__icons">
          <button
            class="auth__btn auth__btn_workQuest"
            @click="showSignWorkQuest()"
          >
            <img
              src="~assets/img/app/logo.svg"
              alt="WorkQuest"
            >
          </button>
          <button
            class="auth__btn auth__btn_google"
            @click="redirectSocialLink('google')"
          >
            <span class="icon-google" />
          </button>
          <button
            class="auth__btn auth__btn_twitter"
            @click="redirectSocialLink('twitter')"
          >
            <span class="icon-twitter" />
          </button>
          <button
            class="auth__btn auth__btn_facebook"
            @click="redirectSocialLink('facebook')"
          >
            <span class="icon-facebook" />
          </button>
          <button
            class="auth__btn auth__btn_LinkedIn"
            @click="redirectSocialLink('linkedin')"
          >
            <span class="icon-LinkedIn" />
          </button>
        </div>
      </div>
    </ValidationObserver>
    <div
      v-if="step > $options.WalletState.Default"
      class="auth__back"
      @click="back"
    >
      <span class="icon-chevron_big_left" /> <span>{{ $t('meta.back') }}</span>
    </div>
    <CreateWallet
      :step="step"
      @goStep="goStep"
      @submit="assignWallet"
      @import="importWallet"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import modals from '~/store/modals/modals';
import {
  createWallet, decryptStringWitheKey, encryptStringWithKey, initWallet, setCipherKey,
} from '~/utils/wallet';
import CreateWallet from '~/components/ui/CreateWallet';
import {
  Path, UserStatuses, WalletState,
} from '~/utils/enums';

const timerDefaultValue = 60;

export default {
  name: 'SignIn',
  layout: 'auth',
  components: {
    CreateWallet,
  },
  WalletState,
  data() {
    return {
      hiddenResend: true,
      disableResend: true,
      isStartedTimer: false,
      timerValue: timerDefaultValue,
      timer: null,
      addressAssigned: false,
      userWalletAddress: null,
      step: WalletState.Default,
      model: { email: '', password: '' },
      isRememberMeSelected: false,
      userStatus: null,
      isLoginWithSocial: false,
    };
  },
  computed: {
    ...mapGetters({
      userData: 'user/getUserData',
      isLoading: 'main/getIsLoading',
    }),
    resendTimer() {
      const { timerValue, isStartedTimer } = this;
      return isStartedTimer ? this.$tc('meta.units.seconds', this.DeclOfNum(timerValue), { count: timerValue }) : '';
    },
  },
  watch: {
    userStatus() {
      if (this.userStatus === UserStatuses.Unconfirmed || this.timer) {
        this.hiddenResend = false;
        if (!this.isStartedTimer) this.disableResend = false;
      } else {
        this.hiddenResend = true;
        this.disableResend = true;
      }
    },
  },
  created() {
    const { token } = this.$route.query;
    window.addEventListener('beforeunload', this.unloadHandler);
    if (token) {
      sessionStorage.setItem('confirmToken', String(token));
    }
  },
  async mounted() {
    this.continueTimer();
    this.isLoginWithSocial = this.$cookies.get('socialNetwork');
    const access = this.$cookies.get('access');
    const refresh = this.$cookies.get('refresh');
    this.userStatus = this.$cookies.get('userStatus');
    if (access && +this.userStatus === UserStatuses.Confirmed) await this.$router.push(Path.PROPOSALS);
    if (this.isLoginWithSocial && access && +this.userStatus === UserStatuses.Confirmed) {
      this.SetLoader(true);
      this.userStatus = await this.$store.dispatch('user/getUserData');
      this.userWalletAddress = this.userData?.wallet?.address;
      this.SetLoader(false);
      if (!this.userWalletAddress) return;
      this.step = WalletState.ImportMnemonic;
      this.$store.commit('user/setTokens', {
        access,
        refresh,
        userStatus: this.userStatus,
        social: this.isLoginWithSocial,
      });
    }
    if (sessionStorage.getItem('confirmToken')) this.ShowToast(this.$t('messages.loginToContinue'), ' ');
  },
  beforeDestroy() {
    if (this.isStartedTimer) {
      this.$cookies.set('resend-timer', {
        timerValue: this.timerValue,
        createdAt: Date.now(),
      });
    }
    if (!this.addressAssigned && !this.$cookies.get('access') && !this.$cookies.get('userStatus')) {
      this.$store.dispatch('user/logout');
    }
  },
  methods: {
    beforeunload() {
      if (this.isStartedTimer) {
        this.$cookies.set('resend-timer', {
          timerValue: this.timerValue,
          createdAt: Date.now(),
        });
        this.hiddenResend = true;
      } else this.$cookies.remove('resend-timer');
      this.clearCookies();
    },
    unloadHandler() {
      if (this.addressAssigned) return;
      this.$store.dispatch('user/logout');
    },
    back() {
      if (this.step === WalletState.ImportOrCreate) {
        this.step = WalletState.Default;
        return;
      }
      if (this.step === WalletState.ImportMnemonic) {
        if (this.isLoginWithSocial) {
          this.step = WalletState.Default;
          this.$store.dispatch('user/logout');
        } else this.step = !this.userWalletAddress ? WalletState.ImportOrCreate : WalletState.Default;
        return;
      }
      if (this.step === WalletState.SaveMnemonic) {
        this.step = WalletState.ImportOrCreate;
        return;
      }
      if (this.step === WalletState.ConfirmMnemonic) {
        this.step = WalletState.SaveMnemonic;
      }
    },
    goStep(step) {
      this.step = step;
    },
    redirectUser() {
      this.addressAssigned = true;
      this.$cookies.set('userLogin', true, { path: '/' });
      // redirect to confirm access if token exists & unconfirmed account
      const confirmToken = sessionStorage.getItem('confirmToken');
      if (this.userStatus === UserStatuses.Unconfirmed && confirmToken) {
        this.$router.push(`${Path.ROLE}/?token=${confirmToken}`);
        return;
      }
      sessionStorage.removeItem('confirmToken');
      if (this.userStatus === UserStatuses.NeedSetRole) this.$router.push(Path.ROLE);
      else this.$router.push(Path.PROPOSALS);
    },
    async signIn() {
      if (this.isLoading) return;
      this.SetLoader(true);
      this.model.email = this.model.email.trim();
      const res = await this.$store.dispatch('user/signIn', {
        ...this.model,
        isRememberMeSelected: this.isRememberMeSelected,
      });
      this.SetLoader(false);
      if (!res.ok) return;
      const { result: { userStatus, address, totpIsActive } } = res;
      this.userStatus = userStatus;
      this.userWalletAddress = address ? address.toLowerCase() : '';
      this.$cookies.set('userStatus', userStatus);
      if (totpIsActive) {
        await this.ShowModal({
          key: modals.securityCheck,
          actionMethod: async () => await this.nextStepAction(),
        });
      } else {
        await this.nextStepAction();
      }
    },
    async nextStepAction() {
      const confirmToken = sessionStorage.getItem('confirmToken');
      // Unconfirmed account w/o confirm token
      if (this.userStatus === UserStatuses.Unconfirmed && !confirmToken) {
        await this.$store.dispatch('main/showToast', {
          title: this.$t('registration.emailConfirmTitle'),
          text: this.$t('registration.emailConfirm'),
        });
        this.SetLoader(false);
        return;
      }

      // Redirect to confirm account
      if (confirmToken) {
        setCipherKey(this.model.password);
        this.redirectUser();
        this.SetLoader(false);
        return;
      }

      // Wallet is not assigned to this account
      if (!this.userWalletAddress) {
        setCipherKey(this.model.password);
        this.$cookies.set('userLogin', true, { path: '/' });
        await this.$router.push(Path.ROLE);
        this.SetLoader(false);
        return;
      }

      // Wallet assigned, checking storage
      const sessionData = JSON.parse(sessionStorage.getItem('mnemonic'));
      const storageData = JSON.parse(localStorage.getItem('mnemonic'));
      if (!sessionData && !storageData) {
        this.step = WalletState.ImportMnemonic;
        this.SetLoader(false);
        return;
      }

      const sessionMnemonic = sessionData ? sessionData[this.userWalletAddress] : null;
      const storageMnemonic = storageData ? storageData[this.userWalletAddress] : null;
      if (!sessionMnemonic && !storageMnemonic) {
        this.step = WalletState.ImportMnemonic;
        this.SetLoader(false);
        return;
      }

      // Check in session if exists
      if (sessionMnemonic) {
        const wallet = createWallet(sessionMnemonic);
        if (wallet && wallet.address.toLowerCase() === this.userWalletAddress) {
          this.saveToStorage(wallet);
          this.redirectUser();
          this.SetLoader(false);
          return;
        }
      }

      // Check in storage
      if (storageMnemonic) {
        const mnemonic = decryptStringWitheKey(storageMnemonic, this.model.password);
        const wallet = createWallet(mnemonic);
        if (wallet && wallet.address.toLowerCase() === this.userWalletAddress) {
          this.saveToStorage(wallet);
          this.redirectUser();
          this.SetLoader(false);
          return;
        }
      }

      // Session & Storage invalid mnemonics
      await this.$store.dispatch('main/showToast', {
        title: this.$t('toasts.error'),
        text: this.$t('messages.mnemonic'),
      });
      this.SetLoader(false);
    },
    async assignWallet(wallet) {
      const res = await this.$store.dispatch('user/registerWallet', {
        address: wallet.address.toLowerCase(),
        publicKey: wallet.publicKey,
      });
      if (res.ok) {
        this.saveToStorage(wallet);
        this.redirectUser();
        return;
      }
      if (res.code === 400011) {
        // На данный mnemonic уже привязан какой-то аккаунт
        await this.$store.dispatch('main/showToast', {
          title: this.$t('toasts.error'),
          text: this.$t('messages.mnemonic'),
        });
      }
    },
    async importWallet(wallet) {
      // Correct phrase, but not assigned to this account
      if (!this.userWalletAddress) {
        await this.assignWallet(wallet);
        return;
      }
      // All ok
      if (wallet.address.toLowerCase() === this.userWalletAddress) {
        this.saveToStorage(wallet);
        this.redirectUser();
        return;
      }
      // Phrase not assigned to this account
      await this.$store.dispatch('main/showToast', {
        title: this.$t('toasts.error'),
        text: this.$t('messages.mnemonic'),
      });
    },
    saveToStorage(wallet) {
      initWallet(wallet.address, wallet.privateKey);
      if (!this.isLoginWithSocial) {
        localStorage.setItem('mnemonic', JSON.stringify({
          ...JSON.parse(localStorage.getItem('mnemonic')),
          [wallet.address.toLowerCase()]: encryptStringWithKey(wallet.mnemonic.phrase, this.model.password),
        }));
      }
      sessionStorage.setItem('mnemonic', JSON.stringify({
        ...JSON.parse(sessionStorage.getItem('mnemonic')),
        [wallet.address.toLowerCase()]: wallet.mnemonic.phrase,
      }));
      this.$store.dispatch('wallet/connectWallet', {
        userWalletAddress: wallet.address,
        userPassword: this.model.password,
      });
    },
    async redirectSocialLink(socialNetwork) {
      window.location = `${this.ENV.BASE_URL}v1/auth/login/dao/${socialNetwork}`;
    },
    showSignWorkQuest() {
      this.ShowModal({
        key: modals.signWorkQuest,
      });
    },
    showRestoreModal() {
      this.ShowModal({
        key: modals.restore,
      });
    },
    async resendLetter() {
      this.model.email = this.model.email.trim();
      if (!this.model.email && !this.model.password) {
        await this.$store.dispatch('main/showToast', {
          text: this.$t('signIn.enterEmail'),
        });
      } else if (this.model.email && !this.disableResend) {
        await this.$store.dispatch('user/resendEmail', { email: this.model.email });
        await this.$store.dispatch('main/showToast', {
          title: this.$t('registration.emailConfirmTitle'),
          text: this.$t('registration.emailConfirmNewLetter'),
        });
        this.startTimer();
      }
    },
    startTimer() {
      if (!this.isStartedTimer) {
        this.timerId = setInterval(() => {
          if (this.timerId && this.timerValue === 0) this.clearTimer();
          this.timerValue -= 1;
        }, 1000);

        this.isStartedTimer = true;
        this.disableResend = true;
      }
    },
    clearTimer() {
      this.$cookies.remove('resend-timer');
      this.timerValue = timerDefaultValue;
      clearInterval(this.timerId);
      this.isStartedTimer = false;
      this.disableResend = false;
    },
    continueTimer() {
      if (this.userStatus === UserStatuses.Unconfirmed) this.hiddenResend = false;
      this.timer = this.$cookies.get('resend-timer');
      if (!this.timer) return;
      this.timer.timerValue -= (this.$moment().diff(this.timer.createdAt) / 1000).toFixed(0);
      if (this.timer.timerValue <= 0) {
        this.clearTimer();
        return;
      }
      this.timerValue = this.timer.timerValue;
      this.startTimer();
    },
    clearCookies() {
      const mnemonicInLocalStorage = JSON.parse(localStorage.getItem('mnemonic'));
      const isWalletInMnemonicList = mnemonicInLocalStorage && mnemonicInLocalStorage[this.userWalletAddress];
      if (this.userData.id && (isWalletInMnemonicList || localStorage.getItem('mnemonic'))) return;
      this.$cookies.remove('access');
      this.$cookies.remove('refresh');
      this.$cookies.remove('userLogin');
      this.$cookies.remove('userStatus');
    },
  },
};
</script>

<style lang="scss" scoped>
.auth {
  &__resend {
    margin-top: 10px;
    &_hidden {
      display: none;
    }
  }
  &__back {
    cursor: pointer;
    display: table-cell;

    & > span {
      color: $black700;
    }
  }

  &__container {
    display: grid;
    grid-template-rows: auto;
  }

  &__input {
    height: 46px;
    margin-bottom: 20px;
  }

  &__text {
    font-family: 'Inter', sans-serif;
    font-style: normal;
    line-height: 130%;

    &_title {
      font-weight: 600;
      font-size: 34px;
      color: $black800;
    }

    &_simple {
      color: #000000;
      font-weight: 300;
      font-size: 16px;
      padding-top: 15px;
    }

    &_link {
      padding-left: 5px;
      font-weight: 300;
      font-size: 16px;
      color: #0083C7;
      text-decoration: underline;
      cursor: pointer;
    }

    &_wrap {
      font-weight: normal;
      color: $black400;
      font-size: 16px;
      line-height: 130%;
      padding: 15px 0;
    }

    &_dark {
      color: $black700;
      font-style: normal;
      font-weight: 500;
      font-size: 16px;
      line-height: 130%;
    }
  }

  &__social {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__fields {
    padding-top: 40px;
    display: grid;
    grid-template-columns: 1fr;
  }

  &__action {
    padding-top: 40px;
  }

  &__icons {
    display: grid;
    grid-template-columns: repeat(5, 40px);
    grid-gap: 30px;
  }

  &__tools {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__btn {
    transition: .5s;
    width: 40px;
    height: 40px;
    background: #F7F8FA;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      background: #0083C7;
    }

    &:hover {
      span:before {
        background: white;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }

    &_twitter {
      span:before {
        font-size: 18px;
        color: #24CAFF;
      }
    }

    &_google {
      span:before {
        font-size: 18px;
        color: #094EFF;
      }
    }

    &_facebook {
      span:before {
        font-size: 18px;
        color: #3B67D7;
      }
    }

    &_LinkedIn {
      span:before {
        font-size: 18px;
        color: #0A7EEA;
      }
    }

    &_wq:hover .auth__btn__picture {
      display: none;
    }

    &_wq:hover .auth__btn__image {
      display: block;
      width: 22px;
      height: 17px;
    }

    &__image {
      display: none;
    }
  }
}

@include _1199 {
  .auth {
    &__icons {
      grid-template-columns: repeat(5, 1fr);
      grid-gap: 15px;
    }

    &__text {
      &_title {
        font-size: 28px;
      }

      &_wrap {
        text-align: center;
      }

      &_dark {
        display: none;
      }
    }

    &__social {
      justify-content: center;
    }
  }
}

@include _575 {
  .auth {
    &__icons {
      display: flex;
      width: 100%;
      align-items: center;
      justify-content: space-between;
    }
  }
}
</style>

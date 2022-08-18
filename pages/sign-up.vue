<template>
  <ValidationObserver
    v-slot="{ handleSubmit }"
    class="auth"
    tag="div"
  >
    <div class="auth__container">
      <div
        class="auth__text auth__text_title"
      >
        <span>{{ $t('signUp.title') }}</span>
      </div>
      <div class="auth__text auth__text_simple">
        <span>{{ $t('signUp.haveAccount') }}</span>
        <nuxt-link
          class="auth__text auth__text_link"
          :to="$options.Path.SIGN_IN"
        >
          {{ $t('signUp.auth') }}
        </nuxt-link>
      </div>
      <form
        class="auth__fields"
        action=""
        @submit.prevent="handleSubmit(signUp)"
      >
        <base-field
          v-model="model.firstName"
          class="auth__input"
          :placeholder="$t('signUp.firstName')"
          mode="icon"
          autocomplete="off"
          :name="$t('signUp.firstName')"
          rules="required_if|alpha_spaces|alpha_spaces_dash|max:15"
          data-selector="FIRST-NAME"
        >
          <template v-slot:left>
            <img
              src="~assets/img/icons/user.svg"
              alt=""
            >
          </template>
        </base-field>
        <base-field
          v-model="model.lastName"
          class="auth__input"
          :placeholder="$t('signUp.lastName')"
          mode="icon"
          :name="$t('signUp.lastName')"
          rules="required_if|alpha_spaces|alpha_spaces_dash|max:15"
          data-selector="LAST-NAME"
        >
          <template v-slot:left>
            <img
              src="~assets/img/icons/user.svg"
              alt=""
            >
          </template>
        </base-field>
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
        <base-field
          v-model="model.passwordConfirm"
          class="auth__input"
          :placeholder="$t('signUp.confirmPassword')"
          mode="icon"
          type="password"
          :name="$t('signUp.confirmPassword')"
          rules="required_if|min:8|confirmed:confirmation"
          data-selector="CONFIRM-PASSWORD"
        >
          <template v-slot:left>
            <img
              src="~assets/img/icons/password.svg"
              alt=""
            >
          </template>
        </base-field>
        <div class="auth__action">
          <base-btn :disabled="inProgress">
            {{ $t('signUp.create') }}
          </base-btn>
        </div>
      </form>
    </div>
  </ValidationObserver>
</template>

<script>
import modals from '~/store/modals/modals';
import { Path } from '~/utils/enums';
import { accessLifetime, resendEmailLifetime } from '~/utils/constants/cookiesLifetime';

export default {
  name: 'SignUp',
  layout: 'auth',
  Path,
  data() {
    return {
      model: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        passwordConfirm: '',
      },
      inProgress: false,
    };
  },
  beforeCreate() {
    this.$store.dispatch('user/logout', false);
  },
  methods: {
    async signUp() {
      this.inProgress = true;
      const payload = {
        firstName: this.model.firstName,
        lastName: this.model.lastName,
        email: this.model.email,
        password: this.model.password,
      };
      const response = await this.$store.dispatch('user/signUp', payload);
      if (response?.ok) {
        sessionStorage.setItem('resend-timer', JSON.stringify({
          timerValue: resendEmailLifetime,
          createdAt: Date.now(),
        }));
        await this.$router.push(Path.SIGN_IN);
        this.ShowModal({
          key: modals.status,
          img: require('~/assets/img/ui/email.svg'),
          title: this.$t('registration.emailConfirmTitle'),
          subtitle: this.$t('registration.emailConfirm'),
        });
      }
      this.inProgress = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.auth {
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
    }
  }

  &__fields {
    padding-top: 40px;
    display: grid;
    grid-template-columns: 1fr;
  }

  &__action {
    padding-top: 30px;
  }
}

@include _1199 {
  .auth {
    &__text {
      &_title {
        font-size: 28px;
      }
    }
  }
}
</style>

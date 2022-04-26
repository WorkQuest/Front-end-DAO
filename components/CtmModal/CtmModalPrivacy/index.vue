<template>
  <ctm-modal-box
    class="privacy"
    :title="$tc('privacy.title')"
  >
    <div class="ctm-modal__content">
      <div class="ctm-modal__desc">
        {{ $t('privacy.desc') }}
      </div>
      <div class="privacy__forms">
        <base-checkbox
          v-model="privacy"
          name="privacy"
          :label="$tc('privacy.agree')"
        >
          <template v-slot:sub>
            <span class="privacy__link">
              {{ $t('privacy.privacyLink') }}
            </span>
          </template>
        </base-checkbox>
        <base-checkbox
          v-model="terms"
          name="terms"
          :label="$tc('privacy.agree')"
        >
          <template v-slot:sub>
            <span class="privacy__link">
              {{ $t('privacy.termsLink') }}
            </span>
          </template>
        </base-checkbox>
        <base-checkbox
          v-model="aml"
          name="aml"
          :label="$tc('privacy.agree')"
        >
          <template v-slot:sub>
            <span class="privacy__link">
              {{ $t('privacy.amlLink') }}
            </span>
          </template>
        </base-checkbox>
        <base-btn
          class="privacy__action"
          :disabled="!isAllChecked"
          @click="onSubmit()"
        >
          {{ $t('meta.ok') }}
        </base-btn>
      </div>
    </div>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';
import { Path, UserStatuses } from '~/utils/enums';

export default {
  name: 'PrivacyModal',
  data() {
    return {
      privacy: false,
      terms: false,
      aml: false,
    };
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
      userData: 'user/getUserData',
    }),
    isAllChecked() {
      return this.privacy && this.terms && this.aml;
    },
  },
  methods: {
    async onSubmit() {
      const response = await this.$store.dispatch('user/confirm', {
        confirmCode: sessionStorage.getItem('confirmToken'),
        role: this.options.role,
      });
      if (response?.ok) {
        const { callback, role } = this.options;
        this.$cookies.set('role', role, { path: '/' });
        this.$cookies.set('userStatus', UserStatuses.Confirmed, { path: '/' });
        sessionStorage.removeItem('confirmToken');
        this.ShowToast(this.$t('modals.yourAccountVerified'), this.$t('modals.success'));
        await callback();
        await this.$router.push(Path.ROLE);
      } else {
        // Wrong confirm token
        await this.$store.dispatch('user/logout');
        await this.$router.push(Path.SIGN_IN);
      }
      this.CloseModal();
    },
  },
};
</script>

<style lang="scss" scoped>
.ctm-modal {
  @include modalKit;

  &__desc {
    text-align: left;
  }
}

.privacy {
  max-width: 382px !important;

  &__forms {
    padding-top: 25px;
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 15px;
  }

  &__link {
    font-family: 'Inter', sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 130%;
    text-decoration-line: underline;
    color: $blue;
  }

  &__action {
    margin-top: 20px;
  }
}
</style>

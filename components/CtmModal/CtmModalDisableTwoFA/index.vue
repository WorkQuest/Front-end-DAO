<template>
  <ctm-modal-box
    class="disable-2fa"
    :title="$t('modals.disable2Fa')"
  >
    <div class="disable-2fa__content">
      <validation-observer
        v-slot="{ handleSubmit, validated, passed, invalid }"
        ref="twoFA"
      >
        <base-field
          id="twoFACode"
          ref="totp"
          v-model="twoFACode"
          vid="totp"
          :placeholder="errorMessage || $t('modals.enterCode')"
          rules="required|min:6|numeric"
          name="disable 2FA"
          :is-hide-error="false"
        />
        <div class="disable-2fa__buttons">
          <base-btn
            class="message__action"
            :disabled="!validated || !passed || invalid"
            @click="handleSubmit(disable2FA)"
          >
            {{ $t('meta.disable') }}
          </base-btn>
          <base-btn
            :mode="'outline'"
            class="message__action"
            @click="hide"
          >
            {{ $t('meta.cancel') }}
          </base-btn>
        </div>
      </validation-observer>
    </div>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';
import modals from '~/store/modals/modals';

export default {
  name: 'ModalDisableTwoFA',
  data() {
    return {
      twoFACode: '',
      errorMessage: '',
    };
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
      userData: 'user/getUserData',
    }),
  },
  methods: {
    hide() {
      this.CloseModal();
    },
    async disable2FA() {
      const response = await this.$store.dispatch('user/disable2FA', {
        totp: this.twoFACode,
      });
      if (response.ok) {
        this.hide();
        this.showModalSuccess();
      } else this.validationErrorFields(response.data);
    },
    showModalSuccess() {
      this.ShowModal({
        key: modals.status,
        img: require('~/assets/img/ui/questAgreed.svg'),
        title: this.$t('modals.2FAStatus'),
        subtitle: this.$t('modals.2FADisabled'),
      });
    },
    validationErrorFields(data) {
      data.forEach(async (obj) => {
        const { field } = obj;
        const { name } = this.$refs.totp.name;
        const err = {
          [field]: [this.$t('messages.excluded', { _field_: name })],
        };
        await this.$refs.twoFA.setErrors(err);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.disable-2fa {
    max-width: 430px;
    padding: 10px;
    display: grid;
    gap: 10px;
    &__buttons {
        display: flex;
        gap: 10px;
    }
}
</style>

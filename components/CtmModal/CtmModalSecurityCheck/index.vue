<template>
  <ctm-modal-box
    class="check"
    :title="$tc('securityCheck.title')"
  >
    <div class="check__content">
      <validation-observer
        v-slot="{handleSubmit, validated, passed, invalid}"
        class="content__validator"
      >
        <div class="content__msg">
          {{ errorMsg ? $t('errors.incorrectPass') : null }}
        </div>
        <div class="content__field">
          <div class="content__title">
            {{ $t('securityCheck.confCode') }}
          </div>
          <base-field
            v-model="securityCode"
            auto-focus
            :disabled="inProgress"
            data-selector="SECURITY-CODE"
            :placeholder="$t('securityCheck.placeholder')"
            :name="$tc('securityCheck.title')"
            rules="required|alpha_num|length:6"
            class="content__input"
            @enter="handleSubmit(submit)"
          />
          <div class="content__body">
            {{ $t('securityCheck.confCodeDesc') }}
          </div>
        </div>
        <div class="content__buttons buttons">
          <base-btn
            class="buttons__button"
            :disabled="!validated || !passed || invalid || inProgress"
            selector="SEND"
            @click="handleSubmit(submit)"
          >
            {{ $t('meta.send') }}
          </base-btn>
        </div>
      </validation-observer>
    </div>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'ModalSecurityCheck',
  data() {
    return {
      securityCode: '',
      errorMsg: false,
      inProgress: false,
    };
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
    }),
  },
  methods: {
    async submit() {
      if (this.inProgress) return;

      const { actionMethod, isOnlySubmit } = this.options;
      if (isOnlySubmit) {
        await actionMethod(this.securityCode);
        return;
      }
      this.inProgress = true;
      const result = await this.$store.dispatch('user/validateTOTP', { token: this.securityCode });
      this.inProgress = false;

      if (result) {
        await this.CloseModal();
        await this.$store.dispatch('user/getUserData');
        await actionMethod();
      } else {
        this.errorMsg = true;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.check {
  max-width: 382px !important;

  &__content {
    justify-items: center;
    padding: 0 28px 30px 28px !important;
  }
}

.content {
  &__msg {
    color: red;
  }

  &__title {
    font-size: 16px;
    line-height: 130%;
    margin-bottom: 4px;
  }

  &__field {
    margin: 25px 0 0 0;
  }

  &__buttons {
    margin-top: 25px;
  }

  &__body {
    font-size: 14px;
    color: $black400;
  }
}

</style>

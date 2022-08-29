<template>
  <ctm-modal-box :title="$tc('forgot.title')">
    <ValidationObserver
      v-slot="{ handleSubmit }"
      class="ctm-modal__content content"
      tag="div"
    >
      <form
        class="content__form"
        action=""
        @submit.prevent="handleSubmit(restore)"
      >
        <div class="content__desc">
          {{ $t('forgot.desc') }}
        </div>
        <base-field
          v-model="emailInput"
          :name="$tc('placeholders.email').toLowerCase()"
          :placeholder="$t('placeholders.email').toLowerCase()"
          class="content__field"
          data-selector="EMAIL"
          rules="required|email"
        />
        <base-btn class="content__action">
          {{ $t('meta.send') }}
        </base-btn>
      </form>
    </ValidationObserver>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';
import { Path } from '~/utils/enums';
import modals from '~/store/modals/modals';

export default {
  name: 'ModalRestore',
  data() {
    return {
      emailInput: '',
    };
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
    }),
  },
  methods: {
    async restore() {
      const { ok, msg } = await this.$store.dispatch('user/passwordSendCode', {
        email: this.emailInput,
      });
      if (ok) {
        this.ShowModal({
          key: modals.status,
          path: Path.SIGN_IN,
          img: require('~/assets/img/ui/email.svg'),
          title: this.$t('registration.emailConfirmTitle'),
          subtitle: this.$t('registration.emailConfirm'),
        });
      } else {
        await this.$store.dispatch('main/showToast', {
          title: this.$t('modals.error'),
          variant: 'warning',
          text: msg,
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.ctm-modal {
  @include modalKit;
  &__box {
    max-width: 382px !important;
  }
}

.content {
  &__form {
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 20px;
  }
}
</style>

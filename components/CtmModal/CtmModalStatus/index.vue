<template>
  <ctm-modal-box
    class="messageSend"
    :is-header="false"
  >
    <div class="ctm-modal__content">
      <div class="messageSend">
        <div class="messageSend__content">
          <img
            v-if="options.img"
            :src="options.img"
            alt=""
          >
          <div class="ctm-modal__title">
            {{ options.title }}
          </div>
          <div class="ctm-modal__desc">
            <span v-if="!options.subtitle">
              {{ $t('modals.smallTemp') }}
            </span>
            <span v-if="options.subtitle">
              {{ options.subtitle }}
            </span>
          </div>
          <div v-if="options.url">
            <a
              :href="options.url"
              target="_blank"
            >
              {{ options.urlText }}
            </a>
          </div>
          <base-btn
            class="email__action"
            @click="closeModal"
          >
            {{ options.buttonText || $t('meta.ok') }}
          </base-btn>
        </div>
      </div>
    </div>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Status',
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
    }),
  },
  methods: {
    async closeModal() {
      const closeCallback = this.options?.closeCallback;
      if (closeCallback) {
        await closeCallback();
      }
      this.CloseModal();
    },
  },
};
</script>

<style lang="scss" scoped>
.ctm-modal {
  @include modalKit;
}

.messageSend {
  max-width: 337px !important;

  &__content {
    display: grid;
    grid-template-columns: 1fr;
    justify-items: center;
    grid-gap: 20px;
  }

  &__action {
    margin-top: 10px;
  }
}
</style>

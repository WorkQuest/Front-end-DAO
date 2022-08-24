<template>
  <ctm-modal-box
    class="warning"
    :is-header="false"
  >
    <div class="warning__content">
      <img
        alt=""
        src="~/assets/img/ui/warning.svg"
        class="warning__icon"
      >
      <div class="warning__title">
        {{ $t('modals.warning') }}
      </div>
      <div class="warning__desc">
        <span>{{ options.text }}</span>
      </div>
      <div class="warning__action">
        <base-btn
          class="action__cancel"
          mode="lightBlue"
          @click="CloseModal"
        >
          {{ $t('meta.cancel') }}
        </base-btn>
        <base-btn
          class="action__change"
          @click="change()"
        >
          {{ $t('meta.change') }}
        </base-btn>
      </div>
    </div>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Warning',
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
    }),
  },
  methods: {
    change() {
      this.options.callback();
      this.CloseModal();
    },
  },
};
</script>

<style lang="scss" scoped>
.warning {
  @include text-simple;
  min-width: 360px;

  &__content {
    padding: 0 28px 30px;
    margin-top: 25px;
  }

  &__icon {
    margin: 5px auto 0;
  }

  &__title {
    font-weight: 500;
    font-size: 23px;
    line-height: 30px;
    text-align: center;
    color: #1D2127;
    margin-top: 30px;
  }

  &__desc {
    font-size: 16px;
    line-height: 21px;
    text-align: center;
    color: #4C5767;
    margin-top: 5px;
    white-space: pre-line;
  }

  &__action {
    margin-top: 30px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 30px;
  }
}

@include _380 {
  .warning {
    min-width: 90vw;
  }
}
</style>

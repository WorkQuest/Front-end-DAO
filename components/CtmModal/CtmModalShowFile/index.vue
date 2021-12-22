<template>
  <ctm-modal-box
    class="ctm-modal"
    :is-header="false"
  >
    <div class="ctm-modal__content content">
      <img
        class="content__img"
        :src="options.imageSrc"
        alt=""
      >
    </div>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';
import modals from '~/store/modals/modals';

export default {
  name: 'ShowImage',
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
    }),
  },
  methods: {
    hide() {
      this.CloseModal();
    },
  },
};
</script>

<style lang="scss" scoped>

.portfolio {
  &__edit {
    transition: .5s ease-in-out;
    opacity: 0;
    visibility: hidden;
  }
  &__close {
    transition: .5s ease-in-out;
    opacity: 0;
    visibility: hidden;
  }
}

.ctm-modal__content:hover .portfolio__close,
.ctm-modal__content:hover .portfolio__edit {
  transition: .5s ease-in-out;
  opacity: 1;
  visibility: visible;
}

.ctm-modal {
  @include modalKit;
  &__box {
    max-width: 1200px !important;
    max-height: 100% !important;
    width: 90vw !important;
    height: auto !important;
    padding: 0 !important;
  }
  &__content {
    margin: auto auto;
  }
  .content {
    margin-top: 28px;
    overflow-y: auto;
    max-height: 800px;
    height: 100vw;
    max-width: 1200px;
    width: 100%;

    &__img {
      height: 100%;
      width: 100%;
      border-radius: 6px;
      object-fit: contain;
      margin: auto auto;
    }
  }
}
</style>

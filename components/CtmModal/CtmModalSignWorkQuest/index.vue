<template>
  <ctm-modal-box
    class="ctm-modal"
    :title="$tc('modals.signWorkQuest.title')"
  >
    <div class="ctm-modal__content">
      <div class="ctm-modal__description">
        {{ $t('modals.signWorkQuest.desc') }}
      </div>
      <div class="ctm-modal__content-btns">
        <base-btn @click="CloseModal">
          {{ $t('modals.cancel') }}
        </base-btn>
      </div>
    </div>
  </ctm-modal-box>
</template>

<script>
export default {
  name: 'ModalSignWorkQuest',
};
</script>

<style lang="scss" scoped>
.icon {
  font-size: 25px;
  color: $blue;
  align-items: center;

  &-Lock:before {
    @extend .icon;
    content: "\ea24";
  }

  &-user::before {
    @extend .icon;
    content: "\e90c";
  }
}

.error-msg {
  color: red;
}

.ctm-modal {
  @include modalKit;
  max-width: 450px !important;
  height: auto !important;

  &__content-field {
    margin: 15px 0 0 0;
  }

  &__content-btns {
    display: grid;
    grid-gap: 20px;
    gap: 20px;
    margin-top: 25px;
  }

  &__content {
    padding: 0 25px !important;
  }

  &__action {
    margin-top: 10px;
  }

  &__description {
    padding-top: 15px;
    padding-bottom: 10px;
  }
}
</style>

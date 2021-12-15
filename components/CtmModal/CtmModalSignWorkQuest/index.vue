<template>
  <ctm-modal-box
    class="messageSend"
    :title="$t('modals.signWorkQuest.title')"
  >
    <div class="ctm-modal__content sign">
      <div class="sign sign__description">
        {{ $t('modals.signWorkQuest.desc') }}
      </div>
      <div class="ctm-modal__content-btns">
        <div class="btn-group">
          <base-btn
            @click="hide()"
          >
            {{ $t('modals.cancel') }}
          </base-btn>
        </div>
      </div>
    </div>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'ModalSignWorkQuest',
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
    }),
  },
  methods: {
    async hide() {
      this.CloseModal();
    },
  },
};
</script>

<style lang="scss" scoped>
.sign__description {
  padding-top: 15px;
  padding-bottom: 10px;
}
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
  color:red;
}
.ctm-modal {
  @include modalKit;
  &__content-field {
    margin: 15px 0 0 0;
  }

  &__content-btns {
    .btn-group{
      display: grid;
      grid-gap: 20px;
      gap: 20px;
      margin-top: 25px;
    }
  }

  &__label {
    margin-bottom: 5px;
  }

  &__content {
    padding-top: 0 !important;
  }
}

.messageSend {
  max-width: 450px !important;
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

<template>
  <ctm-modal-box
    class="messageSend"
    :title="$t('pension.changePercent')"
  >
    <div class="ctm-modal__content">
      <div class="ctm-modal__desc_left">
        {{ $t('modals.lorem') }}
      </div>
      <div class="ctm-modal__content-field">
        <label
          for="currPerc_input"
          class="ctm-modal__label"
        >{{ $t('modals.currentPercent') }}</label>
        <base-field
          id="currPerc_input"
          v-model="amount_input"
          :is-hide-error="true"
          placeholder="15%"
          data-selector="AMOUNT"
        />
      </div>
      <div class="ctm-modal__content-btns">
        <div class="btn-group">
          <base-btn
            class="btn"
            @click="CloseModal"
          >
            {{ $t('meta.cancel') }}
          </base-btn>
          <base-btn
            class="btn_bl"
            @click="showPensionIsRegisteredModal()"
          >
            {{ $t('meta.submit') }}
          </base-btn>
        </div>
      </div>
    </div>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'ModalApplyForAPension',
  data() {
    return {
      amount_input: '',
    };
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
    }),
  },
  methods: {
    showPensionIsRegisteredModal() {
    },
  },
};
</script>

<style lang="scss" scoped>

.ctm-modal {
  @include modalKit;

  &__content-field {
    margin: 15px 0 0 0;
  }

  &__desc {
    &_left {
      text-align: left;
      font-size: 16px;
      font-weight: 400;
      line-height: 21px;
      color: #4C5767;
    }
  }

  &__content-btns {
    .btn-group {
      display: grid;
      grid-template-columns: repeat(2, calc(50% - 10px));
      grid-gap: 20px;
      gap: 20px;
      margin-top: 25px;

      .btn {
        box-sizing: border-box;
        font-weight: 400;
        font-size: 16px;
        color: #0083C7;
        border: 1px solid #0083C71A;
        border-radius: 6px;
        transition: .3s;
        background-color: #fff;

        &:hover {
          background-color: #0083C71A;
          border: 0px;
        }

        &_bl {
          @extend .btn;
          background-color: #0083C7;
          border: unset;
          color: #fff;

          &:hover {
            background-color: #103d7c;
          }
        }
      }
    }
  }

  &__label {
    margin-bottom: 5px;
  }
}

.messageSend {
  max-width: 495px !important;

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

<template>
  <ctm-modal-box
    class="messageSend"
    :title="$tc('saving.openADeposit')"
  >
    <div class="ctm-modal__content">
      <div class="ctm-modal__content-field">
        <label
          for="depositPercent_input"
          class="ctm-modal__label"
        >
          {{ $t("modals.lockedSavings") }}
        </label>
        <base-field
          id="depositPercent_input"
          :is-hide-error="true"
          data-selector="PERCENT"
          placeholder="3 500"
        />
      </div>
      <div class="ctm-modal__content-field">
        <label
          for="amount_input"
          class="ctm-modal__label"
        >
          {{ $t("modals.durationDays") }}
        </label>
        <base-field
          id="amount_input"
          :is-hide-error="true"
          data-selector="AMOUNT"
          placeholder="180"
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
            @click="showDepositIsOpenedModal()"
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
import modals from '~/store/modals/modals';
import { images } from '~/utils/images';

export default {
  name: 'ModalOpenADeposit',
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
    }),
  },
  methods: {
    showDepositIsOpenedModal() {
      this.ShowModal({
        key: modals.status,
        img: images.TRANSACTION_SEND,
        title: this.$t('saving.depositIsOpened'),
        subTitle: '',
        path: '/savings/1',
      });
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

  &__content {
    padding-top: 0 !important;
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

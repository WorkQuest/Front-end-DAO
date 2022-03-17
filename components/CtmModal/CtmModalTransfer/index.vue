<template>
  <ctm-modal-box
    class="messageSend"
    :title="$t('modals.send')"
  >
    <div class="ctm-modal__content">
      <validation-observer
        v-slot="{handleSubmit}"
        tag="div"
      >
        <div class="ctm-modal__content-field">
          <label for="address_input">
            {{ $t('modals.address') }}
          </label>
          <base-field
            id="address_input"
            v-model="address"
            :name="$t('modals.recepientAddressField')"
            :placeholder="$t('modals.recepientAddress')"
            type="text"
            rules="required|alpha_num"
          />
        </div>
        <label for="value_dd">
          {{ $t('modals.cardNumber') }}
        </label>
        <base-dd
          id="value_dd"
          v-model="card"
          type="gray"
          :items="items"
        />
        <div class="ctm-modal__content-field">
          <label for="amount_input">
            {{ $t('modals.amount') }}
          </label>
          <base-field
            id="amount_input"
            v-model="amount"
            :placeholder="'0 WUSD'"
            type="number"
            rules="required|decimal"
            :name="$t('modals.amountField')"
          />
        </div>
        <div class="btn__container">
          <div class="btn__wrapper">
            <base-btn
              class="message__action"
              @click="handleSubmit(showTransactionSendModal)"
            >
              {{ $t('meta.submit') }}
            </base-btn>
          </div>
          <div class="btn__wrapper">
            <base-btn
              mode="outline"
              class="message__action"
              @click="CloseModal"
            >
              {{ $t('meta.cancel') }}
            </base-btn>
          </div>
        </div>
      </validation-observer>
    </div>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';
import modals from '~/store/modals/modals';

export default {
  name: 'ModalTransfer',
  data() {
    return {
      card: 0,
      address: '',
      amount: '',
      items: ['1234 1234 1234 1234'],
    };
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
    }),
  },
  methods: {
    showTransactionSendModal() {
      this.ShowModal({
        key: modals.status,
        img: require('assets/img/ui/transactionSend.svg'),
        title: this.$t('modals.transactionSend'),
        subtitle: this.$t('modals.smallTemp'),
      });
    },
  },
};
</script>

<style lang="scss" scoped>

.ctm-field {
  &__err {
    display: none;
  }
}

.ctm-modal {
  &__content-field {
    height: 46px;
    margin-bottom: 50px;
  }

  &__equal {
    margin: 0 0 35px 10px;
  }
}

.ctm-modal {
  @include modalKit;
}

.input {
  &_white {
    border-radius: 6px;
    border: 1px solid $black0;
    padding: 11px 20px 11px 15px;
    height: 46px;
    width: 100%;
    background-color: $white;
    resize: none;

    &::placeholder {
      color: $black800;
    }
  }
}

.btn {
  &__container {
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
    margin: 15px 0 0 0;
  }

  &__wrapper {
    width: 45%;
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

<template>
  <ctm-modal-box
    class="withdrawal"
    :title="$t('modals.withdrawal')"
  >
    <div class="withdrawal__content content">
      <div class="content__amount">
        <div class="content__field">
          <base-field
            id="amountInput"
            :placeholder="'0 WDX'"
            :label="$t('modals.amount')"
          />
        </div>
        <div class="content__equal">
          =
        </div>
        <div class="content__field">
          <base-field
            mode="white"
            :placeholder="'$ 0'"
          />
        </div>
      </div>
      <div v-if="options.isCardClosed">
        <div class="content__field">
          <base-dd
            v-model="ddValue"
            type="gray"
            :items="options.userCards"
          />
        </div>
        <div class="content__field field">
          <div
            class="field__add-card"
            @click="showAddCardModal"
          >
            <span>{{ $t('modals.addAnotherCard') }}</span>
          </div>
        </div>
      </div>
      <div v-else>
        <div class="content__field">
          <base-field
            id="cardNumberInput"
            v-model="cardNumberInput"
            :placeholder="'1234 1234 1234 1234'"
            :label="$t('modals.numberOfCard')"
          />
        </div>
        <div class="content__field field">
          <div class="field__info">
            <base-field
              id="dateInput"
              v-model="dateInput"
              :placeholder="'02/24'"
              :label="$t('modals.date')"
            />
            <base-field
              id="cvvInput"
              v-model="cvvInput"
              :placeholder="'242'"
              :label="$t('modals.cvv')"
            />
          </div>
        </div>
        <base-checkbox
          v-model="isShowMap"
          name="map"
          :label="$t('modals.saveCardForNextPayment')"
        />
      </div>
      <div class="content__field field">
        <div class="field__actions actions">
          <base-btn
            mode="outline"
            class="actions__cancel"
            @click="hide()"
          >
            <template v-slot:default>
              {{ $t('meta.cancel') }}
            </template>
          </base-btn>
          <base-btn
            class="actions__submit"
            @click="showTransactionSendModal()"
          >
            <template v-slot:default>
              {{ $t('meta.submit') }}
            </template>
          </base-btn>
        </div>
      </div>
    </div>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';
import modals from '~/store/modals/modals';

export default {
  name: 'ModalWithdraw',
  data() {
    return {
      cvvInput: '',
      dateInput: '',
      balanceInput: '',
      cardNumberInput: '',
      isShowMap: false,
      ddValue: 0,
    };
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
    }),
  },
  methods: {
    hide() {
      this.CloseModal();
    },
    showTransactionSendModal() {
      this.ShowModal({
        key: modals.transactionSend,
      });
    },
    showAddCardModal() {
      this.ShowModal({
        key: modals.addCard,
      });
    },
  },
};
</script>

<style lang="scss" scoped>

.withdrawal {
  max-width: 615px !important;
  &__content {
    padding: 0 28px 30px;
    margin-top: 25px;
  }
}

.content {
  &__amount {
    display: grid;
    grid-template-columns: 47% 6% 47%;
    justify-content: space-between;
    align-items: flex-end;
  }
  &__equal {
    margin: 0 0 35px 12px;
  }
}

.field {
  &__info {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }
  &__actions {
    display: grid;
    grid-template-columns: repeat(2, calc(50% - 10px));
    grid-gap: 20px;
    margin-top: 25px;
  }
  &__add-card {
    display: inline-flex;
    justify-content: flex-end;
    cursor: pointer;

    width: 100%;
    line-height: 21px;

    margin-top: 15px;

    color: #0083C7;
    text-decoration: underline;
  }
}

</style>

<template>
  <ctm-modal-box
    class="withdrawal"
    :title="$t('modals.withdrawal')"
  >
    <div class="withdrawal__content content">
      <validation-observer v-slot="{handleSubmit}">
        <div class="content__amount">
          <div class="content__field field">
            <base-field
              id="amountInput"
              v-model="amountWDX"
              :name="$t('modals.amount')"
              type="number"
              :placeholder="'0 WDX'"
              :label="$t('modals.amount')"
              rules="required"
            >
              <template
                v-if="amountWDX"
                v-slot:right-absolute
              >
                <span class="field__currency">WDX</span>
              </template>
            </base-field>
          </div>
          <div class="content__equal">
            =
          </div>
          <div class="content__field">
            <base-field
              v-model="amountUSD"
              mode="white"
              :placeholder="'$ 0'"
              :disabled="true"
            >
              <template
                v-if="amountUSD"
                v-slot:right-absolute
              >
                <span class="field__currency">$</span>
              </template>
            </base-field>
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
              :name="$t('modals.numberOfCard')"
              type="tel"
              rules="max:19|required"
              pattern="[0-9\s]{13,19}"
              inputmode="numeric"
              :placeholder="'1234 1234 1234 1234'"
              :label="$t('modals.numberOfCard')"
            />
          </div>
          <div class="content__field field">
            <div class="field__info">
              <base-field
                id="dateInput"
                v-model="dateInput"
                :name="$t('modals.date')"
                :placeholder="'02/24'"
                :label="$t('modals.date')"
                rules="max:5|required|date"
              />
              <base-field
                id="cvvInput"
                v-model="cvvInput"
                :name="$t('modals.cvv')"
                :placeholder="'242'"
                :label="$t('modals.cvv')"
                rules="max:4|required"
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
              {{ $t('meta.cancel') }}
            </base-btn>
            <base-btn
              class="actions__submit"
              @click="handleSubmit(showTransactionSendModal)"
            >
              {{ $t('meta.submit') }}
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
  name: 'ModalWithdraw',
  data() {
    return {
      cvvInput: '',
      dateInput: '',
      amountWDX: null,
      amountUSD: null,
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

  &__currency {
    color: $black300;
  }

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

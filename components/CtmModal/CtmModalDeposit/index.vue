<template>
  <!--  TODO: Refactoring needed!-->
  <ctm-modal-box
    class="messageSend"
    :title="$tc('modals.deposit')"
  >
    <div class="ctm-modal__content">
      <validation-observer v-slot="{handleSubmit}">
        <div
          class="step-panel"
          :class="{'hide': step === 3}"
        >
          <div
            class="step-panel__step"
            :class="[{'step-panel__step_active': step === 1}, {'hide': step === 3}]"
          >
            {{ $t('wallet.cryptoWallet') }}
          </div>
          <div
            class="step-panel__step"
            :class="[{'step-panel__step_active': step === 2}, {'hide': step === 3}]"
          >
            {{ $t('wallet.bankCard') }}
          </div>
        </div>
        <div
          v-if="step === 1"
          class="step__container"
        >
          <div
            class="ctm-modal__content-field"
          >
            <label for="amount_input">
              {{ $t('modals.amount') }}
            </label>
            <div class="ctm-modal__input">
              <base-field
                id="amount_input"
                v-model="amount_input"
                :name="$tc('modals.amount')"
                data-selector="AMOUNT"
                type="number"
                rules="required"
                placeholder="0 WUSD"
              />
            </div>
          </div>
        </div>
        <div
          v-if="step === 2"
          class="step__container"
        >
          <div class="grid__3col">
            <div class="ctm-modal__content-field">
              <label for="amount_input2">
                {{ $t('modals.amount') }}
              </label>
              <base-field
                id="amount_input2"
                v-model="amount_input"
                :name="$tc('modals.amount')"
                type="number"
                rules="required"
                data-selector="AMOUNT"
                placeholder="0 WUSD"
              />
            </div>
            <div class="ctm-modal__equal">
              =
            </div>
            <div class="ctm-modal__content-field">
              <base-field
                v-model="balance_input"
                :name="$tc('modals.amount')"
                mode="white"
                type="number"
                data-selector="BALANCE"
                rules="required"
                placeholder="$ 0"
              />
            </div>
          </div>
          <div class="ctm-modal__content-field">
            <label for="cardNumber_input">{{ $t('modals.numberOfCard') }}</label>
            <base-field
              id="cardNumber_input"
              v-model="cardNumber_input"
              :name="$tc('modals.numberOfCard')"
              type="tel"
              placeholder="1234 1234 1234 1234"
              data-selector="CARD-NUMBER"
              rules="max:19|required"
            />
          </div>
          <div class="grid__2col">
            <div class="ctm-modal__content-field">
              <label for="date_input">{{ $t('modals.date') }}</label>
              <base-field
                id="date_input"
                v-model="date_input"
                :name="$tc('modals.date')"
                placeholder="02/24"
                rules="max:5|required|date"
                data-selector="DATE"
              />
            </div>
            <div class="ctm-modal__content-field">
              <label for="cvv_input">{{ $t('modals.cvv') }}</label>
              <base-field
                id="cvv_input"
                v-model="cvv_input"
                :name="$tc('modals.cvv')"
                type="number"
                placeholder="242"
                data-selector="CVV"
                rules="max:4|required"
              />
            </div>
          </div>
        </div>
        <div
          v-if="step === 3"
          class="step__container"
          :class="{'step__container_grid': step === 3}"
        >
          <div>
            <img
              alt=""
              src="~/assets/img/temp/qr.svg"
            >
          </div>
          <div>
            <span class="step-three__text">
              {{ $t('wallet.send') }}
            </span>
            <span class="step-three__text_blue">
              0.2 $
            </span>
            <div class="step-three__text">
              {{ $t('wallet.toThisAddress') }}
            </div>
            <div class="code__container">
              <span class="code__text">
                {{ code }}
              </span>
              <button-copy
                :copy-value="code"
              />
            </div>
          </div>
        </div>
        <div class="btn__container">
          <div class="btn__wrapper">
            <span
              v-if="step === 1"
              class="step__container"
            >
              <base-btn
                class="message__action"
                @click="handleSubmit(nextStep)"
              >
                {{ $t('meta.next') }}
              </base-btn>
            </span>
            <span
              v-if="step === 2"
              class="step__container"
            >
              <base-btn
                class="message__action"
                @click="handleSubmit(nextStep)"
              >
                {{ $t('meta.submit') }}
              </base-btn>
            </span>
            <span
              v-if="step === 3"
              class="step__container"
            >
              <base-btn
                class="message__action"
                @click="handleSubmit(CloseModal)"
              >
                {{ $t('meta.submit') }}
              </base-btn>
            </span>
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
  name: 'ModalDeposit',
  data() {
    return {
      amount_input: '',
      balance_input: '',
      cardNumber_input: '',
      date_input: '',
      cvv_input: '',
      step: 1,
      code: '0xf376g...G7f3g8b',
    };
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
    }),
  },
  methods: {
    nextStep() {
      this.step += 1;
    },
    showTransactionSendModal() {
      this.ShowModal({
        img: require('assets/img/ui/transactionSend.svg'),
        key: modals.status,
        title: this.$t('modals.transactionSend'),
      });
    },
  },
};
</script>

<style lang="scss" scoped>

.icon {
  &-copy:before {
    content: "\e996";
    color: $blue;
    font-size: 20px;
  }
}

.code {
  &__container {
    display: flex;
    border: 1px solid $black0;
    border-radius: 6px;
    justify-content: space-between;
    padding: 12px;
    margin: 33px 0 0 0;
  }

  &__text {
    font-weight: 400;
    font-size: 16px;
    color: $black800;
  }
}

.hide {
  display: none;
}

.grid {
  &__2col {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    justify-content: space-between;
    align-items: flex-end;
    grid-gap: 10px;
  }

  &__3col {
    display: grid;
    grid-template-columns: 6fr 1fr 6fr;
    justify-content: space-between;
    align-items: flex-end;
  }
}

.step {
  &-three {
    &__text {
      @include text-simple;
      font-weight: 400;
      font-size: 16px;
      color: $black500;

      &_blue {
        @extend .step-three__text;
        color: $blue;
      }
    }
  }

  &__container {
    &_grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
    }
  }
}

.step-panel {
  display: flex;
  flex-direction: row;
  align-items: flex-start;

  &__step {
    @include text-simple;
    font-weight: 400;
    font-size: 16px;
    color: $black500;
    margin: 0 10px 0 0;

    &_active {
      color: $black800;
      border-bottom: 1px solid $blue;
      padding: 0 0 12px 0;
    }
  }
}

.ctm-modal {
  &__content-field {
    margin: 15px 0 0 0;
  }

  &__equal {
    margin: 0 0 35px 10px;
  }

  &__input {
    height: 46px;
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

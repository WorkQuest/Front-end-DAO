<template>
  <ctm-modal-box
    class="transfer"
    :title="$t('modals.withdraw')"
  >
    <div class="transfer__content content">
      <div class="content__step-panel step-panel">
        <div
          class="step-panel__step"
          :class="[{'step-panel__step_active': step === 'wallet'}]"
          @click="step = 'wallet'"
        >
          {{ $t('wallet.walletAddress') }}
        </div>
        <div
          class="step-panel__step"
          :class="[{'step-panel__step_active': step === 'bank'}]"
          @click="step = 'bank'"
        >
          {{ $t('wallet.bankCard') }}
        </div>
      </div>
      <validation-observer
        v-if="step === 'wallet'"
        v-slot="{ handleSubmit }"
        tag="div"
        class="content_container"
      >
        <div class="content__input input">
          <span class="input__title">
            {{ $t('modals.recepientAddress') }}
          </span>
          <base-field
            v-model="recipient"
            class="input__field"
            :placeholder="$t('modals.address')"
            :rules="`required|${checkFormatAddress(recipient)}`"
            data-selector="ADDRESS"
            :name="$t('modals.addressField')"
          />
        </div>
        <div class="content__input input">
          <span class="input__title">
            {{ $t('modals.amount') }}
          </span>
          <base-field
            v-model="amount"
            class="input__field"
            data-selector="AMOUNT"
            :placeholder="$t('modals.amount')"
            :rules="`required|decimal|is_not:0|max_bn:${maxAmount}|decimalPlaces:18`"
            :name="$t('modals.amountField')"
            type="number"
          >
            <template
              v-slot:right-absolute
              class="content__max max"
            >
              <base-btn
                mode="max"
                class="max__button"
                selector="MAX"
                @click="maxBalance"
              >
                <span class="max__text">
                  {{ $t('modals.max') }}
                </span>
              </base-btn>
            </template>
          </base-field>
        </div>
        <div class="content__txFee txFee">
          <div class="txFee__title">
            {{ $t('wallet.table.trxFee') }}:
          </div>
          <div
            v-if="!isCanSubmit"
            class="txFee__loader-wrapper"
          >
            <loader
              is-mini-loader
              class="txFee__loader"
            />
          </div>
          <div
            v-else
            class="txFee__amount"
          >
            {{ currentFee }} {{ $options.TokenSymbols.WQT }}
          </div>
        </div>
        <div class="content__buttons buttons">
          <base-btn
            mode="outline"
            class="buttons__action"
            @click="CloseModal"
          >
            {{ $t('meta.cancel') }}
          </base-btn>
          <base-btn
            class="buttons__action"
            :disabled="!isCanSubmit"
            selector="SUBMIT"
            @click="handleSubmit(showWithdrawInfo)"
          >
            {{ $t('meta.next') }}
          </base-btn>
        </div>
      </validation-observer>
      <template v-else>
        <bank-card />
      </template>
    </div>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';
import BigNumber from 'bignumber.js';
import { TokenSymbols } from '~/utils/enums';
import BankCard from '~/components/CtmModal/CtmModalDeposit/BankCard';

export default {
  name: 'ModalWalletWithdraw',
  components: { BankCard },
  TokenSymbols,
  data() {
    return {
      step: 'wallet',

      currentFee: 0,
      recipient: '',
      amount: 0,
      maxFeeForNativeToken: 0,
      isCanSubmit: true,
    };
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
      isLoading: 'main/getIsLoading',
      balance: 'wallet/getBalanceData',
      selectedToken: 'wallet/getSelectedToken',
      userWalletAddress: 'user/getUserWalletAddress',
      isConnected: 'wallet/getIsWalletConnected',
    }),
    maxAmount() {
      const fullBalance = new BigNumber(this.balance.WQT.fullBalance);
      const balanceMinusFee = fullBalance.minus(this.maxFeeForNativeToken).isGreaterThan(0);
      return balanceMinusFee ? fullBalance.minus(this.maxFeeForNativeToken).toString() : 0;
    },
  },
  watch: {
    async amount() {
      if (!this.isConnected) return;
      this.isCanSubmit = false;
      this.currentFee = '...';
      clearTimeout(this.timeoutId);
      this.timeoutId = setTimeout(async () => {
        const {
          amount, userWalletAddress, maxAmount,
        } = this;

        if (amount === '' || amount === null || new BigNumber(maxAmount).isLessThan(amount) || amount < 0) {
          this.currentFee = 0;
          this.isCanSubmit = true;
          return;
        }

        const nativeTokenFee = await this.$store.dispatch('wallet/getTransferFeeData', {
          recipient: userWalletAddress,
          value: amount,
        });
        this.currentFee = nativeTokenFee.ok ? nativeTokenFee.result.fee : 0;
        this.isCanSubmit = true;
      }, 300);
    },
  },
  async mounted() {
    this.SetLoader(true);
    if (this.selectedToken !== TokenSymbols.WQT) {
      await this.$store.dispatch('wallet/setSelectedToken', TokenSymbols.WQT);
    }
    await this.updateMaxFee();
    this.SetLoader(false);
  },
  methods: {
    checkFormatAddress(address) {
      if (address.startsWith('wq')) return 'max:41|min:41|addressBech32';
      return 'address';
    },
    showWithdrawInfo() {
      const { submit } = this.options;
      const { recipient, amount, selectedToken } = this;
      submit({ recipient, amount, selectedToken });
    },
    // Для просчета максимальной суммы транзакции от комиссии
    async updateMaxFee() {
      if (!this.isConnected) return;
      this.isCanSubmit = false;
      const { userWalletAddress, balance } = this;
      const feeRes = await this.$store.dispatch('wallet/getTransferFeeData', {
        recipient: userWalletAddress,
        value: balance.WQT.fullBalance,
      });
      if (feeRes?.ok) this.maxFeeForNativeToken = feeRes?.result?.fee ?? 0;
      else this.maxFeeForNativeToken = 0;
      this.isCanSubmit = true;
    },
    maxBalance() {
      this.amount = this.maxAmount;
      console.log(123, this.maxAmount, this.amount);
    },
  },
};
</script>

<style lang="scss" scoped>

.transfer {
  max-width: 500px !important;
  padding: 0 !important;

  &__content {
    padding: 20px 28px 30px 28px !important;
  }
}

.buttons {
  display: flex;
  justify-content: space-between;

  &__action {
    width: 212px !important;

    &:not(:last-child) {
      margin-right: 10px;
    }
  }
}

.input {
  &__field {
    margin-top: 5px;
  }
}

.content {
  &_container {
    margin-top: 10px;
  }
  &__step {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
  }

  &__panel {
    @include text-simple;
    font-weight: 400;
    font-size: 16px;
    color: $black500;
    margin: 0 20px 0 0;
    cursor: pointer;

    &_active {
      color: $black800;
      border-bottom: 2px solid $blue;
      padding: 0 0 12px 0;
    }
  }

  &__card {
    margin: 40px auto;
  }

  &__text {
    font-size: 16px;
    line-height: 130%;
    color: #D8DFE3;
    text-align: center;
  }

  &__txFee {
    margin-bottom: 20px;
    position: relative;
    display: flex;
  }
}

.txFee {
  &__loader-wrapper {
    width: 10px;
    margin-left: 10px;
    position: relative;
  }

  &__loader {
    position: absolute;
    top: -10px;
    background: none;
  }

  &__amount {
    margin-left: 10px;
  }
}

.grid {
  &__title {
    margin: 15px 5px 0 0;
  }
}

.max {
  &__button {
    margin-right: 10px !important;
    background-color: transparent !important;
  }
}

.step-panel {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  user-select: none;

  &__step {
    @include text-simple;
    font-weight: 400;
    font-size: 16px;
    color: $black500;
    margin: 0 10px 0 0;
    cursor: pointer;
    &_active {
      color: $black800;
      border-bottom: 1px solid $blue;
      padding: 0 0 12px 0;
    }
  }
}
</style>

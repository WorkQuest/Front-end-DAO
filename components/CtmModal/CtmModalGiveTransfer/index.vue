<template>
  <ctm-modal-box
    class="transfer"
    :title="$t('modals.transfer')"
  >
    <div class="transfer__content content">
      <validation-observer
        v-slot="{handleSubmit, invalid}"
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
            @input="replaceDot"
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
            :disabled="invalid || !isCanSubmit"
            selector="SUBMIT"
            @click="handleSubmit(showWithdrawInfo)"
          >
            {{ $t('meta.send') }}
          </base-btn>
        </div>
      </validation-observer>
    </div>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';
import BigNumber from 'bignumber.js';
import { TokenSymbols } from '~/utils/enums';

export default {
  name: 'ModalTakeTransfer',
  data() {
    return {
      recipient: '',
      amount: 0,
      step: 1,
      ddValue: 0,
      maxFeeNativeToken: 0,
      isCanSubmit: true,
    };
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
      isLoading: 'main/getIsLoading',
      balance: 'wallet/getBalanceData',
      selectedToken: 'wallet/getSelectedToken',
      userData: 'user/getUserData',
      isConnected: 'wallet/getIsWalletConnected',
    }),
    tokenSymbolsDd() {
      return [TokenSymbols.WQT];
    },
    maxAmount() {
      const {
        selectedToken, balance, maxFeeNativeToken,
      } = this;
      const fullBalance = new BigNumber(balance[selectedToken].fullBalance);
      if (selectedToken === TokenSymbols.WQT) {
        return fullBalance.minus(maxFeeNativeToken).toString();
      }
      return fullBalance.toString();
    },
  },
  watch: {
    ddValue(val) {
      this.$store.dispatch('wallet/setSelectedToken', TokenSymbols[this.tokenSymbolsDd[val]]);
      this.amount = 0;
    },
  },
  async mounted() {
    const i = this.tokenSymbolsDd.indexOf(this.selectedToken);
    this.ddValue = i >= 0 && i < this.tokenSymbolsDd.length ? i : 1;
    await this.updateMaxFee();
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
    replaceDot() {
      this.amount = this.amount.replace(/,/g, '.');
    },
    // Для просчета максимальной суммы транзакции от комиссии
    async updateMaxFee() {
      if (!this.isConnected) return;
      this.isCanSubmit = false;
      const {
        selectedToken, userData, balance,
      } = this;
      if (selectedToken === TokenSymbols.WQT) {
        const feeRes = await this.$store.dispatch('wallet/getTransferFeeData', {
          recipient: userData.wallet.address,
          value: balance.WQT.fullBalance,
        });
        if (feeRes?.ok) this.maxFeeNativeToken = feeRes?.result?.fee ?? 0;
        else this.maxFeeNativeToken = 0;
      }
      this.isCanSubmit = true;
    },
    maxBalance() {
      this.amount = this.maxAmount;
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
}

.grid {
  &__title {
    margin: 15px 5px 0 0;
  }
}

.max {
  &__button {
    color: $black700 !important;
    margin-right: 10px !important;
    background-color: transparent !important;
  }
}
</style>

<template>
  <ctm-modal-box
    class="delegate"
    :title="$tc('modals.delegate')"
  >
    <div class="delegate__content content">
      <validation-observer v-slot="{handleSubmit, valid}">
        <div class="content__address address">
          <label class="address__label">
            {{ options.delegateMode === $options.DelegateMode.INVESTORS ? $t('modals.investorAddress') : $t('modals.validatorAddress') }}
          </label>
          <div class="delegate__input">
            <base-field
              disabled
              data-selector="ADDRESS"
              :value="convertValue"
              class="address__body"
            />
          </div>
        </div>
        <div class="content__tokens tokens">
          <div class="tokens__title">
            {{ $t('modals.tokensNumber') }}
          </div>
          <label
            v-if="options.unbondingDays"
            class="tokens__title_grey"
          >
            {{ $t('validators.undelegateAfterDays', { n: options.unbondingDays } ) }}
          </label>
          <label
            v-else
            class="tokens__title_grey"
          >
            {{ $t('modals.tokensDelegated') }}
          </label>
          <div class="tokens__footer footer">
            <base-field
              v-model="tokensAmount"
              :disabled="!+maxValue"
              class="footer__body"
              placeholder="10000 WQT"
              data-selector="AMOUNT"
              :name="$tc('modals.tokensNumber')"
              :rules="`required${min}|max_bn:${maxValue}|decimalPlaces:18`"
              @input="replaceDot"
            />
            <base-btn
              :disabled="!+maxValue"
              class="footer__maximum"
              mode="lightBlue"
              @click="maxDelegate"
            >
              {{ $t('modals.max') }}
            </base-btn>
          </div>
        </div>
        <base-btn
          class="delegate__done"
          :disabled="!valid"
          @click="handleSubmit(delegate)"
        >
          {{ $t('modals.delegate') }}
        </base-btn>
      </validation-observer>
    </div>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';
import BigNumber from 'bignumber.js';
import modals from '~/store/modals/modals';
import { WQVoting } from '~/abi/index';
import { TokenSymbols, DelegateMode } from '~/utils/enums';
import { tempTxFeeValidators } from '~/utils/wallet';

export default {
  name: 'Delegate',
  data() {
    return {
      tokensAmount: '',
      balance: 0,
      investorAddress: '',
      windowSize: window.innerWidth,
      maxFee: 0,
    };
  },
  DelegateMode,
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
      isWalletConnected: 'wallet/getIsWalletConnected',
      balanceData: 'wallet/getBalanceData',
      userWalletAddress: 'user/getUserWalletAddress',
    }),
    min() {
      return this.options?.min ? `|min_value:${this.options.min}` : '|min_value:1';
    },
    maxValue() {
      if (this.options.delegateMode === DelegateMode.INVESTORS) {
        const max = new BigNumber(this.balance).minus(this.maxFee);
        return max.isGreaterThan(0) ? max.toString() : '0';
      }
      return new BigNumber(this.balance).minus(tempTxFeeValidators).toString();
    },
    convertValue() {
      const { windowSize, investorAddress } = this;
      const convertedValue = this.ConvertToBech32('wq', investorAddress);
      if (windowSize > 480) return convertedValue;
      let a = 10;
      if (windowSize > 450) a = 17;
      else if (windowSize > 380) a = 15;
      else if (windowSize > 350) a = 13;
      return this.CutTxn(convertedValue, a, a);
    },
  },
  async beforeMount() {
    if (!this.isWalletConnected) {
      await this.$store.dispatch('wallet/checkWalletConnected');
      this.CloseModal();
    }
    this.SetLoader(true);
    window.addEventListener('resize', () => {
      this.windowSize = window.innerWidth;
    });
    this.investorAddress = this.ConvertToHex('wq', this.options.investorAddress);
    await this.$store.dispatch('wallet/getBalance');
    if (this.options.delegateMode === DelegateMode.VALIDATORS) {
      this.SetLoader(false);
      this.balance = this.balanceData.WQT.fullBalance;
      if (new BigNumber(this.balance).minus(tempTxFeeValidators).isLessThan(0)) {
        this.ShowToast(this.$t('proposal.errors.transaction.notEnoughFunds'));
        this.balance = 0;
      }
      return;
    }
    // max fee calc
    const feeRes = await this.$store.dispatch('wallet/getContractFeeData', {
      method: 'delegate',
      abi: WQVoting,
      contractAddress: this.ENV.WORKNET_VOTING,
      data: [this.investorAddress],
      amount: this.balanceData.WQT.fullBalance,
    });
    this.SetLoader(false);
    if (feeRes.ok) {
      this.maxFee = feeRes.result.fee;
    } else {
      this.ShowToast(feeRes.msg);
      this.CloseModal();
    }
    if (new BigNumber(this.balanceData.WQT.fullBalance).isLessThan(this.maxFee)) {
      this.balance = 0;
      this.ShowToast(this.$t('proposal.errors.transaction.notEnoughFunds'));
    } else this.balance = this.balanceData.WQT.fullBalance;
  },
  methods: {
    replaceDot() {
      this.tokensAmount.replace(/,/g, '.');
    },
    maxDelegate() {
      this.tokensAmount = this.maxValue;
    },
    async delegate() {
      if (this.options.delegateMode === DelegateMode.VALIDATORS) {
        await this.options.submitMethod(this.tokensAmount);
        return;
      }
      if (!+this.balance) return;

      const { callback } = this.options;
      const {
        tokensAmount, userWalletAddress,
      } = this;

      let { investorAddress } = this;
      investorAddress = this.ConvertToHex('wq', investorAddress);
      this.CloseModal();
      this.SetLoader(true);
      const feeRes = await this.$store.dispatch('wallet/getContractFeeData', {
        method: 'delegate',
        abi: WQVoting,
        contractAddress: this.ENV.WORKNET_VOTING,
        data: [investorAddress],
        amount: tokensAmount,
      });
      this.SetLoader(false);
      if (!feeRes.ok) {
        this.ShowToast(feeRes.msg);
        return;
      }
      this.ShowModal({
        key: modals.transactionReceipt,
        title: this.$t('modals.delegate'),
        fields: {
          from: { name: this.$t('modals.fromAddress'), value: this.ConvertToBech32('wq', userWalletAddress) },
          to: { name: this.$t('modals.toAddress'), value: this.ConvertToBech32('wq', this.ENV.WORKNET_VOTING) },
          amount: { name: this.$t('modals.amount'), value: tokensAmount, symbol: TokenSymbols.WQT },
          fee: { name: this.$t('modals.trxFee'), value: feeRes.result.fee, symbol: TokenSymbols.WQT },
        },
        submitMethod: async () => {
          this.SetLoader(true);
          const res = await this.$store.dispatch('wallet/delegate', {
            toAddress: investorAddress,
            amount: tokensAmount,
          });
          this.SetLoader(false);
          if (res.ok) {
            this.ShowToast(`Delegated ${this.Floor(tokensAmount)} WQT`, this.$t('modals.delegate'));
          } else if (res.msg.includes('Not enough balance to delegate')) {
            this.ShowToast(this.$t('errors.delegate.notEnoughBalance'), this.$t('errors.delegate.title'));
          }
          return res;
        },
        callback,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.delegate {
  max-width: 500px !important;

  &__content {
    padding: 20px 28px 30px 28px !important;
  }

  &__body {
    @include text-usual;
    color: $black800;
    margin: 25px 0;
    background-color: $white !important;
  }

  &__done {
    margin-top: 35px;
  }

  &__input {
    height: 46px;
    margin-bottom: 15px;
  }
}

.footer {
  display: flex;
  justify-content: space-between;
  grid-gap: 10px;

  &__body {
    width: 100%;
    height: 46px !important;
  }

  &__maximum {
    width: 100px !important;
    height: 46px !important;
  }
}

.address {
  &__label {
    @include text-usual;
    color: $black800;
    margin: 0 !important;
  }

  &__body {
    margin-top: 5px;
  }
}

.tokens {
  &__title {
    @include text-usual;
    color: $black800;
    margin-bottom: 5px;

    &_grey {
      color: $black500;
      margin-bottom: 10px !important;
    }
  }
}
</style>

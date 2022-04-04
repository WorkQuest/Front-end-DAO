<template>
  <ctm-modal-box
    class="delegate"
    :title="$t('modals.delegate')"
  >
    <div class="delegate__content content">
      <validation-observer v-slot="{handleSubmit, valid}">
        <div class="content__address address">
          <label class="address__label">
            {{ $t('modals.investorAddress') }}
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
          <label class="tokens__title_grey">
            {{ $t('modals.tokensDelegated') }}
          </label>
          <div class="tokens__footer footer">
            <base-field
              v-model="tokensAmount"
              class="footer__body"
              placeholder="10000 WQT"
              data-selector="AMOUNT"
              :name="$t('modals.tokensNumber')"
              :rules="`required${min}|max_bn:${balance}|min_value:1|decimalPlaces:18`"
              @input="replaceDot"
            />
            <base-btn
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
import { TokenSymbols } from '~/utils/enums';
import abi from '~/abi/index';

export default {
  name: 'Delegate',
  data() {
    return {
      tokensAmount: '',
      balance: 0,
      investorAddress: '',
      windowSize: window.innerWidth,
    };
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
      isWalletConnected: 'wallet/getIsWalletConnected',
      balanceData: 'wallet/getBalanceData',
      userWalletAddress: 'user/getUserWalletAddress',
    }),
    min() {
      return this.options?.min ? `|min_value:${this.options.min}` : '';
    },
    convertValue() {
      const { windowSize } = this;
      if (windowSize > 480) return this.investorAddress;
      let a = 10;
      if (windowSize > 450) a = 17;
      else if (windowSize > 380) a = 15;
      else if (windowSize > 350) a = 13;
      return this.CutTxn(this.investorAddress, a, a);
    },
  },
  async beforeMount() {
    if (!this.isWalletConnected) {
      await this.$store.dispatch('wallet/checkWalletConnected');
      this.CloseModal();
    }
    this.investorAddress = this.options.investorAddress;
    window.addEventListener('resize', () => {
      this.windowSize = window.innerWidth;
    });
  },
  async mounted() {
    await Promise.all([
      this.$store.dispatch('wallet/getBalance'),
      this.$store.dispatch('wallet/getBalanceWQT', this.userWalletAddress),
    ]);
    this.balance = this.balanceData.WQT.fullBalance;
  },
  methods: {
    replaceDot() {
      this.tokensAmount.replace(/,/g, '.');
    },
    maxDelegate() {
      this.tokensAmount = this.balance;
    },
    async delegate() {
      const { callback } = this.options;
      const { investorAddress, tokensAmount, userWalletAddress } = this;
      this.CloseModal();
      this.SetLoader(true);
      const feeRes = await this.$store.dispatch('wallet/getContractFeeData', {
        method: 'delegate',
        _abi: abi.WQToken,
        contractAddress: process.env.WORKNET_WQT_TOKEN,
        data: [investorAddress, new BigNumber(tokensAmount).shiftedBy(18).toString()],
      });
      this.SetLoader(false);
      this.ShowModal({
        key: modals.transactionReceipt,
        title: this.$t('modals.delegate'),
        fields: {
          from: { name: this.$t('modals.fromAddress'), value: userWalletAddress },
          to: { name: this.$t('modals.toAddress'), value: process.env.WORKNET_WQT_TOKEN },
          amount: { name: this.$t('modals.amount'), value: tokensAmount, symbol: TokenSymbols.WQT },
          fee: { name: this.$t('modals.trxFee'), value: feeRes.result.fee, symbol: TokenSymbols.WUSD },
        },
        submitMethod: async () => {
          this.SetLoader(true);
          const res = await this.$store.dispatch('wallet/delegate', {
            toAddress: investorAddress,
            amount: tokensAmount,
          });
          this.SetLoader(false);
          if (res.ok) {
            this.ShowToast(`Delegated ${tokensAmount} WQT`, this.$t('modals.delegate'));
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
    margin-top: 25px;
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
    width: 284px !important;
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
      color: $black400;
      margin-bottom: 10px !important;
    }
  }
}
</style>

<template>
  <ctm-modal-box
    class="undelegate"
    :is-header="false"
  >
    <div class="undelegate__content">
      <div class="undeleagte__header header">
        <div class="header__title">
          {{ $t('modals.undelegate') }}
        </div>
        <div class="header__close">
          <span
            class="icon-close_big header__close"
            @click="CloseModal"
          />
        </div>
      </div>
      <div
        v-if="options.name"
        class="undelegate__body"
      >
        {{ $tc('modals.shureToUndelegate', options.name) }}
      </div>
      <div class="undelegate__tokens tokens">
        <div class="tokens__footer footer">
          {{ $t('modals.willBeUndelegate', { n: willBeUndelegate }) }}
        </div>
      </div>
      <div
        v-if="options.unbondingDays"
        class="undelegate__unbonding"
      >
        {{ $t('validators.undelegateAfterDays', { n: options.unbondingDays } ) }}
      </div>
      <div class="undelegate__bottom bottom">
        <base-btn
          class="bottom__cancel"
          mode="lightBlue"
          @click="CloseModal"
        >
          {{ $t('modals.cancel') }}
        </base-btn>
        <base-btn
          mode="delete"
          class="bottom__done"
          @click="undelegate"
        >
          {{ $t('modals.undelegate') }}
        </base-btn>
      </div>
    </div>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';
import BigNumber from 'bignumber.js';
import { DelegateMode, TokenSymbols } from '~/utils/enums';
import modals from '~/store/modals/modals';
import { WQVoting } from '~/abi/index';

export default {
  name: 'Undelegate',
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
      userWalletAddress: 'user/getUserWalletAddress',
      frozenBalance: 'user/getFrozenBalance',
    }),
    willBeUndelegate() {
      return this.options.delegateMode === DelegateMode.INVESTORS
        ? this.Floor(this.frozenBalance) : new BigNumber(this.options.tokensAmount).shiftedBy(-18).toString();
    },
  },
  beforeMount() {
    this.$store.dispatch('wallet/updateFrozenBalance');
  },
  methods: {
    async undelegate() {
      if (this.options.delegateMode === DelegateMode.VALIDATORS) {
        this.options.submitMethod();
        return;
      }

      const { callback } = this.options;
      this.CloseModal();
      this.SetLoader(true);
      const feeRes = await this.$store.dispatch('wallet/getContractFeeData', {
        method: 'undelegate',
        abi: WQVoting,
        contractAddress: this.ENV.WORKNET_VOTING,
        data: [],
      });
      this.SetLoader(false);
      if (!feeRes.ok) {
        this.ShowToast(feeRes.msg);
        return;
      }
      this.ShowModal({
        key: modals.transactionReceipt,
        title: this.$t('modals.undelegate'),
        fields: {
          from: { name: this.$t('modals.fromAddress'), value: this.ConvertToBech32('wq', this.userWalletAddress) },
          to: { name: this.$t('modals.toAddress'), value: this.ConvertToBech32('wq', this.ENV.WORKNET_VOTING) },
          fee: { name: this.$t('modals.trxFee'), value: feeRes.result.fee, symbol: TokenSymbols.WQT },
        },
        submitMethod: async () => {
          this.SetLoader(true);
          const res = await this.$store.dispatch('wallet/undelegate');
          this.SetLoader(false);
          if (res.ok) {
            this.ShowToast(this.$tc('modals.undelegateAmount', this.Floor(this.frozenBalance)), this.$t('modals.undelegate'));
          } else if (res.msg.includes('Not enough balance to undelegate')) {
            this.ShowToast(this.$t('errors.transaction.notEnoughFunds'), this.$t('errors.undelegateTitle'));
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
.ctm-modal {
  @include modalKit;
  padding: 30px 36px 30px 28px !important;
}

.undelegate {
  max-width: 500px !important;

  &__content {
    padding: 30px 28px 30px 28px !important;
  }

  &__body {
    @include text-usual;
    color: $black800;
    margin: 20px 0 25px 0;
  }

  &__bottom {
    margin-top: 25px;
  }
  &__unbonding {
    margin-top: 5px;
    color: $black500;
  }
}

.header {
  display: flex;
  justify-content: space-between;

  &__title {
    font-weight: 500;
    font-size: 23px;
    line-height: 130%;
  }

  &__close {
    color: $black800;
    font-size: 25px;
    cursor: pointer;
  }
}

.bottom {
  display: flex;
  justify-content: space-between;

  &__cancel {
    width: 112px !important;
  }

  &__done {
    width: 257px !important;
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

.footer {
  display: flex;
  justify-content: space-between;

  &__maximum {
    width: 100px !important;
    height: 46px !important;
  }
}
</style>

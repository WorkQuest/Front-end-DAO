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
          {{ $tc('modals.willBeUndelegate', freezedBalance) }}
        </div>
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
import { Chains, TokenSymbols } from '~/utils/enums';
import modals from '~/store/modals/modals';
import abi from '~/abi';

export default {
  name: 'Undelegate',
  data() {
    return {
      tokensAmount: '',
      accountAddress: '',
    };
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
      userWalletAddress: 'user/getUserWalletAddress',
      freezedBalance: 'user/getFreezedBalance',
    }),
  },
  beforeMount() {
    this.tokensAmount = this.options.tokensAmount;
  },
  async mounted() {
    await this.$store.dispatch('wallet/getBalance');
  },
  methods: {
    async undelegate() {
      const { userWalletAddress } = this;
      const { callback } = this.options;
      this.CloseModal();
      this.SetLoader(true);
      const feeRes = await this.$store.dispatch('wallet/getContractFeeData', {
        method: 'undelegate',
        _abi: abi.WQToken,
        contractAddress: process.env.WORKNET_WQT_TOKEN,
        data: [],
      });
      this.SetLoader(false);
      this.ShowModal({
        key: modals.transactionReceipt,
        title: this.$t('modals.undelegate'),
        fields: {
          from: { name: this.$t('modals.fromAddress'), value: userWalletAddress },
          to: { name: this.$t('modals.toAddress'), value: process.env.WORKNET_WQT_TOKEN },
          fee: { name: this.$t('modals.trxFee'), value: feeRes.result.fee, symbol: TokenSymbols.WUSD },
        },
        submitMethod: async () => {
          this.SetLoader(true);
          const res = await this.$store.dispatch('wallet/undelegate');
          this.SetLoader(false);
          if (res.ok) {
            this.ShowToast(this.$tc('modals.undelegateAmount', this.freezedBalance), this.$t('modals.undelegate'));
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

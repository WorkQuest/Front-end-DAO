<template>
  <ctm-modal-box
    class="info"
    :title="options.title || $tc('modals.txInfo')"
  >
    <div class="info__content content">
      <div class="content__fields">
        <div
          v-for="(item, i) of options.fields"
          :key="i"
          class="content__items-container"
        >
          <div
            v-if="item != null"
            class="item"
          >
            <div class="item__title">
              {{ item.name }}
            </div>
            <div
              class="item__subtitle"
              :class="{'item__subtitle_red': !canSend && item.name === $t('wallet.table.trxFee')}"
            >
              {{ item.value }}
              <span v-if="item.symbol">{{ item.symbol }}</span>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="canSend === false"
        class="info__error error"
      >
        {{ $t('errors.notEnoughBalance') }}
      </div>
      <div class="content__buttons buttons">
        <div class="buttons__group">
          <base-btn
            class="buttons__button"
            mode="outline"
            @click="close"
          >
            {{ $t('meta.cancel') }}
          </base-btn>
          <base-btn
            class="buttons__button"
            :disabled="!canSend"
            @click="handleSubmit"
          >
            {{ $t('meta.confirm') }}
          </base-btn>
        </div>
      </div>
    </div>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';
import BigNumber from 'bignumber.js';
import modals from '~/store/modals/modals';
import { TokenSymbols } from '~/utils/enums';

export default {
  name: 'TransactionReceipt',
  data() {
    return {
      canSend: true,
    };
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
      balance: 'wallet/getBalanceData',
    }),
  },
  mounted() {
    const { fields } = this.options;
    const amount = fields?.amount?.value;
    const symbol = fields?.amount?.symbol;
    const fee = fields?.fee?.value;
    const nativeBalance = this.balance.WQT.fullBalance;

    // If we send Native Token
    if (fee && amount && symbol === TokenSymbols.WQT) {
      this.canSend = new BigNumber(amount).plus(fee).isLessThanOrEqualTo(nativeBalance);
    } else if (fee) {
      // Only need check transaction fee with user balance
      this.canSend = new BigNumber(fee).isLessThanOrEqualTo(nativeBalance);
    }
  },
  methods: {
    async handleSubmit() {
      if (!this.canSend) return;
      const { callback, submitMethod, isShowSuccess } = this.options;
      this.CloseModal();
      this.SetLoader(true);
      if (submitMethod) {
        const res = await submitMethod();
        if (res?.ok) {
          if (callback) await callback();
          if (isShowSuccess) {
            await this.$store.dispatch('modals/show', {
              img: require('assets/img/ui/transactionSend.svg'),
              key: modals.status,
              title: this.$t('modals.transactionSent'),
            });
          }
        }
      }
      this.SetLoader(false);
    },
    async close() {
      const { cancelMethod } = this.options;
      this.CloseModal();
      if (cancelMethod) await cancelMethod();
    },
  },
};
</script>

<style lang="scss" scoped>

.item {
  margin-bottom: 15px;

  &:last-child {
    margin-bottom: 0;
  }

  &__title {
    color: $black500;
  }

  &__subtitle {
    &_red {
      color: $red;
    }
  }
}

.error {
  color: $red;
  font-size: 12px;
  margin: 10px 0;
}

.content {
  padding: 0 28px 30px 28px !important;

  &__fields {
    margin-top: 20px;
  }
}

.buttons {
  &__group {
    display: grid;
    grid-template-columns: repeat(2, calc(50% - 10px));
    grid-gap: 20px;
    gap: 20px;
    margin-top: 25px;
  }
}

.header {
  &__title {
    font-size: 16px;
    line-height: 130%;
    color: $black800;
  }

  &__icon:before {
    font-size: 16px;
    color: $black500;
    vertical-align: middle;
    margin-left: 6px;
  }

  &__button {
    width: 16px !important;
    height: 16px !important;
  }
}
</style>

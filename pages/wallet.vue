<template>
  <div class="wallet">
    <div class="wallet__body">
      <div class="wallet__header">
        <span class="wallet__title">{{ $t('wallet.wallet') }}</span>
        <div class="wallet__address address">
          <span class="address__user">{{ userInfo.userWallet }}</span>
          <base-btn
            v-clipboard:copy="userInfo.userWallet"
            v-clipboard:success="ClipboardSuccessHandler"
            v-clipboard:error="ClipboardErrorHandler"
            mode="back"
            class="address__icon icon"
          >
            <span class="icon__copy icon-copy" />
          </base-btn>
        </div>
      </div>
      <div
        class="wallet__info"
        :class="{'wallet__info_full' : userInfo.cardClosed }"
      >
        <div
          class="wallet__balance balance"
          :class="{'wallet__balance_full': userInfo.cardClosed}"
        >
          <div class="balance__top">
            <span class="balance__title">{{ $t('wallet.balance') }}</span>
            <span class="balance__currency">
              {{ `${convertToCurrency(userInfo.userBalance)} ${userInfo.currency}` }}
            </span>
            <span class="balance__usd">{{ `$ ${userInfo.usd}` }}</span>
          </div>
          <div
            class="balance__bottom"
            :class="{'balance__bottom_row': userInfo.cardClosed}"
          >
            <base-btn
              mode="outline"
              class="balance__btn"
              @click="showDepositModal()"
            >
              {{ $t('wallet.deposit') }}
            </base-btn>
            <base-btn
              :mode="userInfo.cardClosed ? '' : 'outline'"
              class="balance__btn"
              @click="showWithdrawModal()"
            >
              {{ $t('wallet.withdraw') }}
            </base-btn>
            <base-btn
              v-if="!userInfo.cardClosed"
              class="balance__btn"
              @click=" showTransferModal()"
            >
              {{ $t('wallet.send') }}
            </base-btn>
          </div>
        </div>
        <div
          v-if="!userInfo.cardClosed"
          class="wallet__card card"
        >
          <span class="card__title">{{ $t('wallet.addCardProposal') }}</span>
          <div class="card__icon icon">
            <span
              class="icon__close icon-close_big"
              @click="closeCard()"
            />
          </div>
          <base-btn
            class="card__btn"
            mode="outline"
            @click="showAddCardModal()"
          >
            {{ $t('wallet.addCard') }}
          </base-btn>
        </div>
      </div>
      <base-table
        class="wallet__table"
        :title="$t('wallet.table.trx')"
        :items="transactionsData"
        :fields="walletTableFields"
      />
      <!-- mobile -->
      <div class="wallet__transactions">
        <p class="wallet__subtitle">
          {{ $t('wallet.table.trx') }}
        </p>
        <item
          v-for="(transaction, index) in transactionsData"
          :key="index"
          :item="transaction"
          :is-last="transactionsData[index] === transactionsData[transactionsData.length - 1]"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import modals from '~/store/modals/modals';

export default {
  data() {
    return {
      walletTableFields: [
        {
          key: 'tx_hash', label: this.$t('wallet.table.txHash'), sortable: true,
        },
        {
          key: 'status', label: this.$t('wallet.table.status'), sortable: true,
        },
        {
          key: 'block', label: this.$t('wallet.table.block'), sortable: true,
        },
        {
          key: 'timestamp', label: this.$t('wallet.table.timestamp'), sortable: true,
        },
        {
          key: 'transferred', label: this.$t('wallet.table.transferred'), sortable: true,
        },
        {
          key: 'value', label: this.$t('wallet.table.value'), sortable: true,
        },
        {
          key: 'transaction_fee', label: this.$t('wallet.table.trxFee'), sortable: true,
        },
      ],
      transactionsData: [
        {
          tx_hash: '0x1c4f3bf7c0c7264a537f13c90b996ca8c0824a216065e000758d5e8d8ae30c9g',
          status: 'Success',
          block: '5267575474',
          timestamp: 'Feb 1, 2021, 21:34',
          transferred: 'To 2381hkjk123',
          value: '120 WUSD',
          transaction_fee: '5 WUSD',
        },
        {
          tx_hash: '0x1c4f3bf7c0c7264a537f13c90b996ca8c0824a216065e000758d5e8d8ae30c9b',
          status: 'Success',
          block: '5267575474',
          timestamp: 'Feb 1, 2021, 21:34',
          transferred: 'To 2381hkjk123',
          value: '120 WUSD',
          transaction_fee: '5 WUSD',
        },
        {
          tx_hash: '0x1c4f3bf7c0c7264a537f13c90b996ca8c0824a206065e000758d5e8d8ae30c9b',
          status: 'Success',
          block: '5267575474',
          timestamp: 'Feb 1, 2021, 21:34',
          transferred: 'To 2381hkjk123',
          value: '120 WUSD',
          transaction_fee: '5 WUSD',
        },
        {
          tx_hash: '0x1c4f3bf7c0c7264a537f13c90b996ca8c0824a216065e000758d5e8d8ae30c9z',
          status: 'Success',
          block: '5267575474',
          timestamp: 'Feb 1, 2021, 21:34',
          transferred: 'To 2381hkjk123',
          value: '120 WUSD',
          transaction_fee: '5 WUSD',
        },
        {
          tx_hash: '0x1c4f3bf7c0c7264a537f13c90b996ca8c0824a216065e000758d5e8d8ae20c9b',
          status: 'Success',
          block: '5267575474',
          timestamp: 'Feb 1, 2021, 21:34',
          transferred: 'To 2381hkjk123',
          value: '120 WUSD',
          transaction_fee: '5 WUSD',
        },
        {
          tx_hash: '0x1c4f3bf7c0c7264a637f13c90b996ca8c0824a216065e000758d5e8d8ae30c9b',
          status: 'Success',
          block: '5267575474',
          timestamp: 'Feb 1, 2021, 21:34',
          transferred: 'To 2381hkjk123',
          value: '120 WUSD',
          transaction_fee: '5 WUSD',
        },
      ],
      userInfo: {
        userWallet: '123t2323t23t3t23t23t3g45h45234',
        cardClosed: false,
        userBalance: '1234567',
        currency: 'WUSD',
        usd: '124.12',
        userCards: [
          '1234 1234 1234 1234',
        ],
      },
    };
  },
  computed: {
    ...mapGetters({
      tags: 'ui/getTags',
      userRole: 'user/getUserRole',
      userData: 'user/getUserData',
      transactions: 'data/getTransactions',
    }),
  },
  async mounted() {
    this.SetLoader(true);
    this.SetLoader(false);
  },
  methods: {
    closeCard() {
      this.userInfo.cardClosed = true;
    },
    showTransferModal() {
      this.ShowModal({
        key: modals.transfer,
      });
    },
    showDepositModal() {
      this.ShowModal({
        key: modals.deposit,
      });
    },
    showWithdrawModal() {
      this.ShowModal({
        key: modals.withdraw,
        isCardClosed: this.userInfo.cardClosed,
        userCards: this.userInfo.userCards,
      });
    },
    showAddCardModal() {
      this.ShowModal({
        key: modals.addCard,
      });
    },
    convertToCurrency(value) {
      if (value.length < 3) return value;
      let convertValue = value;
      let valueAfterDote = '';
      if (value.indexOf('.') !== -1) {
        valueAfterDote = value.slice(value.indexOf('.'));
        convertValue = value.slice(0, value.indexOf('.'));
      }
      const reverseValue = convertValue.split('').reverse().join('');
      const reverseValueArr = reverseValue.match(/.{1,3}/g);
      const valueArr = reverseValueArr.map((x) => x.split('').reverse().join(''));
      convertValue = valueArr.reverse().join(' ');
      return `${convertValue}${valueAfterDote}`;
    },
  },
};
</script>

<style lang="scss" scoped>

.wallet {
  @include main;
  @include text-simple;
  color: #1D2127;

  &__body {
    max-width: 1180px;
    width: calc(100vw - 40px);
    height: 100%;
  }

  &__header {
    display: flex;
    justify-content: space-between;

    margin-top: 20px;

    font-size: 16px;
  }

  &__title {
    font-weight: 500;
    font-size: 25px;
    line-height: 32px;
  }

  &__address {
    display: flex;
    align-items: center;

    font-weight: 500;
    font-size: 16px;
    line-height: 21px;
  }

  &__info {
    display: grid;
    grid-template-columns: 1fr 479px;
    grid-gap: 20px;

    margin-top: 20px;
    &_full {
      grid-template-columns: 1fr;
    }
  }
  &__balance {
    width: 100%;

    display: flex;
    flex-direction: column;
    justify-content: space-between;

    background: #FFFFFF;
    border-radius: 6px;

    padding: 20px 20px 0 20px;
    margin: 0 0 20px 0;

    &_full {
      display: grid;
      grid-template-columns: 1fr 1fr;
      justify-content: space-between;
      padding: 20px;
    }
  }
  &__transactions {
    display: none;
  }
}

.address {
  &__user {
    margin-right: 20px;
  }
  &__icon {
    width: 24px;
    height: 24px;
  }
}

.balance {
  &__top {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  &__title {
    color: #4C5767;
    font-size: 16px;
    line-height: 21px;

    margin-bottom: 10px;
  }

  &__currency {
    color: #1D2127;

    font-weight: 600;
    font-size: 35px;
    line-height: 45px;
  }

  &__usd {
    color: #0083C7;
    font-weight: 500;
    font-size: 16px;
    line-height: 21px;

    margin-top: 10px;
  }

  &__bottom {
    display: flex;
    grid-gap: 20px;

    padding: 20px 0;
    &_row {
      flex-direction: column;

      width: 220px;

      margin-left: auto;
      padding: 0;
    }
  }

}

.card {
  width: 100%;

  display: grid;
  grid-template-rows: auto 43px;
  grid-gap: 10px;
  grid-template-columns: 230px 1fr;

  padding: 20px;
  margin-bottom: 20px;

  background: #0083C7 url('/img/app/card.svg') no-repeat right center;
  background-size: cover;
  color: #FFFFFF;
  position: relative;
  overflow: hidden;
  border: none !important;

  &__title {
    font-weight: 500;
    font-size: 20px;
    line-height: 26px;
  }

  &__icon {
    display: flex;
    z-index: 2;

    width: 20px;
    height: 20px;

    margin-left: auto;
  }

  &__btn {
    grid-column-start: 2;
    z-index: 2;
  }
}

.icon {
  cursor: pointer;
  &__close {
    font-size: 20px;
    color: #FFFFFF;
  }
  &__copy {
    font-size: 24px;
    color: #0083C7;
  }
}

@include _1199 {
  .wallet {
    margin: 0 15px;
    &__info {
      display: flex;
      flex-direction: column-reverse;
    }
  }
  .card {
    margin: 0;
    grid-template-columns: 2fr 1fr;
    height: 240px;;
  }
}
@include _991 {
  .wallet {
    &__table {
      overflow: auto;
      width: calc(100vw - 40px);
    }
  }
  .table {
    width: 100%;
  }
}
@include _767 {
  .wallet {
    &__table {
      display: none;
    }
    &__transactions {
      display: block;
      background: $white;
      padding: 20px;
      border-radius: 6px;
    }
    &__subtitle {
      font-size: 20px;
    }
  }
  .card {
    grid-template-columns: repeat(2, 1fr);
  }
}
@include _480 {
  .user {
    &__wallet {
      font-size: 13px;
    }
  }
  .wallet {
    &__header {
      flex-direction: column;
    }
  }
}
@include _480 {
  .user {
    &__wallet {
      font-size: 12px;
    }
  }
  .card {
    &__title {
      text-shadow: $black800 2px 2px 10px;
    }
  }
}
</style>

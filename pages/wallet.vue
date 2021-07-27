<template>
  <div class="wallet">
    <div class="wallet__container">
      <div class="wallet__body">
        <div class="wallet__nav">
          <span class="wallet__title">{{ $t('wallet.wallet') }}</span>
          <div class="wallet__address">
            <span class="user__wallet">{{ userInfo.userWallet }}</span>
            <base-btn
              v-clipboard:copy="userInfo.userWallet"
              v-clipboard:success="ClipboardSuccessHandler"
              v-clipboard:error="ClipboardErrorHandler"
              mode="back"
              :style="`width: 24px; height: 24px;`"
            >
              <template v-slot:default>
                <span class="icon-copy wallet__icon" />
              </template>
            </base-btn>
          </div>
        </div>
        <div
          class="wallet__info"
          :class="{'wallet__info_full' : userInfo.cardClosed }"
        >
          <div class="wallet__balance balance">
            <div class="balance__top">
              <span class="balance__title">{{ $t('wallet.balance') }}</span>
              <span class="balance__currency">
                {{
                  userInfo.userBalance.length > 3 ?
                    `${convertToCurrency(userInfo.userBalance)} ${userInfo.currency}` :
                    `${userInfo.userBalance} ${userInfo.currency}`
                }}
              </span>
              <span class="balance__usd">{{ `$ ${userInfo.usd}` }}</span>
            </div>
            <div class="balance__bottom">
              <base-btn
                mode="outline"
                class="balance__btn"
                @click="showDepositModal()"
              >
                {{ $t('wallet.deposit') }}
              </base-btn>
              <base-btn
                mode="outline"
                class="balance__btn"
                @click="showWithdrawModal()"
              >
                {{ $t('wallet.withdraw') }}
              </base-btn>
              <base-btn
                class="balance__btn"
                @click=" showTransferModal()"
              >
                {{ $t('wallet.send') }}
              </base-btn>
            </div>
          </div>
          <div
            v-if="!cardClosed"
            class="wallet__card card"
          >
            <span class="card__title">{{ $t('wallet.addCardProposal') }}</span>
            <span
              class="icon-close_big card__icon"
              @click="closeCard()"
            />
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
      cardClosed: false,
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
      userInfo: {
        userWallet: '123t2323t23t3t23t23t3g45h45234',
        cardClosed: false,
        userBalance: '1234567',
        currency: 'WUSD',
        usd: '124.12',
      },
      transactionsData: [
        {
          tx_hash: 'sd535sd66sdsd',
          status: 'Success',
          block: '5267575474',
          timestamp: 'Feb 1, 2021, 21:34',
          transferred: 'To 2381hkjk123',
          value: '120 WUSD',
          transaction_fee: '5 WUSD',
        },
        {
          tx_hash: 'sd535sd66sdsd',
          status: 'Success',
          block: '5267575474',
          timestamp: 'Feb 1, 2021, 21:34',
          transferred: 'To 2381hkjk123',
          value: '120 WUSD',
          transaction_fee: '5 WUSD',
        },
        {
          tx_hash: 'sd535sd66sdsd',
          status: 'Success',
          block: '5267575474',
          timestamp: 'Feb 1, 2021, 21:34',
          transferred: 'To 2381hkjk123',
          value: '120 WUSD',
          transaction_fee: '5 WUSD',
        },
        {
          tx_hash: 'sd535sd66sdsd',
          status: 'Success',
          block: '5267575474',
          timestamp: 'Feb 1, 2021, 21:34',
          transferred: 'To 2381hkjk123',
          value: '120 WUSD',
          transaction_fee: '5 WUSD',
        },
        {
          tx_hash: 'sd535sd66sdsd',
          status: 'Success',
          block: '5267575474',
          timestamp: 'Feb 1, 2021, 21:34',
          transferred: 'To 2381hkjk123',
          value: '120 WUSD',
          transaction_fee: '5 WUSD',
        },
        {
          tx_hash: 'sd535sd66sdsd',
          status: 'Success',
          block: '5267575474',
          timestamp: 'Feb 1, 2021, 21:34',
          transferred: 'To 2381hkjk123',
          value: '120 WUSD',
          transaction_fee: '5 WUSD',
        },
      ],
    };
  },
  computed: {
    ...mapGetters({
      tags: 'ui/getTags',
      userRole: 'user/getUserRole',
      userData: 'user/getUserData',
      // userInfo: 'data/getUserInfo',
      transactions: 'data/getTransactions',
      // transactionsData: 'data/getTransactionsData',
    }),
  },
  async mounted() {
    this.SetLoader(true);
    this.SetLoader(false);
  },
  methods: {
    closeCard() {
      this.cardClosed = true;
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
      });
    },
    showAddCardModal() {
      this.ShowModal({
        key: modals.addCard,
      });
    },
    convertToCurrency(value) {
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

.status {
  &__title {
    font-weight: 400;
    font-size: 16px;
    color: $black800;
  }
  &__date {
    font-weight: 400;
    font-size: 14px;
    color: $black300;
  }
}

.btn {
  &__container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    margin: 16px 0 0 0;
    grid-gap: 20px;
  }
}

.wallet {
  &__container {
    display: flex;
    justify-content: center;
  }
  &__body {
    max-width: 1180px;
    width: calc(100vw - 40px);
  }
  &__nav {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    font-size: 16px;
  }
  &__address {
    @include text-simple;
    display: flex;
    align-items: center;
    font-weight: 500;
    font-size: 16px;
    color: #1D2127;
    line-height: 21px;
  }

  &__icon {
    font-size: 24px;
    &::before {
      color: $blue;
    }
  }

  &__title {
    @include text-simple;
    font-size: 25px;
    font-weight: 500;
  }

  &__info {
    margin-top: 20px;
    display: grid;
    grid-template-columns: 1fr 479px;
    grid-gap: 20px;
    &_full {
      grid-template-columns: 1fr;
    }
  }
}

.balance {
  display: flex;
  background: #FFFFFF;
  justify-content: space-between;
  flex-direction: column;
  border-radius: 6px;
  width: 100%;
  padding: 20px 20px 0 20px;
  margin: 0 0 20px 0;

  &__dollar {
    font-weight: 400;
    font-size: 14px;
    color: $black300;
  }
  &__number {
    font-weight: 700;
    font-size: 25px;
    color: $blue;
  }
  &__title {
    font-size: 16px;
    color: #4C5767;
    line-height: 21px;
    margin-bottom: 10px;
  }

  &__top {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  &__bottom {
    display: flex;
    grid-gap: 20px;
    padding: 20px 0 20px 0;
  }

  &__title {
    @include text-simple;
    color: #4C5767;
  }

  &__currency {
    @include text-simple;
    color: #1D2127;
    font-weight: 600;
    font-size: 35px;
    line-height: 45px;
  }

  &__usd {
    @include text-simple;
    color: #0083C7;
    margin-top: 10px;
    font-weight: 500;
  }
}

.card {
  margin: 0 0 20px 0;
  width: 100%;
  padding: 20px;
  display: grid;
  grid-template-rows: auto 43px;
  grid-gap: 10px;
  grid-template-columns: 230px 1fr;
  @include text-simple;
  background: #0083C7 url('/img/app/card.svg') no-repeat right center;
  background-size: cover;
  color: #FFFFFF;
  position: relative;
  overflow: hidden;
  border: none !important;

  &__title {
    @include text-simple;
    color: #FFFFFF;
    font-weight: 500;
    font-size: 20px;
    line-height: 26px;
  }

  &__btn {
    grid-column-start: 2;
    z-index: 2;
  }

  &__img {
    position: absolute;
    left: 144px;
    top: -43px;
    width: 355px;
    height: 250px;
    z-index: 1;
    object-fit: cover;
  }

  &__icon {
    display: flex;
    justify-content: flex-end;
    z-index: 2;
    &:before {
      cursor: pointer;
      font-size: 20px;
      color: $white;
    }
  }
}

@include _1199 {
  .wallet {
    margin: 0 20px 0 20px;
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
    width: 1180px;
  }
}
@include _767 {
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
}
@include _480 {
  .user {
    &__wallet {
      font-size: 12px;
    }
  }
}
</style>

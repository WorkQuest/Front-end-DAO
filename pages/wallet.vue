<template>
  <div class="wallet">
    <div class="wallet__container">
      <div class="wallet__body">
        <div class="wallet__nav">
          <span class="wallet__title">{{ $t('wallet.wallet') }}</span>
          <div class="wallet__address">
            <span class="user__wallet">{{ CutTxn(ConvertToBech32('wq', userWalletAddress), 8, 8) }}</span>
            <button-copy
              :copy-value="ConvertToBech32('wq', userWalletAddress)"
              mode="wallet"
            />
          </div>
        </div>
        <div
          class="wallet__info"
          :class="{'wallet__info_full' : cardClosed }"
        >
          <div class="wallet__balance balance">
            <div class="balance__top">
              <span class="balance__title">{{ $t('wallet.balance') }}</span>
              <span class="balance__currency">
                <span
                  class="balance__currency-text"
                  :class="{'balance__currency-text_light': isFetchingBalance}"
                >
                  {{ balance[selectedToken].balance + ' ' + selectedToken }}
                </span>
                <span
                  v-if="selectedToken === $options.TokenSymbols.WQT"
                  class="balance__usd-mobile"
                >
                  <span class="balance__usd-mobile_blue">
                    {{ $t('wallet.frozen') }}
                  </span>
                  {{ Floor(frozenBalance) }} {{ $options.TokenSymbols.WQT }}
                </span>
              </span>
              <span :class="[{'balance__currency__margin-bottom' : selectedToken !== $options.TokenSymbols.WQT}]">
                <span
                  v-if="selectedToken === $options.TokenSymbols.WQT"
                  class="balance__usd balance__usd_blue"
                >
                  <span class="balance__usd">
                    {{ $t('wallet.frozen') }}
                  </span>
                  {{ Floor(frozenBalance) }} {{ $options.TokenSymbols.WQT }}
                </span>
              </span>
            </div>
            <div class="balance__bottom">
              <base-btn
                selector="SHOW-DEPOSIT-MODAL"
                mode="outline"
                class="balance__btn"
                :disabled="true"
                @click="showModal({key: 'deposit'})"
              >
                {{ $t('wallet.deposit') }}
              </base-btn>
              <base-btn
                selector="SHOW-WITHDRAW-MODAL"
                mode="outline"
                class="balance__btn"
                :disabled="true"
                @click="showModal({key: 'withdraw', branchText: 'withdraw' })"
              >
                {{ $t('wallet.withdraw') }}
              </base-btn>
              <base-btn
                :disabled="isFetchingBalance"
                selector="SHOW-TRANSFER-MODAL"
                class="balance__btn"
                @click="showTransferModal()"
              >
                {{ $t('modals.transfer') }}
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
              selector="SHOW-ADD-CARD-MODAL"
              class="card__btn"
              mode="outline"
              :disabled="true"
              @click="showModal({key: 'addCard', branchText: 'adding' })"
            >
              {{ $t('wallet.addCard') }}
            </base-btn>
          </div>
        </div>
        <div class="wallet__table table">
          <base-table
            class="table__txs"
            :title="$t('wallet.table.trx')"
            :items="styledTransactions"
            :fields="walletTableFields"
          />
          <empty-data
            v-if="!totalPages"
            :description="$t('wallet.table.empty')"
            class="table__empty"
          />
        </div>
        <base-pager
          v-if="totalPages > 1"
          v-model="currentPage"
          :total-pages="totalPages"
          class="wallet__pager"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import BigNumber from 'bignumber.js';
import modals from '~/store/modals/modals';
import { TokenSymbolByContract, TokenSymbols, WalletTables } from '~/utils/enums';
import { getStyledAmount } from '~/utils/wallet';
import EmptyData from '~/components/app/EmptyData';
import { error, success } from '~/utils/success-error';

export default {
  name: 'Wallet',
  middleware: 'auth',
  components: { EmptyData },
  TokenSymbols,
  data() {
    return {
      cardClosed: false,
      ddValue: 0,
      txsPerPage: 10,
      currentPage: 1,
      selectedWalletTable: WalletTables.TXS,
      isFetchingBalance: false,
    };
  },
  computed: {
    ...mapGetters({
      userRole: 'user/getUserRole',
      userData: 'user/getUserData',
      transactions: 'wallet/getTransactions',
      transactionsCount: 'wallet/getTransactionsCount',
      isWalletConnected: 'wallet/getIsWalletConnected',
      balance: 'wallet/getBalanceData',
      frozenBalance: 'user/getFrozenBalance',
      selectedToken: 'wallet/getSelectedToken',
      userWalletAddress: 'user/getUserWalletAddress',
    }),
    totalPages() {
      if (!this.transactionsCount) return 0;
      return Math.ceil(this.transactionsCount / this.txsPerPage);
    },
    styledTransactions() {
      return this.transactions.map((t) => {
        const symbol = TokenSymbolByContract[t.to_address_hash.hex] || TokenSymbols.WQT;
        const decimals = this.balance[symbol]?.decimals || 18;
        return {
          tx_hash: t.hash,
          block: t.block_number,
          timestamp: this.$moment(t.block.timestamp).format('lll'),
          status: !!t.status,
          value: `${getStyledAmount(t.tokenTransfers[0]?.amount || t.value, false, decimals)} ${symbol}`,
          transaction_fee: getStyledAmount(new BigNumber(t.gas_price).multipliedBy(t.gas_used), false),
          from_address: t.from_address_hash.hex,
          to_address: t.to_address_hash.hex,
        };
      });
    },
    tokenSymbolsDd() {
      return [TokenSymbols.WQT];
    },
    walletTableFields() {
      return [
        { key: 'tx_hash', label: this.$t('wallet.table.txHash'), sortable: true },
        { key: 'status', label: this.$t('wallet.table.status'), sortable: true },
        { key: 'block', label: this.$t('wallet.table.block'), sortable: false },
        { key: 'timestamp', label: this.$t('wallet.table.timestamp'), sortable: true },
        { key: 'from_address', label: this.$t('modals.fromAddress'), sortable: true },
        { key: 'to_address', label: this.$t('modals.toAddress'), sortable: true },
        { key: 'value', label: this.$t('wallet.table.transferred'), sortable: true },
        { key: 'transaction_fee', label: this.$t('wallet.table.trxFee'), sortable: false },
      ];
    },
  },
  watch: {
    ddValue(val) {
      this.$store.dispatch('wallet/setSelectedToken', TokenSymbols[this.tokenSymbolsDd[val]]);
    },
    async selectedToken() {
      const i = this.tokenSymbolsDd.indexOf(this.selectedToken);
      this.ddValue = i >= 0 && i < this.tokenSymbolsDd.length ? i : 1;
      await this.loadData();
    },
    isConnected(newVal) {
      if (newVal) return;
      this.$store.dispatch('wallet/checkWalletConnected', { nuxt: this.$nuxt });
    },
    currentPage() {
      this.getTransactions();
    },
  },
  beforeMount() {
    this.$store.dispatch('wallet/checkWalletConnected', { nuxt: this.$nuxt });
  },
  async mounted() {
    if (!this.isWalletConnected) return;
    const i = this.tokenSymbolsDd.indexOf(this.selectedToken);
    this.ddValue = i >= 0 && i < this.tokenSymbolsDd.length ? i : 1;
    await this.loadData();
  },
  methods: {
    async getTransactions() {
      await this.$store.dispatch('wallet/getTransactions', {
        limit: this.txsPerPage,
        offset: this.txsPerPage * (this.currentPage - 1),
      });
    },
    async loadData() {
      this.isFetchingBalance = true;
      await Promise.all([
        this.$store.dispatch('wallet/getBalance'),
        this.$store.dispatch('wallet/updateFrozenBalance'),
        this.getTransactions(),
      ]);
      this.isFetchingBalance = false;
    },
    closeCard() {
      this.cardClosed = true;
    },
    showModal({ key, branchText }) {
      this.ShowModal({
        key: modals[key],
        branch: branchText,
      });
    },
    showTransferModal() {
      if (this.isFetchingBalance) return;
      this.ShowModal({
        key: modals.giveTransfer,
        submit: async ({ recipient, amount, selectedToken }) => {
          const { ConvertToHex, ConvertToBech32 } = this;
          const recipientHexAddress = ConvertToHex('wq', recipient);
          let feeRes;
          if (selectedToken === TokenSymbols.WQT) {
            feeRes = await this.$store.dispatch('wallet/getTransferFeeData', {
              recipient: recipientHexAddress,
              value: amount,
            });
          }
          this.ShowModal({
            key: modals.transactionReceipt,
            fields: {
              from: { name: this.$t('modals.fromAddress'), value: ConvertToBech32('wq', this.userData.wallet.address) },
              to: { name: this.$t('modals.toAddress'), value: recipient },
              amount: {
                name: this.$t('modals.amount'),
                value: amount,
                symbol: selectedToken, // REQUIRED!
              },
              fee: { name: this.$t('wallet.table.trxFee'), value: feeRes.result.fee, symbol: TokenSymbols.WQT },
            },
            submitMethod: async () => {
              this.CloseModal();
              this.SetLoader(true);
              const action = 'transfer';
              const res = await this.$store.dispatch(`wallet/${action}`, {
                recipient: recipientHexAddress,
                value: amount,
              });
              this.SetLoader(false);
              if (res?.ok) {
                await this.loadData();
                await this.ShowModal({
                  img: require('assets/img/ui/transactionSend.svg'),
                  key: modals.status,
                  title: this.$t('modals.transactionSend'),
                });
                return success();
              }
              return error();
            },
          });
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>

.table {
  position: relative;
  overflow: auto;
  &__txs {
    width: 1180px;
  }
}

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

  &__card {
    box-shadow: -1px 1px 8px 0px rgba(34, 60, 80, 0.2);
  }

  &__balance {
    box-shadow: -1px 1px 8px 0px rgba(34, 60, 80, 0.2);
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
  }

  &__icon {
    margin-left: 22px;
    font-size: 24px;

    &::before {
      color: $blue;
    }
  }

  &__title {
    @include text-simple;
    font-size: 25px;
    font-weight: 500;
    margin-right: 10px;
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

  &__table {
    box-shadow: -1px 1px 8px 0px rgba(34, 60, 80, 0.2);
    margin-bottom: 15px;
  }
}

.balance {
  display: flex;
  background: $white;
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
    font-weight: 400;
    font-size: 16px;
    color: $black800;
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
    color: $black800;
    font-weight: 600;
    font-size: 35px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    &__margin-bottom {
      margin-bottom: 25px;
    }

    @include _767 {
      font-size: 26px;
    }

    &-text {
      overflow: hidden;
      text-overflow: ellipsis;
      overflow-wrap: anywhere;
      max-width: 1000px;
      padding-right: 20px;
      &_light {
        color: $black500;
      }
    }
  }

  &__token {
    height: 49px;
  }

  &__usd {
    @include text-simple;
    height: 24px;
    color: $black800;

    &_blue {
      color: $blue;
    }

    &-mobile {
      display: none;
      max-height: 33px;
      height: 100%;
      color: $black800;
      font-size: 18px;
      font-weight: normal;
    }

    &_blue {
      color: $blue;
    }
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
  background: $blue url('/img/app/card.svg') no-repeat right center;
  background-size: cover;
  color: $white;
  position: relative;
  overflow: hidden;
  border: none !important;

  &__title {
    @include text-simple;
    color: $white;
    font-weight: 500;
    font-size: 20px;
    line-height: 130%;
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
    justify-self: self-end;
    height: 20px;
    width: 20px;
    z-index: 2;

    &:before {
      cursor: pointer;
      font-size: 20px;
      color: $white;
    }
  }
}

.table {
  background: #FFFFFF;

  &__txs {
    margin: 0 !important;
    border-radius: 6px !important;
  }

  :deep(td) {
    padding: 12px 10px !important;
  }

  &__empty {
    background: #FFFFFF !important;
    margin: 10px 0 !important;
  }
}

@include _1199 {
  .wallet {
    &__info {
      display: flex;
      flex-direction: column-reverse;
    }
  }
  .card {
    margin: 0;
    grid-template-columns: 2fr 1fr;
    height: 240px;
  }
}

@include _767 {
  .card {
    grid-template-columns: repeat(2, 1fr);
  }
  .balance__bottom {
    gap: 10px;
  }
  .wallet {
    &__pager {
      margin: auto;
    }
  }
}

@include _480 {
  .balance {
    &__currency {
      display: flex;
      flex-direction: column;
      align-items: unset;
    }

    &__token {
      margin-top: 5px;
    }
  }
  .balance__usd {
    display: none;

    &_mobile {
      display: block;
    }
  }
}

@include _350 {
  .wallet {
    &__nav {
      flex-direction: column;
    }
  }
}
</style>

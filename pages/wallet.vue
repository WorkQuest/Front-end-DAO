<template>
  <div class="wallet">
    <div class="wallet__container">
      <div class="wallet__body">
        <div
          v-if="!isShowedBuyWqtNotification"
          class="buy-wqt"
        >
          <div class="buy-wqt__title">
            {{ $t('wallet.buyWQT.title') }}
          </div>
          <div class="buy-wqt__sub">
            <div>
              <div class="buy-wqt__sub_text">
                {{ $t('wallet.buyWQT.sub') }}
              </div>
              <div class="buy-wqt__sub_text">
                {{ $t('wallet.buyWQT.networks') }}
              </div>
            </div>
            <base-btn
              mode="outline"
              @click="showBuyWQTModal"
            >
              {{ $t('wallet.buyWQT.buyButton') }}
            </base-btn>
          </div>
        </div>
        <div class="wallet__nav">
          <span class="wallet__title">{{ $t('wallet.wallet') }}</span>
          <div class="wallet__address">
            <div class="wallet__address-wrapper">
              <base-dd
                v-model="addressType"
                :items="addressTypesDd"
                data-selector="ADDRESS-TYPE"
                class="wallet__address-type"
                type="underline"
                mode="blackFont"
              />
            </div>
            <div class="user">
              <span class="user__wallet">{{ shortWqAddress }}</span>
              <button-copy
                :copy-value="wqAddress"
                mode="wallet"
              />
            </div>
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
                  {{ selectedTokenBalanceInfo }}
                </span>
                <span class="balance__frozen-mobile">
                  <span class="balance__frozen-mobile_blue">
                    {{ $t('wallet.frozen') }}
                  </span>
                  {{ Floor(frozenBalance) }} {{ $options.TokenSymbols.WQT }}
                </span>
              </span>
              <span class="balance__currency__margin-bottom">
                <span class="balance__frozen balance__frozen_blue">
                  <span class="balance__frozen">
                    {{ $t('wallet.frozen') }}
                  </span>
                  {{ Floor(frozenBalance) }} {{ $options.TokenSymbols.WQT }}
                </span>
              </span>
            </div>
            <div class="balance__bottom">
              <base-btn
                data-selector="SHOW-DEPOSIT-MODAL"
                class="balance__btn"
                @click="showDepositModal"
              >
                {{ $t('modals.deposit') }}
              </base-btn>
              <base-btn
                data-selector="SHOW-TRANSFER-MODAL"
                class="balance__btn"
                @click="showTransferModal"
              >
                {{ $t('wallet.withdraw') }}
              </base-btn>
              <base-btn
                data-selector="SHOW-WITHDRAW-MODAL"
                class="balance__btn"
                @click="showBuyWQTModal"
              >
                {{ $t('modals.swap') }}
              </base-btn>
              <base-btn
                data-selector="SHOW-GIVE-VOTING_POWER"
                class="balance__btn"
                @click="showDelegateModal"
              >
                {{ $t('wallet.addVotes') }}
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
              @click="cardClosed = true"
            />
            <base-btn
              data-selector="SHOW-ADD-CARD-MODAL"
              class="card__btn"
              mode="outline"
              :disabled="true"
              @click="ShowModal({key: 'addCard', branchText: 'adding' })"
            >
              {{ $t('wallet.addCard') }}
            </base-btn>
          </div>
        </div>
        <div class="wallet__table-wrapper">
          <div class="wallet__switch-table">
            <base-btn
              data-selector="SWITCH-ALL"
              :mode="getSwitchButtonMode($options.WalletTables.TXS)"
              @click="selectedWalletTable = $options.WalletTables.TXS"
            >
              {{ $t('meta.allTransactions') }}
            </base-btn>
            <base-btn
              data-selector="SWITCH-COLLATERAL"
              :mode="getSwitchButtonMode($options.WalletTables.DELEGATIONS)"
              @click="selectedWalletTable = $options.WalletTables.DELEGATIONS"
            >
              {{ $t('meta.delegations') }}
            </base-btn>
          </div>
          <div
            v-show="selectedWalletTable === $options.WalletTables.TXS"
            class="wallet__txs"
          >
            <div class="wallet__table table">
              <base-table
                class="table__txs"
                :title="$tc('wallet.table.trx')"
                :items="styledTransactions"
                :fields="walletTableFields"
              />
            </div>
            <base-pager
              v-if="totalPages > 1"
              v-model="currentPage"
              :total-pages="totalPages"
            />
          </div>
          <div v-show="selectedWalletTable === $options.WalletTables.DELEGATIONS">
            <DelegationsTable />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import BigNumber from 'bignumber.js';
import modals from '~/store/modals/modals';
import {
  TokenSymbolByContract,
  TokenSymbols,
  WalletTables,
  Chains,
  WalletTokensData,
  AddressType,
  DelegateMode,
} from '~/utils/enums';
import { getStyledAmount } from '~/utils/wallet';
import { error, success } from '~/utils/success-error';
import DelegationsTable from '~/components/app/Pages/Wallet/DelegationsTable';

export default {
  name: 'Wallet',
  middleware: 'auth',
  components: { DelegationsTable },
  TokenSymbols,
  Chains,
  WalletTables,
  data() {
    return {
      cardClosed: false,
      txsPerPage: 10,
      currentPage: 1,
      selectedWalletTable: WalletTables.TXS,
      isFetchingBalance: false,
      shortWqAddress: '',
      isShowedBuyWqtNotification: true,
      addressType: 0,

      prevSelectedTokenBalance: null,
    };
  },
  computed: {
    ...mapGetters({
      userRole: 'user/getUserRole',
      userWalletAddress: 'user/getUserWalletAddress',
      balance: 'wallet/getBalanceData',
      transactions: 'wallet/getTransactions',
      selectedToken: 'wallet/getSelectedToken',
      frozenBalance: 'user/getFrozenBalance',
      transactionsCount: 'wallet/getTransactionsCount',
      isWalletConnected: 'wallet/getIsWalletConnected',
      selectedNetwork: 'wallet/getSelectedNetwork',
    }),
    tokens() {
      return WalletTokensData[this.selectedNetwork].tokenList || [];
    },
    tokensMap() {
      const res = {};
      this.tokens.forEach((token, i) => {
        res[token.title] = { ...token, index: i };
      });
      return res;
    },
    selectedNetworkExplorer() {
      const net = WalletTokensData[this.selectedNetwork];
      return {
        txUrl: `${net.explorer}/tx/`,
        url: `${net.explorer}/address/${this.userWalletAddress}`,
        icon: net.explorerIcon,
      };
    },
    nativeTokenSymbol() {
      return WalletTokensData[this.selectedNetwork].tokenList[0].title;
    },
    selectedTokenData() {
      return this.balance.WQT;
    },
    selectedTokenBalanceInfo() {
      if (!this.selectedTokenData) return this.selectedToken;
      return `${this.selectedTokenData?.balance || '0'} ${TokenSymbols.WQT}`;
    },
    addressTypesDd() {
      return [AddressType.BECH32, AddressType.HEX];
    },
    wqAddress() {
      if (this.addressType === 0) return this.ConvertToBech32('wq', this.userWalletAddress);
      return this.userWalletAddress;
    },
    totalPages() {
      if (!this.transactionsCount) return 0;
      return Math.ceil(this.transactionsCount / this.txsPerPage);
    },
    styledTransactions() {
      return this.transactions.map((t) => {
        /**
         * @property gas_used
         * @property gas_price
         * @property tokenTransfers
         */
        const symbol = TokenSymbolByContract[t.to_address_hash?.hex] || TokenSymbols.WQT;
        const amount = t.tokenTransfers?.length ? t.tokenTransfers[0]?.amount : t.value;
        const txFee = t.transaction_fee || new BigNumber(t.gas_price).multipliedBy(t.gas_used).toString();
        return {
          tx_hash: t.hash,
          block: t.block_number,
          timestamp: this.$moment(t.block.timestamp).format('lll'),
          status: !!t.status,
          value: `${getStyledAmount(amount, false, this.balance[symbol].decimals || 18)} ${symbol}`,
          transaction_fee: `${getStyledAmount(txFee, false, this.balance[TokenSymbols.WQT].decimals || 18)} ${TokenSymbols.WQT}`,
          from_address: t.from_address_hash.hex,
          to_address: t.to_address_hash?.hex || '',
        };
      });
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
    addressType() {
      this.updateWQAddress();
    },
    currentPage() {
      this.getTransactions();
    },
  },
  beforeMount() {
    this.$store.dispatch('wallet/checkWalletConnected');
  },
  async mounted() {
    if (!this.isWalletConnected) return;

    this.updateWQAddress();
    window.addEventListener('resize', this.updateWQAddress);

    await this.$store.dispatch('wallet/setCallbackWS', this.loadData);
    await this.loadData(true);
    if (this.selectedToken === TokenSymbols.WQT && this.selectedTokenData.balance <= 0) {
      this.isShowedBuyWqtNotification = false;
    }
  },
  async beforeDestroy() {
    await this.$store.dispatch('wallet/connectToProvider', Chains.WORKNET);
    await this.$store.dispatch('wallet/setCallbackWS', null);

    window.removeEventListener('resize', this.updateWQAddress);
  },
  methods: {
    updateWQAddress() {
      const w = window.innerWidth;
      if (w > 678) this.shortWqAddress = this.wqAddress;
      else if (w > 400) this.shortWqAddress = this.CutTxn(this.wqAddress, 8, 8);
      else this.shortWqAddress = this.CutTxn(this.wqAddress, 4, 8);
    },
    showDelegateModal() {
      this.ShowModal({
        key: modals.delegate,
        delegateMode: DelegateMode.INVESTORS,
        investorAddress: this.userWalletAddress,
        callback: async () => this.$store.dispatch('wallet/updateFrozenBalance'),
      });
    },
    async showBuyWQTModal() {
      if (this.selectedNetwork === Chains.WORKNET) {
        this.SetLoader(true);
        const res = await this.$store.dispatch('wallet/connectToProvider', Chains.ETHEREUM);
        this.SetLoader(false);
        if (!res.ok) {
          this.ShowModal(res.msg);
          return;
        }
      }
      this.ShowModal({ key: modals.buyWQT });
    },
    getSwitchButtonMode(btn) {
      if (btn === this.selectedWalletTable) return '';
      return 'outline';
    },
    async getTransactions() {
      await this.$store.dispatch('wallet/getTransactions', {
        limit: this.txsPerPage,
        offset: this.txsPerPage * (this.currentPage - 1),
      });
    },
    async loadData(isFirstLoading) {
      if (this.isFetchingBalance || this.selectedNetwork !== Chains.WORKNET) return;

      if (isFirstLoading) this.isFetchingBalance = true;

      const toFetch = [this.$store.dispatch('wallet/getBalance')];
      if (this.selectedNetwork === Chains.WORKNET) {
        toFetch.push(this.$store.dispatch('wallet/updateFrozenBalance'));
      }
      await Promise.all(toFetch);

      this.isFetchingBalance = false;
      if (isFirstLoading) {
        await this.getTransactions();
      } else if (this.prevSelectedTokenBalance !== this.selectedTokenData.fullBalance) {
        await this.getTransactions();
        this.ShowToast(`Balance update (${this.selectedToken})`, 'Wallet');
      }
      this.prevSelectedTokenBalance = this.selectedTokenData.fullBalance;
    },
    showDepositModal() {
      this.ShowModal({
        key: modals.deposit,
        addressType: this.addressType,
      });
    },
    showTransferModal() {
      if (this.isFetchingBalance) return;
      this.ShowModal({
        key: modals.walletWithdraw,
        submit: async ({ recipient, amount, selectedToken }) => {
          const {
            wqAddress, ConvertToHex, nativeTokenSymbol,
          } = this;
          recipient = ConvertToHex('wq', recipient);
          const feeRes = await this.$store.dispatch('wallet/getTransferFeeData', {
            recipient,
            value: amount,
          });
          this.ShowModal({
            key: modals.transactionReceipt,
            fields: {
              from: { name: this.$t('modals.fromAddress'), value: wqAddress },
              to: { name: this.$t('modals.toAddress'), value: recipient },
              amount: {
                name: this.$t('modals.amount'),
                value: amount,
                symbol: selectedToken, // REQUIRED!
              },
              fee: { name: this.$t('wallet.table.trxFee'), value: feeRes.result.fee, symbol: nativeTokenSymbol },
            },
            submitMethod: async () => {
              this.CloseModal();
              const action = 'transfer';
              const payload = { recipient, value: amount };
              const { ok, result } = await this.$store.dispatch(`wallet/${action}`, payload);
              if (ok) {
                await this.ShowModal({
                  key: modals.transactionSend,
                  txUrl: `${this.selectedNetworkExplorer.txUrl}${result.transactionHash}`,
                });
                await this.loadData();
                return success();
              }
              await this.ShowModal({ key: modals.transactionSend, mode: 'error' });
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

.buy-wqt {
  position: relative;
  margin-top: 20px;
  border-radius: 6px;
  padding: 20px;
  background: $blue;
  color: $white100;
  &__title {
    font-size: 22px;
    font-weight: 500;
  }
  &__sub {
    display: grid;
    grid-template-columns: 80% 1fr;
  }
}

.table {
  &__container {
    width: 100%;
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

.user {
  display: flex;
  align-items: center;
}

.wallet {
  &__container {
    display: flex;
    justify-content: center;
  }

  &__card {
    @include shadow;
  }

  &__balance {
    @include shadow;
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
    align-items: center;
  }

  &__address {
    @include text-simple;
    display: flex;
    font-weight: 500;
    font-size: 16px;
  }

  &__address-wrapper {
    margin-bottom: 5px;
    margin-right: 10px;
  }

  &__address-type {
    display: inline-block;
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

  &__explorer-ref {
    display: flex;
    align-items: center;
    justify-content: center;
    width: fit-content;
    padding: 5px 15px;
    background: $white;
    border-radius: 6px;
    border: 1px solid $black100;
    text-decoration: none;
    font-size: 20px;
    line-height: 20px;
    color: $black800;

    & img {
      margin-right: 5px;
      border: 1px solid $black100;
      border-radius: 50%;
    }
  }

  &__switch-table {
    display: grid;
    grid-template-columns: repeat(2, 210px);
    grid-gap: 10px;
    margin-bottom: 20px;
  }

  &__table {
    position: relative;
    max-width: 100%;
    margin-bottom: 1rem;
    overflow-x: auto;
    @include shadow;
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
    line-height: 130%;
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
      max-width: 1000px;
      padding-right: 20px;
      word-break: break-word;
      height: fit-content;
      &_light {
        color: $black500;
      }
    }
  }

  &__token {
    height: 49px;
    box-sizing: border-box;
  }

  &__frozen {
    @include text-simple;
    height: 24px;
    color: $black800;

    &_blue {
      color: $blue;
    }

    &-mobile {
      display: none;
      color: $black800;
      font-size: 18px;
      font-weight: normal;

      height: fit-content;
      word-break: break-word;

      &_blue {
        color: $blue;
      }
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
  .balance__bottom {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }
  .buy-wqt__sub {
    grid-template-columns: 1fr;
    grid-gap: 10px
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
  .balance__frozen {
    display: none;

    &-mobile {
      display: block;
    }
  }
  .wallet{
    &__switch-table {
      grid-template-columns: 1fr;
    }
    &__nav {
      flex-direction: column;
    }
    &__title {
      margin-right: 0;
    }
  }
  .balance__bottom {
    grid-template-columns: 1fr;
  }
}
</style>

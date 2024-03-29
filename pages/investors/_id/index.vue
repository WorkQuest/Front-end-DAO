<template>
  <div class="investor">
    <div
      v-if="investor"
      class="investor__profile investor__body"
    >
      <div class="investor__header header">
        <base-btn
          class="header__link link"
          @click="$router.go(-1)"
        >
          <span class="icon-short_left link__arrow" />
          <div class="link__text">
            {{ $t('discussions.back') }}
          </div>
        </base-btn>
      </div>
      <div class="investor__title title">
        <div class="title__name">
          {{ $t('investors.profile') }}
        </div>
        <div
          v-if="investorAddress"
          class="title__panel panel"
        >
          <div class="panel__address">
            {{ styledInvestorAddress }}
          </div>
          <div class="panel__picture">
            <button-copy
              :copy-value="ConvertToBech32('wq', investorAddress)"
              mode="panel"
            />
          </div>
        </div>
      </div>
      <div class="investor__profile profile">
        <div class="profile__body">
          <div class="profile__grid-container">
            <div class="profile__main-data">
              <img
                id="userAvatar"
                class="profile__avatar"
                :src="(investor.avatar && investor.avatar.url) ? investor.avatar.url : require('~/assets/img/app/avatar_empty.png')"
                alt=""
              >
              <div class="profile__right-data">
                <div
                  :class="investor.statusKYC ? 'profile__status_verified' : 'profile__status_not-verified'"
                  class="profile__status"
                >
                  {{ investor.statusKYC ? $t('settings.verifiсated') : $t('settings.notVerified') }}
                  <span
                    :class="investor.statusKYC ? 'profile__status_verified' : 'profile__status_not-verified'"
                    class="icon field__icon input-icon__check icon-check_all_big"
                  />
                </div>
                <div class="profile__main-fields">
                  <div
                    v-for="input in mainDataArr"
                    :key="input.key"
                    class="field"
                  >
                    <span
                      class="icon field__icon"
                      :class="input.icon"
                    />
                    <span class="field__text">
                      {{ fillInputs(input) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div class="profile__about about">
              <div class="about__title">
                {{ $t('workers.aboutMe') }}
              </div>
              <div class="about__textarea">
                {{ investor.additionalInfo && investor.additionalInfo.description ? investor.additionalInfo.description : $t('investor.notFilled') }}
              </div>
            </div>
            <div class="profile__social social">
              <div
                v-for="input in socialInputsArr"
                :key="input.key"
                class="field field_social"
                @click="goToSocialMedia(input)"
              >
                <span
                  class="icon field__icon"
                  :class="input.icon"
                />
                <span class="field__text">
                  {{ investor.additionalInfo && investor.additionalInfo.socialNetwork ? investor.additionalInfo.socialNetwork[input.key] : '' }}
                </span>
              </div>
            </div>
            <div
              v-if="investorAddress"
              class="info__action action"
            >
              <div>
                {{ $t('investors.table.voting') }}: {{ votingPower }}
              </div>
              <div
                class="action__btns"
                :class="{'action__btns_single': !isDelegatedToUser}"
              >
                <base-btn
                  v-if="isDelegatedToUser"
                  mode="lightRed"
                  class="action__button"
                  @click="openModalUndelegate"
                >
                  {{ $t('modals.undelegate') }}
                </base-btn>
                <base-btn
                  mode="lightBlue"
                  class="action__button"
                  @click="openModalDelegate"
                >
                  {{ $t('modals.delegate') }}
                </base-btn>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="transactionsCount !== 0"
        class="investor__table"
      >
        <base-table
          class="investor__table_txs"
          :title="$t('wallet.table.trx')"
          :items="styledTransactions"
          :fields="walletTableFields"
        />
        <div class="investor__table_mobile">
          <p class="investor__table_title">
            {{ $t('wallet.table.trx') }}
          </p>
          <mobile-table-item
            v-for="(transaction, index) in styledTransactions"
            :key="index"
            :item="transaction"
            :is-last="currentPage === totalPages"
          />
        </div>
      </div>
      <template v-else>
        <div class="investor__empty-info">
          {{ $t('wallet.table.trx') }}
        </div>
        <empty-data :description="$t('wallet.table.empty')" />
      </template>
      <base-pager
        v-if="totalPages > 1"
        v-model="currentPage"
        class="investor__pagination"
        :total-pages="totalPages"
      />
    </div>
    <empty-data
      v-else
      :description="$t('investor.notFound')"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import BigNumber from 'bignumber.js';
import modals from '~/store/modals/modals';
import {
  DelegateMode, TokenSymbolByContract, TokenSymbols, UserRole,
} from '~/utils/enums';
import { getStyledAmount } from '~/utils/wallet';

export default {
  name: 'InvestorProfile',
  data() {
    return {
      investor: {},
      userId: this.$route.params.id,
      votingPower: 0,
      investorAddress: '',
      currentPage: 1,
      txsPerPage: 10,
    };
  },
  computed: {
    ...mapGetters({
      balance: 'wallet/getBalanceData',
      delegatedToUser: 'investors/getDelegatedToUser',
      userData: 'user/getUserData',
      isWalletConnected: 'wallet/getIsWalletConnected',
      transactions: 'wallet/getTransactions',
      transactionsCount: 'wallet/getTransactionsCount',
    }),
    totalPages() {
      if (!this.transactionsCount) return 0;
      return Math.ceil(this.transactionsCount / this.txsPerPage);
    },
    styledInvestorAddress() {
      return this.CutTxn(this.ConvertToBech32('wq', this.investorAddress), 8, 8);
    },
    /**
     * @property block_number
     * @property to_address_hash
     * @property gas_price
     * @property gas_used
     * @property tokenTransfers
     * @property from_address_hash
     * @return {{transaction_fee: BigNumber, tx_hash: *, block: *, to_address: *, value: string, from_address: *, timestamp: *, status}[]}
     */
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
    isDelegatedToUser() {
      return this.delegatedToUser && this.investorAddress === this.delegatedToUser?.wallet?.address;
    },
    mainDataArr() {
      return [
        { key: 'firstName', icon: 'icon-user', isVisible: true },
        { key: 'lastName', icon: 'icon-user', isVisible: true },
        { key: 'location', icon: 'icon-location', isVisible: true },
        { key: 'email', icon: 'icon-mail', isVisible: true },
        { key: 'phone', icon: 'icon-phone', isVisible: true },
        { key: 'secondPhone', icon: 'icon-phone', isVisible: this.investor.role === UserRole.EMPLOYER },
      ];
    },
    socialInputsArr() {
      return [
        { key: 'instagram', icon: 'icon-instagram', nickName: this.investor?.additionalInfo?.socialNetwork.instagram },
        { key: 'twitter', icon: 'icon-twitter', nickName: this.investor?.additionalInfo?.socialNetwork.twitter },
        { key: 'linkedin', icon: 'icon-LinkedIn', nickName: this.investor?.additionalInfo?.socialNetwork.linkedin },
        { key: 'facebook', icon: 'icon-facebook', nickName: this.investor?.additionalInfo?.socialNetwork.facebook },
      ];
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
    isMyProfile() {
      return this.userData.id === this.userId;
    },
  },
  watch: {
    currentPage() {
      this.getTransactions();
    },
  },
  async beforeMount() {
    await this.$store.dispatch('wallet/checkWalletConnected');
  },
  async mounted() {
    if (!this.isWalletConnected) return;
    this.SetLoader(true);
    await this.getInvestorData();
    this.SetLoader(false);
    await this.getTransactions();
  },
  methods: {
    goToSocialMedia(input) {
      if (input.nickName) {
        window.open(`https://${input.key}.com/${input.nickName}`, '_blank');
      }
    },
    async getTransactions() {
      await this.$store.dispatch('wallet/getTransactions', {
        limit: this.txsPerPage,
        offset: this.txsPerPage * (this.currentPage - 1),
        investorAddress: this.investorAddress,
      });
    },
    fillInputs(input) {
      if (this.investor.additionalInfo) {
        if (input.key === 'location') return this.investor.locationPlaceName;
        if (input.key === 'phone') return this.investor.phone?.fullPhone || this.investor.tempPhone?.fullPhone;
        if (input.key === 'secondPhone') return this.investor.additionalInfo.secondMobileNumber?.fullPhone;
        return this.investor[input.key];
      }
      return '';
    },
    async getInvestorData() {
      if (this.isMyProfile) this.investor = this.userData;
      else {
        const [investor] = await Promise.all([
          this.$store.dispatch('user/getSpecialUserData', this.userId),
          this.$store.dispatch('wallet/getDelegates'),
        ]);
        this.investor = investor;
      }

      if (this.investor?.wallet?.address) {
        this.investorAddress = this.investor.wallet.address;
        const powerResponse = await this.$store.dispatch('wallet/getVotesByAddresses', [this.investorAddress]);
        if (powerResponse.ok) this.votingPower = getStyledAmount(powerResponse.result[0]);
      }
    },
    async updateDelegatedUser() {
      this.SetLoader(true);
      await Promise.all([
        this.getInvestorData(),
        this.$store.dispatch('wallet/getDelegates'),
      ]);
      this.SetLoader(false);
    },
    async openModalDelegate() {
      this.ShowModal({
        key: modals.delegate,
        delegateMode: DelegateMode.INVESTORS,
        investorAddress: this.investorAddress,
        callback: async () => this.updateDelegatedUser(),
      });
    },
    async openModalUndelegate() {
      this.ShowModal({
        key: modals.undelegate,
        name: `${this.investor.firstName} ${this.investor.lastName}`,
        tokensAmount: this.votingPower,
        delegateMode: DelegateMode.INVESTORS,
        callback: async () => this.updateDelegatedUser(),
      });
    },
  },
};
</script>

<style lang="scss" scoped>

.investor {
  @include main;
  @include text-simple;
  color: $black800;

  &__body{
    max-width: 1180px;
    width: calc(100vw - 40px);
  }

  &__table {
    background: $white;
    border-radius: 6px;
    margin: 20px 0;

    position: relative;
    overflow: auto;

    :deep(td) {
      padding: 12px 10px !important;
    }

    &_txs {
      width: 1180px;
    }

    &_mobile {
      display: none;
    }

    &_title {
      padding: 10px;
      font-weight: 600;
      font-size: 20px;
    }
  }

  &__empty-info {
    margin-top: 20px;
    border-radius: 6px;
    background: white;
    padding: 10px;
  }

  &__header {
    display: flex;
    justify-content: left;
    margin: 30px 0 20px 0;
    font-size: 16px;
  }
}

.title {
  display: flex;
  justify-content: space-between;

  &__name {
    font-weight: 600;
    font-size: 28px;
    line-height: 36px;
  }
}

.panel {
  text-align: center;
  display: table;

  &__address {
    font-weight: 500;
    font-size: 16px;
    display: table-cell;
    vertical-align: middle;
    padding-right: 17px;
  }
}

.field {
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 46px;
  border: 1px solid $black0;
  border-radius: 6px;
  padding: 5px 10px;
  word-break: break-all;

  &_social {
    cursor: pointer;
    white-space: nowrap;
    overflow: hidden;
    .field__text {
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  &__icon {
    font-size: 23px;
    color: $blue;
    line-height: 36px;
  }

  &__text {
    margin-left: 10px;
  }
}

.profile {
  @include main;
  @include text-simple;

  &__body {
    max-width: 1180px;
    height: 100%;
  }

  &__grid-container {
    display: grid;
    gap: 20px;
    padding: 20px;
    background: $white;
    border-radius: 6px;
    margin-top: 15px;
  }

  &__main-data {
    display: flex;
  }

  &__right-data {
    flex-grow: 1;
  }

  &__main-fields {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 20px;
  }

  &__avatar {
    flex-shrink: 0;
    height: 151px;
    width: 151px;
    border-radius: 6px;
    overflow: hidden;
    object-fit: cover;
    margin-right: 20px;
    border: 1px solid $black0;
  }

  &__status {
    grid-column: 2/4;
    display: grid;
    grid-template-columns: repeat(2, max-content);
    gap: 10px;
    align-items: center;
    width: fit-content;
    height: 36px;
    padding: 0 13px;
    background: rgba(0, 131, 199, 0.1);
    border-radius: 36px;
    font-size: 14px;
    margin-bottom: 10px;
    &_verified {
      color: $blue;
    }

    &_not-verified {
      color: $black300;
      background: $black100;
    }
  }

  &__social {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
  }
}

.contacts {
  &__name {
    color: $black800 !important;
  }
}

.about {
  display: flex;
  flex-direction: column;

  &__title {
    color: $black800;
    font-size: 16px;
    line-height: 21px;
    margin-bottom: 5px;
  }

  &__textarea {
    @include text-simple;
    height: 86px;
    padding: 10px 10px 0 10px;
    border-radius: 6px;
    font-size: 16px;
    line-height: 18.2px;
    background-color: $white;
    border: 1px solid $black0;
    overflow-y: auto;
    scroll-behavior: inherit;
  }
}

.social {
  &__network {
    height: 46px;
  }

  &__icon {
    cursor: pointer;
  }
}

.action {
  display: flex;
  justify-content: space-between;
  align-items: center;

  &__button {
    min-width: 270px;
  }

  &__btns {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    &_single {
      grid-template-columns: 1fr;
    }
  }
}

.link {
  display: flex;
  align-items: center;
  text-decoration: none;
  background: transparent;
  justify-content: flex-start;
  width: 100px;

  &:hover {
    background: transparent;
  }

  &__text {
    font-size: 18px;
    line-height: 130%;
    font-weight: 500;
    align-items: center;
    color: $black600;
  }

  &__arrow {
    margin: 6px 10px 6px 0;
    color: $black600;
    font-size: 25px;
    cursor: pointer;
  }
}

@include _1199 {
  .investor {
    padding: 0 20px;
  }
}

@include _991 {
  .profile {
    &__main-fields {
      grid-template-columns: 1fr;
    }

    &__avatar {
      grid-row: 1/7;
    }

    &__status {
      grid-column: 2;
    }

    &__social {
      grid-template-columns: repeat(2, 1fr);
    }

    &__main-inp-cont {
      grid-column: 2;
    }
  }
  .action {
    flex-direction: column;
    align-items: normal;
    &__btns {
      margin-top: 10px;
    }
  }
}

@include _767 {
  .title {
    flex-direction: column;
    align-items: flex-start;
  }
  .investor {
    width: 100vw;
    display: block;
    margin: 0;

    &__header {
      margin: 15px 10px;
    }

    &__table_txs {
      display: none;
    }

    &__table_mobile {
      display: block;
    }
  }
  .info {
    grid-template-rows: 3fr 1fr auto;

    &__base {
      grid-template-columns: 1fr;
    }

    &__additional {
      grid-template-columns: 1fr;
    }
  }
  .profile {
    &__subtitle {
      font-size: 20px;
    }
    &__avatar {
      margin: 0 auto 10px auto;
    }
    &__main-data {
      flex-direction: column;
    }
    &__status {
      margin: 0 auto 10px auto;
    }
  }
  .title {
    margin: 0 15px;
  }
}

@include _575 {
  .profile {

    &__avatar {
      grid-row: 1;
    }

    &__status {
      grid-column: 1/3;
    }

    &__main-inp-cont {
      grid-column: 1/3;
    }

    &__social {
      grid-template-columns: 1fr;
    }
  }
  .title {
    flex-direction: column;
    align-items: flex-start;
  }
  .action {
    &__button {
      max-width: 100%;
    }
    &__btns {
      grid-template-columns: 1fr;
    }
  }
}

@include _350 {
  .profile {
    &__main-data {
    }

    & .about {
      max-width: 240px;
    }

    .action {
      &__button {
        min-width: 240px;
      }
    }
  }
}
</style>

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
            <base-btn
              v-clipboard:copy="ConvertToBech32('wq', investorAddress)"
              v-clipboard:success="ClipboardSuccessHandler"
              v-clipboard:error="ClipboardErrorHandler"
              mode="copy"
              class="panel__copy"
            />
          </div>
        </div>
      </div>
      <div class="investor__profile profile">
        <div class="profile__body">
          <div class="profile__grid-container">
            <div class="profile__main-data">
              <div class="profile__avatar avatar">
                <img
                  id="userAvatar"
                  class="avatar__img"
                  :src="(investor.avatar && investor.avatar.url) ? investor.avatar.url : require('~/assets/img/app/avatar_empty.png')"
                  alt=""
                >
              </div>
              <div class="profile__status status">
                {{ $t('settings.verifiсated') }}
                <span class="icon input-icon input-icon__check icon-check_all_big" />
              </div>
              <div
                v-for="input in mainDataArr"
                :key="input.key"
                class="profile__main-inp-cont"
              >
                <base-field
                  v-if="input.isVisible"
                  class="contacts__name"
                  :is-hide-error="true"
                  mode="left"
                  :value="fillInputs(input)"
                  :placeholder="$t('investor.notFilled')"
                  data-selector="NAME"
                >
                  <template v-slot:left>
                    <span
                      class="icon input-icon"
                      :class="input.icon"
                    />
                  </template>
                </base-field>
              </div>
            </div>
            <div class="profile__about about">
              <div class="about__title">
                {{ $t('workers.aboutMe') }}
              </div>
              <textarea
                id="textarea"
                class="about__textarea"
                title="test"
                :disabled="true"
                :placeholder="investor.additionalInfo ? (investor.additionalInfo.description || $t('investor.notFilled')) : ''"
              />
            </div>
            <div class="profile__social social">
              <base-field
                v-for="input in socialInputsArr"
                :key="input.key"
                class="social__network"
                :disabled="true"
                mode="left"
                :is-hide-error="true"
                :value="investor.additionalInfo && investor.additionalInfo.socialNetwork ? investor.additionalInfo.socialNetwork[input.key] : ''"
                :placeholder="$t('investor.notFilled')"
                :data-selector="`SOCIAL-${input.key}`"
              >
                <template v-slot:left>
                  <span
                    class="icon input-icon"
                    :class="input.icon"
                  />
                </template>
              </base-field>
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
      <empty-data
        v-else
        :description="$t('wallet.table.empty')"
      />
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
import { TokenSymbolByContract, TokenSymbols, UserRole } from '~/utils/enums';
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
        { key: 'instagram', icon: 'icon-instagram' },
        { key: 'twitter', icon: 'icon-twitter' },
        { key: 'linkedin', icon: 'icon-LinkedIn' },
        { key: 'facebook', icon: 'icon-facebook' },
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
    await this.$store.dispatch('wallet/checkWalletConnected', { nuxt: this.$nuxt });
  },
  async mounted() {
    if (!this.isWalletConnected) return;
    await this.getInvestorData();
    await this.getTransactions();
  },
  methods: {
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
        investorAddress: this.investorAddress,
        callback: async () => this.updateDelegatedUser(),
      });
    },
    async openModalUndelegate() {
      this.ShowModal({
        key: modals.undelegate,
        name: `${this.investor.firstName} ${this.investor.lastName}`,
        tokensAmount: this.votingPower,
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

    /deep/ td {
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

  &__copy {
    background: $black0;
  }

  &__copy:hover {
    background: $black0;
  }

  &__address {
    font-weight: 500;
    font-size: 16px;
    display: table-cell;
    vertical-align: middle;
    padding-right: 17px;
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
    display: grid;
    gap: 20px;
    grid-template-columns: 151px repeat(2, 1fr);
  }

  &__main-inp-cont {
    height: 46px;
  }

  &__avatar {
    height: 151px;
    border-radius: 6px;
    overflow: hidden;
    grid-column: 1;
    grid-row: 1/5;
  }

  &__status {
    grid-column: 2/4;
    display: grid;
    grid-template-columns: repeat(2, max-content);
    gap: 10px;
    align-items: center;
    width: fit-content;
    height: 34px;
    padding: 0 13px;
    background: rgba(0, 131, 199, 0.1);
    color: $blue;
    border-radius: 36px;
    font-size: 14px;
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

.avatar {
  &__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
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
    resize: none;
    font-size: 16px;
    line-height: 18.2px;
    background-color: $white;
    border: 1px solid $black0;

    &::placeholder {
      color: $black800;
      padding-left: 30px;
      padding-top: 20px;
    }
  }
}

.social {
  &__network {
    height: 46px;
  }
}

.input-icon {
  font-size: 23px;
  color: $blue;
  line-height: 36px;
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
    &__main-data {
      grid-template-columns: 151px 1fr;
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

    &__avatar {
      height: 100%;
      width: 340px;
    }
  }
  .profile {

    &__subtitle {
      font-size: 20px;
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
      grid-template-columns: 100px 120px;
    }

    & .about {
      max-width: 240px;
    }

    &__social {
      grid-template-columns: 240px;
    }
    .action {
      &__button {
        min-width: 240px;
      }
    }
  }
}
</style>

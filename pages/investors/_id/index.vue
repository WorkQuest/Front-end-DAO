<template>
  <div class="investor">
    <div
      v-if="investor"
      class="investor__profile"
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
            {{ CutTxn(ConvertToBech32('wq', investorAddress), 8, 8) }}
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
              <!--              TODO вернуть -->
              <!--              <div class="profile__status status">-->
              <!--                {{ $t('settings.verifiсated') }}-->
              <!--                <span class="icon input-icon input-icon__check icon-check_all_big" />-->
              <!--              </div>-->
              <div
                v-for="input in mainDataArr"
                :key="input.key"
                class="profile__main-inp-cont"
              >
                <base-field
                  v-if="input.isVisible"
                  class="contacts__name"
                  :is-hide-error="true"
                  :disabled="true"
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
              <base-btn
                v-if="isDelegatedToUser"
                mode="lightRed"
                class="action__undelegate"
                @click="openModalUndelegate"
              >
                {{ $t('modals.undelegate') }}
              </base-btn>
              <base-btn
                mode="lightBlue"
                class="action__delegate"
                @click="openModalDelegate"
              >
                {{ $t('modals.delegate') }}
              </base-btn>
            </div>
          </div>
          <!--TODO Попросила убрать роза пока не появятся данные для таблицы-->
          <!--          <div class="profile__table">-->
          <!--            <base-table-->
          <!--              class="profile__field"-->
          <!--              :title="$t('wallet.table.trx')"-->
          <!--              :items="transactionsData"-->
          <!--              :fields="walletTableFields"-->
          <!--            />-->
          <!--          </div>-->
          <!-- mobile -->
          <!--          <div class="profile__history">-->
          <!--            <p class="profile__subtitle">-->
          <!--              {{ $t('wallet.table.trx') }}-->
          <!--            </p>-->
          <!--            <mobile-table-item-->
          <!--              v-for="(transaction, index) in transactionsData"-->
          <!--              :key="index"-->
          <!--              :item="transaction"-->
          <!--              :is-last="transactionsData[index] === transactionsData[transactionsData.length - 1]"-->
          <!--            />-->
          <!--          </div>-->
          <!-- /mobile -->
        </div>
      </div>
      <!--TODO Попросила убрать роза пока не появятся данные для таблицы-->
      <!--      <base-pager-->
      <!--        v-model="pages"-->
      <!--        class="investor__pagination"-->
      <!--        :total-pages="totalPages"-->
      <!--      />-->
    </div>
    <empty-data
      v-else
      :description="$t('investor.notFound')"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import modals from '~/store/modals/modals';
import { UserRole } from '~/utils/enums';
import { getStyledAmount } from '~/utils/wallet';

export default {
  name: 'InvestorProfile',
  data() {
    return {
      investor: {},
      userId: this.$route.params.id,
      votingPower: 0,
      investorAddress: '',
      pages: 1,
      totalPages: 5,
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
      delegatedToUser: 'investors/getDelegatedToUser',
      userData: 'user/getUserData',
      isWalletConnected: 'wallet/getIsWalletConnected',
    }),
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
        { key: 'block', label: this.$t('wallet.table.block'), sortable: true },
        { key: 'timestamp', label: this.$t('wallet.table.timestamp'), sortable: true },
        { key: 'transferred', label: this.$t('wallet.table.transferred'), sortable: true },
        { key: 'value', label: this.$t('wallet.table.value'), sortable: true },
        { key: 'transaction_fee', label: this.$t('wallet.table.trxFee'), sortable: true },
      ];
    },
    isMyProfile() {
      return this.userData.id === this.userId;
    },
  },
  async beforeMount() {
    await this.$store.dispatch('wallet/checkWalletConnected', { nuxt: this.$nuxt });
  },
  async mounted() {
    if (!this.isWalletConnected) return;
    await this.getInvestorData();
  },
  methods: {
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

  &__profile {
    width: 100%;
    max-width: 1180px;
  }

  &__pagination {
    margin-top: 10px;
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

  &__table {
    margin: 15px 0;
  }

  &__history {
    display: none;
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
  justify-content: flex-end;

  &__undelegate {
    max-width: 240px;
  }

  &__delegate {
    @extend .action__undelegate;
    margin-left: 20px;
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
  }
}

@include _575 {
  .profile {

    &__avatar {
      grid-row: 1;
      margin-bottom: 17px;
    }

    &__main-inp-cont {
      grid-column: 1/3;
    }

    &__social {
      grid-template-columns: 1fr;
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
    &__table {
      display: none;
    }

    &__history {
      display: block;
      background: $white;
      padding: 16px;
      margin: 15px 0;
    }

    &__subtitle {
      font-size: 20px;
    }
  }
  .title {
    margin: 0 15px;
  }
}

@include _575 {
  .title {
    flex-direction: column;
    align-items: flex-start;
  }
  .info__action {
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 10px;
  }
  .action__delegate {
    max-width: 100%
  }
  .action__undelegate {
    margin: 0;
    max-width: 100%
  }
}
</style>

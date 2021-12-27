<template>
  <div class="investor">
    <div
      v-if="investor"
      class="investor__profile"
    >
      <div class="investor__header header">
        <nuxt-link
          to="/investors"
          class="header__link link"
        >
          <span class="icon-short_left link__arrow" />
          <div class="link__text">
            {{ $t('discussions.back') }}
          </div>
        </nuxt-link>
      </div>
      <div class="investor__title title">
        <div class="title__name">
          {{ $t('investors.profile') }}
        </div>
        <div class="title__panel panel">
          <div class="panel__address">
            {{ investorAddress }}
          </div>
          <div class="panel__picture">
            <base-btn
              v-clipboard:copy="investorAddress"
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
                  class="contacts__name"
                  :is-hide-error="true"
                  mode="iconWhite"
                  :disabled="true"
                  :value="investor.additionalInfo ? (input.key === 'location' ? investor.additionalInfo.address : investor[input.key]) : ''"
                  :placeholder="$t('investor.notFilled')"
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
                :title="'test'"
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
                :is-hide-error="true"
                mode="iconWhite"
                :value="investor.additionalInfo && investor.additionalInfo.socialNetwork ? investor.additionalInfo.socialNetwork[input.key] : ''"
                :placeholder="$t('investor.notFilled')"
              >
                <template v-slot:left>
                  <span
                    class="icon input-icon"
                    :class="input.icon"
                  />
                </template>
              </base-field>
            </div>
            <div class="info__action action">
              <base-btn
                mode="lightRed"
                class="action__undelegate"
                :disabled="!isMyProfile || votingPower === 0"
                @click="openModalUndelegate"
              >
                {{ $t('modals.undelegate') }}
              </base-btn>
              <base-btn
                mode="lightBlue"
                class="action__delegate"
                :disabled="!isMyProfile"
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
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import modals from '~/store/modals/modals';
import { Chains } from '~/utils/enums';

export default {
  data() {
    return {
      investor: {},
      userId: this.$route.params.id,
      votingPower: 0,
      investorAddress: '0xnf8o29837hrvbn42o37hsho3b74thb3',
      stake: '126,613,276',
      name: 'user@gmail.com',
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
      userData: 'user/getUserData',
    }),
    mainDataArr() {
      return [
        { key: 'firstName', icon: 'icon-user' },
        { key: 'lastName', icon: 'icon-user' },
        { key: 'location', icon: 'icon-location' },
        { key: 'email', icon: 'icon-mail' },
        { key: 'secondMobileNumber', icon: 'icon-phone' },
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
    const isMobile = await this.$store.dispatch('web3/checkIsMobileMetamaskNeed');
    if (isMobile) {
      this.ShowModal({
        key: modals.status,
        title: 'Please install Metamask!',
        subtitle: 'Please open site from Metamask app',
      });
      await this.$router.push('/proposals');
      return;
    }
    await this.getInvestorData();
  },
  async mounted() {
    await this.$store.dispatch('web3/checkMetamaskStatus', Chains.ETHEREUM);
    await this.getVotingPower();
  },
  methods: {
    async getVotingPower() {
      const { address } = await this.$store.dispatch('web3/getAccount');
      const response = await this.$store.dispatch('web3/getVotes', address);
      if (response.ok) this.votingPower = +response.result;
    },
    async getInvestorData() {
      if (this.isMyProfile) {
        this.investor = this.userData;
      } else {
        this.investor = await this.$store.dispatch('user/getSpecialUserData', this.userId);
      }
    },
    async openModalDelegate() {
      this.ShowModal({
        key: modals.delegate,
        stake: this.stake,
        investorAddress: this.investorAddress,
        callback: this.getVotingPower,
      });
    },
    async openModalUndelegate() {
      this.ShowModal({
        key: modals.undelegate,
        stake: this.stake,
        name: `${this.investor.firstName} ${this.investor.lastName}`,
        callback: this.getVotingPower,
      });
    },
    ClipboardSuccessHandler(value) {
      this.$store.dispatch('main/showToast', {
        title: 'Copied successfully',
        text: value,
      });
    },
    ClipboardErrorHandler(value) {
      this.$store.dispatch('main/showToast', {
        title: 'Copy error',
        text: value,
      });
    },
  },
};
</script>

<style lang="scss" scoped>

.investor {
  @include main;
  @include text-simple;
  color: #1D2127;
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
  &__name{
    font-weight: 600;
    font-size: 28px;
    line-height: 36px;
  }
}

.panel {
  text-align: center;
  display: table;

  &__copy {
    background: #F7F8FA;
  }
  &__copy:hover{
    background: #F7F8FA;
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
    background: #FFFFFF;
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
  &__status{
    grid-column: 2/4;
    display: grid;
    grid-template-columns: repeat(2, max-content);
    gap: 10px;
    align-items: center;
    width: fit-content;
    height: 34px;
    padding: 0 13px;
    background: rgba(0, 131, 199, 0.1);
    color: #0083C7;
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

  &__name{
    color: #1D2127 !important;
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
    color: #1D2127;
    font-size: 16px;
    line-height: 21px;
    margin-bottom: 5px;
  }

  &__textarea {
    height: 86px;
    padding: 10px 10px 0 10px;
    border-radius: 6px;
    resize: none;
    font-size: 14px;
    line-height: 18.2px;
    background-color: #FFFFFF;
    border: 1px solid #F7F8FA;

    &::placeholder {
      color: #1D2127;
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
  color: #0083C7;
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

  &__text {
    font-size: 18px;
    line-height: 130%;
    font-weight: 500;
    align-items: center;
    color: #4C5767;
  }

  &__arrow {
    margin: 6px 10px 6px 0;
    color:  #4C5767;
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
  .action {
    justify-content: space-around;
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
}
</style>

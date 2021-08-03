<template>
  <div class="investor">
    <div class="investor__profile">
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
          <div class="profile__info info">
            <div class="info__base">
              <div class="info__avatar avatar">
                <img
                  id="userAvatar"
                  class="avatar__img"
                  src="~/assets/img/app/avatar.svg"
                  alt=""
                >
              </div>
              <div class="info__contacts contacts">
                <div
                  class="contacts__status status"
                >
                  {{ $t('settings.verifiсated') }}
                  <span class="status__icon icon icon-check_all_big" />
                </div>
                <base-field
                  class="contacts__name"
                  :is-hide-error="true"
                  mode="iconWhite"
                  :disabled="true"
                  :value="$t('settings.nameInput')"
                >
                  <template v-slot:left>
                    <span class="icon contacts__icon icon-user" />
                  </template>
                </base-field>
                <base-field
                  class="contacts__name"
                  :is-hide-error="true"
                  mode="iconWhite"
                  :disabled="true"
                  :value="$t('settings.lastNameInput') "
                >
                  <template v-slot:left>
                    <span class="icon contacts__icon icon-user" />
                  </template>
                </base-field>
              </div>
              <div class="info__contacts contacts">
                <div />
                <base-field
                  class="contacts__name"
                  :is-hide-error="true"
                  mode="iconWhite"
                  :disabled="true"
                  :value="$t('settings.addressInput')"
                >
                  <template v-slot:left>
                    <span class="icon contacts__icon icon-location" />
                  </template>
                </base-field>
                <base-field
                  class="contacts__name"
                  :is-hide-error="true"
                  mode="iconWhite"
                  :disabled="true"
                  :value="$t('settings.telInput')"
                >
                  <template v-slot:left>
                    <span class="icon contacts__icon icon-phone" />
                  </template>
                </base-field>
              </div>
              <div class="info__contacts contacts">
                <div />
                <base-field
                  class="contacts__name"
                  :value="$t('settings.addressInput')"
                  :disabled="true"
                  :is-hide-error="true"
                  mode="iconWhite"
                >
                  <template v-slot:left>
                    <span class="icon contacts__icon icon-mail" />
                  </template>
                </base-field>
                <base-field
                  class="contacts__name"
                  :is-hide-error="true"
                  :value="$t('settings.telInput')"
                  mode="iconWhite"
                  :disabled="true"
                >
                  <template v-slot:left>
                    <span class="icon contacts__icon icon-phone" />
                  </template>
                </base-field>
              </div>
            </div>
            <div class="info__additional">
              <div class="info__about about">
                <div class="about__title">
                  {{ $t('workers.aboutMe') }}
                </div>
                <textarea
                  id="textarea"
                  class="about__textarea"
                  :title="'test'"
                  :disabled="true"
                  :placeholder="profileDescription"
                />
              </div>
              <div class="info__social social">
                <div class="social__container ">
                  <base-field
                    class="social__network"
                    :disabled="true"
                    :is-hide-error="true"
                    mode="iconWhite"
                    :value="$t('settings.socialInput')"
                  >
                    <template v-slot:left>
                      <span class="icon social__icon icon-instagram" />
                    </template>
                  </base-field>

                  <base-field
                    class="social__network"
                    :value="$t('settings.socialInput')"
                    :is-hide-error="true"
                    mode="iconWhite"
                    :disabled="true"
                  >
                    <template v-slot:left>
                      <span class="icon social__icon icon-twitter" />
                    </template>
                  </base-field>
                </div>
                <div class="social__container">
                  <base-field
                    class="social__network"
                    :is-hide-error="true"
                    :value="$t('settings.socialInput')"
                    mode="iconWhite"
                    :disabled="true"
                  >
                    <template v-slot:left>
                      <span class="icon social__icon icon-LinkedIn" />
                    </template>
                  </base-field>
                  <base-field
                    class="social__network"
                    :value="$t('settings.socialInput')"
                    :is-hide-error="true"
                    mode="iconWhite"
                    :disabled="true"
                  >
                    <template v-slot:left>
                      <span class="icon social__icon icon-facebook" />
                    </template>
                  </base-field>
                </div>
              </div>
            </div>
            <div class="info__action action">
              <base-btn
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
          <div class="profile__table">
            <base-table
              class="profile__field"
              :title="$t('wallet.table.trx')"
              :items="transactionsData"
              :fields="walletTableFields"
              :is-pagination="true"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import modals from '~/store/modals/modals';

export default {

  data() {
    return {
      profileDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam, purus sit amet luctus venenatis, lectus magna fringilla urna, porttitor rhoncus dolor purus non enim praesent elementum facilisis leo, vel',
      investorAddress: '0xnf8o29837hrvbn42o37hsho3b74thb3',
      stake: '126,613,276',
      name: 'user@gmail.com',
      isDescending: true,

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
  async mounted() {
    this.SetLoader(false);
  },
  methods: {
    openModalDelegate() {
      this.ShowModal({
        key: modals.delegate,
        stake: this.stake,
        investorAddress: this.investorAddress,
      });
    },
    openModalUndelegate() {
      this.ShowModal({
        key: modals.undelegate,
        stake: this.stake,
        name: this.name,
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

  &__header {
    display: flex;
    justify-content: left;
    margin: 30px 0 20px 0;
    font-size: 16px;
  }
}
.title{
  display: flex;
  justify-content: space-between;
  &__name{
    font-weight: 600;
    font-size: 28px;
    line-height: 36px;
  }
}
.panel{
  text-align: center;
  display: table;

  &__copy{
    background: #F7F8FA;
  }
  &__copy:hover{
    background: #F7F8FA;
  }
  &__address{
    font-weight: 500;
    font-size: 16px;
    display: table-cell;
    vertical-align: middle;
    padding-right: 17px;
  }
}

@include _1199 {
  .investor {
    margin: 0 20px 0 20px;
    &__info {
      display: flex;
      flex-direction: column-reverse;
    }

  }
}
.profile {
  @include main;
  @include text-simple;
  &__body {
    max-width: 1180px;
    height: 100%;
  }
  &__info {
    display: grid;
    grid-template-rows: 151px 1fr 43px;
    grid-gap: 20px;
    margin-top: 15px;
    padding: 20px;

    background: #FFFFFF;
    border-radius: 6px;
  }
  &__table{
    margin-top: 15px;
  }
}
.info {
  &__base {
    display: grid;
    grid-template-columns: 151px repeat(3, 1fr);
    grid-gap: 20px;
  }

  &__avatar {
    width: 100%;
    height: 151px;
    border-radius: 6px;
    overflow: hidden;
  }

  &__contacts {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }

  &__additional {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 20px;
  }

  &__social {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 20px;
  }
}

.contacts {

  & div:first-child {
    margin-bottom: 10px;
  }

  & div:last-child {
    margin-top: 15px;
  }

  &__input {
    width: 100%;
  }

  &__name{
    color: #1D2127!important;
  }
  &__icon {
    font-size: 23px;
    color: #0083C7;
    line-height: 36px;
  }
}
.avatar {
  &:hover .edit {
    opacity: 1;
  }
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
    height: 100%;
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
  &__container {
    display: flex;
    flex-direction: column;

    & div:first-child {
      margin-bottom: 15px;
    }
  }

  &__icon {
    font-size: 23px;
    color: #0083C7;
    line-height: 36px;
  }
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

.link{
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
    margin: 6px 10px 6px 0px;
    color:  #4C5767;
    font-size: 25px;
    cursor: pointer;
  }
}
.status {
  display: flex;
  max-width: max-content;
  height: 34px;
  padding: 8px 13px;
  background: rgba(0, 131, 199, 0.1);
  color: #0083C7;
  border-radius: 36px;
  font-size: 14px;
  line-height: 18px;
  &__icon {
    font-size: 23px;
    color: #0083C7;
    margin-left: 10px;
    margin-top: -3px;
  }
}

</style>

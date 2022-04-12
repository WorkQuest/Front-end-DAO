<template>
  <b-table
    :items="items"
    :fields="fields"
    show-empty
    borderless
    caption-top
    thead-class="table__header"
    :responsive="true"
    tbody-tr-class="table__row"
  >
    <template
      v-if="$props.title.length"
      #table-caption
    >
      <span class="table__title">{{ $props.title }}</span>
    </template>
    <template #cell(tx_hash)="el">
      <a
        :href="getTransactionUrl(el.item.tx_hash)"
        target="_blank"
        class="table__url"
      >
        {{ CutTxn(el.item.tx_hash, 8, 4) }}
      </a>
    </template>
    <template #cell(status)="el">
      <span
        :class="{table__success: el.item.status, table__failed: !el.item.status}"
      >
        {{ el.item.status ? $t('wallet.success') : $t('wallet.failed') }}
      </span>
    </template>
    <template #cell(block)="el">
      <span class="table__grey">{{ el.item.block }}</span>
    </template>
    <template #cell(timestamp)="el">
      <span class="table__grey">{{ el.item.timestamp }}</span>
    </template>
    <template #cell(date)="el">
      <span>{{ $moment(el.item.date).format('ll') }}</span>
    </template>
    <template #cell(transaction_fee)="el">
      <span class="table__grey">{{ el.item.transaction_fee }}</span>
    </template>
    <template #cell(avatar)="el">
      <nuxt-link
        :to="`/investors/${el.item.id}`"
        class=" table__link"
      >
        <img
          :src="(el.item.avatar && el.item.avatar.url) ? el.item.avatar.url : require('~/assets/img/app/avatar_empty.png')"
          alt="userAvatar"
          class="table__avatar"
        >
      </nuxt-link>
    </template>
    <template #cell(copy)="el">
      <base-btn
        v-if="el.item.investorAddress"
        v-clipboard:copy="convertToBech32('wq', el.item.investorAddress)"
        v-clipboard:success="ClipboardSuccessHandler"
        v-clipboard:error="ClipboardErrorHandler"
        mode="copy"
        class="table__copy"
      />
    </template>
    <template #cell(vote)="el">
      <base-btn
        class="btn__vote"
        :class="voteClass(el)"
      >
        {{ el.item.vote ? $t('proposal.yes') : $t('proposal.no') }}
      </base-btn>
    </template>
    <template #cell(undelegate)="el">
      <base-btn
        v-if="delegatedToUser && el.item.investorAddress === delegatedToUser.wallet.address"
        mode="lightRed"
        class="btn__delegate"
        :class="delegateClass(el)"
        @click="openModalUndelegate(el)"
      >
        {{ $t('modals.undelegate') }}
      </base-btn>
    </template>
    <template #cell(delegate)="el">
      <base-btn
        v-if="el.item.investorAddress"
        mode="lightBlue"
        class="btn__delegate"
        @click="openModalDelegate(el)"
      >
        {{ $t('modals.delegate') }}
      </base-btn>
    </template>
    <template #cell(investorAddress)="el">
      <a
        v-if="el.item.investorAddress"
        :href="getAddressUrl(el.item.investorAddress)"
        target="_blank"
      >
        {{ CutTxn(convertToBech32('wq', el.item.investorAddress), 8, 8) }}
      </a>
      <span
        v-else
        class="table__grey"
      >
        {{ $t('messages.walletNotLinked') }}
      </span>
    </template>
    <template #cell(from_address)="el">
      <a
        :href="getAddressUrl(el.item.from_address)"
        target="_blank"
        class="table__url"
      >
        {{ CutTxn(convertToBech32('wq', el.item.from_address), 4, 4) }}
      </a>
    </template>
    <template #cell(to_address)="el">
      <a
        :href="getAddressUrl(el.item.to_address)"
        target="_blank"
        class="table__url"
      >
        {{ CutTxn(convertToBech32('wq', el.item.to_address), 4, 4) }}
      </a>
    </template>
    <template #cell(fullName)="el">
      <nuxt-link
        :to="`/investors/${el.item.id}`"
        class="table__link"
      >
        <span>{{ cropTxt(el.item.fullName, 15) }}</span>
      </nuxt-link>
    </template>
  </b-table>
</template>

<script>
import { mapGetters } from 'vuex';
import modals from '~/store/modals/modals';
import { ExplorerUrls } from '~/utils/enums';

export default {
  props: {
    title: {
      type: String,
      default: '',
    },
    items: {
      type: Array,
      default: () => [],
    },
    fields: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      isProd: process.env.PROD === 'true',
    };
  },
  computed: {
    ...mapGetters({
      userData: 'user/getUserData',
      delegatedToUser: 'investors/getDelegatedToUser',
    }),
  },
  methods: {
    getTransactionUrl(hash) {
      return `${ExplorerUrls[this.isProd ? 'PROD' : 'DEV']}/transactions/${hash}`;
    },
    getAddressUrl(address) {
      return `${ExplorerUrls[this.isProd ? 'PROD' : 'DEV']}/address/${address}`;
    },
    myProfile(id) {
      return this.userData.id === id;
    },
    voteClass(el) {
      return [
        { btn__vote_green: el.item.vote === true },
        { btn__vote_red: el.item.vote === false },
      ];
    },
    delegateClass(el) {
      return [
        { btn__delegate: el.item.undelegate === 'undelegate' },
        { btn__delegate_hidden: el.item.undelegate === '' },
      ];
    },
    openModalDelegate(el) {
      this.ShowModal({
        key: modals.delegate,
        stake: el.item.stake,
        investorAddress: el.item.investorAddress,
        callback: el.item.callback,
      });
    },
    openModalUndelegate(el) {
      this.ShowModal({
        key: modals.undelegate,
        stake: el.item.stake,
        name: el.item.fullName,
        tokensAmount: el.item.voting,
        callback: el.item.callback,
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
    cropTxt(str, maxLength = 80) {
      if (!str) return '';
      if (str.toString().length > maxLength) str = `${str.slice(0, maxLength)}...`;
      return str;
    },
  },
};
</script>

<style lang="scss">
.table {
  @include text-usual;
  overflow-x: hidden;
  background: $white;
  border-radius: 6px;
  width: 1180px;

  &__title {
    margin: 10px;
    color: $black800;
  }

  &__success {
    color: $green;
  }

  &__failed {
    color: $red;
  }

  &__grey {
    color: $black500;
  }

  &__header {
    @include text-simple;
    background: rgba(0, 131, 199, 0.1);
    height: 27px;
    line-height: 17px;
    color: $blue;
    font-style: normal;
    font-size: 12px;
    word-break: break-word;
  }

  &__row {
    line-height: 40px;
  }

  &__link {
    color: $black800 !important;
    text-decoration: none !important;
  }

  @include _1199 {
    .btn__delegate {
      width: 80px !important;
      font-size: 13px;
    }
  }
  @include _991 {
    .table {
      width: 1180px;
      overflow-x: hidden;

      .btn__delegate {
        width: 60px !important;
        font-size: 10px;
      }
    }
    &__copy {
      font-size: 10px;
    }
  }

  &__copy {
    color: $blue;
    font-size: 25px;
  }

  &__avatar {
    width: 30px !important;
    height: 30px !important;
    border-radius: 50%;
    margin: 0 !important;
    text-align: center;
    object-fit: cover;
  }
}

.btn {
  &__vote {
    cursor: default !important;
    width: 63px !important;
    height: 31px !important;
    margin-right: -30px;
    justify-content: center !important;

    &_green {
      margin: auto auto;
      background: $green !important;
    }

    &_red {
      margin: auto auto;
      background: $red !important;
    }
  }

  &__delegate {
    width: 130px !important;
    height: 43px !important;

    &_hidden {
      display: none !important;
    }
  }
}

</style>

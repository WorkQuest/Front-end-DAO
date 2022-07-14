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
        :to="`${$options.Path.INVESTORS}/${el.item.id}`"
        class="table__link"
      >
        <img
          :src="(el.item.avatar && el.item.avatar.url) ? el.item.avatar.url : require('~/assets/img/app/avatar_empty.png')"
          alt="userAvatar"
          class="table__avatar"
        >
      </nuxt-link>
    </template>
    <template #cell(copy)="el">
      <button-copy
        v-if="el.item.investorAddress"
        :copy-value="el.item.investorAddress"
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
        v-if="delegatedToUser && el.item.investorAddress === delegatedToUser.investorAddress"
        mode="lightRed"
        class="btn__delegate"
        :class="delegateClass(el)"
        :disabled="!balanceWQT"
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
        @click="!balanceWQT ? toastsDelegateInfo($t('investors.notEnoughTokens')) : openModalDelegate(el)"
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
        {{ CutTxn(el.item.investorAddress, 8, 8) }}
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
        {{ CutTxn( el.item.from_address, 4, 4) }}
      </a>
    </template>
    <template #cell(to_address)="el">
      <a
        :href="getAddressUrl(el.item.to_address)"
        target="_blank"
        class="table__url"
      >
        {{ CutTxn(el.item.to_address, 4, 4) }}
      </a>
    </template>
    <template #cell(fullName)="el">
      <nuxt-link
        :to="`${$options.Path.INVESTORS}/${el.item.id}`"
        class="table__link"
      >
        <span>{{ cropTxt(el.item.fullName, 15) }}</span>
      </nuxt-link>
    </template>
    <template #cell(validatorName)="el">
      <nuxt-link :to="`${$options.Path.VALIDATORS}/${el.item.investorAddress}`">
        <span>{{ el.item.validatorName }}</span>
      </nuxt-link>
    </template>
  </b-table>
</template>

<script>
import { mapGetters } from 'vuex';
import modals from '~/store/modals/modals';
import { DelegateMode, ExplorerUrl, Path } from '~/utils/enums';

export default {
  Path,
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
  computed: {
    ...mapGetters({
      userData: 'user/getUserData',
      delegatedToUser: 'investors/getDelegatedToUser',
      balanceWQT: 'wallet/getBalanceWQT',
    }),
  },
  methods: {
    toastsDelegateInfo(value) {
      this.ShowToast(value, this.$t('investors.delegateInfo'));
    },
    getTransactionUrl(hash) {
      return `${ExplorerUrl}/tx/${hash}`;
    },
    getAddressUrl(address) {
      return `${ExplorerUrl}/address/${address}`;
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
        delegateMode: DelegateMode.INVESTORS,
        stake: el.item.stake,
        investorAddress: el.item.investorAddress,
        callback: el.item.callback,
      });
    },
    openModalUndelegate(el) {
      this.ShowModal({
        key: modals.undelegate,
        delegateMode: DelegateMode.INVESTORS,
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

  @include _991 {
    .table {
      width: 1180px;
      overflow-x: hidden;
    }
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

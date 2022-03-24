<template>
  <div
    v-if="item !== undefined"
    class="item"
    :class="{item__separator: isLast}"
  >
    <div
      v-if="item.tx_hash"
      class="item__hash"
    >
      {{ $t('wallet.table.txHash') }}
      <span class="item__info_large">
        {{ CutTxn(item.tx_hash, 9, 6) }}
      </span>
    </div>
    <div
      v-if="item.hash"
      class="item__hash"
    >
      {{ $t('proposal.table.hash') }}
      <span class="item__info_large">
        {{ CutTxn(item.hash, 9, 6) }}
      </span>
    </div>
    <p
      v-if="item.timestamp || item.date"
      class="item__timestamp"
    >
      {{ item.timestamp || $moment(item.date).format('ll') }}
    </p>
    <div
      v-if="item.fullName"
      class="item__subtitle"
    >
      <nuxt-link
        :to="`/investors/${item.id}`"
        class="item__link"
      >
        <img
          class="item__image"
          :src="(item.avatar && item.avatar.url) ? item.avatar.url : require('~/assets/img/app/avatar_empty.png')"
          alt="user"
        >
      </nuxt-link>
      <nuxt-link
        :to="`/investors/${item.id}`"
        class="item__link"
      >
        <span class="item__info_large">
          {{ item.fullName }}
        </span>
      </nuxt-link>
    </div>
    <div
      v-if="typeof item.status === 'string'"
      class="item__subtitle"
    >
      {{ $t('wallet.table.status') }}
      <span
        v-if="item.status === 'Success'"
        class="item__info_green"
      >
        {{ item.status }}
      </span>
      <span
        v-if="item.status === 'Fail'"
        class="item__info_red"
      >
        {{ item.status }}
      </span>
    </div>
    <div
      v-if="item.block"
      class="item__subtitle"
    >
      {{ $t('wallet.table.block') }}
      <span class="item__info">
        {{ item.block }}
      </span>
    </div>
    <div
      v-if="item.transferred"
      class="item__subtitle"
    >
      {{ $t('wallet.table.transferred') }}
      <span class="item__info">
        {{ item.transferred }}
      </span>
    </div>
    <div
      v-if="item.value"
      class="item__subtitle"
    >
      {{ $t('wallet.table.value') }}
      <span class="item__info">
        {{ item.value }}
      </span>
    </div>
    <div
      v-if="item.item_fee || item.transaction_fee"
      class="item__subtitle"
    >
      {{ $t('wallet.table.trxFee') }}
      <span class="item__info">
        {{ item.item_fee || item.transaction_fee }}
      </span>
    </div>
    <div
      v-if="item.address || item.investorAddress"
      class="item__subtitle"
    >
      {{ $t('proposal.table.address') }}
      <span class="item__info">
        {{ CutTxn(item.address || item.investorAddress, 9, 6) }}
        <base-btn
          v-if="item.investorAddress"
          v-clipboard:copy="item.investorAddress"
          v-clipboard:success="ClipboardSuccessHandler"
          v-clipboard:error="ClipboardErrorHandler"
          mode="copy"
          class="item__copy"
        />
      </span>
    </div>
    <div
      v-if="item.vote"
      class="item__subtitle"
    >
      {{ $t('proposal.table.vote') }}
      <span :class="{item__info_yes: item.vote, item__info_no: !item.vote}">
        {{ item.vote ? $t('proposal.yes') : $t('proposal.no') }}
      </span>
    </div>
    <div
      v-if="item.voting"
      class="item__subtitle"
    >
      {{ $t('investors.table.voting') }}
      <span class="item__info">
        {{ item.voting }}
      </span>
    </div>
    <div
      v-if="item.investorAddress"
      class="item__buttons"
    >
      <base-btn
        v-if="delegatedToUser && item.investorAddress === delegatedToUser.address"
        mode="lightRed"
        class="btn__delegate"
        @click="openModalUndelegate(item)"
      >
        {{ $t('modals.undelegate') }}
      </base-btn>
      <base-btn
        mode="lightBlue"
        class="btn__delegate"
        @click="openModalDelegate(item)"
      >
        {{ $t('modals.delegate') }}
      </base-btn>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import modals from '~/store/modals/modals';

export default {
  name: 'Item',
  props: {
    item: {
      type: Object,
      default: () => {},
    },
    isLast: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapGetters({
      userData: 'user/getUserData',
      delegatedToUser: 'investors/getDelegatedToUser',
    }),
  },
  methods: {
    myProfile(id) {
      return this.userData.id === id;
    },
    openModalDelegate(item) {
      this.ShowModal({
        key: modals.delegate,
        stake: item.stake,
        investorAddress: item.investorAddress,
        callback: item.callback,
      });
    },
    openModalUndelegate(item) {
      this.ShowModal({
        key: modals.undelegate,
        stake: item.stake,
        name: item.fullName,
        tokensAmount: item.voting,
        investorAddress: item.investorAddress,
        callback: item.callback,
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.item {
    padding: 20px 0;
    border-bottom: 1px solid $black100;
    grid-template-columns: 1fr 1fr;
    display: grid;
    &__link {
      &:hover {
        text-decoration: none;
      }
    }
    &__separator {
        border: none;
        padding-bottom: 0;
    }
    &__hash {
      font-weight: 600;
      font-size: 14px;
      color: $black300;
    }
    &__timestamp {
      font-weight: normal;
      font-size: 14px;
      color: $black400;
      justify-self: flex-end;
    }
    &__subtitle {
      font-weight: 600;
      grid-column: 1/3;
      margin-top: 11px;
    }
    &__info {
        font-weight: normal;
        margin-left: 10px;
        &_large {
          display: block;
          font-size: 20px;
          color: $black800;
          text-overflow: ellipsis;
          overflow: hidden;
        }
        &_green {
          font-weight: normal;
          color: $green;
        }
        &_red {
          font-weight: normal;
          color: $red;
        }
        &_yes {
          background: $green;
          width: 63px;
          height: 31px;
          border-radius: 6px;
          display: inline-flex;
          justify-content: center;
          align-items: center;
          @include text-simple;
          @include text-usual;
          color: $white;
          margin-left: 10px;
        }
        &_no {
          background: $red;
          width: 63px;
          height: 31px;
          border-radius: 6px;
          display: inline-flex;
          justify-content: center;
          align-items: center;
          @include text-simple;
          @include text-usual;
          color: $white;
          margin-left: 10px;
        }
    }
    &__buttons {
      display: flex;
      gap: 10px;
      margin: 10px 0;
    }
    &__copy {
      display: inline-block !important;
      width: 15px !important;
      height: 100% !important;
    }
    &__image {
      width: 120px;
      height: 120px;
      -o-object-fit: cover;
      object-fit: cover;
    }
  }
</style>

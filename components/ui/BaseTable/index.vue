<template>
  <div class="table">
    <b-table
      :items="items"
      :fields="fields"
      borderless
      thead-class="table__header"
      caption-top
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
        <span>{{ cutString(el.item.tx_hash, 9, 6) }}</span>
      </template>
      <template #cell(status)="el">
        <span
          v-if="el.item.status === 'Success'"
          class="table__success"
        >{{ el.item.status }}</span>
        <span
          v-else
          class="table__failed"
        >{{ el.item.status }}</span>
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
          v-clipboard:copy="el.item.investorAddress"
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
          mode="lightRed"
          class="btn__delegate"
          :disabled="!myProfile(el.item.id) || el.item.voting === 0"
          :class="delegateClass(el)"
          @click="openModalUndelegate(el)"
        >
          {{ el.item.undelegate }}
        </base-btn>
      </template>
      <template #cell(delegate)="el">
        <base-btn
          mode="lightBlue"
          :disabled="!myProfile(el.item.id)"
          class="btn__delegate"
          @click="openModalDelegate(el)"
        >
          {{ el.item.delegate }}
        </base-btn>
      </template>
      <template #cell(investorAddress)="el">
        {{ cutString(el.item.investorAddress, 5, 6) }}
      </template>
      <template
        #cell(fullName)="el"
      >
        <nuxt-link
          :to="`/investors/${el.item.id}`"
          class="table__link"
        >
          <span>{{ cropTxt(el.item.fullName, 15) }}</span>
        </nuxt-link>
      </template>
    </b-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import modals from '~/store/modals/modals';

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
    };
  },
  computed: {
    ...mapGetters({
      userData: 'user/getUserData',
    }),
  },
  methods: {
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
  background: #FFFFFF;
  border-radius: 6px;
  text-align: center;
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
  &__link{
    color: #1D2127!important;
    text-decoration: none!important;
  }
  @include _1199 {
    .table {
       &__row {
        font-size: 13px !important;
      }
      &__header {
        font-size: 10px !important;
      }
    }
    .btn__delegate {
      width: 80px !important;
      font-size: 13px;
    }
  }
  @include _991 {
    .table {
      width: 99%;
      &__row {
        font-size: 10px !important;
      }
      &__header {
        font-size: 8px !important;
      }
      .btn__delegate {
      width: 60px !important;
      font-size: 10px;
    }
    }
    &__copy {
      font-size: 10px;
    }
  }
  &__copy{
    color:#0083C7;
    font-size: 25px;
  }
  &__avatar{
    width: 30px!important;
    height: 30px!important;
    border-radius: 50%;
    margin: 0!important;
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
    justify-content: center!important;
    &_green {
      margin: auto auto;
      background: #22CC14 !important;
    }
    &_red {
      margin: auto auto;
      background: #DF3333 !important;
    }
  }
  &__delegate{
    width: 130px !important;
    height: 43px !important;
    &_hidden{
      display: none!important;
    }
  }
}

</style>

<template>
  <div class="validators">
    <div class="validators__body">
      <button @click="test">
        test
      </button>
      <div class="validators__head head">
        <div class="head__title">
          {{ $t('validators.title') }}
        </div>
        <div class="head__navigation">
          <button
            class="head__button"
            :class="{ 'head__button_active' : tableType === 'validators' }"
            data-selector="VALIDATORS"
            @click="tableType = 'validators'"
          >
            {{ $t('validators.title') }}
          </button>
          <button
            class="head__button"
            :class="{ 'head__button_active' : tableType === 'candidates' }"
            data-selector="CANDIDATES"
            @click="tableType = 'candidates'"
          >
            {{ $t('validators.candidates') }}
          </button>
        </div>
      </div>
      <base-field
        v-model="search"
        class="validators__search"
        is-search
        :placeholder="$t(`validators.${tableType === 'validators' ? 'searchValidator' : 'searchCandidates'}`)"
        mode="icon"
        data-selector="SEARCH"
      />
      <base-table
        class="validators__table"
        :fields="tableFields"
        :items="validators"
      />
      <base-pager
        v-model="currPage"
        class="validators__pagination"
        :total-pages="totalPages"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { delegateToValidator, test } from '~/utils/wallet';

export default {
  name: 'Validators',
  data() {
    return {
      limit: 20,
      offset: 0,
      search: '',
      q: '',
      currPage: 1,
      tableType: 'validators',
    };
  },
  computed: {
    ...mapGetters({
      isWalletConnected: 'web3/getWalletIsConnected',
      userData: 'user/getUserData',
      validatorsList: 'validators/getValidatorsList',
      validatorsCount: 'validators/getValidatorsCount',
    }),
    validators() {
      const res = [];
      // eslint-disable-next-line no-restricted-syntax
      for (const item of this.validatorsList) {
        res.push({
          fullName: item.description.moniker,
          investorAddress: item.operator_address,
          fee: item.commission.commission_rates.rate,
        });
      }
      return res;
    },
    tableFields() {
      const mainFields = [
        { key: 'avatar', label: this.$t('validators.table.name') },
        { key: 'fullName', label: '', sortable: true },
        { key: 'investorAddress', label: this.$t('validators.table.address') },
        { key: 'copy', label: '', sortable: true },
      ];
      if (this.tableType === 'validators') {
        mainFields.push(
          { key: 'missedBlocks', label: this.$t('validators.table.missedBlocks'), sortable: true },
          { key: 'fee', label: this.$t('validators.table.fee'), sortable: true },
          { key: 'stake', label: this.$t('validators.table.stake'), sortable: true },
          { key: 'minStake', label: this.$t('validators.table.minStake'), sortable: true },
          { key: 'slots', label: this.$t('validators.table.slots'), sortable: true },
          { key: 'menu', label: '' },
        );
      } else {
        mainFields.push(
          { key: 'fee', label: this.$t('validators.table.fee'), sortable: true },
          { key: 'stake', label: this.$t('validators.table.stake'), sortable: true },
          { key: 'slots', label: this.$t('validators.table.slots'), sortable: true },
        );
      }
      return mainFields;
    },
    totalPages() {
      return 2;
    },
  },
  beforeCreate() {
    this.$store.dispatch('wallet/checkWalletConnected', { nuxt: this.$nuxt });
  },
  async beforeMount() {
    await Promise.all([
      this.$store.dispatch('validators/getValidators'),
    ]);
  },
  methods: {
    async test() {
      // const res = await test();
      const delegateTx = await delegateToValidator('address', 'amount');
      console.log('base64', delegateTx);
      const broadcastRes = await this.$store.dispatch('validators/broadcast', { signedTxBytes: delegateTx.result });
      console.log('RESULT >>', broadcastRes);
    },
  },
};
</script>

<style lang="scss" scoped>
.validators {
  @include main;
  @include text-simple;
  &__body {
    margin-top: 30px;
    max-width: 1180px;
    height: 100%;
  }
  &__table{
    overflow: auto;
    margin-bottom: 15px;
    position: relative;
  }
  &__head {
    display: flex;
    justify-content: space-between;
  }
  &__search{
    margin: 20px 0 20px 0;
    background-color: #FFFFFF;
    height: 43px;
    border-radius: 6px;
  }
}
.head {
  &__navigation {
    display: grid;
    grid-template-columns: repeat(2, auto);
    grid-gap: 20px;
  }
  &__title{
    font-weight: 600;
    font-size: 28px;
    line-height: 36px;
    color: #000000;
  }
  &__button {
    @include text-simple;
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    height: 100%;
    line-height: 130%;
    color: $black500;
    &_active {
      color: $black800;
      border-bottom: solid $blue 2px;
    }
  }
}
@include _1199 {
  .validators {
    &__body {
      padding: 0 20px;
    }
    &__table {
      width: calc(100vw - 40px);
    }
  }
}
@include _575 {
  .validators {
    &__head {
      flex-direction: column;
    }
  }
  .head {
    &__title {
      margin-bottom: 10px;
    }
  }
}
</style>

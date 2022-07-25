<template>
  <div class="validators">
    <div class="validators__container">
      <div class="validators__body">
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
        <div class="validators__txs">
          <base-table
            class="table__txs"
            :fields="tableFields"
            :items="validators"
          />
          <base-pager
            v-if="totalPages > 1"
            v-model="currPage"
            class="validators__pagination"
            :total-pages="totalPages"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import BigNumber from 'bignumber.js';
import { TokenSymbols } from '~/utils/enums';

export default {
  name: 'Validators',
  data() {
    return {
      limit: 10,
      offset: 0,
      currPage: 1,
      tableType: 'validators',
    };
  },
  computed: {
    ...mapGetters({
      balanceData: 'wallet/getBalanceData',
      isWalletConnected: 'wallet/getIsWalletConnected',
      userData: 'user/getUserData',
      validatorsList: 'validators/getValidatorsList',
      validatorsCount: 'validators/getValidatorsCount',
    }),
    /**
     * @property moniker
     * @property operator_address
     * @property commission
     * @property commission_rates
     * @property min_self_delegation
     * @returns {{investorAddress: *, stake: string, slots: *, minStake: *, missedBlocks: *, fee: string, validatorName: *, id: *}[]}
     */
    validators() {
      return this.validatorsList.map((item) => {
        const address = this.ConvertToBech32('wq', this.ConvertToHex('wqvaloper', item.operator_address));
        return {
          validatorName: item.description.moniker,
          investorAddress: address,
          id: address,
          fee: `${Math.ceil(item.commission.commission_rates.rate * 100)}%`,
          minStake: `${item.min_self_delegation} ${TokenSymbols.WQT}`,
          missedBlocks: item.missedBlocks,
          stake: `${new BigNumber(item.tokens).shiftedBy(-this.balanceData.WQT.decimals).toString()} ${TokenSymbols.WQT}`,
        };
      });
    },
    tableFields() {
      const mainFields = [
        { key: 'validatorName', label: this.$t('validators.table.name') },
        { key: 'investorAddress', label: this.$t('validators.table.address') },
        { key: 'copy', label: '', sortable: false },
      ];
      if (this.tableType === 'validators') {
        mainFields.push(
          { key: 'missedBlocks', label: this.$t('validators.table.missedBlocks'), sortable: false },
          { key: 'fee', label: this.$t('validators.table.fee'), sortable: false },
          { key: 'stake', label: this.$t('validators.table.stake'), sortable: false },
          { key: 'minStake', label: this.$t('validators.table.minStake'), sortable: false },
        );
      } else {
        mainFields.push(
          { key: 'fee', label: this.$t('validators.table.fee'), sortable: false },
          { key: 'stake', label: this.$t('validators.table.stake'), sortable: false },
          { key: 'slots', label: this.$t('validators.table.slots'), sortable: false },
        );
      }
      return mainFields;
    },
    totalPages() {
      return Math.ceil(this.validatorsCount / this.limit);
    },
  },
  watch: {
    tableType() {
      this.getValidators();
    },
    currPage() {
      this.getValidators();
    },
  },
  beforeCreate() {
    this.$store.dispatch('wallet/checkWalletConnected', { nuxt: this.$nuxt });
  },
  async beforeMount() {
    if (!this.isWalletConnected) return;
    await this.getValidators();
  },
  methods: {
    async getValidators() {
      this.offset = (this.currPage - 1) * this.limit;
      const type = this.tableType === 'validators'
        ? ['BOND_STATUS_BONDED', 'BOND_STATUS_UNBONDING']
        : 'BOND_STATUS_UNBONDED';
      await this.$store.dispatch('validators/getValidators', {
        status: type,
        limit: this.limit,
        offset: this.offset,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.table {
  position: relative;
  overflow: auto;
  &__txs {
    width: 1180px;
  }
}
.validators {
  @include main;
  @include text-simple;
  &__container{
    display: flex;
    justify-content: center;
  }
  &__body {
    margin-top: 30px;
    max-width: 1180px;
    width: calc(100vw - 40px);
    height: 100%;
  }
  &__head {
    display: flex;
    justify-content: space-between;
  }
  &__txs {
    margin-top: 20px;
    overflow: auto;
  }
  &__pagination {
    margin-top: 20px;
  }
}
.table__link {
  color: $black800 !important;
  text-decoration: none !important;
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

<template>
  <div class="validators">
    <div class="validators__body">
      <div class="validators__head head">
        <div class="head__title">
          {{ $t('validators.title') }}
        </div>
        <div class="head__navigation">
          <button
            class="head__button"
            :class="{ 'head__button_active' : tableType === 'validators' }"
            @click="tableType = 'validators'"
          >
            {{ $t('validators.title') }}
          </button>
          <button
            class="head__button"
            :class="{ 'head__button_active' : tableType === 'candidates' }"
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
      />
      <base-table
        class="validators__table"
        :fields="tableFields"
      />
      <base-pager
        v-if="usersData.count > limit"
        v-model="currPage"
        class="validators__pagination"
        :total-pages="totalPages"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Index',
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
      userData: 'user/getUserData',
      usersData: 'user/getAllUsers',
      isConnected: 'web3/getWalletIsConnected',
    }),
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
      return Math.ceil(this.usersData.count / this.limit);
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
  &__pagination{
    margin: 10px 15px 0 0;
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
@include _991 {
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

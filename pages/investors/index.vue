<template>
  <div class="investors">
    <div class="investors__body body">
      <div class="body__title">
        {{ $t('investors.title') }}
      </div>
      <base-field
        v-model="search"
        class="body__search"
        :is-search="true"
        :placeholder="$t('investors.search')"
      />
      <base-table
        v-if="usersData.count !== 0"
        class="investors__table"
        :fields="historyTableFields"
        :items="usersData.users"
      />
      <div class="investors__investors">
        <mobile-table-item
          v-for="(investor, index) in usersData.users"
          :key="index"
          :item="investor"
          :is-last="usersData.users[index] === usersData.users[usersData.users.length - 1]"
        />
      </div>
      <base-pager
        v-if="usersData.count > filter.limit"
        v-model="currPage"
        class="investors__pagination"
        :total-pages="totalPages"
      />
    </div>
  </div>
</template>

<script>

import { mapGetters } from 'vuex';
import { Chains } from '~/utils/enums';

export default {

  data() {
    return {
      filter: {
        limit: 20,
        offset: 0,
        q: '',
        timout: '',
      },
      search: '',
      currPage: 1,
    };
  },
  computed: {
    ...mapGetters({
      usersData: 'user/getAllUsers',
      isConnected: 'web3/getWalletIsConnected',
    }),
    historyTableFields() {
      return [
        { key: 'avatar', label: this.$t('investors.table.name') },
        { key: 'fullName', label: '', sortable: true },
        { key: 'investorAddress', label: this.$t('investors.table.address') },
        { key: 'copy', label: '', sortable: true },
        { key: 'stake', label: this.$t('investors.table.stake'), sortable: true },
        { key: 'slots', label: this.$t('investors.table.slots'), sortable: true },
        { key: 'voting', label: this.$t('investors.table.voting'), sortable: true },
        { key: 'undelegate', label: '' },
        { key: 'delegate', label: '' },
      ];
    },
    totalPages() {
      return Math.ceil(this.usersData.count / this.filter.limit);
    },
  },
  watch: {
    async currPage() {
      const { currPage, filter: { limit } } = this;

      this.filter.offset = (currPage - 1) * limit;

      this.SetLoader(true);
      await this.getInvestors();
      this.SetLoader(false);
    },
    search() {
      this.filter.q = this.search;
      clearTimeout(this.timout);
      this.timout = setTimeout(() => {
        this.getInvestors();
      }, 1000);
    },
  },
  beforeMount() {
    this.getInvestors();
  },
  async mounted() {
    await this.$store.dispatch('web3/checkMetamaskStatus', Chains.ETHEREUM);
  },
  beforeDestroy() {
    clearTimeout(this.timout);
  },
  methods: {
    async getInvestors() {
      await this.$store.dispatch('user/getAllUserData', this.filter);
    },
  },
};
</script>

<style lang="scss" scoped>
.investors {
  @include main;
  @include text-simple;
  &__body {
    margin-top: 30px;
    max-width: 1180px;
    height: 100%;
  }
  &__table{
    margin-bottom: 15px;
  }
  &__investors {
      display: none;
    }
  &__pagination{
    margin: 10px 15px 0 0;
  }
}

.body{
  &__title{
    font-weight: 600;
    font-size: 28px;
    line-height: 36px;
    color: #000000;
  }
  &__search{
    margin: 20px 0 20px 0;
    background-color: #FFFFFF;
    width: 1180px;
    height: 43px;
    border-radius: 6px;
  }
}
@include _1199 {
  .body {
    max-width: 100vw;
    &__title {
      margin-left: 10px;
    }
  }
}
@include _767 {
  .body {
    max-width: 100vw;
  }
  .investors {
    &__table {
      display: none;
    }
    &__investors {
      display: block;
      background: $white;
      padding: 16px;
    }
    &__pagination {
      margin-right: 10px;
    }
  }
}
</style>

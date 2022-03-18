<template>
  <div class="investors">
    <div class="investors__body body">
      <div class="body__title">
        {{ $t('investors.title') }}
      </div>
      <base-field
        v-model="search"
        class="body__search"
        is-search
        :placeholder="$t('investors.search')"
        mode="icon"
      />
      <div
        v-if="delegatedToUser.address"
        class="body__delegated"
      >
        <div>{{ $tc('investors.youDelegated', delegatedToUser.tokensAmount) }}</div>
        <div>{{ $t('modals.to') }} {{ delegatedToUser.address }}</div>
        <base-btn
          mode="lightRed"
          class="btn__delegate"
          @click="openModalUndelegate"
        >
          {{ $t('modals.undelegate') }}
        </base-btn>
      </div>
      <base-table
        v-if="usersData.count !== 0"
        class="investors__table"
        :fields="tableFields"
        :items="users"
      />
      <div class="investors__investors">
        <mobile-table-item
          v-for="(investor, index) in users"
          :key="index"
          :item="investor"
          :is-last="users[index] === users[users.length - 1]"
        />
      </div>
      <base-pager
        v-if="usersData.count > limit"
        v-model="currPage"
        class="investors__pagination"
        :total-pages="totalPages"
      />
    </div>
  </div>
</template>

<script>

import { mapGetters } from 'vuex';
import modals from '~/store/modals/modals';

export default {
  name: 'Investors',
  data() {
    return {
      limit: 20,
      offset: 0,
      q: '',
      timeout: '',
      search: '',
      currPage: 1,
      votingPower: 0,
      investorAddress: '',
    };
  },
  computed: {
    ...mapGetters({
      userData: 'user/getUserData',
      usersData: 'user/getAllUsers',
      isWalletConnected: 'wallet/getIsWalletConnected',
      lastPage: 'investors/getLastPage',
      delegatedToUser: 'investors/getDelegatedToUser',
    }),
    tableFields() {
      return [
        { key: 'avatar', label: this.$t('investors.table.name') },
        { key: 'fullName', label: '', sortable: true },
        { key: 'investorAddress', label: this.$t('investors.table.address') },
        { key: 'copy', label: '', sortable: true },
        { key: 'voting', label: this.$t('investors.table.voting'), sortable: true },
        { key: 'undelegate', label: '' },
        { key: 'delegate', label: '' },
      ];
    },
    users() {
      const users = [];
      this.usersData.users.forEach((user) => {
        users.push({ ...user, callback: this.getInvestors });
      });
      return users;
    },
    totalPages() {
      return Math.ceil(this.usersData.count / this.limit);
    },
  },
  watch: {
    async currPage() {
      this.offset = (this.currPage - 1) * this.limit;
      await this.$store.dispatch('investors/setLastPage', this.currPage);
      await this.getInvestors();
    },
    search() {
      this.q = this.search.trim();
      this.offset = 0;
      this.currPage = 1;
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => { this.getInvestors(); }, 1000);
    },
  },
  async beforeMount() {
    if (this.lastPage) this.currPage = this.lastPage;
    await this.$store.dispatch('wallet/checkWalletConnected', { nuxt: this.$nuxt });
  },
  async mounted() {
    if (!this.isWalletConnected) return;
    await this.getInvestors();
  },
  beforeDestroy() {
    clearTimeout(this.timeout);
  },
  methods: {
    openModalUndelegate() {
      this.ShowModal({
        key: modals.undelegate,
        tokensAmount: this.delegatedToUser.tokensAmount,
        callback: async () => await this.getInvestors(),
      });
    },
    async getInvestors() {
      this.SetLoader(true);
      await Promise.all([
        this.$store.dispatch('user/getAllUserData', { limit: this.limit, offset: this.offset, q: this.q }),
        this.$store.dispatch('wallet/getDelegates'),
      ]);
      this.SetLoader(false);
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
    color: $black800;
  }
  &__search{
    margin: 20px 0 20px 0;
    background-color: $white;
    width: 1180px;
    height: 43px;
    border-radius: 6px;
  }
  &__delegated {
    margin-bottom: 20px;
    color: $black800;
    font-size: 16px;
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
    &__delegated {
      white-space: nowrap;
    }
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

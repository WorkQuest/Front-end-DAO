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
import modals from '~/store/modals/modals';

export default {

  data() {
    return {
      filter: {
        limit: 20,
        offset: 0,
        q: '',
        timeout: '',
      },
      search: '',
      currPage: 1,
      votingPower: 0,
    };
  },
  computed: {
    ...mapGetters({
      userData: 'user/getUserData',
      usersData: 'user/getAllUsers',
      isConnected: 'web3/getWalletIsConnected',
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
        users.push({
          ...user,
          callback: this.getInvestors,
          voting: user.id === this.userData.id ? this.votingPower : '',
        });
      });
      return users;
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
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.getInvestors();
      }, 1000);
    },
  },
  async beforeMount() {
    const isMobile = await this.$store.dispatch('web3/checkIsMobileMetamaskNeed');
    if (isMobile) {
      this.ShowModal({
        key: modals.status,
        title: 'Please install Metamask!',
        subtitle: 'Please open site from Metamask app',
      });
      await this.$router.push('/proposals');
    }
  },
  async mounted() {
    await this.$store.dispatch('web3/checkMetamaskStatus', Chains.ETHEREUM);
    await this.getInvestors();
  },
  beforeDestroy() {
    clearTimeout(this.timeout);
  },
  methods: {
    // TODO Когда появятся кошельки убрать это, брать информацию из сущности юзера полученной с бэка
    async getVotingPower() {
      const { address } = await this.$store.dispatch('web3/getAccount');
      const response = await this.$store.dispatch('web3/getVotes', address);
      if (response.ok) this.votingPower = +response.result;
    },
    async getInvestors() {
      await Promise.all([
        this.$store.dispatch('user/getAllUserData', this.filter),
        this.getVotingPower(),
      ]);
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

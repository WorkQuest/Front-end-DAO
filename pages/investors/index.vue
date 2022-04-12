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
        data-selector="INPUT-SEARCH-INVESTOR"
      />
      <base-table
        v-if="investorsCount !== 0"
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
        v-if="investorsCount > limit"
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
      investors: 'investors/getInvestorsList',
      investorsCount: 'investors/getInvestorsCount',
      isWalletConnected: 'wallet/getIsWalletConnected',
      userWalletAddress: 'user/getUserWalletAddress',
      lastPage: 'investors/getLastPage',
      delegatedToUser: 'investors/getDelegatedToUser',
    }),
    tableFields() {
      return [
        { key: 'avatar', label: '' },
        { key: 'fullName', label: this.$t('investors.table.name'), sortable: true },
        { key: 'investorAddress', label: this.$t('investors.table.address') },
        { key: 'copy', label: '' },
        { key: 'voting', label: this.$t('investors.table.voting'), sortable: true },
        { key: 'undelegate', label: '' },
        { key: 'delegate', label: '' },
      ];
    },
    users() {
      const users = [];
      if (this.delegatedToUser) {
        users.push({
          ...this.delegatedToUser,
          voting: this.$tc('meta.wqtCount', this.delegatedToUser.voting),
          callback: this.getInvestors,
        });
      }
      this.investors.forEach((user) => {
        if (!this.delegatedToUser
            || (this.delegatedToUser && user.investorAddress !== this.delegatedToUser?.wallet?.address)) {
          users.push({
            ...user,
            voting: this.$tc('meta.wqtCount', user.voting),
            callback: this.getInvestors,
          });
        }
      });
      return users;
    },
    totalPages() {
      return Math.ceil(this.investorsCount / this.limit);
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
      this.timeout = setTimeout(() => {
        this.getInvestors();
      }, 1000);
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
        this.$store.dispatch('investors/getInvestors', { limit: this.limit, offset: this.offset, q: this.q }),
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
    height: 100%;
  }

  &__table {
    overflow: auto;
    margin-bottom: 15px;
    position: relative;
  }

  &__investors {
    display: none;
  }
}

.body {
  &__title {
    font-weight: 600;
    font-size: 28px;
    line-height: 36px;
    color: $black800;
  }

  &__search {
    margin: 20px 0 20px 0;
    background-color: $white;
    height: 43px;
    border-radius: 6px;
  }
}

@include _1199 {
  .investors {
    &__investors {
      padding-left: 20px;
      padding-right: 20px;
    }
  }
  .body {
    width: 100%;
    min-width: 0;
    max-width: 99vw;

    &__search {
      max-width: 100%;
      min-width: 0;
    }

    &__title {
      margin-left: 20px;
    }
  }
}

@include _991 {
  .investors {
    &__body {
      padding: 0 20px;
    }

    &__table {
      width: calc(100vw - 49px);
    }
  }
}

@include _767 {
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

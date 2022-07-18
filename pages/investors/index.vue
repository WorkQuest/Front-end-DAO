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
      <div class="investors__table-container">
        <base-table
          class="investors__table"
          :fields="tableFields"
          :items="users"
        />
      </div>
      <div class="investors__investors">
        <mobile-table-item
          v-for="(investor, index) in users"
          :key="index"
          :item="investor"
          :is-last="users[index] === users[users.length - 1]"
        />
      </div>
      <base-pager
        v-if="totalPages > 1"
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
import { DelegateMode } from '~/utils/enums';

export default {
  name: 'Investors',
  data() {
    return {
      limit: 20,
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
      this.investors.forEach((user, i) => {
        users.push({
          ...user,
          fullName: this.UserName(user.firstName, user.lastName),
          investorAddress: this.ConvertToBech32('wq', user.investorAddress),
          voting: this.$tc('meta.wqtCount', user.voting),
          callback: this.getInvestors,
          bordered: true,
          _rowVariant: i === 0 ? 'primary' : '',
        });
      });
      return users;
    },
    totalPages() {
      return Math.ceil(this.investorsCount / this.limit);
    },
  },
  watch: {
    async currPage() {
      await this.$store.dispatch('investors/setLastPage', this.currPage);
      await this.getInvestors();
    },
    search() {
      this.q = this.search.trim();
      this.currPage = 1;
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.getInvestors();
      }, 300);
    },
  },
  async beforeMount() {
    if (this.lastPage) this.currPage = this.lastPage;
    await this.$store.dispatch('wallet/checkWalletConnected', { nuxt: this.$nuxt });
  },
  async mounted() {
    if (!this.isWalletConnected) return;
    await Promise.all([
      this.getInvestors(),
      this.$store.dispatch('wallet/getBalance'),
      this.$store.dispatch('wallet/updateFrozenBalance'),
    ]);
  },
  beforeDestroy() {
    clearTimeout(this.timeout);
  },
  methods: {
    openModalUndelegate() {
      this.ShowModal({
        key: modals.undelegate,
        delegateMode: DelegateMode.INVESTORS,
        tokensAmount: this.delegatedToUser.tokensAmount,
        callback: async () => await this.getInvestors(),
      });
    },
    async getInvestors() {
      await Promise.all([
        this.$store.dispatch('investors/getInvestors', { limit: this.limit, offset: (this.currPage - 1) * this.limit, q: this.q }),
        this.$store.dispatch('wallet/getDelegates'),
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
    height: 100%;
  }

  &__table-container {
    overflow: auto;
    margin-bottom: 15px;
    position: relative;
  }

  &__table {
    width: 1180px;
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
      margin-top: 15px;
      margin-left: auto;
      margin-right: auto;
    }
  }
}
</style>

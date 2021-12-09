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
        class="investors__table"
        :fields="historyTableFields"
        :items="historyTableData"
      />
      <div class="investors__investors">
        <item
          v-for="(investor, index) in historyTableData"
          :key="index"
          :item="investor"
          :is-last="historyTableData[index] === historyTableData[historyTableData.length - 1]"
        />
      </div>
      <base-pager
        v-model="pages"
        class="investors__pagination"
        :total-pages="totalPages"
      />
    </div>
  </div>
</template>

<script>

export default {

  data() {
    return {
      search: '',
      pages: 1,
      totalPages: 5,
      historyTableFields: [
        {
          key: 'avatar', label: this.$t('investors.table.name'),
        },
        {
          key: 'name', label: '', sortable: true,
        },
        {
          key: 'investorAddress', label: this.$t('investors.table.address'),
        },
        {
          key: 'copy', label: '',
        },
        {
          key: 'stake', label: this.$t('investors.table.stake'), sortable: true,
        },
        {
          key: 'slots', label: this.$t('investors.table.slots'), sortable: true,
        },
        {
          key: 'voting', label: this.$t('investors.table.voting'), sortable: true,
        },
        {
          key: 'undelegate', label: '',
        },
        {
          key: 'delegate', label: '',
        },
      ],
      historyTableData: [
        {
          avatar: '',
          name: 'user@gmail.com',
          investorAddress: '0xnf8o29837hrvbn42o37hsho3b74thb3',
          stake: '126,613,276',
          slots: '147',
          voting: '127 millions',
          undelegate: 'Undelegate',
          delegate: 'Delegate',
          id: 1,
        },
        {
          avatar: '',
          name: 'Main Node',
          investorAddress: '0xnf8o29837hrvbn42o37hsho3b74thb3',
          stake: '126,613,276',
          slots: '147',
          voting: '127 millions',
          undelegate: 'Undelegate',
          delegate: 'Delegate',
          id: 2,
        },
        {
          avatar: '',
          name: 'Turing',
          investorAddress: '0xnf8o29837hrvbn42o37hsho3b74thb3',
          stake: '126,613,276',
          slots: '147',
          voting: '127 millions',
          undelegate: 'Undelegate',
          delegate: 'Delegate',
          id: 3,

        },
        {
          avatar: '',
          name: 'user@gmail.com',
          investorAddress: '0xnf8o29837hrvbn42o37hsho3b74thb3',
          stake: '126,613,276',
          slots: '147',
          voting: '127 millions',
          undelegate: 'Undelegate',
          delegate: 'Delegate',
          id: 4,
        },
        {
          avatar: '',
          name: 'Spacebot',
          investorAddress: '0xnf8o29837hrvbn42o37hsho3b74thb3',
          stake: '126,613,276',
          slots: '147',
          voting: '127 millions',
          undelegate: 'Undelegate',
          delegate: 'Delegate',
          id: 5,
        },
        {
          avatar: '',
          name: 'user@gmail.com',
          investorAddress: '0xnf8o29837hrvbn42o37hsho3b74thb3',
          stake: '126,613,276',
          slots: '147',
          voting: '127 millions',
          undelegate: 'Undelegate',
          delegate: 'Delegate',
          id: 6,
        },
        {
          avatar: '',
          name: 'user@gmail.com',
          investorAddress: '0xnf8o29837hrvbn42o37hsho3b74thb3',
          stake: '126,613,276',
          slots: '147',
          voting: '127 millions',
          undelegate: 'Undelegate',
          delegate: 'Delegate',
          id: 7,
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
.investors {
  @include main;
  @include text-simple;
  &__body {
    margin: 30px 0 0px 0px;
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

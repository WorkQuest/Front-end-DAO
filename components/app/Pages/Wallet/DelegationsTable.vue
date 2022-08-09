<template>
  <div class="delegations">
    <b-table
      v-if="delegatesCount"
      :fields="fields"
      :items="items"
      show-empty
      borderless
      caption-top
      thead-class="table__header"
      :responsive="true"
      tbody-tr-class="table__row"
    >
      <template #table-caption>
        <span class="delegations__title">Delegation</span>
      </template>
      <template #cell(username)="el">
        <img
          :src="el.item.avatar || $options.images.AVATAR_EMPTY"
          alt=""
          class="avatar"
          @click="openInvestorProfile(el.item.id)"
        >
        <span
          class="table__grey link"
          @click="openInvestorProfile(el.item.id)"
        >
          {{ el.item.username }}
        </span>
      </template>
      <template #cell(address)="el">
        <span>
          {{ CutTxn(el.item.address) }}
          <button-copy :copy-value="el.item.address" />
        </span>
      </template>

      <template #cell(details)="el">
        <div
          class="down-btn"
          @click="el.toggleDetails"
        >
          <span :class="`icon-chevron_${el.item._showDetails ? 'up' : 'down'} down-btn__icon`" />
        </div>
      </template>

      <!--SUB TABLE-->

      <template #row-details="el">
        <b-card class="sub-table">
          <!--HEADER FIELDS-->

          <b-row class="sub-table__header">
            <b-col />
            <b-col
              v-for="(item) of subFields"
              :key="item.key"
            >
              {{ item.label }}
            </b-col>
          </b-row>

          <b-row v-show="!el.item.subCount">
            <empty-data />
          </b-row>

          <!--ITEMS-->

          <b-row
            v-for="(item, i) of el.item.subItems"
            v-show="el.item.subCount > 0"
            :key="i"
            class="mb-2"
          >
            <b-col />
            <b-col>
              <a
                :href="getTxLink(item.hash)"
                target="_blank"
                class="link"
              >
                {{ CutTxn(item.hash) }}
              </a>
            </b-col>
            <b-col>{{ $moment(item.date).format('lll') }}</b-col>
            <b-col>{{ item.type }}</b-col>
            <b-col>{{ item.delegated }}</b-col>
          </b-row>

          <b-row class="sub-table__pager">
            <base-pager
              v-if="getPagesSubCount(el.item.subCount) > 1"
              v-model="el.item.subPage"
              :total-pages="getPagesSubCount(el.item.subCount)"
              @input="getUserHistory(items[el.index].addressHex, el.index)"
            />
          </b-row>
        </b-card>
      </template>
    </b-table>
    <empty-data v-else />

    <base-pager
      v-if="totalPages > 1"
      v-model="page"
      :total-pages="totalPages"
      class="delegations__pager"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import BigNumber from 'bignumber.js';
import { images } from '~/utils/images';
import { ExplorerUrl, Path, TokenSymbols } from '~/utils/enums';

const MAIN_LIMIT = 10;
const SUB_LIMIT = 5;

export default {
  name: 'DelegationsTable',
  images,
  data() {
    return {
      delegates: [],
      delegatesCount: 0,
      page: 1,

      // Main table items
      items: [],

      // For selected user
      votes: [],
      votesCount: 0,
    };
  },
  computed: {
    ...mapGetters({
      userAddress: 'user/getUserWalletAddress',
    }),
    fields() {
      return [
        { key: 'username', label: 'Name', sortable: false },
        { key: 'address', label: 'Address', sortable: false },
        { key: 'votingPower', label: 'Voting power', sortable: false },
        { key: 'delegated', label: 'Delegated', sortable: false },
        { key: 'details', label: 'details', sortable: false },
      ];
    },
    subFields() {
      return [
        { key: 'hash', label: 'Tx Hash' },
        { key: 'date', label: 'Date' },
        { key: 'type', label: 'Type' },
        { key: 'delegated', label: 'Delegated' },
      ];
    },
    columnsStyle() {
      return `grid-template-columns: repeat(${this.fields.length}, 1fr);`;
    },
    totalPages() {
      return Math.ceil(this.delegatesCount / MAIN_LIMIT);
    },
  },
  watch: {
    page(newVal, prevVal) {
      if (newVal !== prevVal) this.loadPage();
    },
  },
  async mounted() {
    await this.loadPage();
  },
  methods: {
    openInvestorProfile(id) {
      this.$router.push(`${Path.INVESTORS}/${id}`);
    },
    getTxLink(hash) {
      return `${ExplorerUrl}/tx/${hash}`;
    },
    getPagesSubCount(count) {
      return Math.ceil(count / SUB_LIMIT);
    },
    updateItems() {
      this.items = this.delegates.map((item, i) => {
        const { delegateeWallet } = item;
        return {
          id: delegateeWallet.user.id,
          avatar: delegateeWallet.user.avatar?.url,
          username: this.UserName(delegateeWallet.user.firstName, delegateeWallet.user.lastName),
          address: delegateeWallet.bech32Address,
          addressHex: delegateeWallet.address,

          _showDetails: false,
          subCount: 0,
          subItems: [],
          subPage: 1,
        };
      });
    },
    async loadPage() {
      const { delegates, count } = await this.$store.dispatch('investors/getHistory', {
        limit: MAIN_LIMIT,
        offset: (this.page - 1) * MAIN_LIMIT,
      });
      this.delegates = delegates;
      this.delegatesCount = count;
      this.updateItems();

      await Promise.all(delegates.map((item, i) => this.getUserHistory(item.addressHex, i)));
    },
    async getUserHistory(delegatee, index) {
      const { votes, count } = await this.$store.dispatch('investors/getVotes', {
        limit: SUB_LIMIT,
        offset: Math.ceil(this.items[index].subPage - 1) * SUB_LIMIT,
        delegatee,
        delegator: this.userAddress,
      });
      this.items[index].subCount = count;
      this.items[index].subItems = votes.map((item) => ({
        hash: item.transactionHash,
        date: item.timestamp,
        type: 'delegate',
        delegated: new BigNumber(item.newBalance).minus(item.previousBalance).shiftedBy(-18).toFixed(4)
          .toString() + TokenSymbols.WQT,
      }));
    },
  },
};

</script>

<style scoped lang="scss">
.delegations {
  &__title {
    background: $white;
    padding: 12px 10px;
    font-size: 16px;
    width: 100%;
    line-height: 130%;
  }

  &__pager {
    margin-top: 1rem;
  }
}

.down-btn {
  width: 43px;
  height: 43px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 6px;
  background: $black0;
  cursor: pointer;
  &__icon {
    font-size: 40px;
    color: $blue;
  }
}

.avatar {
   @include avatar;
   margin-right: 10px;
   cursor: pointer;
}

.sub-table {
  border: none !important;

  &__header {
    margin-left: 0 !important;
    background: $blue100;
    font-size: 12px;
    font-weight: 700;
    width: 100%;
    height: 41px;
    color: $blue;
  }

  &__row {

  }

  &__pager {
    padding: 10px;
    border-bottom: 1px solid $blue100;
  }
}

.link {
  cursor: pointer;
  color: $black800;
  text-decoration: none;
  &:hover {
    color: $blue;
  }
}
</style>

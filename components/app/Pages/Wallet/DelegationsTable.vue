<template>
  <div class="delegations-wrapper">
    <div class="delegations">
      <div class="delegations__title">
        {{ $t('meta.delegations') }}
      </div>
      <b-table
        v-if="delegatesCount"
        :fields="fields"
        :items="items"
        show-empty
        borderless
        thead-class="table__header"
        :responsive="true"
        tbody-tr-class="table__row"
        class="delegations__table"
      >
        <template #cell(username)="el">
          <div class="delegations__user">
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
          </div>
        </template>
        <template #cell(address)="el">
          <span>
            {{ CutTxn(el.item.address, 6, 4) }}
            <button-copy :copy-value="el.item.address" />
          </span>
        </template>
        <template #cell(votingPower)="el">
          <span>{{ el.item.votingPower }} WQT</span>
        </template>
        <template #cell(delegated)="el">
          <span>{{ delegatedToUser?.id === el.item.id ? `${frozenBalance} WQT` : '' }}</span>
        </template>

        <template #cell(actions)="el">
          <div class="delegations__actions">
            <base-btn
              mode="lightBlue"
              @click="handleDelegate(el.index)"
            >
              {{ $t('wallet.addPower') }}
            </base-btn>
            <base-btn
              v-if="delegatedToUser && delegatedToUser.id === el.item.id"
              mode="lightRed"
              @click="handleUndelegate(el.index)"
            >
              {{ $t('modals.undelegate') }}
            </base-btn>
          </div>
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
    </div>
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
import {
  DelegateMode, ExplorerUrl, Path, TokenSymbols,
} from '~/utils/enums';
import modals from '~/store/modals/modals';
import { getStyledAmount } from '~/utils/wallet';

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
    };
  },
  computed: {
    ...mapGetters({
      userAddress: 'user/getUserWalletAddress',
      delegatedToUser: 'investors/getDelegatedToUser',
      frozenBalance: 'user/getFrozenBalance',
    }),
    fields() {
      return [
        { key: 'username', label: this.$t('investors.table.name'), sortable: false },
        { key: 'address', label: this.$t('modals.address'), sortable: false },
        { key: 'votingPower', label: this.$t('investors.table.voting'), sortable: false },
        { key: 'delegated', label: 'Delegated', sortable: false },
        { key: 'actions', label: '', sortable: false },
        { key: 'details', label: '', sortable: false },
      ];
    },
    subFields() {
      return [
        { key: 'hash', label: this.$t('proposal.hashTitle') },
        { key: 'date', label: this.$t('modals.date') },
        { key: 'type', label: this.$t('wallet.table.type') },
        { key: 'delegated', label: this.$t('wallet.table.delegated') },
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
    await this.$store.dispatch('wallet/getDelegates');
    await this.loadPage();
  },
  methods: {
    async handleDelegate(index) {
      this.ShowModal({
        key: modals.delegate,
        delegateMode: DelegateMode.INVESTORS,
        investorAddress: this.items[index].addressHex,
        callback: async () => {
          this.page = 1;
          await Promise.all([
            this.loadPage(),
            this.$store.dispatch('wallet/updateFrozenBalance'),
            this.$store.dispatch('wallet/getDelegates'),
          ]);
        },
      });
    },
    async handleUndelegate(index) {
      this.ShowModal({
        key: modals.undelegate,
        delegateMode: DelegateMode.INVESTORS,
        callback: async () => await Promise.all([
          this.$store.dispatch('wallet/getDelegates'),
          this.$store.dispatch('wallet/updateFrozenBalance'),
        ]),
      });
    },
    openInvestorProfile(id) {
      this.$router.push(`${Path.INVESTORS}/${id}`);
    },
    getTxLink(hash) {
      return `${ExplorerUrl}/tx/${hash}`;
    },
    getPagesSubCount(count) {
      return Math.ceil(count / SUB_LIMIT);
    },
    async updateItems() {
      const addresses = [];
      this.items = this.delegates.map((item) => {
        const { delegateeWallet } = item;
        addresses.push(delegateeWallet.address);
        return {
          id: delegateeWallet.user.id,
          avatar: delegateeWallet.user.avatar?.url,
          username: this.UserName(delegateeWallet.user.firstName, delegateeWallet.user.lastName),
          address: delegateeWallet.bech32Address,
          addressHex: delegateeWallet.address,
          votingPower: 0,

          _showDetails: false,
          subCount: 0,
          subItems: [],
          subPage: 1,
        };
      });
      const votes = await this.$store.dispatch('wallet/getVotesByAddresses', addresses);
      if (votes.ok) {
        votes.result.forEach((item, i) => { this.items[i].votingPower = getStyledAmount(item); });
      }
      await Promise.all(this.items.map((item, i) => this.getUserHistory(item.addressHex, i)));
    },
    async loadPage() {
      const { delegates, count } = await this.$store.dispatch('investors/getHistory', {
        limit: MAIN_LIMIT,
        offset: (this.page - 1) * MAIN_LIMIT,
      });
      this.delegates = delegates;
      this.delegatesCount = count;
      await this.updateItems();
    },
    async getUserHistory(delegatee, index) {
      const { votes, count } = await this.$store.dispatch('investors/getVotes', {
        limit: SUB_LIMIT,
        offset: (this.items[index].subPage - 1) * SUB_LIMIT,
        delegatee,
        delegator: this.userAddress,
      });
      this.items[index].subCount = count;
      this.items[index].subItems = votes.map((item) => ({
        hash: item.transactionHash,
        date: new Date(item.delegateTimestamp * 1000),
        type: item.type === 'delegate' ? this.$t('modals.delegate') : this.$t('modals.undelegate'),
        delegated: `${new BigNumber(item.delegated).shiftedBy(-18).decimalPlaces(4).toString()}  ${TokenSymbols.WQT}`,
      }));
    },
  },
};

</script>

<style scoped lang="scss">
.delegations {
  overflow: auto;
  @include shadow;
  &__table {
    width: 1180px;
  }

  &__title {
    border-top-right-radius: 6px;
    border-top-left-radius: 6px;
    background: $white;
    padding: 12px 10px;
    font-size: 16px;
    width: 100%;
    line-height: 130%;
  }

  &__actions {
    display: grid;
    grid-gap: 10px;
    grid-template-columns: 1fr 1fr;
  }

  &__user {
    display: grid;
    grid-template-columns: 40px 1fr;
    grid-gap: 10px;
    margin-right: 5px;
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
   cursor: pointer;
}

.sub-table {
  border: none !important;

  & > div {
    padding: 0 !important;
  }

  .row {
    margin: 0 0 10px 0 !important;
  }

  &__header {
    margin-left: 0 !important;
    background: $blue100;
    font-size: 12px;
    font-weight: 700;
    width: 100%;
    height: 41px;
    color: $blue;
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
  white-space: nowrap;
  &:hover {
    color: $blue;
  }
}
</style>

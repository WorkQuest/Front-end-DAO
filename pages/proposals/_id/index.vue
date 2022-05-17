<template>
  <div class="proposal">
    <div class="proposal__body">
      <div class="proposal__header-wrapper">
        <div class="proposal__back back">
          <div class="back__container">
            <nuxt-link
              class="back__link"
              to="/proposals"
            >
              <span class="back__icon icon-short_left" />
              {{ $t('proposal.back') }}
            </nuxt-link>
          </div>
        </div>
        <div class="proposal__header">
          {{ $t('proposal.title') }}
        </div>
      </div>
      <div class="proposal__content content">
        <div class="proposal__info info content__column">
          <div class="info__top info__top_blue">
            <span class="info__voting-number">
              {{ `${$t('proposals.voting')} #${card.createdEvent.contractProposalId}` }}
            </span>
            <span
              class="info__status"
              :class="cardsStatusColor(card.status)"
            >{{ getPriority(card.status) }}</span>
          </div>
          <div class="info__header header">
            <div class="header__title">
              <span>{{ card.title }}</span>
            </div>
            <div
              v-if="dateStart && dateEnd"
              class="header__subtitle"
            >
              <span class="header__subtitle-start-date">
                {{ $moment(dateStart).format('lll') }}
              </span>
              <span class="header__subtitle-delimiter">-</span>
              <span class="header__subtitle-end-date">
                {{ $moment(dateEnd).format('lll') }}
              </span>
            </div>
          </div>
          <div class="info__transactions transactions">
            <div class="transactions__hash hash">
              <div class="hash__title">
                {{ $t('proposal.hashTitle') }}
              </div>
              <a
                :href="getHashLink()"
                class="hash__value"
                target="_blank"
              >
                {{ CutTxn(card.createdEvent.transactionHash, 8, 8) }}
              </a>
            </div>
            <div class="transactions__files files">
              <div class="files__title">
                {{ $t('proposal.filesTitle') }}
              </div>
              <base-files
                class="files__container"
                :items="docs"
                :is-show-empty="true"
              />
              <base-images
                :mode="''"
                :items="images"
              />
            </div>
          </div>
          <hr class="info__line">
          <div class="info__description description">
            <div class="description__title">
              {{ $t('proposal.description') }}
            </div>
            <div class="description__value">
              {{ card.description }}
            </div>
          </div>
          <div class="info__forum forum">
            <nuxt-link
              class="forum__link btn"
              :to="card.discussionId ? `/discussions/${card.discussionId}` : '/discussions'"
            >
              <base-btn
                mode="outline"
                class="btn__forum btn__forum_size"
              >
                {{ $t('proposal.toTheForum') }}
              </base-btn>
            </nuxt-link>
          </div>
        </div>
        <div class="proposal__results results content__column">
          <div class="results__header">
            {{ $t('proposal.results') }}
          </div>
          <div class="results__bar bar">
            <div class="bar">
              <div class="bar__result result">
                <div class="result__name">
                  {{ $t('proposal.yes') }}
                </div>
                <div class="result__percent">
                  {{ `${results.percents.yes}%` }}
                </div>
              </div>
              <progress-bar
                :value="results.percents.yes"
                mode="green"
              />
              <div class="bar__votes">
                {{ results.votes.yes }} {{ $t('proposal.votes') }}
              </div>
            </div>
            <div class="bar">
              <div class="bar__result result">
                <div class="result__name">
                  {{ $t('proposal.no') }}
                </div>
                <div class="result__percent">
                  {{ `${results.percents.no}%` }}
                </div>
              </div>
              <progress-bar
                :value="results.percents.no"
                mode="red"
              />
              <div class="bar__votes">
                {{ results.votes.no }} {{ $t('proposal.votes') }}
              </div>
            </div>
          </div>
          <div class="results__buttons buttons">
            <div
              v-if="isActive && !timeIsExpired"
              class="buttons__header"
            >
              {{ $t('proposal.voteForProposal') }}
            </div>
            <base-btn
              v-if="isActive && timeIsExpired && isChairperson"
              class="results__finish"
              @click="executeVoting"
            >
              {{ $t('proposal.executeVoting') }}
            </base-btn>
            <div
              v-else-if="timeIsExpired && isActive && !isChairperson"
              class="results__finish"
            >
              {{ $t('proposal.proposalIsExpired') }}
            </div>
            <div
              v-else-if="!isVoted && !timeIsExpired"
              class="buttons__container"
            >
              <base-btn
                mode="delete"
                class="btn__votes btn__votes_size"
                @click="doVote(false)"
              >
                {{ $t('proposal.no') }}
              </base-btn>
              <base-btn
                mode="approve"
                class="btn__votes btn__votes_size btn__votes_green"
                @click="doVote(true)"
              >
                {{ $t('proposal.yes') }}
              </base-btn>
            </div>
            <base-btn
              v-else-if="isVoted"
              mode="outline"
              class="btn__voted"
              :class="[
                {'btn__voted_green': vote === true },
                {'btn__voted_red': vote === false },
              ]"
            >
              {{ $t('proposal.youVoted') }} {{ vote ? $t('proposal.yes') : $t('proposal.no') }}
            </base-btn>
          </div>
        </div>
      </div>
      <div class="proposal__history history">
        <div class="history__menu menu">
          <div class="menu">
            <base-btn
              mode="light"
              class="btn__sorting"
              @click="isDescending = !isDescending"
            >
              <template v-slot:right>
                <span
                  class="icon icon__sorting"
                  :class="sortingClass"
                />
              </template>
              {{ $t('proposal.ui.addTime') }}
            </base-btn>
            <base-dd
              v-model="ddValue"
              class="btn__dd"
              type="light"
              :items="ddValues"
            />
          </div>
        </div>
        <base-table
          class="history__table"
          :title="$t('proposal.proposalHistory')"
          :fields="historyTableFields"
          :items="historyTableData"
        />
        <base-pager
          v-if="totalPages > 1"
          v-model="currentPage"
          class="history__pagination"
          :total-pages="totalPages"
        />
        <!-- mobile -->
        <div class="history__proposals">
          <p class="history__subtitle">
            {{ $t('proposal.proposalHistory') }}
          </p>
          <mobile-table-item
            v-for="(proposal, index) in historyTableData"
            :key="index"
            :item="proposal"
            :is-last="historyTableData[index] === historyTableData[historyTableData.length - 1]"
          />
          <div
            v-if="!historyTableData.length"
            class="history__empty"
          >
            {{ $t('proposal.table.isEmpty') }}
          </div>
        </div>
        <div class="history__pagination_mobile">
          <base-pager
            v-if="totalPages > 1"
            v-model="currentPage"
            :total-pages="totalPages"
          />
        </div>
        <!-- /mobile -->
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import BigNumber from 'bignumber.js';
import {
  ExplorerUrls, Path, proposalStatuses, TokenSymbols,
} from '~/utils/enums';
import modals from '~/store/modals/modals';
import { WQVoting } from '~/abi/index';
import { getStyledAmount } from '~/utils/wallet';

export default {
  name: 'ProposalInfo',
  data() {
    return {
      isProd: process.env.PROD === 'true',
      idCard: null,
      card: {
        createdEvent: {
          contractProposalId: '',
          transactionHash: '',
          votingPeriod: 0,
        },
        description: '',
        medias: [],
        status: 0,
        title: '',
      },
      documents: [],
      dateStart: '',
      dateEnd: '',
      limit: 10,
      currentPage: 1,
      historyTableData: [],
      historyCount: 0,
      ddValue: 0,
      results: {
        percents: {
          yes: 0,
          no: 0,
        },
        votes: {
          yes: 0,
          no: 0,
        },
      },
      isVoted: false,
      vote: null,
      isDescending: true,
      isActive: true,
    };
  },
  computed: {
    ...mapGetters({
      userWalletAddress: 'user/getUserWalletAddress',
      proposalThreshold: 'proposals/proposalThreshold',
      isWalletConnected: 'wallet/getIsWalletConnected',
      isChairperson: 'proposals/isChairpersonRole',
      cards: 'proposals/cards',
    }),
    docs() {
      if (!this.documents.length) return [];
      return this.documents.filter((item) => item.type === 'doc');
    },
    images() {
      if (!this.documents.length) return [];
      return this.documents.filter((item) => item.type === 'img');
    },
    totalPages() {
      return Math.ceil(this.historyCount / this.limit);
    },
    historyTableFields() {
      return [
        { key: 'number', label: this.$t('proposal.table.number'), sortable: true },
        { key: 'tx_hash', label: this.$t('proposal.table.hash'), sortable: true },
        { key: 'date', label: this.$t('proposal.table.date'), sortable: true },
        { key: 'investorAddress', label: this.$t('proposal.table.address'), sortable: true },
        { key: 'vote', label: this.$t('proposal.table.vote'), sortable: true },
      ];
    },
    ddValues() {
      return [
        this.$t('proposal.ui.all'),
        this.$t('proposal.ui.yes'),
        this.$t('proposal.ui.no'),
      ];
    },
    sortingClass() {
      return [
        { 'icon-Sorting_descending': this.isDescending },
        { 'icon-Sorting_ascending': !this.isDescending },
      ];
    },
    timeIsExpired() {
      return this.$moment().isAfter(this.$moment(this.dateEnd));
    },
  },
  watch: {
    async isDescending() {
      await this.fetchVoting(this.currentPage);
    },
    async currentPage() {
      await this.fetchVoting(this.currentPage);
    },
    async ddValue() {
      await this.fetchVoting(1);
    },
  },
  async beforeMount() {
    await this.$store.dispatch('wallet/checkWalletConnected', { nuxt: this.$nuxt });
  },
  async mounted() {
    if (!this.isWalletConnected) return;
    this.SetLoader(true);
    this.idCard = this.$route.params.id;

    let tempCard = null;
    if (this.cards && this.cards.length) {
      // eslint-disable-next-line no-restricted-syntax
      for (const item of this.cards) {
        if (item.proposalId === this.idCard) {
          tempCard = item;
          break;
        }
      }
    }
    // Not found in store
    if (tempCard === null) {
      const [proposalRes, votingRes] = await Promise.all([
        this.$store.dispatch('proposals/getProposal', { proposalId: this.idCard }),
        this.fetchVoting(this.currentPage),
      ]);
      if (!proposalRes.ok || !votingRes) {
        this.SetLoader(false);
        await this.$router.push(Path.PROPOSALS);
        return;
      }
      tempCard = proposalRes.result;
    }
    this.card = tempCard;
    this.dateStart = new Date(this.card.createdEvent.timestamp * 1000);
    this.dateEnd = new Date((+this.card.createdEvent.timestamp + +this.card.createdEvent.votingPeriod) * 1000);
    let i = 1;
    // eslint-disable-next-line no-restricted-syntax
    for (const media of this.card.medias) {
      const type = media.contentType.split('/')[0] === 'image' ? 'img' : 'doc';
      this.documents.push({
        id: i,
        name: `Document ${i}`,
        type,
        url: media.url,
      });
      if (type === 'doc') i += 1;
    }
    await this.loadCard();

    this.SetLoader(false);
  },
  methods: {
    async fetchVoting(page) {
      const votingRes = await this.$store.dispatch('proposals/getProposalVotes', {
        proposalId: this.idCard,
        params: {
          limit: this.limit,
          offset: (page - 1) * this.limit,
          support: this.ddValue > 0 ? this.ddValue === 1 : null,
          'sort[createdAt]': this.isDescending ? 'desc' : 'asc',
        },
      });
      if (!votingRes.ok) {
        return false;
      }
      this.historyCount = votingRes.result.count;
      this.fillTableData(votingRes.result.votes);
      return true;
    },
    fillTableData(votes) {
      let id = 1;
      const result = [];
      // eslint-disable-next-line no-restricted-syntax
      for (const vote of votes) {
        result.push({
          number: id,
          tx_hash: vote.transactionHash,
          date: new Date(vote.timestamp * 1000),
          investorAddress: vote.voter,
          vote: vote.support,
        });
        id += 1;
      }
      this.historyTableData = result;
    },
    getHashLink() {
      return `${ExplorerUrls[this.isProd ? 'PROD' : 'DEV']}/transactions/${this.card.createdEvent.transactionHash}`;
    },
    async executeVoting() {
      this.SetLoader(true);
      if (!this.isChairperson) return;
      await this.$store.dispatch('proposals/executeVoting', this.card.createdEvent.contractProposalId);
      this.isActive = false;
      await this.loadCard();
      this.SetLoader(false);
    },
    resetDataFromContract() {
      this.results = {
        percents: {
          yes: 0,
          no: 0,
        },
        votes: {
          yes: 0,
          no: 0,
        },
      };
    },
    async loadCard() {
      const [proposalRes] = await Promise.all([
        this.$store.dispatch('proposals/getProposalInfoById', this.card.createdEvent.contractProposalId),
        this.getReceipt(),
        this.$store.dispatch('proposals/isChairpersonRole'), // TODO: remove check chairperson and move logic to admin panel
      ]);
      if (!proposalRes.ok) return;
      const {
        forVotes, againstVotes, active, succeded, defeated,
      } = proposalRes.result;

      if (!succeded && !defeated) {
        this.card.status = 1;
      } else if (defeated || !succeded) {
        this.card.status = 2;
      } else this.card.status = 3;

      const yes = +(new BigNumber(forVotes).shiftedBy(-18));
      const no = +(new BigNumber(againstVotes).shiftedBy(-18));
      this.results.votes.yes = yes;
      this.results.votes.no = no;
      const sumVotes = no + yes;
      if (sumVotes <= 0) {
        this.results.percents.yes = 0;
        this.results.percents.no = 0;
      } else if (!+new BigNumber(no).minus(yes)) {
        this.results.percents.yes = 0;
        this.results.percents.no = 100;
      } else if (!+new BigNumber(yes).minus(no)) {
        this.results.percents.yes = 100;
        this.results.percents.no = 0;
      } else {
        if (yes > 0) {
          this.results.percents.yes = +(new BigNumber((yes * 100) / sumVotes).decimalPlaces(1).toString());
        } else this.results.percents.yes = 0;
        if (no > 0) {
          this.results.percents.no = +(new BigNumber((no * 100) / sumVotes).decimalPlaces(1).toString());
        } else this.results.percents.no = 0;
      }
      this.isActive = active;
    },
    async getReceipt() {
      const res = await this.$store.dispatch('proposals/getReceipt', {
        id: this.card.createdEvent.contractProposalId,
        accountAddress: this.userWalletAddress,
      });
      if (res.ok && res.result) {
        const { hasVoted, support } = res.result;
        this.isVoted = hasVoted;
        this.vote = support;
      }
    },
    cardsStatusColor(idx) {
      const statusClass = {
        [proposalStatuses.PENDING]: 'info__status_pending',
        [proposalStatuses.ACTIVE]: 'info__status_active',
        [proposalStatuses.REJECTED]: 'info__status_rejected',
        [proposalStatuses.ACCEPTED]: 'info__status_accepted',
      };
      return statusClass[idx] || 'None';
    },
    getPriority(index) {
      return {
        [proposalStatuses.PENDING]: this.$t('proposals.cards.status.pending'),
        [proposalStatuses.ACTIVE]: this.$t('proposals.cards.status.active'),
        [proposalStatuses.REJECTED]: this.$t('proposals.cards.status.rejected'),
        [proposalStatuses.ACCEPTED]: this.$t('proposals.cards.status.accepted'),
      }[index] || 'None';
    },
    async doVote(value) {
      const [delegatedRes, voteThreshold] = await Promise.all([
        this.$store.dispatch('proposals/getVotesByAddresses', [this.userWalletAddress]),
        this.$store.dispatch('proposals/getVoteThreshold'),
        this.$store.dispatch('wallet/getBalance'),
      ]);
      const delegated = getStyledAmount(delegatedRes.result[0]);
      if (new BigNumber(delegated).isLessThan(voteThreshold.result)) {
        this.ShowToast(
          this.$tc('proposal.errors.notEnoughFunds', {
            a: +voteThreshold.result,
            b: +delegated,
          },
          this.$t('proposal.errors.voteError')),
        );
        return;
      }

      this.SetLoader(true);
      if (this.$moment().isAfter(this.$moment(this.dateEnd))) {
        this.ShowToast(this.$t('proposal.errors.votingTimeIsExpired'), this.$t('proposal.voteError'));
        this.SetLoader(false);
        return;
      }

      if (!this.isWalletConnected) return;
      const feeRes = await this.$store.dispatch('wallet/getContractFeeData', {
        method: 'doVote',
        abi: WQVoting,
        contractAddress: process.env.WORKNET_VOTING,
        data: [this.card.createdEvent.contractProposalId, value],
      });
      this.SetLoader(false);
      if (!feeRes.ok) return;
      this.ShowModal({
        key: modals.transactionReceipt,
        title: this.$t('proposal.voteForProposal'),
        fields: {
          from: { name: this.$t('modals.fromAddress'), value: this.userWalletAddress },
          to: { name: this.$t('modals.toAddress'), value: process.env.WORKNET_VOTING },
          fee: { name: this.$t('modals.trxFee'), value: feeRes.result.fee, symbol: TokenSymbols.WQT },
        },
        submitMethod: async () => {
          this.SetLoader(true);
          const res = await this.$store.dispatch('proposals/doVote', {
            id: this.card.createdEvent.contractProposalId,
            value,
          });
          if (!res.ok) {
            this.ShowToast(this.$t('proposal.errors.delegatedAfter'), this.$t('proposal.errors.voteError'));
            this.SetLoader(false);
            return;
          }
          await this.fetchVoting(this.currentPage);
          await this.loadCard();
          this.SetLoader(false);
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.proposal {
  @include main;
  @include text-simple;

  &__body {
    margin: 30px 15px 0 15px;
    height: 100%;
  }

  &__info {
    min-width: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__header {
    font-weight: 600;
    font-size: 28px;
    line-height: 36px;
    color: #000000;
    margin: 20px 0;
  }

  &__content {
    display: grid;
    grid-template-columns: 2fr 1fr;
    grid-column-gap: 20px;

  }

  &__results {
    display: grid;
    grid-template-rows: repeat(3, auto);
    height: max-content;
  }

  &__history {
    margin-top: 30px;
  }
}

.back {
  &__container {
    width: 77px;
    height: 24px;
  }

  &__link {
    font-weight: 500;
    font-size: 18px;
    line-height: 130%;
    color: #4C5767;
  }

  &__link:hover {
    text-decoration: none;
  }

  &__icon {
    color: #4C5767;
  }
}

.content {
  &__column {
    padding: 20px;
    background: #FFFFFF;
    border-radius: 6px;
  }
}

.info {
  &__top {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;

    &_blue {
      font-size: 14px;
      line-height: 130%;
      color: $blue;
    }
  }

  &__status {
    display: flex;
    align-items: center;
    padding: 0 4px;
    height: 24px;
    font-size: 12px;
    border-radius: 3px;

    &_pending {
      background-color: #f6f8fa;
      color: #AAB0B9;
    }

    &_active {
      background-color: #f6f8fa;
      color: $blue;
    }

    &_rejected {
      background-color: #fcebeb;
      color: $red;
    }

    &_accepted {
      background-color: #f6f8fa;
      color: $green;
    }

    &_disabled {
      display: none;
    }
  }

  &__transactions {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-top: 20px;
  }

  &__line {
    background: #E9EDF2;
    margin: 20px 0;
  }

  &__forum {
    margin-top: 20px;
  }
}

.forum {
  &__link {
    text-decoration: none;
  }
}

.header {
  &__title {
    min-width: 0;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    font-weight: 600;
    font-size: 24px;
    line-height: 32px;
  }

  &__subtitle {
    font-weight: normal;
    font-size: 14px;
    line-height: 130%;
    color: #AAB0B9;
    margin-top: 10px;
  }
}

.transactions {

  &__hash {
    display: grid;
    grid-template-rows: max-content 1fr;
    grid-row-gap: 10px;
  }

  &__files {
    display: grid;
    grid-template-rows: max-content 1fr;
  }
}

.hash {

  &__title {
    font-weight: 600;
    font-size: 18px;
    line-height: 130%;
    color: #1D2127;
  }

  &__value {
    font-weight: normal;
    font-size: 14px;
    color: #0083C7;
    line-height: 33px;

    &:hover {
      text-decoration: none;
    }
  }
}

.files {

  &__title {
    font-weight: 600;
    font-size: 18px;
    line-height: 130%;
    color: #1D2127;
  }
}

.description {
  &__title {
    font-weight: 600;
    font-size: 18px;
    line-height: 130%;
    color: #1D2127;
    margin: 10px 0;
  }

  &__value {
    font-weight: normal;
    font-size: 16px;
    line-height: 130%;
    color: #7C838D;
    margin: 10px 0;
    min-width: 0;
    word-break: break-all;
    white-space: normal;
  }
}

.results {
  &__header {
    font-size: 16px;
    line-height: 130%;
    color: #1D2127;
    margin-bottom: 15px;
  }

  &__finish {
    margin-bottom: 15px;
  }
}

.bar {
  &__result {
    font-size: 16px;
    line-height: 130%;
    display: flex;
    justify-content: space-between;
    margin-bottom: 7px;
  }

  &__line {
    border-radius: 4px;
    height: 6px;
    width: 100%;
    margin-bottom: 7px;

    &_gray {
      @extend .bar__line;
      background: #E9EDF2;
    }

    &_green {
      @extend .bar__line;
      background: #00AA5B;
    }

    &_red {
      @extend .bar__line;
      background: #DF3333;
    }
  }

  &__votes {
    font-size: 14px;
    line-height: 130%;
    color: #AAB0B9;
  }
}

.result {
  &__name {
    width: 100%;
    color: #353C47;
  }

  &__percent {
    width: 29px;
    color: #7C838D;
    margin-right: 10px;
  }
}

.buttons {
  margin-top: 15px;

  &__header {
    font-size: 18px;
    line-height: 130%;
    color: #000000;
    margin-bottom: 20px;
  }

  &__container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 20px;
  }
}

.history {
  &__table {
    position: relative;
    margin-top: 15px;
  }

  &__proposals {
    display: none;
  }

  &__empty {
    text-align: center;
  }

  &__pagination {
    margin-top: 20px;

    &_mobile {
      display: none;
      margin-top: 20px;
    }
  }
}

.menu {
  display: flex;
}

.btn {
  &__forum {
    &:hover {
      background: rgba(0, 131, 199, 0.1);
    }

    &_size {
      width: 220px;
      height: 43px;
    }
  }

  &__download {
    margin-left: 8px;
    margin-top: 2px;
    cursor: pointer;
    color: #F7F8FA;
  }

  &__delete {
    cursor: pointer;
    height: 9px;
  }

  &__votes {
    &_size {
      height: 43px;
    }

    &_green {
      &:hover {
        color: #F7F8FA;
        background: #019a53;
      }
    }
  }

  &__voted {
    &_green {
      color: #00AA5B;
      border-color: rgba(0, 170, 91, 0.1) !important;

      &:hover {
        color: #00AA5B;
        background: rgba(0, 170, 91, 0.1);
      }
    }

    &_red {
      color: #DF3333;
      border-color: rgba(223, 51, 51, 0.1) !important;

      &:hover {
        color: #DF3333;
        background: rgba(223, 51, 51, 0.1);
      }
    }
  }

  &__sorting {
    width: 152px;
    border: 1px solid rgba(0, 0, 0, 0);

    &:hover {
      background: #FFFFFF;
      border: 1px solid rgba(0, 0, 0, 0.1);
    }
  }
}

.icon {
  &__sorting {
    color: #000000;
  }
}

.dd {
  margin-left: 15px;
  color: #8D96A2;
  border: 1px solid rgba(0, 0, 0, 0);
  min-width: 140px;
}

@include _1300 {
  .proposal {
    &__content {
      display: flex;
      flex-direction: column;
      margin-right: 30px;
    }

    &__history {
      margin-right: 30px;
    }
  }
}

@include _991 {
  .content {
    grid-template-columns: 1fr;
    grid-row-gap: 20px;
  }
}

@include _767 {
  .item {
    display: flex;
    flex-direction: column;
  }
  .info__forum {
    display: flex;
    justify-content: center;
  }
  .proposal {
    &__header {
      &-wrapper {
        display: grid;
        padding: 20px;
      }
    }

    &__back, &__header {
      margin: 0;
    }

    &__content {
      margin-right: 10px;
    }

    &__history {
      margin-right: 10px;
    }

    &__body {
      margin: 22px 5px;
      @include mobile-container;
    }
  }
  .content {
    &__column {
      @include mobile-container;
    }
  }
  .history {

    &__table {
      display: none;
    }

    &__pagination {
      display: none;

      &_mobile {
        display: block;
      }
    }

    &__proposals {
      display: flex;
      flex-direction: column;
      background: $white;
      padding: 20px 15px;
      margin-top: 15px;
      border-radius: 6px;
    }

    &__subtitle {
      font-size: 20px;
    }
  }
  .info {
    &__transactions {
      grid-gap: 60px;
      margin-top: 20px;
    }
  }
}

@include _480 {
  .proposal {
    &__body {
      margin: 22px 0 0 0;
    }
  }
  .forum {
    &__link {
      padding: 0;
    }
  }
  .info {
    &__transactions {
      grid-gap: 10px;
      grid-template-columns: 1fr;
    }
  }
}

@include _380 {
  .header__subtitle {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    word-wrap: inherit;
    gap: 5px;

    &-delimiter {
      display: none;
    }
  }
}
</style>

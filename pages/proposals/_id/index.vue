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
            <span>{{ `Voting #${idCard}` }}</span>
            <span
              class="info__status"
              :class="cardsStatusColor(status)"
            >{{ getPriority(status) }}</span>
          </div>
          <div class="info__header header">
            <div class="header__title">
              <span>{{ title }}</span>
            </div>
            <div class="header__subtitle">
              <span v-if="dateStart && dateEnd">{{ $moment(dateStart).format('lll') }} - {{ $moment(dateEnd).format('lll') }}</span>
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
                {{ hash.length ? modifyHash(hash) : '...' }}
              </a>
            </div>
            <div class="transactions__files files">
              <div class="files__title">
                {{ $t('proposal.filesTitle') }}
              </div>
              <base-files
                class="files__container"
                :items="documents"
                :is-show-empty="true"
              />
            </div>
          </div>
          <hr class="info__line">
          <div class="info__description description">
            <div class="description__title">
              {{ $t('proposal.description') }}
            </div>
            <div class="description__value">
              {{ description }}
            </div>
          </div>
          <div class="info__forum forum">
            <nuxt-link
              class="forum__link btn"
              to="/discussions"
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
              <div class="bar__line">
                <div class="bar__line_gray">
                  <div
                    class="bar__line_green"
                    :style="`width: ${results.percents.yes}%`"
                  />
                </div>
              </div>
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
              <div class="bar__line">
                <div class="bar__line_gray">
                  <div
                    class="bar__line_red"
                    :style="`width: ${results.percents.no}%`"
                  />
                </div>
              </div>
              <div class="bar__votes">
                {{ results.votes.no }} {{ $t('proposal.votes') }}
              </div>
            </div>
          </div>
          <div class="results__buttons buttons">
            <div class="buttons__header">
              {{ $t('proposal.results') }}
            </div>
            <base-btn
              v-if="!isActive && isChairperson"
              class="results__finish"
              @click="executeVoting"
            >
              {{ $t('proposal.executeVoting') }}
            </base-btn>
            <div
              v-if="!isVoted && timeIsExpired && !isChairperson"
              class="results__finish"
            >
              {{ $t('proposal.proposalIsExpired') }}
            </div>
            <div
              v-else-if="!isVoted"
              class="buttons__container"
            >
              <base-btn
                mode="delete"
                class="btn__votes btn__votes_size"
                @click="toDelegate(false)"
              >
                {{ $t('proposal.no') }}
              </base-btn>
              <base-btn
                mode="approve"
                class="btn__votes btn__votes_size btn__votes_green"
                @click="toDelegate(true)"
              >
                {{ $t('proposal.yes') }}
              </base-btn>
            </div>
            <base-btn
              v-else
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
          :items="prepareTableData(historyTableData)"
        />
        <div
          v-if="!historyTableData.length"
          class="history__table history__empty"
        >
          {{ $t('proposal.table.isEmpty') }}
        </div>
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
        <!-- /mobile -->
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import BigNumber from 'bignumber.js';
import { proposalStatuses, Chains } from '~/utils/enums';
import modals from '~/store/modals/modals';

export default {
  data() {
    return {
      historyTableFields: [
        {
          key: 'number', label: this.$t('proposal.table.number'), sortable: true,
        },
        {
          key: 'hash', label: this.$t('proposal.table.hash'), sortable: true,
        },
        {
          key: 'date', label: this.$t('proposal.table.date'), sortable: true,
        },
        {
          key: 'address', label: this.$t('proposal.table.address'), sortable: true,
        },
        {
          key: 'vote', label: this.$t('proposal.table.vote'), sortable: true,
        },
      ],
      historyTableData: [
        // {
        //   number: '1',
        //   hash: '11400714819323198485',
        //   date: moment('20210615', 'YYYYMMDD').format('ll'),
        //   address: '18vk40cc3er48fzs5ghqzxy88uqs6a3lsus8cz9',
        //   vote: true,
        // },
        // {
        //   number: '4',
        //   hash: '11400714819323198485',
        //   date: moment('20210520', 'YYYYMMDD').format('ll'),
        //   address: '18vk40cc3er48fzs5ghqzxy88uqs6a3lsus8cz9',
        //   vote: false,
        // },
      ],
      idCard: null,
      status: 0,
      dateStart: '',
      dateEnd: '',
      title: '',
      ddValue: 0,
      documents: [],
      hash: '',
      description: null,
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
      isFirstLoading: true,
    };
  },
  computed: {
    ...mapGetters({
      isConnected: 'web3/getWalletIsConnected',
      isChairperson: 'web3/isChairpersonRole',
      cards: 'proposals/cards',
    }),
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
    async isConnected(newVal) {
      if (this.isFirstLoading) return;
      if (!newVal) {
        this.resetDataFromContract();
        return;
      }
      this.SetLoader(true);
      await this.loadCard();
      this.SetLoader(false);
    },
  },
  async mounted() {
    this.SetLoader(true);
    this.idCard = +this.$route.params.id;

    const resp = await this.$store.dispatch('proposals/getProposal', this.idCard);
    console.log(resp);
    if (resp.ok === false) {
      await this.$router.push('/proposals');
      return;
    }

    await this.$store.dispatch('web3/checkMetamaskStatus', Chains.ETHEREUM);
    if (this.isConnected) {
      await this.loadCard();
    }

    let card = null;
    let voteData = null;

    const { result } = resp;
    card = result.proposal;
    voteData = result.vote;

    this.status = card.status;
    this.title = card.title;
    this.description = card.description;
    this.hash = card.txHash;
    this.dateStart = new Date(card.timestamp * 1000);
    this.dateEnd = new Date((card.timestamp + card.votingPeriod) * 1000);
    let i = 1;
    // eslint-disable-next-line no-restricted-syntax
    for (const media of card.medias) {
      this.documents.push({
        id: i,
        name: `Document ${i}`,
        type: 'doc',
        downloadUrl: media.url,
      });
      i += 1;
    }
    // eslint-disable-next-line no-restricted-syntax
    for (const vote of voteData.voting) {
      this.historyTableData.push({
        ...vote,
      });
    }
    this.isFirstLoading = false;
    this.SetLoader(false);
  },
  methods: {
    getHashLink() {
      if (!this.hash) return '';
      return process.env.PROD === 'true'
        ? `https://rinkeby.etherscan.io/tx/${this.hash}` : `https://rinkeby.etherscan.io/tx/${this.hash}`;
    },
    async checkRole() { // TODO: remove check chairperson and move logic to admin panel
      await this.$store.dispatch('web3/isChairpersonRole');
    },
    async executeVoting() {
      this.SetLoader(true);
      if (!this.isChairperson) return;
      const res = await this.$store.dispatch('web3/executeVoting', this.idCard);
      await this.loadCard();
      this.SetLoader(false);
    },
    resetDataFromContract() {
      console.log('Clear data');
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
        this.$store.dispatch('web3/getProposalInfoById', this.idCard),
        this.getReceipt(),
        this.checkRole(),
      ]);
      if (!proposalRes.ok) return;
      const { result } = proposalRes.result;
      console.log(result);
      const {
        forVotes, againstVotes, active, defeated, succeded,
      } = result;
      const yes = +(new BigNumber(forVotes).shiftedBy(-18));
      const no = +(new BigNumber(againstVotes).shiftedBy(-18));
      this.results.votes.yes = yes;
      this.results.votes.no = no;
      const sumVotes = no + yes;
      if (sumVotes <= 0) {
        this.results.percents.yes = 0;
        this.results.percents.no = 0;
      } else if (no - yes === no) {
        this.results.percents.yes = 0;
        this.results.percents.no = 100;
      } else if (yes - no === yes) {
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
      if (active) {
        this.status = 0;
      } else if (defeated) {
        this.status = 3;
      } else {
        this.status = succeded ? 2 : 1;
      }
    },
    async getReceipt() {
      const { address } = await this.$store.dispatch('web3/getAccount');
      const res = await this.$store.dispatch('web3/getReceipt', { id: this.idCard, accountAddress: address });
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
      const priority = {
        [proposalStatuses.PENDING]: this.$t('proposals.cards.status.pending'),
        [proposalStatuses.ACTIVE]: this.$t('proposals.cards.status.active'),
        [proposalStatuses.REJECTED]: this.$t('proposals.cards.status.rejected'),
        [proposalStatuses.ACCEPTED]: this.$t('proposals.cards.status.accepted'),
      };
      return priority[index] || 'None';
    },
    modifyHash(hash) {
      return `${hash.substr(0, 6)}...${hash.substr(hash.length - 6, 6)}`;
    },
    prepareTableData(data) {
      const newData = [];
      data.forEach((item) => {
        const itemModel = item;
        itemModel.hash = this.modifyHash(item.hash);
        newData.push(itemModel);
      });
      switch (this.ddValue) {
        case 0:
          return newData.filter((item) => item.vote);
        case 1:
          return newData.filter((item) => !item.vote);
        default:
          return newData;
      }
    },
    async toDelegate(value) {
      await this.$store.dispatch('web3/checkMetamaskStatus', Chains.ETHEREUM);
      if (!this.isConnected) return;

      const account = await this.$store.dispatch('web3/getAccount');
      const [delegated, voteThreshold] = await Promise.all([
        this.$store.dispatch('web3/getVotes', account.address),
        this.$store.dispatch('web3/getVoteThreshold'),
      ]);
      console.log(+delegated.result, +voteThreshold.result);
      if (+delegated.result < +voteThreshold.result) {
        await this.$store.dispatch('main/showToast', {
          title: this.$t('proposal.errors.voteError'),
          text: this.$tc('proposal.errors.notEnoughFunds', { a: voteThreshold.result, b: delegated.result }),
        });
        await this.$store.dispatch('modals/show', {
          key: modals.delegate,
          investorAddress: account.address,
          min: +voteThreshold.result,
          callback: async () => this.onVote(value),
        });
      } else {
        await this.onVote(value);
      }
    },
    async onVote(value) {
      this.SetLoader(true);
      if (this.timeIsExpired || this.$moment().isAfter(this.$moment(this.endTime))) { // todo: check can remove 2q?
        await this.$store.dispatch('main/showToast', {
          title: this.$t('proposal.voteError'),
          text: this.$t('proposal.errors.votingTimeIsExpired'),
        });
        this.SetLoader(false);
        return;
      }
      await this.$store.dispatch('web3/checkMetamaskStatus', Chains.ETHEREUM);
      if (!this.isConnected) return;
      const res = await this.$store.dispatch('web3/doVote', { id: this.idCard, value });
      if (!res.ok) {
        this.SetLoader(false);
        return;
      }
      await this.loadCard();
      this.SetLoader(false);
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
    max-width: 1180px;
    height: 100%;
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
      color: #0083C7;
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
    &_accepted{
      background-color: #f6f8fa;
      color: $green;
    }

    &_disabled {
      display: none;
    }
  }

  &__transactions {
    display: grid;
    grid-template-columns: max-content auto;
    grid-gap: 80px;
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
  margin-bottom: 15px;

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
@include _991 {
  .content {
    grid-template-columns: 1fr;
    grid-row-gap: 20px;
  }
}
@include _767 {
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
    &__proposals {
      display: block;
      background: $white;
      padding: 20px 15px;
      margin-top: 15px;
      border-radius: 6px;
    }
    &__subtitle {
      font-size: 20px;
    }
  }
  .info{
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
  .info{
    &__transactions {
      grid-gap: 10px;
      grid-template-columns: 1fr;
    }
  }
}
</style>

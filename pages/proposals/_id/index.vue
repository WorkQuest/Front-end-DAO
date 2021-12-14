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
            <span>{{ `Voting #${voting}` }}</span>
            <span
              class="info__status"
              :class="cardsStatusColor(status)"
            >{{ getPriority(status) }}</span>
          </div>
          <div class="info__header header">
            <div class="header__title">
              <span>{{ about }}</span>
            </div>
            <div class="header__subtitle">
              <span>{{ date }}</span>
            </div>
          </div>
          <div class="info__transactions transactions">
            <div class="transactions__hash hash">
              <div class="hash__title">
                {{ $t('proposal.hashTitle') }}
              </div>
              <nuxt-link
                to="/proposals/1"
                class="hash__value"
              >
                {{ hash.length ? modifyHash(hash) : '...' }}
              </nuxt-link>
            </div>
            <div class="transactions__files files">
              <div class="files__title">
                {{ $t('proposal.filesTitle') }}
              </div>
              <base-uploader
                class="files__container"
                type="files"
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
              {{ descriptionValue }}
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
              {{ $t('proposal.voteForProposal') }}
            </div>
            <div
              v-if="!results.isVoted"
              class="buttons__container"
            >
              <base-btn
                mode="delete"
                class="btn__votes btn__votes_size"
                @click="onVote('NO')"
              >
                {{ $t('proposal.no') }}
              </base-btn>
              <base-btn
                mode="approve"
                class="btn__votes btn__votes_size btn__votes_green"
                @click="onVote('YES')"
              >
                {{ $t('proposal.yes') }}
              </base-btn>
            </div>
            <div
              v-else
            >
              <base-btn
                mode="outline"
                class="btn__voted"
                :class="[
                  {'btn__voted_green': results.vote === 'YES' },
                  {'btn__voted_red': results.vote === 'NO' },
                ]"
              >
                {{ $t('proposal.youVoted') }} {{ results.vote === 'YES' ? $t('proposal.yes') : $t('proposal.no') }}
              </base-btn>
            </div>
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
        <div class="history__proposals">
          <p class="history__subtitle">
            {{ $t('proposal.proposalHistory') }}
          </p>
          <item
            v-for="(proposal, index) in historyTableData"
            :key="index"
            :item="proposal"
            :is-last="historyTableData[index] === historyTableData[historyTableData.length - 1]"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';

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
        {
          number: '1',
          hash: '11400714819323198485',
          date: moment('20210615', 'YYYYMMDD').format('ll'),
          address: '18vk40cc3er48fzs5ghqzxy88uqs6a3lsus8cz9',
          vote: 'YES',
        },
        {
          number: '2',
          hash: '11400714819323198485',
          date: moment('20210720', 'YYYYMMDD').format('ll'),
          address: '18vk40cc3er48fzs5ghqzxy88uqs6a3lsus8cz9',
          vote: 'YES',
        },
        {
          number: '3',
          hash: '11400714819323198485',
          date: moment('20210617', 'YYYYMMDD').format('ll'),
          address: '18vk40cc3er48fzs5ghqzxy88uqs6a3lsus8cz9',
          vote: 'NO',
        },
        {
          number: '4',
          hash: '11400714819323198485',
          date: moment('20210520', 'YYYYMMDD').format('ll'),
          address: '18vk40cc3er48fzs5ghqzxy88uqs6a3lsus8cz9',
          vote: 'NO',
        },
      ],
      idCard: '',
      voting: '',
      status: '',
      date: '',
      about: '',
      ddValues: [
        this.$t('proposal.ui.yes'),
        this.$t('proposal.ui.no'),
        this.$t('proposal.ui.allProposals'),
      ],
      ddValue: 2,
      documents0: [],
      documents: [
        {
          id: '1',
          type: 'doc',
          name: 'some_document1.pdf',
          size: '1.2mb',
          img: 'https://static6.depositphotos.com/1029473/605/i/600/depositphotos_6058054-stock-photo-abstract-3d-image.jpg',
        }, {
          id: '2',
          type: 'doc',
          name: 'some_doc2.pdf',
          size: '1.5mb',
          img: 'https://static6.depositphotos.com/1029473/605/i/600/depositphotos_6058054-stock-photo-abstract-3d-image.jpg',
        }, {
          id: '3',
          type: 'doc',
          name: 'some_doc2.pdf',
          size: '1.5mb',
          img: 'https://static6.depositphotos.com/1029473/605/i/600/depositphotos_6058054-stock-photo-abstract-3d-image.jpg',
        }, {
          id: '4',
          type: 'img',
          name: 'some_doc2.pdf',
          size: '1.5mb',
          img: 'https://static6.depositphotos.com/1029473/605/i/600/depositphotos_6058054-stock-photo-abstract-3d-image.jpg',
        }, {
          id: '5',
          type: 'img',
          name: 'some_doc2.pdf',
          size: '1.5mb',
          img: 'https://static6.depositphotos.com/1029473/605/i/600/depositphotos_6058054-stock-photo-abstract-3d-image.jpg',
        }, {
          id: '6',
          type: 'img',
          name: 'some_doc2.pdf',
          size: '1.5mb',
          img: 'https://static6.depositphotos.com/1029473/605/i/600/depositphotos_6058054-stock-photo-abstract-3d-image.jpg',
        }, {
          id: '7',
          type: 'img',
          name: 'some_doc2.pdf',
          size: '1.5mb',
          img: 'https://static6.depositphotos.com/1029473/605/i/600/depositphotos_6058054-stock-photo-abstract-3d-image.jpg',
        },
      ],
      hash: '11400714819323198485',
      descriptionValue: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid animi, ea exercitationem fugit incidunt nesciunt nisi non officiis optio quaerat rem similique suscipit. Ab ad asperiores, commodi consequatur cum delectus distinctio eaque fugiat impedit iste laborum laudantium maxime nam odio perspiciatis quibusdam quisquam ratione sequi suscipit ullam vel veritatis voluptate.',
      results: {
        percents: {
          yes: '65',
          no: '35',
        },
        votes: {
          yes: 10,
          no: 2,
        },
        isVoted: false,
        vote: 'YES',
      },
      cards: [
        {
          voting: 1,
          status: 0,
          date: `${moment('20210520', 'YYYYMMDD').format('ll')} - ${moment().format('ll')}`,
          about: 'Lorem ipsum dolor sit amet, consectetur',
        },
        {
          voting: 1,
          status: 1,
          date: `${moment('20210520', 'YYYYMMDD').format('ll')} - ${moment().format('ll')}`,
          about: 'Lorem ipsum dolor sit amet, consectetur',
        },
        {
          voting: 1,
          status: 2,
          date: `${moment('20210520', 'YYYYMMDD').format('ll')} - ${moment().format('ll')}`,
          about: 'Lorem ipsum dolor sit amet, consectetur',
        },
      ],
      isDescending: true,
    };
  },
  computed: {
    sortingClass() {
      return [
        { 'icon-Sorting_descending': this.isDescending },
        { 'icon-Sorting_ascending': !this.isDescending },
      ];
    },
  },
  mounted() {
    const URLString = document.URL;
    this.idCard = parseInt(URLString.split('/').slice(-1)[0], 10);
    const card = this.cards[this.idCard - 1];
    this.voting = card.voting;
    this.status = card.status;
    this.date = card.date;
    this.about = card.about;
  },
  methods: {
    cardsStatusColor(idx) {
      const statusClass = {
        0: 'info__status_pending',
        1: 'info__status_rejected',
        2: 'info__status_accepted',
      };
      return statusClass[idx] || 'None';
    },
    getPriority(index) {
      const priority = {
        0: this.$t('proposals.cards.status.pending'),
        1: this.$t('proposals.cards.status.rejected'),
        2: this.$t('proposals.cards.status.accepted'),
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
          return newData.filter((item) => item.vote === 'YES');
        case 1:
          return newData.filter((item) => item.vote === 'NO');
        default:
          return newData;
      }
    },
    onVote(value) {
      this.results.isVoted = true;
      this.results.vote = value;
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

    &_rejected {
      background-color: #fcebeb;
      color: #DF3333;
    }

    &_accepted {
      background-color: #f6f8fa;
      color: #22CC14;
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

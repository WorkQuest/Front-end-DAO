<template>
  <div class="proposal">
    <div class="proposal__body">
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
      <div class="proposal__content content">
        <div class="content__grid">
          <div class="proposal__info info content__column">
            <div class="info__top">
              <div class="info__top_left">
                <span>{{ `Voting #${voting}` }}</span>
              </div>
              <div class="info__top_right">
                <div class="info__status">
                  <span
                    class="info__status"
                    :class="cardsStatusColor(status)"
                  >{{ getPriority(status) }}</span>
                </div>
              </div>
            </div>
            <div class="info__header header">
              <div class="header__title">
                <span>{{ about }}</span>
              </div>
              <div class="header__subtitle">
                <span>{{ date }}</span>
              </div>
            </div>
            <div class="info__components components">
              <div class="components__hash hash">
                <div class="hash__title">
                  {{ $t('proposal.hashTitle') }}
                </div>
                <div
                  class="hash__value"
                  :class="{'hash__value_33height' : documents.length}"
                >
                  {{ hash.length ? modifyHash(hash) : '...' }}
                </div>
              </div>
              <div class="components__files files">
                <div class="files__title">
                  {{ $t('proposal.filesTitle') }}
                </div>
                <div class="files__container">
                  <template v-if="documents.length">
                    <div
                      v-for="doc in documents"
                      :key="doc.id"
                      class="file"
                    >
                      <div class="file__icon">
                        <img
                          src="~/assets/img/ui/pdf.svg"
                          alt=""
                        >
                      </div>
                      <div class="file__name">
                        {{ doc.name }}
                      </div>
                      <div class="file__size">
                        {{ doc.size }}
                      </div>
                      <div class="file__close">
                        <span>
                          <img
                            class="btn__delete"
                            src="~/assets/img/ui/close.svg"
                            alt=""
                          >
                        </span>
                      </div>
                    </div>
                  </template>
                  <template v-else>
                    <div class="files__noFiles">
                      {{ $t('proposal.noFiles') }}
                      <span class="btn__download">
                        <img
                          src="~/assets/img/ui/download.svg"
                          alt=""
                        >
                      </span>
                    </div>
                  </template>
                </div>
              </div>
            </div>
            <hr class="line">
            <div class="info__description description">
              <div class="description__title">
                {{ $t('proposal.description') }}
              </div>
              <div class="description__value">
                {{ descriptionValue }}
              </div>
            </div>
            <div class="info__toForum">
              <nuxt-link
                class="btn__link"
                to="proposals/1"
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
            <div>
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
                    v-on:click="onVote('NO')"
                >
                  {{ $t('proposal.no') }}
                </base-btn>
                <base-btn
                    mode="approve"
                  class="btn__votes btn__votes_size btn__votes_green"
                    v-on:click="onVote('YES')"
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
                  {{ $t('proposal.youVoted') }} {{ results.vote === 'YES' ? $t('proposal.yes') :  $t('proposal.no')}}
                </base-btn>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="proposal__history history">
        <div class="history__menu menu">
          <div class="menu__left">
            <base-btn
              mode="light"
              class="btn__sorting"
            >
              <template v-slot:right>
                <span class="icon-Sorting_descending" />
              </template>
              {{ $t('proposal.ui.addTime') }}
            </base-btn>
            <baseDD
                type="light"
              :items="ddValues"
              :v-model="ddValue"
            />
          </div>
        </div>
        <div class="history__content">
          <history-table
              class="table"
              :title="$t('proposal.proposalHistory')"
              :fields="historyTableFields"
              :items="prepareTableData(historyTableData)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import baseDD from '~/components/ui/BaseDD';
import historyTable from '~/components/ui/BaseTable';

export default {
  components: {
    baseDD,
    historyTable,
  },
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
          date: 'Jan 01, 2021',
          address: '18vk40cc3er48fzs5ghqzxy88uqs6a3lsus8cz9',
          vote: 'YES',
        },
        {
          number: '2',
          hash: '11400714819323198485',
          date: 'Jan 01, 2021',
          address: '18vk40cc3er48fzs5ghqzxy88uqs6a3lsus8cz9',
          vote: 'YES',
        },
        {
          number: '3',
          hash: '11400714819323198485',
          date: 'Jan 01, 2021',
          address: '18vk40cc3er48fzs5ghqzxy88uqs6a3lsus8cz9',
          vote: 'NO',
        },
        {
          number: '4',
          hash: '11400714819323198485',
          date: 'Jan 01, 2021',
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
      ddValue: '',
      documents0: [],
      documents: [
        {
          id: '1',
          type: 'pdf',
          name: 'some_document1.pdf',
          size: '1.2mb',
        },
        {
          id: '2',
          type: 'pdf',
          name: 'some_document2.pdf',
          size: '1.5mb',
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
          date: 'Jan 01, 2021 - Mar 01, 2021',
          about: 'Lorem ipsum dolor sit amet, consectetur',
        },
        {
          voting: 1,
          status: 1,
          date: 'Jan 01, 2021 - Mar 01, 2021',
          about: 'Lorem ipsum dolor sit amet, consectetur',
        },
        {
          voting: 1,
          status: 2,
          date: 'Jan 01, 2021 - Mar 01, 2021',
          about: 'Lorem ipsum dolor sit amet, consectetur',
        },
      ],
    };
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
      return newData;
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
    margin-top: 30px;
    max-width: 1180px;
    height: 100%;
  }

  &__back {
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
  }

  &__header {
    font-weight: 600;
    font-size: 28px;
    line-height: 36px;
    color: #000000;
    margin: 20px 0;
  }

  &__content {
    .content {
      &__grid {
        display: grid;
        grid-template-columns: 2fr 1fr;
        grid-column-gap: 20px;
      }

      &__column {
        padding: 20px;
        background: #FFFFFF;
        border-radius: 6px;
      }
    }
  }

  &__info {
    .info {
      &__top {
        display: flex;
        justify-content: space-between;
        margin-bottom: 15px;

        &_left {
          font-size: 14px;
          line-height: 130%;
          color: #0083C7;
        }
      }

      &__status {
        font-size: 12px;
        justify-content: flex-start;
        align-items: center;
        height: 24px;
        display: flex;
        padding: 0 4px;
        align-items: center;
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

      &__header {
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
      }

      &__components {
        display: grid;
        grid-template-columns: max-content auto;
        grid-gap: 80px;
        margin-top: 20px;

        .components {
          @extend .info__components;

          &__hash {
            display: grid;
            grid-template-rows: max-content 1fr;
            grid-row-gap: 10px;

            .hash {
              @extend .components__hash;

              &__title {
                font-weight: 600;
                font-size: 18px;
                line-height: 130%;
                color: #1D2127;
              }

              &__value {
                font-weight: normal;
                font-size: 14px;
                line-height: 130%;
                color: #0083C7;
                //margin-top: 10px;
                &_33height {
                  line-height: 33px;
                }
              }
            }
          }

          &__files {
            display: grid;
            grid-template-rows: max-content 1fr;

            .files {
              @extend .components__files;

              &__title {
                font-weight: 600;
                font-size: 18px;
                line-height: 130%;
                color: #1D2127;
              }

              &__container {
                font-weight: normal;
                font-size: 14px;
                line-height: 130%;
                color: #000000;
                margin-top: 10px;
              }

              &__noFiles {
                display: flex;
              }
            }

            .file {
              display: flex;
              flex-direction: row;
              align-items: center;
              margin-bottom: 10px;

              &__icon {
                margin-right: 8px;
              }

              &__name {
                font-size: 16px;
                line-height: 145%;
                color: #282F39;
                margin-right: 8px;
              }

              &__size {
                font-size: 13px;
                line-height: 130%;
                color: #A7AEB9;
                margin-right: 8px;
              }
            }
          }
        }
      }

      .line {
        background: #E9EDF2;
      }

      &__description {
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
      }

      &__toForum {
        margin-top: 20px;
      }
    }
  }

  &__results {
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .results {
      &__header {
        font-size: 16px;
        line-height: 130%;
        color: #1D2127;
        margin-bottom: 15px;
      }

      &__bar {
        .bar {
          margin-bottom: 15px;

          &__result {
            font-size: 16px;
            line-height: 130%;
            display: flex;
            justify-content: space-between;
            margin-bottom: 7px;

            .result {
              @extend .bar__result;

              &__name {
                width: 100%;
                color: #353C47;
              }

              &__percent {
                width: 29px;
                color: #7C838D;
              }
            }
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
      }

      &__buttons {
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
      }
    }
  }

  &__history {
    margin-top: 30px;

    .history {
      &__content {
        margin-top: 15px;
      }

    }

    .menu {
      &__left {
        display: flex;
      }
    }
  }
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

  &__link {
    text-decoration: none;
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

.dd {
  border-radius: 6px;
  margin-left: 15px;
  color: #8D96A2;
  border: 1px solid rgba(0, 0, 0, 0);
  min-width: 100px;
}
</style>

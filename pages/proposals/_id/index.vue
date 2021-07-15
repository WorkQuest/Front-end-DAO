<template>
  <div class="proposal">
    <div class="proposal__body">
      <div class="proposal__back back">
        <div class="back__container">
          <nuxt-link class="back__link" to="/proposals">
            <span class="back__icon icon-short_left"/>
            {{ $t('proposal.back') }}
          </nuxt-link>
        </div>
      </div>
      <div class="proposal__header">
        {{ $t('proposal.title') }}
      </div>
      <div class="proposal__content">
        <div class="proposal__content_grid">
          <div class="proposal__info proposal__content_item">
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
            <div class="info__header">
              <div class="info__header_title">
                <span>{{ about }}</span>
              </div>
              <div class="info__header_subtitle">
                <span>{{ date }}</span>git
              </div>
            </div>
            <div class="info__row">
              <div class="hash">
                <div class="hash__title">
                  {{ $t('proposal.hashTitle') }}
                </div>
                <div class="hash__value">
                  {{ modifyHash(hash) }}
                </div>
              </div>
              <div class="files">
                <div class="files__title">
                  {{ $t('proposal.filesTitle') }}
                </div>
                <div class="files__container">
                  {{ $t('proposal.noFiles') }}
                </div>
              </div>
            </div>
            <hr class="line">
            <div class="description">
              <div class="description__title">
                {{ $t('proposal.description') }}
              </div>
              <div class="description__value">
                {{ descriptionValue }}
              </div>
            </div>
            <div class="btn__container">
              <nuxt-link
                  class="btn__link"
                  to="proposals/1">
                <base-btn
                    mode="outline"
                    class="btn__forum_size"
                >
                  {{ $t('proposal.toTheForum') }}
                </base-btn>
              </nuxt-link>
            </div>
          </div>
          <div class="proposal__result proposal__content_item">
            result
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    idCard: {
      type: Number,
      default: 0,
    },
    voting: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      default: '',
    },
    date: {
      type: String,
      default: '',
    },
    about: {
      type: String,
      default: '',
    },
    hash: {
      type: String,
      default: '11400714819323198485',
    },
    descriptionValue: {
      type: String,
      default: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid animi, ea exercitationem fugit incidunt nesciunt nisi non officiis optio quaerat rem similique suscipit. Ab ad asperiores, commodi consequatur cum delectus distinctio eaque fugiat impedit iste laborum laudantium maxime nam odio perspiciatis quibusdam quisquam ratione sequi suscipit ullam vel veritatis voluptate.',
    },
  },
  data() {
    return {
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
        {
          voting: 1,
          status: 0,
          date: 'Jan 01, 2021 - Mar 01, 2021',
          about: 'Lorem ipsum dolor sit amet, consectetur',
        },
        {
          voting: 1,
          status: 2,
          date: 'Jan 01, 2021 - Mar 01, 2021',
          about: 'Lorem ipsum dolor sit amet, consectetur',
        },
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
          status: 1,
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
        {
          voting: 1,
          status: 0,
          date: 'Jan 01, 2021 - Mar 01, 2021',
          about: 'Lorem ipsum dolor sit amet, consectetur',
        },
      ],
    };
  },
  beforeCreate() {
  },
  created() {
    const URLString = document.URL;
    this.idCard = parseInt(URLString.split('/').slice(-1)[0], 10);
    const card = this.cards[this.idCard - 1];
    this.voting = card.voting;
    this.status = card.status;
    this.date = card.date;
    this.about = card.about;
  },
  mounted() {

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
      if (hash.length) {
        return `${hash.substr(0, 6)}...${hash.substr(hash.length - 6, 6)}`;
      }
      return '...';
    },
  },
};
</script>

<style lang="scss" scoped>
.proposal {
  @include main;
  @include text-simple;

  &-white {
    @include main;
    background: $white;
    background: #FFFFFF;
    margin: 0 0 20px 0;
    border-radius: 6px;
    justify-content: center;
  }

  &__body {
    margin-top: 30px;
    max-width: 1180px;
    height: 100%;
  }

  &__back {
    padding: 0;
  }

  .back {
    @extend .proposal__back;

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

  &__header {
    font-weight: 600;
    font-size: 28px;
    line-height: 36px;
    color: #000000;
    margin: 20px 0;
  }

  &__content {
    &_grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      grid-column-gap: 20px;
    }

    &_item {
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

      &_left {
        @include text-simple;
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
      font-family: Inter;
      font-style: normal;

      &_title {
        font-weight: 600;
        font-size: 24px;
        line-height: 32px;
      }

      &_subtitle {
        font-weight: normal;
        font-size: 14px;
        line-height: 130%;
        color: #AAB0B9;
        margin-top: 10px;
      }
    }

    &__row {
      display: inline-flex;
      margin-top: 20px;

      .hash {
        font-family: Inter;
        font-style: normal;
        margin-right: 80px;

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
        }
      }

      .files {
        font-family: Inter;
        font-style: normal;

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
        }
      }
    }
  }

  .description {
    font-family: Inter;
    font-style: normal;

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

.line {
  background: #E9EDF2;
}

.btn {
  &__container {
    margin-top: 10px;
  }

  &__forum_size {
    width: 220px;
    height: 43px;
  }

  &__link {
    text-decoration: none;
  }
}
</style>

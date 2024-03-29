<template>
  <div class="main__body">
    <div class="main__menu menu">
      <div class="menu__left">
        <base-btn
          mode="light"
          class="btn_white"
          @click="isDescending = !isDescending"
        >
          <template v-slot:right>
            <span
              class="icon icon__sorting"
              :class="sortingClass"
            />
          </template>
          {{ $t('proposals.ui.addTime') }}
        </base-btn>
        <base-dd
          v-model="ddValue"
          type="light"
          :items="ddValues"
          class="menu__drop"
        />
      </div>
      <div class="menu__right">
        <div class="proposals__search">
          <div class="search">
            <div class="search__inputs">
              <base-field
                v-model="search"
                is-search
                class="search__input"
                :placeholder="$t('proposals.ui.search')"
                data-selector="FIELD-SEARCH"
                mode="icon"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <empty-data
      v-if="!cards.length"
      :description="$t('proposals.cards.emptyCardsList')"
    />
    <div
      v-else
      class="content"
    >
      <div
        v-for="(card, i) in cards"
        :key="i"
        class="card"
      >
        <div class="card__content">
          <div class="card__header">
            <div class="card__header_top">
              <div class="card__header_left">
                {{ $t('proposals.voting') }}
                <span v-if="card.status !== 0">#{{ +card.createdEvent.contractProposalId }}</span>
              </div>
              <div class="card__header_right">
                <div class="card__status">
                  <span
                    class="card__status"
                    :class="cardsStatusColor(card.status)"
                  >{{ priority[card.status] || 'None' }}</span>
                </div>
              </div>
            </div>
          </div>
          <div
            v-if="card.status !== 0"
            class="card__date"
          >
            {{ $moment(new Date(card.createdEvent.timestamp * 1000)).format('ll') }} - {{ $moment(new Date(card.createdEvent.timestamp * 1000 + card.createdEvent.votingPeriod * 1000)).format('ll') }}
          </div>
          <div
            class="card__about"
            :class="{card__about_pending: card.status === 0}"
          >
            {{ card.title }}
          </div>
          <div class="btn__container">
            <div
              v-if="!isMobile"
              class="btn__wrapper"
            >
              <nuxt-link
                v-if="card.status !== 0"
                class="btn__link"
                :to="`/proposals/${card.id}`"
              >
                <base-btn
                  mode="outline"
                  class="message__action"
                >
                  {{ $t('meta.open') }}
                </base-btn>
              </nuxt-link>
            </div>
          </div>
        </div>
      </div>
    </div>
    <base-pager
      v-if="totalPages > 1"
      v-model="currentPage"
      class="main__pagination"
      :total-pages="totalPages"
    />
  </div>
</template>

<script>

import { mapGetters } from 'vuex';
import { proposalStatuses } from '~/utils/enums';
import modals from '~/store/modals/modals';

export default {
  name: 'ProposalCards',
  data() {
    return {
      tab: 1,
      currentPage: 1,
      search: '',
      searchTimeout: null,
      timeoutIdSearch: null,
      isDescending: true,
      cardsLimit: 12,
      ddValue: 2,
      isMobile: false,
    };
  },
  computed: {
    ...mapGetters({
      isWalletConnected: 'wallet/getIsWalletConnected',
      cards: 'proposals/cards',
      cardsCount: 'proposals/cardsCount',
      prevFilters: 'proposals/filters',
    }),
    totalPages() {
      return Math.ceil(this.cardsCount / this.cardsLimit);
    },
    ddValues() {
      return [
        this.$t('proposals.ui.allProposals'),
        this.$t('proposals.cards.status.pending'),
        this.$t('proposals.cards.status.active'),
        this.$t('proposals.cards.status.rejected'),
        this.$t('proposals.cards.status.accepted'),
      ];
    },
    cardLevelClass(idx) {
      const { cards } = this;
      return [
        { card__level_reliable: cards[idx].level.code === 2 },
        { card__level_checked: cards[idx].level.code === 3 },
      ];
    },
    sortingClass() {
      return [
        { 'icon-Sorting_descending': this.isDescending },
        { 'icon-Sorting_ascending': !this.isDescending },
      ];
    },
    priority() {
      return {
        [proposalStatuses.PENDING]: this.$t('proposals.cards.status.pending'),
        [proposalStatuses.ACTIVE]: this.$t('proposals.cards.status.active'),
        [proposalStatuses.REJECTED]: this.$t('proposals.cards.status.rejected'),
        [proposalStatuses.ACCEPTED]: this.$t('proposals.cards.status.accepted'),
      };
    },
  },
  watch: {
    async currentPage(newVal) {
      await this.loadPage(newVal);
    },
    async search() {
      this.searchTimeout = setTimeout(async () => {
        await this.loadPage(1);
      }, 500);
    },
    async ddValue() {
      await this.loadPage(1);
    },
    async isDescending() {
      await this.loadPage(this.currentPage);
    },
    prevFilters: {
      deep: true,
      async handler() {
        this.currentPage = this.prevFilters.lastPage || 1;
        if (!this.prevFilters.lastPage) await this.loadPage(this.currentPage);
      },
    },
  },
  async mounted() {
    if (!this.isWalletConnected) return;
    this.SetLoader(true);
    this.currentPage = this.prevFilters.lastPage || 1;
    this.search = this.prevFilters.search || '';
    this.ddValue = this.prevFilters.sortVoteStatus || 0;
    this.isDescending = this.prevFilters.isDescending || true;
    await this.loadPage(this.currentPage);
    this.SetLoader(false);
  },
  beforeDestroy() {
    this.$store.dispatch('proposals/updateFilters', {
      lastPage: this.currentPage,
      search: this.search,
      sortVoteStatus: this.ddValue,
      isDescending: this.isDescending,
    });
  },
  methods: {
    cardsStatusColor(idx) {
      const statusClass = {
        [proposalStatuses.PENDING]: 'card__status_pending',
        [proposalStatuses.ACTIVE]: 'card__status_active',
        [proposalStatuses.REJECTED]: 'card__status_rejected',
        [proposalStatuses.ACCEPTED]: 'card__status_accepted',
      };
      return statusClass[idx] || 'None';
    },
    async searchProposals() {
      if (this.timeoutIdSearch) {
        clearTimeout(this.timeoutIdSearch);
        this.timeoutIdSearch = null;
      }
      this.timeoutIdSearch = setTimeout(async () => {
        await this.loadPage(1);
      }, 500);
    },
    async loadPage(page) {
      if (!this.isWalletConnected) return;
      this.currentPage = page;
      const params = {
        limit: this.cardsLimit,
        offset: (page - 1) * this.cardsLimit,
        q: this.search || null,
        'sort[createdAt]': this.isDescending ? 'desc' : 'asc',
      };
      if (this.ddValue - 1 >= 0) {
        params.statuses = [this.ddValue - 1];
      }
      await this.$store.dispatch('proposals/getProposals', params);
    },
  },
};
</script>

<style lang="scss" scoped>
.message {
  &__action {
    margin-top: 10px;
  }
}

.btn {
  &__container {
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
  }

  &__wrapper {
    width: 100%;
  }

  &__link {
    text-decoration: none;
  }
}

.proposals {
  &__search {
    width: 580px;
    font-size: 16px;
    height: 43px;
    bottom: 30px;
    margin: auto;
    background-color: $white;
    color: $black800;
    flex-direction: row;
    align-items: center;
    border-radius: 6px;
    flex-shrink: 0;
  }
}

.search {
  display: flex;
  align-items: center;
  height: 100%;
  justify-items: center;

  &__icon {
    margin-bottom: -10px;

    &::before {
      font-size: 24px;
      color: $blue;
    }
  }

  &__inputs {
    width: 100%;
    height: 43px;
    display: grid;
    align-items: center;
  }

  &__input {
    display: flex;
    align-items: center;
  }
}

.main {
  @include main;

  &-white {
    @include main-white;
  }

  &__title {
    @include text-simple;
    font-weight: 500;
    font-size: 25px;
    line-height: 130%;
    color: $black800;
    margin: 30px 0 25px 0;
  }

  &__pagination {
    margin-top: 20px;
  }

  &__body {
    margin-top: 20px;
  }
}

.menu {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 20px;
  justify-content: space-between;
  max-width: 1180px;
  width: 100%;

  &__left {
    display: grid;
    grid-template-columns: repeat(2, auto);
    grid-gap: 20px;
    justify-content: flex-start;
  }

  &__right {
    justify-content: flex-end;
  }

  &__drop {
    width: 183px;
  }
}

.map {
  &__container {
    position: relative;
  }
}

.content {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: auto;
  grid-gap: 20px;
  margin-top: 20px;
}

.btn_white {
  border: 1px solid rgba(0, 0, 0, 0);
  padding: 0 20px;
  width: 100%;
  white-space: nowrap;

  &:hover {
    background: #FFFFFF;
    border: 1px solid rgba(0, 0, 0, 0.1);
  }
}

.icon {
  &__sorting {
    color: #000000;
  }

  &_blue {
    color: $blue;
    font-size: 24px;
    display: block;
  }
}

.card {
  width: 100%;
  max-height: 300px;
  box-sizing: border-box;
  border-radius: 6px;
  align-items: center;
  box-shadow: none;
  transition: .2s;

  &:hover {
    box-shadow: -1px 1px 8px 0px rgba(34, 60, 80, 0.2);
  }

  &_higher {
    border: 1px solid #F6CF00;
  }

  &__content {
    display: grid;
    grid-template-rows: 0.8fr 0.7fr 1fr 0.5fr;
    width: 100%;
    padding: 20px;
  }

  &__header {
    display: flex;
    flex-direction: column;

    &_left {
      color: #0083C7;
    }

    &_top {
      display: flex;
      justify-content: space-between;
      grid-gap: 15px;
      align-items: center;
    }
  }

  &__status {
    font-size: 12px;
    justify-content: flex-start;
    align-items: center;
    height: 24px;
    display: flex;
    padding: 0 4px;
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

  &__title {
    font-weight: 400;
    font-size: 14px;
  }

  &__date {
    font-weight: 400;
    font-size: 14px;
    color: $black300;
    white-space: normal;
    overflow: hidden;
    max-height: 65px;
    text-overflow: ellipsis;
  }

  &__about {
    color: #4C5767;
    font-size: 18px;
    font-style: normal;
    font-weight: 500;
    line-height: 28px;
    letter-spacing: 0;
    text-align: left;

    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;

    &_pending {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      height: 56px;
    }
  }
}

.dd {
  color: #8D96A2;
  border: 1px solid rgba(0, 0, 0, 0);
  min-width: 140px;
}

@include _1199 {
  .map__container, .main {
    padding-left: 20px;
    padding-right: 20px;
  }
  .content {
    grid-template-columns: repeat(3, 1fr);
  }
  .menu {
    grid-template-columns: auto auto;
  }
  .card {
    padding: 10px;
  }
}

@include _991 {
  .menu {
    justify-content: flex-start;
    display: flex;

    &__right {
      flex-grow: 3;
    }
  }
  .proposals {
    &__search {
      width: 100%;
    }
  }
  .content {
    grid-gap: 10px;
  }
}

@include _767 {
  .main {
    display: block;

    .content {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  .search {
    grid-template-columns: auto auto;
    grid-gap: 10px;

    &__toggle {
      display: none;
    }

    &__actions {
      border: none;
    }
  }
}

@include _575 {
  .main {
    .menu {
      display: flex;
      flex-direction: column;
      grid-template-columns: auto;

      &__right {
        grid-template-columns: repeat(2, 1fr);
      }

      &__drop {
        width: 100vw;
      }
    }

    .menu__left {
      display: flex;
      flex-direction: row-reverse;
    }

    .content {
      grid-template-columns: 1fr;
    }
  }
  .dd:deep(.dd__btn) {
    padding: 0 10px;
  }
}
</style>

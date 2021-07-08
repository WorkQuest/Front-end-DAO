<template>
  <div class="main__body">
    <h2 class="main__title">
      {{ $t('workers.topWorkers') }}
    </h2>
    <div class="main__menu menu">
      <div class="menu__left">
        <base-btn
          class="btn_white"
        >
          <template v-slot:right>
            <span class="icon-Sorting_descending" />
          </template>
          {{ $t('proposals.ui.addTime') }}
        </base-btn>
        <base-btn
          class="btn_white"
        >
          <template v-slot:right>
            <span class="icon-Sorting_descending" />
          </template>
          {{ $t('proposals.ui.allProposals') }}
        </base-btn>
      </div>
      <div class="menu__right">
        <div class="quests__search">
          <div class="search">
            <div class="search__inputs">
              <base-field
                v-model="search"
                is-search
                class="search__input"
                :placeholder="$t('proposals.ui.search')"
                :mode="'icon'"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="content">
      <div
        v-for="(card, i) in cards"
        :key="i"
        class="card"
      >
        <div
          class="card__content"
        >
          <div class="card__header">
            <div class="card__header_top">
              <div class="card__header_left">
                <span>Voting #{{ card.voting }}</span>
              </div>
              <div class="card__header_right">
                <div class="card__status">
                  <span
                    class="card__status"
                    :class="cardsStatusColor(card.status)"
                  >{{ getPriority(card.status) }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="card__date">
            {{ card.date }}
          </div>
          <div class="card__about">
            {{ card.about }}
          </div>
          <div class="btn__container">
            <div class="btn__wrapper">
              <nuxt-link
                to="/proposals/1"
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
    <div class="nav_block">
      <ul class="nav">
        <li class="nav-item">
          <button
            class="nav-btn"
            :class="[{'nav-btn__active' :tab === 1}]"
            @click="tab = 1"
          >
            1
          </button>
        </li>
        <li class="nav-item">
          <button
            class="nav-btn"
            :class="[{'nav-btn__active' :tab === 2}]"
            @click="tab = 2"
          >
            2
          </button>
        </li>
        <li class="nav-item">
          <button
            class="nav-btn"
            :class="[{'nav-btn__active' :tab === 3}]"
            @click="tab = 3"
          >
            3
          </button>
        </li>
        <li class="nav-item">
          <button
            class="nav-btn"
            :class="[{'nav-btn__active' :tab === 4}]"
            @click="tab = 4"
          >
            4
          </button>
        </li>
        <li class="nav-item">
          <button
            class="nav-btn"
            :class="[{'nav-btn__active' :tab === 5}]"
            @click="tab = 5"
          >
            5
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProposalCards',
  data() {
    return {
      tab: 1,
      currentPage: 1,
      search: '',
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
          about: 'Lorem ipsum dolor sit amet, consectetur',
        },
        {
          voting: 1,
          status: 0,
          date: 'Jan 01, 2021 - Mar 01, 2021',
          about: 'Lorem ipsum dolor sit amet, consectetur',
        },
      ],
      priceSort: 'desc',
      timeSort: 'desc',
      priority: [
        this.$t('quests.priority.all'),
        this.$t('quests.priority.low'),
        this.$t('quests.priority.normal'),
        this.$t('quests.priority.urgent'),
      ],
    };
  },
  computed: {
    cardLevelClass(idx) {
      const { cards } = this;
      return [
        { card__level_reliable: cards[idx].level.code === 2 },
        { card__level_checked: cards[idx].level.code === 3 },
      ];
    },
  },
  async mounted() {
    this.SetLoader(true);
    this.SetLoader(false);
  },
  methods: {
    showDetails() {
      this.$router.push('/proposals/1');
    },
    cardsStatusColor(idx) {
      const statusClass = {
        0: 'card__status_pending',
        1: 'card__status_rejected',
        2: 'card__status_accepted',
      };
      return statusClass[idx] || 'None';
    },
    cardsLevelsBorder(idx) {
      const { cards } = this;
      return [
        { card_lower: cards[idx].level.code === 2 },
        { card_lower: cards[idx].level.code === 3 },
        { card_lower: cards[idx].level.code === 0 },
      ];
    },
    getPriority(index) {
      const priority = {
        0: this.$t('proposals.cards.status.pending'),
        1: this.$t('proposals.cards.status.rejected'),
        2: this.$t('proposals.cards.status.accepted'),
      };
      return priority[index] || 'None';
    },
    getPriorityClass(index) {
      const priority = {
        0: 'block__priority_low',
        1: 'block__priority_normal',
        2: 'block__priority_urgent',
      };
      return priority[index] || '';
    },
  },
};
</script>

<style lang="scss" scoped>
.nav_block {
  display: flex;
  justify-content: flex-end;
}
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
}
.quests {
  &__cards {
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 20px;
    padding-top: 20px;
  }
  &__top {
    position: relative;
    min-height: 160px;
  }
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
  &__content {
    display: flex;
    justify-content: center;
  }
  &__body {
    padding-top: 30px;
    max-width: 1180px;
    width: 100%;
    height: 100%;
    &_wrap {
      padding-top: 10px;
    }
  }
  &__text {
    @include text-simple;
    font-style: normal;
    &_title  {
      font-weight: 500;
      font-size: 25px;
      line-height: 130%;
      color: $black800;
    }
  }
  &__tags {
    padding-top: 30px;
    max-width: 1180px;
  }
  &__tools {
    padding-top:  20px;
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
.btn_white{
  font-size: 14px;
  background-color: $white;
  color: $black800;
  padding: 0 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  border-radius: 6px;
  flex-shrink: 0;
  width: 100%;
  transition: .2s;
  &:hover {
    background-color: $white;
    box-shadow: -1px 1px 8px 0px rgba(34, 60, 80, 0.2);
  }
}
.icon {
  &_blue::before {
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
  cursor: pointer;
  box-shadow: none;
  transition: .2s;
  &:hover {
    cursor: pointer;
    box-shadow: -1px 1px 8px 0px rgba(34, 60, 80, 0.2);
  }
  &_higher {
    border: 1px solid #F6CF00;
  }
  &_lower {
    border: none;
  }
  &__content {
    display: grid;
    grid-template-rows: 0.8fr 0.7fr 1fr 0.5fr;
    width: 240px;
    padding: 20px 0px;
  }
  &__spec {
    font-weight: 400;
    font-size: 14px;
    color: $blue;
    &_title {
      font-size: 14px;
      font-weight: 400;
    }
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
  &__img {
    width: 61px;
    height: 61px;
    border-radius: 100%;
    object-fit: cover;
  }
  &__name {
    @include text-simple;
    font-size: 18px;
    font-weight: 500;
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
    &_accepted{
      background-color: #f6f8fa;
      color: #22CC14;
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
    letter-spacing: 0em;
    text-align: left;
  }
}
.checkbox {
  &__isShowMap {
    margin: 30px 50px 0 10px;
    display: flex;
    flex-direction: row;
    height: 25px;
    align-items: center;
  }
  &-input {
    width: 24px;
    height: 24px;
  }
  &__label {
    display: flex;
    flex-direction: row;
    flex-shrink: 0;
    margin: 0 0 0 5px;
    font-size: 16px;
  }
}
.search-bar {
  left: 18%;
  bottom: 30px;
  margin: 10px 0 0 0;
  position: absolute;
  max-width: 1180px;
  width: 100%;
  height: 84px;
  display: flex;
  flex-direction: column;
  border-radius: 6px;
  background-color: $white;
  z-index: 10;
  box-shadow: 0 17px 17px rgba(0, 0, 0, 0.05), 0 5.125px 5.125px rgba(0, 0, 0, 0.0325794), 0 2.12866px 2.12866px rgba(0, 0, 0, 0.025), 0 0.769896px 0.769896px rgba(0, 0, 0, 0.0174206);
  &__body {
    display: flex;
    flex-direction: row;
    flex-shrink: 0;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    height: 40px;
  }
  &__input {
    margin: 30px 10px 0 0;
    height: 25px;
    width: 510px;
  }
  &__btn {
    margin: 30px 10px 0 0;
    flex-shrink: 0;
  }
  &__btn-search {
    margin: 30px 10px 0 0;
    width: 220px;
  }
}

@include _1199 {
  .map__container, .main {
    padding-left: 20px;
    padding-right: 20px;
  }
  .menu {
    grid-template-columns: auto auto;
  }
  .card {
    padding: 10px;
  }
}
@include _991 {
  .content {
    grid-template-columns: repeat(3, 1fr);
  }
  .menu__right {
    grid-template-columns: repeat(2, 1fr);
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
    padding: 0 10px;
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
    }
    .menu__left {
      display: flex;
      flex-direction: column;
    }
    .content {
      grid-template-columns: 1fr;
    }
    .menu__right {
      grid-template-columns: repeat(2, 1fr);
    }
  }
}
</style>

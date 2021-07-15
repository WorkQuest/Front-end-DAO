<template>
  <div class="main__body">
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
        <div class="proposals__search">
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
                class="btn__link"
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
            class="nav-btn nav-btn_prev"
            @click="prevTab()"
          >
            <div
              class="nav-arrow"
              :disabled="tab === 1"
              :class="tab === 1 ? 'nav-arrow_disabled' : 'nav-arrow_active'"
            />
          </button>
        </li>
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
        <li class="nav-item">
          <button
            class="nav-btn nav-btn_next"
            :disabled="tab === 5"
            @click="nextTab()"
          >
            <div
              class="nav-arrow"
              :class="tab === 5 ? 'nav-arrow_disabled' : 'nav-arrow_active'"
            />
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
    prevTab() {
      if (this.tab > 1) {
        this.tab -= 1;
      }
    },
    nextTab() {
      this.tab += 1;
    },
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
    getPriority(index) {
      const priority = {
        0: this.$t('proposals.cards.status.pending'),
        1: this.$t('proposals.cards.status.rejected'),
        2: this.$t('proposals.cards.status.accepted'),
      };
      return priority[index] || 'None';
    },
  },
};
</script>

<style lang="scss" scoped>
.nav_block {
  background-color: #FFFFFF;
  display: flex;
  justify-content: flex-end;
  border-radius: 6px;
  width: max-content;
  margin-top: 25px;
  float: right;
  .nav {
    align-content: center;
    &-btn {
      border-left: 1px solid #F7F8FA;
      width:43px;
      height:43px;
      &__active {
        background-color: #E6F3F9;
        color: #0083c7;
      }
      &_next .nav-arrow {
        mask-image: url('~assets/img/ui/coolicon_next.svg');
      }
      &_prev .nav-arrow {
        mask-image: url('~assets/img/ui/coolicon_prev.svg');
      }
    }
    &-arrow {
      margin-left: auto;
      margin-right: auto;
      height: 10px;
      width: 5px;
      &_disabled {
        background-color: #c2c2c2;
      }
      &_active {
        background-color: #4C5767;
      }
    }
  }
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
  &__content {
    display: grid;
    grid-template-rows: 0.8fr 0.7fr 1fr 0.5fr;
    width: 240px;
    padding: 20px 0px;
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
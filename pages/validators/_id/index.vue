<template>
  <div class="validator">
    <div class="validator__body">
      <div class="validator__head">
        <div class="validator__back back">
          <nuxt-link
            class="back__link"
            to="/validators"
          >
            <span class="back__icon icon-short_left" />
            {{ $t('proposal.back') }}
          </nuxt-link>
        </div>
        <div class="validator__title">
          {{ $t('validator.title') }}
        </div>
      </div>
      <div class="validator__block">
        <div class="validator__profile profile">
          <div class="profile__left">
            <img
              class="profile__avatar"
              :src="require('~/assets/img/app/avatar_empty.png')"
              alt="empty avatar"
            >
            <div class="left__info">
              <div class="left__user">
                <div class="left__text left__text_name">
                  Name SecondName
                </div>
                <div class="left__date">
                  Created on 22 Aug, 2021
                </div>
              </div>
            </div>
          </div>
          <div class="profile__left profile__left_data">
            <div
              v-for="(item, key) in leftColumn"
              :key="key"
              class="left__info"
            >
              <div class="left__user">
                <div class="left__text">
                  {{ item.name }}
                </div>
                <div class="left__date">
                  {{ item.desc }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="validator__profile profile">
          <div class="profile__right">
            <div class="right__bar">
              <div class="bar__info">
                <div class="bar__text">
                  {{ $t('validator.slots') }}
                </div>
                <div class="bar__data">
                  <div class="bar__text bar__text_grey">
                    {{ `${$t('validator.occupied')}:` }}
                  </div>
                  <div class="bar__text bar__text_small">
                    {{ `395 ${$t('validator.outOf')} 1000` }}
                  </div>
                </div>
              </div>
            </div>
            <div class="right__block">
              <div class="right__info">
                <div class="right__data-name">
                  {{ $t('validator.delegators') }}
                </div>
                <div class="right__data-desc">
                  337
                </div>
              </div>
              <div class="right__info">
                <div class="right__data-name">
                  {{ $t('validator.minimalStake') }}
                </div>
                <div class="right__data-desc">
                  {{ $tc('meta.wusdCount', 0) }}
                </div>
              </div>
            </div>
            <div class="right__block">
              <button class="right__button right__button_red">
                {{ $t('modals.undelegate') }}
              </button>
              <button class="right__button right__button_blue">
                {{ $t('modals.delegate') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Validator',
  computed: {
    leftColumn() {
      return [
        { name: this.$t('modals.address'), desc: '0xnf…thb3' },
        { name: this.$t('validator.commonStake'), desc: this.$tc('meta.wusdCount', 1000000) },
        { name: this.$t('validator.fee'), desc: '5%' },
        { name: this.$t('validator.missedBlocks'), desc: 1000 },
      ];
    },
  },
};
</script>

<style lang="scss" scoped>
.validator {
  @include main;
  @include text-simple;
  &__body {
    margin-top: 30px;
    display: grid;
    grid-template-rows: 80px auto;
    grid-gap: 20px;
  }
  &__back {
    width: 77px;
    height: 24px;
  }
  &__block {
    display: grid;
    grid-template-columns: auto auto;
    grid-gap: 20px;
  }
  &__head {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
  }
  &__title{
    font-weight: 600;
    font-size: 28px;
    line-height: 36px;
    color: #000000;
  }
  &__profile {
    grid-gap: 20px;
    display: grid;
    max-height: 280px;
    padding: 20px;
    border-radius: 6px;
    background: white;
  }
}

.back {
  &__link {
    font-weight: 500;
    font-size: 18px;
    line-height: 130%;
    color: $black600;
  }
  &__link:hover {
    text-decoration: none;
  }
  &__icon {
    color: $black600;
  }
}

.profile {
  &__left {
    display: grid;
    grid-template-columns: 76px auto;
    grid-gap: 20px;
    align-items: center;
    &_data {
      grid-template-columns: auto auto;
    }
  }
  &__right {
    display: grid;
    grid-gap: 20px;
  }
  &__avatar {
    width: 100%;
  }
}

.left {
  &__text {
    font-weight: 600;
    font-size: 18px;
    &_name {
      font-weight: 500;
    }
  }
  &__date {
    font-weight: 400;
    font-size: 14px;
    color: $black300;
  }
}

.right {
  &__button, &__info, &__bar {
    border: 1px solid $black0;
    box-sizing: border-box;
    border-radius: 6px;
    &_red {
      color: $red;
      border-color: $red100;
    }
    &_blue {
      color: $blue;
      border-color: $blue100;
    }
  }
  &__button {
    min-height: 40px;
  }
  &__info {
    display:flex;
    flex-direction: column;
    padding: 10px;
    justify-content: space-around;
  }
  &__data-name {
    font-weight: 600;
    font-size: 18px;
    line-height: 130%;
  }
  &__data-desc {
    font-weight: 400;
    font-size: 14px;
    line-height: 130%;
    color: $blue;
  }
  &__block {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 20px;
  }
  &__bar {
    padding: 20px 10px;
  }
}

.bar {
  &__info {
    display: flex;
    justify-content: space-between;
  }
  &__text {
    font-weight: 600;
    font-size: 18px;
    &_small {
      font-weight: 500;
      font-size: 16px;
    }
    &_grey {
      font-weight: 500;
      font-size: 16px;
      color: $black400;
    }
  }
  &__data {
    display: grid;
    grid-template-columns: auto auto;
    grid-gap: 5px;
  }
}

@include _1199 {
  .validator {
    &__body {
      padding: 0 20px;
    }
    &__block {
      grid-template-columns: auto;
      grid-template-rows: repeat(2, 290px);
    }
  }
}

@include _380 {
  .validator {
    &__profile {
      max-height: 100%;
    }
  }
  .bar {
    &__data {
      grid-template-columns: auto;
    }
  }
}
</style>

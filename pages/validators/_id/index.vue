<template>
  <div class="validator">
    <div class="validator__body">
      <div class="validator__back">
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
      <div class="validator__profile profile">
        <div class="profile__top">
          <img
            class="profile__avatar"
            :src="require('~/assets/img/app/avatar_empty.png')"
            :alt="'empty avatar'"
          >
          <div class="top__info">
            <div class="top__user">
              <div class="top__name">
                Name Namew
              </div>
              <div class="top__some-info">
                123
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Index',
};
</script>

<style lang="scss" scoped>
.validator {
  @include main;
  @include text-simple;
  &__body {
    margin-top: 30px;
    display: grid;
    grid-template-rows: 23px 36px auto;
    grid-gap: 20px;
  }
  &__back {
    width: 77px;
    height: 24px;
  }
  &__head {
    display: flex;
    justify-content: space-between;
  }
  &__title{
    font-weight: 600;
    font-size: 28px;
    line-height: 36px;
    color: #000000;
  }
  &__profile {
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
  &__top {
    display: grid;
    grid-template-columns: 151px auto;
    grid-gap: 20px;
  }
  &__avatar {
    width: 100%;
  }
}
</style>

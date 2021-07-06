<template>
  <div
    class="quests__top"
    :class="[{'top-disabled': isShowInfo === false}]"
  >
    <transition name="fade-fast">
      <div class="page__info">
        <div class="page__grid">
          <div
            class="page__info"
          >
            <div class="page__info">
              <h2 class="page__info page__info-title">
                {{ $t('settings.addInfo') }}
              </h2>
              <div class="page__info page__info-subtitle">
                {{ $t('settings.alsoRating') }}
              </div>
              <div class="ver-btn__container">
                <base-btn mode="ver">
                  {{ $t('settings.getVerification') }}
                </base-btn>
              </div>
            </div>
          </div>
          <div>
            <img
              class="higher-level__img"
              src="~/assets/img/ui/settingsHigherLevel.svg"
            >
            <button @click="isCloseInfo()">
              <span
                class="icon-close_big icon__close"
                :class="{'icon_close_closed' : isShowInfo }"
              />
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'Index',
  data() {
    return {
      isShowInfo: true,
    };
  },
  methods: {
    isCloseInfo() {
      this.isShowInfo = !this.isShowInfo;
    },
  },
};
</script>

<style scoped>

</style>

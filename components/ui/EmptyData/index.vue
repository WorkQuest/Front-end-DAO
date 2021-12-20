<template>
  <div class="absence">
    <div class="absence__content">
      <img
        class="absence__img"
        src="~/assets/img/temp/smile_sad.svg"
        alt=""
      >
      <div
        v-if="description !== ''"
        class="absence__desc"
      >
        {{ description }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EmptyData',
  props: {
    description: {
      type: String,
      default: '',
    },
  },
};
</script>

<style lang="scss" scoped>
.absence {
  width: 100%;
  background-color: #f6f8fa;
  margin-top: 60px;
  display: flex;
  justify-content: center;
  &__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    grid-gap: 20px;
  }
  &__desc {
    color: #AAB0B9;
  }
}
</style>

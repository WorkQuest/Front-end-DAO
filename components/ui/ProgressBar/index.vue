<template>
  <div class="bar__line">
    <div class="bar__line_gray">
      <div
        :class="`bar__line_${mode}`"
        :style="`width: ${value}%`"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Number,
      default: 1,
    },
    mode: {
      type: String,
      default: 'red',
    },
  },
};
</script>

<style lang="scss" scoped>
.bar {
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
      background: $green;
    }

    &_blue {
      @extend .bar__line;
      background: $blue;
    }

    &_red {
      @extend .bar__line;
      background: $red;
    }
  }
}
</style>

<template>
  <div
    v-click-outside="hideDd"
    class="dd"
    :class="[{'dd__top': mode === 'top' }, { 'dd_min-width': type !== 'underline' }]"
  >
    <button
      class="dd__btn"
      :class="ddClass"
      @click="isShown = !isShown"
    >
      <div
        v-if="isIcon"
        class="dd__icon"
      >
        <img
          :src="items[value].icon"
          :alt="items[value].title"
        >
        <span
          class="dd__title"
          :class="titleClass"
        >
          {{ items[value].title }}
        </span>
      </div>
      <span
        v-else
        class="dd__title"
        :class="titleClass"
      >
        {{ items[value] }}
      </span>
      <span
        v-if="type === 'sort'"
        class="dd__caret dd__caret_dark icon-Sorting_descending"
      />
      <span
        v-else
        class="dd__caret icon-caret_down"
        :class="caretClass"
      />
    </button>
    <transition name="fade">
      <div
        v-if="isShown && isIcon"
        class="dd__items"
        :class="{ 'dd__items_underline-type': type === 'underline' }"
      >
        <button
          v-for="(item, i) in items"
          :key="`dd__item-${i}`"
          class="dd__item dd__item_icon"
          @click="selectItem(i)"
        >
          <img
            :src="item.icon"
            :alt="item.title"
          >
          {{ item.title }}
        </button>
      </div>
      <div
        v-if="isShown && !isIcon"
        class="dd__items"
        :class="{ 'dd__items_underline-type': type === 'underline' }"
      >
        <button
          v-for="(item, i) in items"
          :key="`dd__item-${i}`"
          class="dd__item"
          @click="selectItem(i)"
        >
          {{ item }}
        </button>
      </div>
    </transition>
  </div>
</template>

<script>
import ClickOutside from 'vue-click-outside';

export default {
  name: 'Dd',
  directives: {
    ClickOutside,
  },
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    value: {
      type: Number,
      default: 0,
    },
    type: {
      type: String,
      default: 'default',
    },
    isIcon: {
      type: Boolean,
      default: false,
    },
    mode: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      isShown: false,
    };
  },
  computed: {
    ddClass() {
      const { type } = this;
      return [
        { dd__btn_dark: type === 'dark' },
        { dd__btn_gray: type === 'gray' },
        { dd__btn_light: type === 'light' },
        { dd__btn_border: type === 'border' },
        { dd__btn_underline: type === 'underline' },
      ];
    },
    titleClass() {
      const { type } = this;
      return [
        { dd__title_light: type === 'light' },
      ];
    },
    caretClass() {
      const { type } = this;
      return [
        { dd__caret_light: type === 'light' },
      ];
    },
  },
  methods: {
    hideDd() {
      this.isShown = false;
    },
    selectItem(i) {
      this.isShown = false;
      this.$emit('input', i);
    },
  },
};
</script>

<style scoped lang="scss">
.dd {
  display: flex;
  align-items: center;
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 130%;
  color: $black500;
  position: relative;
  text-align: left;

  &_min-width {
    min-width: 131px;
  }

  &:hover .dd__caret {
    color: #0083C7;
  }

  &__title {
    color: $black500;

    &_light {
      color: $black800;
    }
  }

  &__top {
    align-items: flex-start;
  }

  &__items {
    @include box;
    width: 100%;
    position: absolute;
    background: #FFFFFF;
    top: calc(100% + 4px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    grid-gap: 15px;
    padding: 15px 20px;
    z-index: 1;

    &_underline-type {
      width: fit-content;
      min-width: fit-content;
      right: 0;
    }

  }
  &__item {
    text-align: left;
    width: 100%;
    color: $black500;
    min-height: 21px;

    &:hover {
      color: $black800;
    }

    &_icon {
      display: flex;
      align-items: center;
      img {
        margin-right: 5px;
        height: 24px;
        width: 24px;
      }
    }
  }
  &__icon {
    display: flex;
    align-items: center;

    img {
      height: 24px;
      width: 24px;
      margin-right: 5px;
    }

    span {
      margin-right: 5px;
    }
  }
  &__caret {
    padding-left: 10px;
    color: $blue;
    font-size: 24px;

    &_dark {
      color: $black700;
    }

    &_light {
      color: #8D96A2;
    }

    &_blue {
      color: #0083C7;
    }
  }
  &__btn {
    height: 43px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    width: 100%;
    background: #FFFFFF;
    border-radius: 6px;

    &_dark {
      background: #151552;
    }

    &_gray {
      background-color: $black0;
    }

    &_light {
      background: #FFFFFF;
      border: 1px solid rgba(0, 0, 0, 0);
      &:hover {
        border: 1px solid rgba(0, 0, 0, 0.1);
      }
    }

    &_border {
      border: 1px solid $black0;
    }

    &_underline {
      border: none;
      background: none;
      min-height: 26px;
      padding-right: 0;
      padding-left: 0;
      margin-top: 5px;

      .dd__title {
        border-bottom: 1px solid $blue !important;
        color: $blue !important;
      }

      &:hover {
        border: none;
      }
    }
  }
}
</style>

<template>
  <ValidationProvider
    v-slot="{errors}"
    tag="div"
    class="ctm-field ctm-field_default"
    :class="[
      {'ctm-field_big': big},
      {'ctm-field_disabled': disabled},
      {'ctm-field_search': isSearch},
      {'ctm-field_icon': mode === 'icon'},
      {'ctm-field_white': mode === 'white'},
      {'ctm-field_iconWhite': mode === 'iconWhite'},
    ]"
    :rules="rules"
    :name="name"
    :vid="vid"
    mode="eager"
    slim
  >
    <div
      v-if="label !== ''"
      class="ctm-field__header"
    >
      {{ label }}
    </div>
    <div class="ctm-field__body">
      <span
        v-if="isSearch"
        class="icon-search ctm-field__search"
      />
      <div class="ctm-field__left">
        <slot name="left" />
      </div>
      <input
        class="ctm-field__input"
        :class="[{'ctm-field__input_text-align-center' : textAlign === 'center'},
                 {'ctm-field__input_padding-r' : isWithLoader}]"
        :placeholder="placeholder"
        :value="value"
        :type="type"
        :autocomplete="autocomplete"
        :disabled="disabled"
        :inputmode="inputmode"
        @focus="changeFocus(true)"
        @blur="changeFocus(false)"
        @input="input"
      >
      <div
        v-if="value && isSearch"
        class="ctm-field__clear"
        @click="clear()"
      >
        <span class="icon-close_small" />
      </div>
      <div class="ctm-field__selector">
        <slot name="selector" />
      </div>
      <div class="ctm-field__right">
        <slot name="right" />
      </div>
      <div class="ctm-field__right-absolute">
        <slot name="right-absolute" />
      </div>
    </div>
    <div
      v-if="!isHideError"
      class="ctm-field__err"
      :class="[{'ctm-field__err_small': modeError === 'small'}]"
    >
      {{ errors[0] }}
    </div>
  </ValidationProvider>
</template>
<script>
export default {
  props: {
    value: {
      type: [String, Number],
      default: '',
    },
    mode: {
      type: String,
      default: '',
    },
    big: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: '',
    },
    errorText: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    isHideError: {
      type: Boolean,
      default: false,
    },
    modeError: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'text',
    },
    isSearch: {
      type: Boolean,
      default: false,
    },
    autocomplete: {
      type: String,
      default: 'on',
    },
    rules: {
      type: [String, Array, Object],
      description: 'Vee validate validation rules',
      default: '',
    },
    name: {
      type: String,
      description: 'Input name (used for validation)',
      default: '',
    },
    vid: {
      type: String,
      default: '',
    },
    selector: {
      type: Boolean,
      default: false,
    },
    inputmode: {
      type: String,
      default: '',
    },
    textAlign: {
      type: String,
      default: 'left',
    },
    isWithLoader: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    changeFocus(arg) {
      this.$emit('focus', arg);
    },
    input($event) {
      this.$emit('input', $event.target.value);
      if (this.selector) {
        this.$emit('selector', $event.target.value);
      }
    },
    clear() {
      this.$emit('input', '');
    },
  },
};
</script>
<style lang="scss" scoped>
.ctm-field {
  &__selector {
    position: absolute;
    width: 100%;
    top: calc(100% + 10px);
    left: 0;
    right: 0;
    z-index: 120;
  }
  &__right {
    min-height: 100%;
    display: flex;
  }
  &__clear {
    position: absolute;
    right: 20px;
    padding-top: 6px;
    cursor: pointer;
    span::before {
      color: $blue;
      font-size: 24px;
    }
  }
  &__right-absolute {
    position: absolute;
    right: 12px;
  }
  &__left {
    position: absolute;
    left: 12px;
    padding-left: 5px;
  }
  &__body {
    display: flex;
    align-items: center;
    position: relative;
    width: 100%;
  }
  &__header {
    letter-spacing: -0.025em;
    margin-bottom: 13px;
    height: 24px;
    color: #1D2127;
  }
  &__err {
    color: #F82727;
    font-size: 12px;
    min-height: 23px;
    &_small {
      min-height: 15px !important;
    }
  }
  &__search {
    position: absolute;
    left: 13px;
    &:before {
      font-size: 24px;
      background: #0083C7;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
  &__input {
    height: 46px;
    border-radius: 6px;
    border: 2px solid transparent;
    padding: 0 20px;
    transition: .3s;
    width: 100%;

    &_text-align-center {
      text-align: center;
    }

    &_padding-r {
      padding-right: 40px !important;
    }
  }

  &_search {
    .ctm-field__input {
      padding: 0 20px 0 50px;
      background: transparent !important;
      &:hover {
        border: 1px solid #E6EAEE !important;
      }
      &:focus {
        border: 1px solid #E6EAEE !important;
      }
    }
  }
  &_default {
    .ctm-field__input {
      color: $black700;
      background: #F7F8FA;
      border-radius: 6px;
      border: 1px solid transparent;
      &::placeholder {
        color: $black300;
      }
      &:focus {
        background: #FFFFFF;
        border: 1px solid #0083C7;
      }
    }
  }
  &_white {
    .ctm-field__input {
      color: $black700;
      background: #FFFFFF;
      border-radius: 6px;
      border: 1px solid #F3F7FA;
      &::placeholder {
        color: $black300;
      }
      &:focus {
        background: #FFFFFF;
        border: 1px solid #0083C7;
      }
    }
  }
  &_icon {
    .ctm-field {
      &__input {
        padding: 0 20px 0 50px;
      }
      &__err{
        min-height: 36px;
      }
    }
  }
  &_iconWhite {
    color:  $blue!important;
    .ctm-field {
      color: black!important;
      &__input {
        color: #1D2127!important;
        padding: 0 20px 0 50px;
        border: 1px solid #F7F8FA;
        background-color: white;
      }
    }
  }
  &_big {
    .ctm-field {
      &__input {
        font-family: 'Inter', sans-serif;
        font-style: normal;
        font-weight: normal;
        font-size: 25px;
        height: 84px;
      }
    }
  }
  &_disabled {
    .ctm-field__input {
      pointer-events: none;
      background: #FFFFFF;
      border-radius: 6px;
      border: 1px solid #F3F7FA;
    }
  }
}
</style>

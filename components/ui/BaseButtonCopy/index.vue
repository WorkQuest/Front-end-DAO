<template>
  <button
    v-clipboard:copy="copyValue"
    v-clipboard:success="isShowToastSuccess ? ClipboardSuccessHandler : ''"
    v-clipboard:error="ClipboardErrorHandler"
    data-selector="COPY-BTN"
    type="button"
    :class="classByMode"
  >
    <span
      class="icon-copy"
    />
  </button>
</template>

<script>
export default {
  name: 'Copy',
  props: {
    copyValue: {
      type: String,
      default: '',
    },
    mode: {
      type: String,
      default: '',
    },
    isShowToastSuccess: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    classByMode() {
      switch (this.mode) {
        case 'wallet':
          return 'wallet';
        case 'panel':
          return 'panel';
        default: {
          return '';
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.icon-copy {
  font-size: 24px;
  color: $blue;
}
.wallet {
  margin-left: 22px;
}
.panel {
  margin-top: 5px;
}
</style>

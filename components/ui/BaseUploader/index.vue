<template>
  <div class="uploader">
    <base-files
      v-if="type === 'files' || type === 'all'"
      class="uploader__files"
      :items="files"
      :is-show-download="isShowDownload"
      :is-show-empty="isShowEmpty"
      @remove="remove"
    />
    <base-images
      v-if="type === 'images' || type === 'all'"
      :items="images"
      :is-show-download="isShowDownload"
      @remove="remove"
    />
    <div
      v-if="limit && items.length >= limit"
      class="uploader__error"
    >
      {{ $t('modals.filesLimit', { a: limit }) }}
    </div>
    <slot name="actionButton" />
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    limit: {
      type: Number,
      default: 0,
    },
    type: {
      type: String,
      default: '',
    },
    isShowDownload: {
      type: Boolean,
      default: true,
    },
    isShowEmpty: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    files() {
      return this.items.filter((item) => item.type === 'doc');
    },
    images() {
      return this.items.filter((item) => item.type === 'img');
    },
  },
  methods: {
    remove(item) {
      this.$emit('remove', item);
    },
  },
};
</script>

<style lang="scss" scoped>
.uploader {
  display: flex;
  flex-direction: column;
  &__error {
    margin-top: 5px;
    color: $red;
    font-size: 12px;
  }
}
</style>

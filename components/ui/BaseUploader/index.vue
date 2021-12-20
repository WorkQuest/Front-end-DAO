<template>
  <div class="uploader">
    <div
      v-if="type === 'files'"
      class="uploader__files"
    >
      <base-files
        :items="files"
        :is-show-download="isShowDownload"
        :is-show-empty="isShowEmpty"
      />
      <slot name="actionButton" />
    </div>
    <div
      v-else-if="type === 'images'"
      class="uploader__images"
    >
      <base-images
        :items="images"
        :is-show-download="isShowDownload"
        @remove="remove"
      />
      <slot name="actionButton" />
    </div>
    <div
      v-else-if="type === 'all'"
      class="uploader__all"
    >
      <base-files
        :items="files"
        :is-show-download="isShowDownload"
        :is-show-empty="isShowEmpty"
        @remove="remove"
      />
      <base-images
        :items="images"
        :is-show-download="isShowDownload"
        @remove="remove"
      />
      <slot name="actionButton" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      default: () => [],
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
      return this.items.filter((item) => item.type === 'image/jpeg');
    },
  },
  methods: {
    remove(id) {
      this.$emit('remove', id);
    },
  },
};
</script>

<style lang="scss" scoped>
.uploader {

  &__files {
    display: flex;
    flex-direction: column;
  }
  &__images {
    display: flex;
    flex-direction: column;
  }
  &__all {
    display: flex;
    flex-direction: column;
  }
}

</style>

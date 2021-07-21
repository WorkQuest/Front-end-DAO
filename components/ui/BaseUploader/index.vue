<template>
  <div class="uploader">
    <div
      v-if="type === 'files'"
      class="uploader__files"
    >
      <Files
        :items="files"
        :is-show-download="true"
      />
    </div>
    <div
      v-else-if="type === 'images'"
      class="uploader__images"
    >
      <Images
        :items="images"
        :is-show-download="true"
      />
    </div>
    <div
      v-else-if="type === 'all'"
      class="uploader__all"
    >
      <Files
        :items="files"
        :is-files-inline="true"
        :is-show-download="true"
      />
      <Images
        class="uploader__images"
        :items="images"
        :is-show-download="true"
      />
    </div>
  </div>
</template>

<script>
import Files from '~/components/ui/BaseFiles';
import Images from '~/components/ui/BaseImages';

export default {
  components: {
    Files,
    Images,
  },
  props: {
    items: {
      type: Object,
      default: () => {},
    },
    type: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      files: this.items.files,
      images: this.items.images,
    };
  },
};
</script>

<style lang="scss" scoped>
.uploader {
  &__files {
    height: 100%;
  }
  &__images {
    height: 100%;
    margin-top: 10px;
  }
  &__all{
    height: 100%;
  }
}
</style>

<template>
  <div class="uploader">
    <div
      v-if="type === 'files'"
      class="uploader__files"
    >
      <files
        :items="files"
        :is-show-download="isShowFilesDownload"
      />
    </div>
    <div
      v-else-if="type === 'images'"
      class="uploader__images"
    >
      <images
        :items="images"
        :is-show-download="isShowImagesDownload"
      />
    </div>
    <div
      v-else-if="type === 'all'"
      class="uploader__all all"
    >
      <files
        :items="files"
        :is-files-inline="isFilesInline"
        :is-show-download="isShowFilesDownload"
      />
      <images
        class="all__images"
        :items="images"
        :is-show-download="isShowImagesDownload"
      />
    </div>
  </div>
</template>

<script>
import files from '~/components/ui/BaseFiles';
import images from '~/components/ui/BaseImages';

export default {
  components: {
    files,
    images,
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
    isShowFilesDownload: {
      type: Boolean,
      default: true,
    },
    isShowImagesDownload: {
      type: Boolean,
      default: true,
    },
    isFilesInline: {
      type: Boolean,
      default: true,
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
    display: flex;
    flex-direction: column;
  }
  &__images {
    display: flex;
    flex-direction: column;
    margin-top: 10px;
  }
  &__all{
    display: flex;
    flex-direction: column;
  }
}

.all {
  &__images {
    margin-top: 10px;
  }
}
</style>

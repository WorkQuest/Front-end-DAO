<template>
  <div
    class="images"
  >
    <div
      v-for="img in images"
      :key="img.id"
      class="image"
    >
      <img
        :src="img.img"
        alt=""
        class="image__img"
        @mouseover="showClose"
        @mouseleave="showClose"
      >
      <span
        class="image__close icon__close icon-close_big"
        @click="deleteImage(img.id)"
      />
    </div>
    <div
      v-if="isShowDownload"
      class="download"
      @click="callUploader"
    >
      <span class="download__icon icon-download" />
    </div>
    <Uploader
      ref="uploader"
      class="uploader_none"
    />
  </div>
</template>

<script>
import Uploader from '~/components/ui/Uploader';

export default {
  components: {
    Uploader,
  },
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    isShowDownload: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      images: this.items,
    };
  },
  methods: {
    showClose() {
      const el = event.target;
      const iconClose = el.nextElementSibling;
      const { type, toElement, fromElement } = event;
      if (!toElement || !fromElement) return;
      if (type === 'mouseleave' && toElement.classList.contains('icon__close')) return;
      if (type === 'mouseover' && fromElement.classList.contains('icon__close')) return;
      if (type === 'mouseleave') {
        el.classList.remove('image__img_brightness');
        iconClose.classList.remove('image__close_visible');
      }
      if (type === 'mouseover') {
        el.classList.add('image__img_brightness');
        iconClose.classList.add('image__close_visible');
      }
    },
    deleteImage(id) {
      this.images = this.images.filter((img) => img.id !== id);
    },
    callUploader() {
      this.$refs.uploader.$children[0].$el.click();
    },
  },
};
</script>

<style lang="scss" scoped>
.images {
  display: inline-flex;
}

.image {
  overflow: hidden;
  height: 90px;
  width: 90px;
  border-radius: 6px;
  margin-right: 20px;
  position: relative;

  &__img {
    width: 100%;
    height: 100%;
    &_brightness {
      filter: brightness(70%);
    }
  }

  &__close {
    display: none;
    cursor: pointer;

    height: 45px;
    width: 45px;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.5);

    font-weight: 800;
    font-size: 25px;

    padding: 10px 0 0 10px;

    &_visible {
      display: block;
      position: absolute;
      left: 23px;
      bottom: 20px;
      color: #FFFFFF;
    }
  }
}

.download {
  @extend .image;
  cursor: pointer;
  padding-top: 30px;
  background: rgba(0, 0, 0, 0.05);

  &:hover {
    background: rgba(0, 0, 0, 0.1);
  }

  &__icon {
    margin-left: 35px;
    font-size: 20px;
    color: #0083C7;
    vertical-align: middle;
  }
}

.uploader {
  &_none{
    display: none;
  }
}
</style>

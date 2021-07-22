<template>
  <div
    class="images"
  >
    <div
      v-for="(item, i) in images"
      :id="i"
      :key="i"
      class="image"
    >
      <img
        :src="item.img"
        alt=""
        class="image__img"
        @mouseover="onMouseOver(i)"
        @mouseleave="onMouseLeave(i)"
      >
      <span
        class="image__close icon__close icon-close_big"
        @click="deleteImage(item.id)"
      />
    </div>
    <div
      v-if="isShowDownload"
      class="download"
      @click="callUploader"
    >
      <span class="download__icon icon-download" />
    </div>
    <uploader
      ref="uploader"
      class="uploader_none"
    />
  </div>
</template>

<script>
import uploader from '~/components/ui/Uploader';

export default {
  components: {
    uploader,
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
    onMouseOver(i) {
      const { toElement, fromElement } = event;
      if (toElement.classList.contains('icon__close')) return;
      if (fromElement.classList.contains('icon__close')) return;
      const image = document.getElementById(i);
      image.childNodes[0].classList.add('image__img_brightness');
      image.childNodes[2].classList.add('image__close_visible');
    },
    onMouseLeave(i) {
      const { toElement, fromElement } = event;
      if (toElement.classList.contains('icon__close')) return;
      if (fromElement.classList.contains('icon__close')) return;
      const image = document.getElementById(i);
      image.childNodes[0].classList.remove('image__img_brightness');
      image.childNodes[2].classList.remove('image__close_visible');
    },
    deleteImage(id) {
      this.images = this.images.filter((item) => item.id !== id);
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

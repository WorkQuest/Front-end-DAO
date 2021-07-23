<template>
  <div
    class="images"
  >
    <div
      v-for="(item, i) in images"
      :id="i"
      :key="i"
      class="images__image image"
    >
      <img
        :src="item.img"
        alt=""
        class="image__img"
        @mouseover="onMouseOver(i) this.hoverId = i"
        @mouseleave="onMouseLeave(i)"
      >
      <span
        class="image__icon icon"
        :class="classIcon"
        @click="onIconClick(item.id)"
      />
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
    isShowDownload: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      images: this.items,
      hoverId: -1,
    };
  },
  methods: {
    onMouseOver(i) {
      const { toElement, fromElement } = event;
      if (toElement.classList.contains('icon')) return;
      if (fromElement.classList.contains('icon')) return;
      const image = document.getElementById(i);
      image.childNodes[0].classList.add('image__img_brightness');
      image.childNodes[2].classList.add('icon_visible');
    },
    onMouseLeave(i) {
      const { toElement, fromElement } = event;
      if (toElement.classList.contains('icon')) return;
      if (fromElement.classList.contains('icon')) return;
      const image = document.getElementById(i);
      image.childNodes[0].classList.remove('image__img_brightness');
      image.childNodes[2].classList.remove('icon_visible');
    },
    onIconClick(id) {
      if (this.isShowDownload) this.downloadImage(id);
      else this.deleteImage(id);
    },
    deleteImage(id) {
      this.images = this.images.filter((item) => item.id !== id);
    },
    downloadImage(id) {
      console.log(`download Image ${id}`);
    },
    classIcon() {
      return [
        { 'icon__download icon-download': this.isShowDownload },
        { 'icon-close_big': !this.isShowDownload },
      ];
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
}

.icon {
  display: none;
  cursor: pointer;

  height: 45px;
  width: 45px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);

  font-weight: 800;
  font-size: 25px;

  padding: 10px 0 0 10px;

  &__download {
    vertical-align: middle;
  }

  &_visible {
    display: block;
    position: absolute;
    left: 23px;
    bottom: 20px;
    color: #FFFFFF;
  }
}
</style>

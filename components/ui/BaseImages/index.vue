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
    };
  },
  computed: {
    classIcon() {
      return [
        { 'icon__download icon-download': this.isShowDownload },
        { 'icon-close_big': !this.isShowDownload },
      ];
    },
  },
  methods: {
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
  margin-top: 15px;

  &__img {
    width: 100%;
    height: 100%;
  }

  &__icon {
    display: none;
    cursor: pointer;

    height: 45px;
    width: 45px;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.5);

    font-weight: 800;
    font-size: 25px;

    padding: 10px 0 0 10px;
  }

  &:hover .icon {
    display: block;
    position: absolute;
    left: 23px;
    bottom: 20px;
    color: #FFFFFF;
  }

  &:hover .image__img {
    filter: brightness(70%);
  }
}
@include _767 {
  .images {
    display: inline-block;
    white-space: nowrap;
    overflow-x: scroll;
    user-select: none;
    &__image {
      display: inline-block;
    }
  }
}
</style>

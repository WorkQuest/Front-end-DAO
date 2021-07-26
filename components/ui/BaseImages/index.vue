<template>
  <div
    class="images"
  >
    <div
      v-for="(item, i) in images"
      :id="item.id"
      :key="i"
      class="images__image image"
    >
      <img
        :src="item.img"
        alt=""
        class="image__img"
      >
      <span
        class="image__icon picture"
        :class="{'icon-download icon__download':isShowDownload, 'icon-close_big':!isShowDownload}"
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
      default: false,
    },
  },
  data() {
    return {
      images: this.items,
    };
  },
  methods: {
    onIconClick(id) {
      if (this.isShowDownload) this.downloadImage(id);
      if (!this.isShowDownload) this.deleteImage(id);
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
  text-align: center;
  &__img {
    width: 100%;
    height: 100%;
    &_brightness {
      filter: brightness(70%);
    }
  }
}
.image:hover
.image__img{
  filter: brightness(70%);
}
.image:hover
.picture{
  display: inline;
  position: absolute;
  left: 23px;
  bottom: 20px;
  color: #FFFFFF;
}
.picture{
  display: none;
  cursor: pointer;
  height: 45px;
  width: 45px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  font-weight: 800;
  font-size: 25px;
  padding: 10px 10px 0 10px;

  &_visible {
    display: block;
    position: absolute;
    left: 23px;
    bottom: 20px;
    color: #FFFFFF;
  }
}
</style>

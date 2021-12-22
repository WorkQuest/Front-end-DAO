<template>
  <div
    class="images"
  >
    <div
      v-for="(item, i) in items"
      :id="i"
      :key="i"
      class="images__image image"
    >
      <img
        :src="item.img || item.url"
        alt=""
        class="image__img"
        @click="mode !== 'default' ? showGallery(item) : ''"
      >
      <span class="image__size">
        {{ item.size }}
      </span>
      <span
        v-if="mode === 'default'"
        class="image__icon icon"
        :class="classIcon"
        @click="onIconClick(item)"
      />
    </div>
  </div>
</template>

<script>
import modals from '~/store/modals/modals';

export default {
  props: {
    mode: {
      type: String,
      default: () => 'default',
    },
    items: {
      type: Array,
      default: () => [],
    },
    isShowDownload: {
      type: Boolean,
      default: true,
    },
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
    showGallery(item) {
      this.ShowModal({ key: modals.showFile, imageSrc: item.url });
    },
    onIconClick(item) {
      this.deleteImage(item);
    },
    deleteImage(item) {
      this.$emit('remove', item);
    },
  },
};
</script>

<style lang="scss" scoped>
.images {
  display: inline-flex;
  flex-wrap: wrap;
}

.image {
  position: relative;
  overflow: hidden;
  height: 90px;
  width: 90px;
  border-radius: 6px;
  margin-right: 20px;
  margin-top: 15px;

  &__img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    cursor: pointer;
  }

  &__size {
    display: none;
    position: absolute;
    left: 2px;
    bottom: 1px;
    color: #FFFFFF;
    font-size: 12px;
    font-weight: 500;
  }

  &:hover .image__size {
    display: block !important;
    object-fit: cover;
  }

  &__size {
    display: none;
    position: absolute;
    left: 2px;
    bottom: 1px;
    color: #FFFFFF;
    font-size: 12px;
    font-weight: 500;
  }

  &:hover .image__size {
    display: block !important;
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
    filter: brightness(60%);
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

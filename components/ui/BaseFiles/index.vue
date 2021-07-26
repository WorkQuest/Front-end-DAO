<template>
  <span
    class="files"
    :class="[{'files_inline': isInLine}]"
  >
    <div
      v-for="(item, i) in files"
      :key="i"
      class="file"
    >
      <div class="file__icon">
        <img
          src="~/assets/img/ui/pdf.svg"
          alt=""
        >
      </div>
      <div class="file__name">
        {{ item.name }}
      </div>
      <div class="file__size">
        {{ item.size }}
      </div>
      <div
        v-if="isShowClose"
        class="file__close icon"
        @click="deleteFile(item.id)"
      >
        <span class="icon__close icon-close_big" />
      </div>
      <div
        v-if="isShowDownload"
        class="file__download download"
        @click="download(item.id)"
      >
        <div class="download__icon icon">
          <span class="icon__download icon-download" />
        </div>
      </div>
    </div>
    <div
      v-if="!files.length && isShowEmpty"
      class="files__empty"
    >
      {{ $t('discussions.noFiles') }}
    </div>
  </span>
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
    isShowClose: {
      type: Boolean,
      default: true,
    },
    isShowEmpty: {
      type: Boolean,
      default: true,
    },
    isFilesInline: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isInLine: this.isFilesInline,
      files: this.items,
    };
  },
  methods: {
    deleteFile(id) {
      this.files = this.files.filter((file) => file.id !== id);
      if (!this.files.length) this.isInLine = false;
    },
    download(id) {
      console.log('download', id);
    },
  },
};
</script>

<style lang="scss" scoped>

.files {
  width: 100%;
  &_inline {
    display: inline-flex;
  }
  &__empty {
    height: 33px;
    line-height: 33px;
    margin-top: 10px;
  }
  &__download {

  }
}

.file {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 10px;
  margin-right: 8px;

  &_margin-right {
    margin-right: 10px;
  }

  &__icon {
    width: 33px;
    height: 33px;
    margin-right: 8px;
  }

  &__name {
    font-size: 16px;
    line-height: 145%;
    color: #282F39;
    margin-right: 8px;
  }

  &__size {
    font-size: 13px;
    line-height: 130%;
    color: #A7AEB9;
  }

  &__close {
    margin: 3px 0 0 5px;
    background: #F7F8FA;
    width: 33px;
    height: 33px;
    border-radius: 6px;
    text-align: center;
    padding: 5px;
  }

  &__download {

  }

}

.icon {
  cursor: pointer;
  &__close {
    font-size: 16px;
    color: #DF3333;
  }

  &__download {
    color: #0083C7;
    font-size: 21px;
  }
}

.download {

  &__icon {
    width: 33px;
    height: 33px;
    border-radius: 6px;
    margin-left: 8px;
    padding-left: 6px;
    padding-top: 5px;
    vertical-align: middle;
    background: #F7F8FA;
  }

}
</style>

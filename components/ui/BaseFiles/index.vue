<template>
  <div
    class="files"
    :class="[{'files_inline': isInLine}]"
  >
    <div
      v-for="(file, i) in files"
      :key="file.id"
      class="file"
    >
      <div class="file__icon">
        <img
          src="~/assets/img/ui/pdf.svg"
          alt=""
        >
      </div>
      <div class="file__name">
        {{ file.name }}
      </div>
      <div class="file__size">
        {{ file.size }}
      </div>
      <div
        class="file__close icon"
        @click="deleteFile(file.id)"
      >
        <span class="icon__close icon-close_big" />
      </div>
      <div
        v-if="isShowDownload && i === files.length - 1"
        class="file__download download"
        @click="callUploader"
      >
        <div class="download__icon icon">
          <span class="icon__download icon-download" />
        </div>
      </div>
    </div>
    <div
      v-if="!files.length"
      class="files__download download files_empty"
      @click="callUploader"
    >
      <span>{{ $t('proposal.noFiles') }}</span>
      <div class="download__icon icon">
        <span class="icon__download icon-download" />
      </div>
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
    callUploader() {
      this.$refs.uploader.$children[0].$el.click();
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
  &_empty {
    display: flex;
    height: 33px;
    cursor: pointer;
    width: max-content;
    margin-top: 10px;

    & > span {
      line-height: 33px;
    }
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
    margin-top: 5px;
  }

  &__download {

  }

}

.icon {
  cursor: pointer;
  &__close {
    font-size: 16px;
    color: black;
  }

  &__download {
    color: #0083C7;
    font-size: 21px;
  }
}

.uploader {
  &_none{
    display: none;
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
    &:hover {
      background: #F7F8FA;
    }
  }

}
</style>

<template>
  <div
    class="files"
  >
    <div
      v-for="(item, i) in items"
      :key="i"
      class="files__file file"
    >
      <div class="file__icon">
        <img
          src="~/assets/img/ui/pdf.svg"
          alt=""
        >
      </div>
      <div
        class="file__container"
      >
        <div class="file__name">
          {{ item.name }}
        </div>
        <div class="file__size">
          {{ item.size }}
        </div>
      </div>
      <div class="file__actions actions">
        <div
          v-if="isShowDownload"
          class="actions__download download"
          @click="download(item.id)"
        >
          <div class="download__icon icon">
            <span class="icon__download icon-download" />
          </div>
        </div>
        <div
          v-else
          class="actions__close icon"
          @click="deleteFile(item.id)"
        >
          <span class="icon__close icon-close_big" />
        </div>
      </div>
    </div>
    <div
      v-if="!items.length && isShowEmpty"
      class="files__empty"
    >
      {{ $t('proposal.noFiles') }}
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
    isShowClose: {
      type: Boolean,
      default: false,
    },
    isShowEmpty: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    deleteFile(id) {
      // TODO: emit up
      // this.files = this.files.filter((file) => file.id !== id);
    },
    download(id) {
      // console.log('download file', id);
    },
  },
};
</script>

<style lang="scss" scoped>

.files {
  width: 100%;
  &__empty {
    height: 33px;
    line-height: 33px;
    margin-top: 10px;
  }
}

.file {
  display: flex;
  flex-direction: row;

  align-items: center;
  align-content: center;
  justify-content: flex-start;

  margin-top: 10px;
  margin-right: 8px;
  width: 300px;
  height: 33px;

  &_margin-right {
    margin-right: 10px;
  }

  &__icon {
    width: 33px;
    height: 33px;

    & > img {
      width: 100%;
      height: 100%;
    }
  }

  &__container {
    display: inline-flex;
    line-height: 33px;
    width: calc(100% - 82px);
  }

  &__name {
    font-size: 16px;
    color: #282F39;
    margin-left: 8px;
  }

  &__size {
    font-size: 13px;
    color: #A7AEB9;
    margin-left: 8px;
  }

  &__actions {
    display: inline-flex;
    height: 100%;
  }

}

.actions {
  justify-content: flex-end;
  &__close {
    padding-top: 7px;
  }
}

.icon {
  cursor: pointer;
  &__close {
    font-size: 16px;
    color: #DF3333;
  }

  &__download {
    font-size: 21px;
    color: #0083C7;
  }
}

.download {
  width: 33px;
  height: 33px;

  &__icon {
    width: 100%;
    height: 100%;
    border-radius: 6px;
    padding-left: 5px;
    padding-top: 5px;
    &:hover {
      background: #F7F8FA;
    }
  }

}
</style>

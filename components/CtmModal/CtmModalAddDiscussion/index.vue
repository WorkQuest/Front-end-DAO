<template>
  <ctm-modal-box
    class="add-discussion"
    :is-header="false"
  >
    <div class="add-discussion__content">
      <div class="add-discussion__header header">
        <div class="header__title">
          {{ $t('modals.addDiscussion') }}
        </div>
        <div class="header__close">
          <span
            class="icon-close_big header__close"
            @click="hide"
          />
        </div>
      </div>
      <validation-observer
        v-slot="{ handleSubmit, invalid }"
      >
        <div class="add-discussion__subtitle">
          {{ $t('modals.discussionTopic') }}
        </div>
        <validation-provider
          name="description-title"
          rules="required|max:78"
        >
          <base-field
            v-model="title"
            :placeholder="$t('modals.discussionTopic')"
            class="add-discussion__field"
            rules="required|max:78"
            :name="$t('modals.discussionTopic')"
          />
        </validation-provider>
        <div class="add-discussion__subtitle">
          {{ $t('modals.description') }}
        </div>
        <validation-provider
          name="description-description"
          rules="required|max:2000"
        >
          <base-textarea
            v-model="discussion"
            class="add-discussion__body"
            :placeholder="$t('modals.description')"
            rules="required|max:2000"
            mode="add-discussion"
            :name="$t('modals.description')"
          />
        </validation-provider>
        <base-uploader
          class="add-discussion uploader__container"
          type="all"
          :items="documents"
          :limit="docsLimit"
          :is-show-download="false"
          @remove="remove"
        >
          <template v-slot:actionButton>
            <input
              ref="fileUpload"
              class="uploader__btn_hidden"
              type="file"
              multiple
              :accept="accept"
              @change="handleFileSelected($event)"
            >
            <base-btn
              mode="outline"
              class="uploader__btn"
              @click="$refs.fileUpload.click()"
            >
              {{ $t('meta.addFile') }}
              <template v-slot:right>
                <span class="icon-plus_circle_outline add-discussion__plus" />
              </template>
            </base-btn>
          </template>
        </base-uploader>
        <div class="add-discussion__footer footer">
          <base-btn
            class="footer__buttons"
            mode="lightBlue"
            @click="hide"
          >
            {{ $t('modals.cancel') }}
          </base-btn>
          <base-btn
            :disabled="!isComplete() || invalid"
            class="footer__buttons"
            @click="handleSubmit(createDiscussion)"
          >
            {{ $t('modals.addDiscussion') }}
          </base-btn>
        </div>
      </validation-observer>
    </div>
  </ctm-modal-box>
</template>

<script>

export default {
  name: 'AddDiscussion',
  data() {
    return {
      accept: 'application/msword, application/pdf, image/jpeg, image/png',
      acceptedTypes: [],
      title: '',
      discussion: '',
      docsLimit: 10,
      documents: [],
      fileId: 0,
    };
  },
  computed: {
    docsLimitReached() {
      return this.documents.length >= this.docsLimit;
    },
  },
  mounted() {
    this.acceptedTypes = this.accept.replace(/\s/g, '').split(',');
  },
  methods: {
    isComplete() {
      return this.title && this.discussion;
    },
    remove(item) {
      this.documents = this.documents.filter((doc) => doc.id !== item.id);
    },
    checkContentType(file) {
      return this.acceptedTypes.indexOf(file.type) !== -1;
    },
    handleFileSelected(e) {
      if (!e.target.files[0] || this.docsLimitReached) return;
      const file = e.target.files[0];
      const type = file.type.split('/').shift() === 'image' ? 'img' : 'doc';

      if (!this.checkContentType(file)) {
        return;
      }

      const { size, name } = file;
      const sizeKb = size / 1000;
      const sizeMb = sizeKb / 1000;
      if (sizeMb > 20) return; // more 20mb
      let fileSize;
      if (sizeMb < 0.1) {
        fileSize = `${Math.round(sizeKb * 10) / 10}kb`;
      } else {
        fileSize = `${Math.round(sizeMb * 10) / 10}mb`;
      }
      this.documents.push({
        id: this.fileId,
        img: URL.createObjectURL(file),
        type,
        file,
        name,
        size: fileSize,
      });
      this.fileId += 1;
    },
    async createDiscussion() {
      const medias = await this.uploadFiles(this.documents);
      this.title = this.title.trim();
      this.discussion = this.discussion.trim();
      const response = await this.$store.dispatch('discussions/createDiscussion', {
        title: this.title,
        description: this.discussion,
        medias,
      });
      if (response.ok) {
        const { id } = response.result;
        await this.$router.push(`/discussions/${id}`);
      } else console.error('Something wrong, tell to developers');
      this.hide();
    },
    hide() {
      this.CloseModal();
    },
  },
};
</script>

<style lang="scss" scoped>
.uploader {
  &__container {
    margin: 30px 0 30px 0;
  }
  &__btn {
    height: 46px !important;
    width: 162px !important;
    margin-left: auto;
    margin-top: 15px;
    &_hidden {
      display: none;
    }
  }
}
.add-discussion {
  &__content {
    padding: 30px 28px;
    width: 100%;
    background-color: $white;
    border-radius: 6px;
  }

  &__header {
    margin-bottom: 10px;
  }

  &__field {
    width: 444px !important;
    height: 46px !important;
    background: #F3F7FA !important;
    justify-content: center;
    margin: 5px 0 25px 0;
    border-radius: 6px;
  }

  &__body {
    width: 444px;
    height: 174px;
    margin: 5px 0 15px 0;
  }

  &__plus {
    color: #0083C7;
    font-size: 22px;
    padding: 12px;
  }

  &__button {
    width: 162px !important;
    height: 46px !important;
    margin: 10px 0 25px auto;
    border: 0.1px solid #0083C7;
  }

  &__images {
    margin: 15px 0 15px 0;
  }

  &__files {
    margin-top: 10px !important;
  }
}

.header {
  display: flex;
  justify-content: space-between;

  &__title {
    font-weight: 500;
    font-size: 23px;
    line-height: 130%;
  }

  &__close {
    color: black;
    font-size: 25px;
  }
}

.footer {
  display: flex;
  justify-content: space-between;
  gap: 10px;

  &__buttons {
    width: 274px !important;
  }
}

@include _767 {
  .add-discussion {
    width: 90vw !important;

    &__content {
      width: 100%;
    }
  }
}

@include _575 {
  .add-discussion {
    &__field, &__body {
      width: 80vw !important;
    }
  }
}

@include _380 {
  .add-discussion {
    &__field, &__body {
      width: 75vw !important;
    }
  }
}
</style>

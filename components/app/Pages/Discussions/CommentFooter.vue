<template>
  <validation-observer
    ref="observer"
    v-slot="{invalid}"
    tag="div"
    class="comment-footer"
  >
    <div class="comment-footer__uploader">
      <base-uploader
        class="uploader uploader__container"
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
            :accept="accept"
            @change="handleFileSelected($event)"
          >
        </template>
      </base-uploader>
    </div>
    <div class="comment-footer__footer">
      <base-btn
        class="footer footer__btn"
        @click="$refs.fileUpload.click()"
      >
        <span class="icon-link footer__chain" />
      </base-btn>
      <base-field
        v-model="subCommentInput"
        class="footer__input"
        :placeholder="$t('discussions.input')"
        custom-rules="comment"
        rules="min:1"
        :name="$t('discussions.response')"
        :auto-focus="isReply"
        mode="comment-field"
        data-selector="COMMENT_TYPES"
        @keyup.enter.native="addSubCommentResponse(comment)"
      />
      <span
        v-if="!invalid"
        class="footer__error"
      >
        {{ charactersLeft }}
      </span>
      <base-btn
        class="footer__btn"
        :disabled="!isComplete() || invalid"
        @click="addSubCommentResponse(comment)"
      >
        <span
          class="icon-send footer__arrow"
          :class="{'footer__arrow_blue': isComplete()}"
        />
      </base-btn>
    </div>
  </validation-observer>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'CommentFooter',
  props: {
    isReply: {
      type: Boolean,
      default: false,
    },
    comment: {
      type: Object,
      default: () => {
      },
    },
  },
  data() {
    return {
      subCommentInput: '',
      accept: 'application/msword, application/pdf, image/jpeg, image/png, image/heic',
      acceptedTypes: [],
      documents: [],
      docsLimit: 10,
    };
  },
  computed: {
    ...mapGetters({
      currentDiscussion: 'discussions/getCurrentDiscussion',
    }),
    charactersLeft() {
      return (this.subCommentInput.length <= 400) ? `${this.$t('messages.characters_left')} ${400 - this.subCommentInput.length}` : '';
    },
    docsLimitReached() {
      return this.documents.length >= this.docsLimit;
    },
  },
  mounted() {
    this.acceptedTypes = this.accept.replace(/\s/g, '').split(',');
  },
  methods: {
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
    isComplete() {
      return this.subCommentInput;
    },
    async addSubCommentResponse(comment) {
      this.SetLoader(true);
      this.$refs.observer.validate();
      if (comment.level <= 4) {
        const medias = await this.UploadFiles(this.documents);
        const payload = {
          rootCommentId: comment.id,
          text: this.subCommentInput,
          medias,
        };
        await this.$store.dispatch('discussions/sendCommentOnDiscussion', { id: this.currentDiscussion.id, payload });
        this.$parent.showSubs = true;
        this.$parent.isReply = false;
        await this.$parent.loadSubs(comment.id);
        await this.$parent.getRootComments();
        this.subCommentInput = '';
        this.documents = [];
      }
      this.SetLoader(false);
    },
  },
};
</script>

<style lang="scss" scoped>
.comment-footer {
  &__footer {
    margin: 25px 0 10px 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    position: relative;
  }
}

.uploader {
  &__container {
    margin-left: 15px;
    display: flex;
  }

  &__btn {
    &_hidden {
      display: none;
    }
  }
}

.hide {
  display: none;
}

.base-btn {
  &_disabled {
    background: transparent !important;
  }
}

.comment {
  animation: show 1s 1;
  padding: 0 30px 0 0;
  display: flex;

  &__footer {
    height: 40px;
    display: grid;
    grid-template-columns: 1fr 11fr 1fr;
    margin: 20px;
    align-items: center;
    position: relative;
  }
}

.footer {
  animation: show 1s 1;
  display: flex;
  &__error {
    position: absolute;
    top: 58px;
    left: 60px;
    font-size: 12px;
    min-height: 23px;
    color: $black400;
  }

  &__input {
    animation: show 1s 1;
    @include text-usual;
    width: 100%;
    height: 40px;
    border-radius: 6px;
    border: none;
    padding: 10px 15px 10px 15px;
    margin: 0 0 20px 0;
  }

  &__chain {
    display: flex;
    width: 46px;
    height: 46px;
    background: #F7F8FA;
    border-radius: 6px;
    align-items: center;
    justify-content: center;
    color: #000000;
    font-size: 25px;
    cursor: pointer;
    transition: .5s;

    &:hover {
      color: #0083C7;
    }
  }

  &__btn {
    padding-right: 0;
    width: 46px !important;
    height: 46px !important;
    background: #F7F8FA;
    margin: 5px 0 0 0;
    cursor: pointer;
    animation: show 1s 1;

    &:hover {
      background: #F7F8FA;
    }
  }

  &__arrow {
    display: flex;
    width: 16px;
    height: 16px;
    padding: 20px;
    background: #F7F8FA;
    border-radius: 6px;
    align-items: center;
    justify-content: center;
    font-size: 25px;
    color: $black500;
    cursor: pointer;
    transition: .5s;

    &_blue {
      color: #0083C7;
    }
  }
}

@include _767 {
  .footer {
    &__error {
      left: 62px;
    }
  }
}

@include _380 {
  .comment-footer {
    &__footer {
      margin-top: 0;
    }
  }
}
</style>

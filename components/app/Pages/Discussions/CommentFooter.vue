<template>
  <validation-observer
    ref="observer"
    v-slot="{invalid}"
  >
    <div class="uploader">
      <base-uploader
        class="uploader__container"
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
    <div class="comment__footer footer">
      <base-btn
        class="footer__btn"
        @click="$refs.fileUpload.click()"
      >
        <template v-slot:left>
          <span class="icon-link footer__chain" />
        </template>
      </base-btn>
      <base-field
        v-model="subCommentInput"
        class="footer__input"
        :placeholder="$t('discussions.input')"
        rules="required|max:250"
        :name="$t('discussions.response')"
        mode="comment-field"
        @keyup.enter.native="addSubCommentResponse(comment)"
      />
      <base-btn
        class="footer__btn"
        :disabled="!isComplete() || invalid"
        @click="addSubCommentResponse(comment)"
      >
        <template v-slot:left>
          <span
            class="icon-send footer__arrow"
            :class="{'footer__arrow_blue': isComplete()}"
          />
        </template>
      </base-btn>
    </div>
  </validation-observer>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'CommentFooter',
  props: {
    comment: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      subCommentInput: '',
      accept: 'application/msword, application/pdf, image/jpeg, image/png',
      acceptedTypes: [],
      documents: [],
      docsLimit: 10,
    };
  },
  computed: {
    ...mapGetters({
      currentDiscussion: 'discussions/getCurrentDiscussion',
    }),
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
      this.$refs.observer.validate();
      const medias = await this.uploadFiles(this.documents);
      const payload = {
        rootCommentId: comment.id,
        text: this.subCommentInput,
        medias,
      };
      await this.$store.dispatch('discussions/sendCommentOnDiscussion', { id: this.currentDiscussion.id, payload });
      this.$parent.showSubs = true;
      this.$parent.isReply = false;
      await this.$parent.loadSubs(comment.id);
      this.subCommentInput = '';
    },
  },
};
</script>

<style lang="scss" scoped>
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
  animation: show  1s 1;
  padding: 0 30px 0 0;
  display: flex;
  &__footer {
    height: 40px;
    display: grid;
    grid-template-columns: 1fr 11fr 1fr;
    margin: 20px;
    align-items: center;
  }
}
.footer {
  animation: show  1s 1;
  display: flex;
  &__input {
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
    width: 40px;
    height: 40px;
    background: #F7F8FA;
    border-radius: 6px;
    align-items: center;
    justify-content: center;
    color: #000000;
    font-size: 25px;
    cursor: pointer;
  }
  &__btn {
    width: 40px !important;
    height: 40px !important;
    background: #F7F8FA;
    cursor: pointer;
    &:hover {
      background: #F7F8FA;
    }
  }
  &__arrow {
    display: flex;
    width: 40px;
    height: 40px;
    background: #F7F8FA;
    border-radius: 6px;
    align-items: center;
    justify-content: center;
    font-size: 25px;
    color: $black500;
    cursor: pointer;
    &_blue {
      color: #0083C7;
    }
  }
}
</style>

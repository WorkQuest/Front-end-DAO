<template>
  <div class="info">
    <div class="info__body">
      <div class="info__header header">
        <nuxt-link
          to="/discussions"
          class="header__link link"
        >
          <span class="icon-short_left link__arrow" />
          <div class="link__text">
            {{ $t('discussions.back') }}
          </div>
        </nuxt-link>
      </div>
      <div class="info__title">
        {{ $t('discussions.infoTitle') }}
      </div>
      <div class="info__field">
        <div class="info__discussion discussion">
          <div class="discussion__user user">
            <img
              :src="authorAvatarUrl ? authorAvatarUrl : require('~/assets/img/app/avatar_empty.png')"
              alt="userAvatar"
              class="user__avatar"
              @click="toInvestor(discussionAuthor.id)"
            >
            <span
              class="user__name"
              @click="toInvestor(discussionAuthor.id)"
            >
              {{ authorName() }}
            </span>
            <button
              v-if="false"
              class="user__star"
            >
              <img
                :src="currentDiscussion.star ? require('~/assets/img/ui/star_checked.svg'): require('~/assets/img/ui/star_simple.svg')"
                :alt="currentDiscussion.star ? 'checkedStar' : 'simpleStar'"
                @click="toggleFavorite(currentDiscussion.id)"
              >
            </button>
          </div>
          <div class="discussion__title">
            {{ currentDiscussion.title }}
          </div>
          <div class="discussion__date">
            {{ $moment(currentDiscussion.createdAt).format('Do MMMM YYYY, hh:mm a') }}
          </div>
          <div class="discussion__subtitle">
            {{ $t('discussions.files') }}
          </div>
          <div
            v-if="!discussionDocuments.length && !discussionImages.length"
            class="discussion__files"
          >
            {{ $t('discussions.noFiles') }}
          </div>
          <base-files
            v-if="discussionDocuments.length"
            class="discussion__files"
            :items="discussionDocuments"
          />
          <base-images
            v-if="discussionImages.length"
            class="discussion__images"
            mode="images"
            :items="discussionImages"
            :is-show-download="false"
          />
          <slot name="actionButton" />
          <div class="discussion__description description">
            <hr class="discussion__line">
            <div class="description__title">
              {{ $t('discussions.descriptionTitle') }}
            </div>
            <div class="description__item">
              {{ currentDiscussion.description }}
            </div>
          </div>
          <div class="discussion__bottom bottom bottom">
            <div class="bottom__footer">
              <div class="bottom__comment">
                <img
                  src="~assets/img/ui/comment.svg"
                  alt=""
                >
              </div>
              <div class="bottom__counter">
                {{ currentDiscussion.amountComments }}
              </div>
              <button class="bottom__like">
                <span
                  :class="{'bottom__like_chosen' : currentDiscussion.liked}"
                  class="icon-heart_fill bottom__like"
                  @click="toggleLikeOnDiscussion(discussionId)"
                />
              </button>
              <div class="bottom__counter bottom__counter_right">
                {{ currentDiscussion.amountLikes }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="info__heading heading">
        <div class="heading__title">
          {{ $t('discussions.commentTitle') }}
        </div>
        <base-btn
          v-if="!isAddComment"
          class="heading__btn"
          @click="addComment"
        >
          {{ $t('discussions.add') }}
        </base-btn>
        <base-btn
          v-if="!isAddComment"
          class="heading__btn_mobile"
          mode="transparent"
          @click="addComment"
        >
          <span class="heading__btn-text">
            + {{ $t('discussions.add') }}
          </span>
        </base-btn>
      </div>
      <validation-observer
        ref="observer"
        v-slot="{ invalid }"
      >
        <div
          v-if="isAddComment"
          class="info__response response"
        >
          <div
            class="response__field"
          >
            <div class="response__title">
              {{ $t('discussions.responseTitle') }}
            </div>
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
            <div class="response__footer footer">
              <base-btn
                class="footer__btn"
                @click="$refs.fileUpload.click()"
              >
                <span class="icon-link footer__chain" />
              </base-btn>
              <base-field
                ref="input"
                v-model="opinion"
                :auto-focus="isAddComment"
                class="footer__input"
                :placeholder="$t('discussions.input')"
                rules="min:1|max:250"
                :name="$t('discussions.response')"
                mode="comment-field"
                data-selector="OPINION"
                @keyup.enter.native="addRootCommentResponse"
              />
            </div>
            <div class="response__footer">
              <base-btn
                class="response__btn"
                mode="lightBlue"
                @click="addComment"
              >
                {{ $t('discussions.cancel') }}
              </base-btn>
              <base-btn
                :disabled="!isComplete() || invalid"
                class="response__btn"
                @click="addRootCommentResponse"
              >
                {{ $t('discussions.add') }}
              </base-btn>
            </div>
          </div>
        </div>
      </validation-observer>
      <empty-data
        v-if="rootComments.count === 0"
        :description="$t('discussions.comments.noComments')"
      />
      <div
        v-for="(comment) in rootComments.comments"
        :id="comment.id"
        :key="comment.id"
        class="info__comment comment"
      >
        <root-comment-field
          class="comment__field"
          :comment="comment"
        />
      </div>
      <base-pager
        v-if="totalPagesValue > 1"
        v-model="page"
        class="info__pagination"
        :total-pages="totalPagesValue"
      />
    </div>
  </div>
</template>

<script>

import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      accept: 'application/msword, application/pdf, image/jpeg, image/png',
      acceptedTypes: [],
      documents: [],
      docsLimit: 10,
      page: 1,
      perPager: 10,
      isAddComment: false,
      totalPagesValue: 1,
      discussionId: '',
      opinion: '',
    };
  },
  computed: {
    ...mapGetters({
      discussionImages: 'discussions/getDiscussionImages',
      discussionDocuments: 'discussions/getDiscussionDocuments',
      discussionAuthor: 'discussions/getCurrentDiscussionAuthorData',
      currentDiscussion: 'discussions/getCurrentDiscussion',
      authorAvatarUrl: 'discussions/getCurrentDiscussionAuthorAvatarUrl',
      rootComments: 'discussions/getRootComments',
      subComments: 'discussions/getSubCommentsLevel2',
    }),
    docsLimitReached() {
      return this.documents.length >= this.docsLimit;
    },
  },
  watch: {
    async page() {
      this.SetLoader(true);
      const additionalValue = `limit=${this.perPager}&offset=${(this.page - 1) * this.perPager}`;
      await this.getRootComments(additionalValue);
      this.SetLoader(false);
    },
  },
  async mounted() {
    this.SetLoader(true);
    this.acceptedTypes = this.accept.replace(/\s/g, '').split(',');
    this.discussionId = this.$route.params.id;
    await this.getCurrentDiscussion();
    await this.filterMediaToTypes();
    await this.getRootComments();
    this.totalPages();
    this.focus();
    this.SetLoader(false);
  },
  methods: {
    focus() {
      if (this.autoFocus) this.$refs.input.focus();
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
    isComplete() {
      return this.opinion;
    },
    async filterMediaToTypes() {
      const documents = this.currentDiscussion.medias.filter((file) => file.contentType === 'application/msword' || file.contentType === 'application/pdf');
      const images = this.currentDiscussion.medias.filter((file) => file.contentType === 'image/jpeg' || file.contentType === 'image/png');
      await this.$store.dispatch('discussions/setDiscussionDocuments', documents);
      await this.$store.dispatch('discussions/setDiscussionImages', images);
    },
    authorName() {
      if (this.discussionAuthor) return `${this.discussionAuthor.firstName} ${this.discussionAuthor.lastName}`;
      return this.$t('user.nameless');
    },
    toInvestor(authorId) {
      this.$router.push(`/investors/${authorId}`);
    },
    totalPages() {
      return Math.ceil(this.rootComments.count / this.perPager);
    },
    async getRootComments(additionalValue) {
      const discussionId = this.currentDiscussion.id;
      await this.$store.dispatch('discussions/getRootComments', { discussionId, additionalValue });
      this.totalPagesValue = this.totalPages();
    },
    async addRootCommentResponse() {
      this.SetLoader(true);
      this.$refs.observer.validate();
      const medias = await this.UploadFiles(this.documents);
      const payload = {
        text: this.opinion,
        medias,
      };
      await this.$store.dispatch('discussions/sendCommentOnDiscussion', { id: this.currentDiscussion.id, payload });
      this.isAddComment = false;
      this.opinion = '';
      await Promise.all([this.getRootComments(), this.getCurrentDiscussion()]);
      this.SetLoader(false);
    },
    async getCurrentDiscussion() {
      await this.$store.dispatch('discussions/getCurrentDiscussion', this.discussionId);
    },
    async toggleFavorite(discussionId) {
      this.SetLoader(true);
      await this.$store.dispatch('discussions/toggleStarOnDiscussion', {
        id: discussionId,
        like: this.currentDiscussion && !this.currentDiscussion.star,
      });
      await this.getCurrentDiscussion();
      this.SetLoader(false);
    },
    async toggleLikeOnDiscussion(discussionId) {
      this.SetLoader(true);
      await this.$store.dispatch('discussions/toggleLikeOnDiscussion', {
        id: discussionId,
        like: this.currentDiscussion && !this.currentDiscussion.liked,
      });
      await this.getCurrentDiscussion();
      this.SetLoader(false);
    },
    addComment() {
      this.isAddComment = !this.isAddComment;
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
    &_hidden {
      display: none;
    }
  }
}

.hide {
  visibility: hidden;
}

.info {
  animation: show 1s 1;

  &__comment {
    background: #fff;
    width: 100%;
  }

  &__body {
    justify-content: center;
    max-width: 1180px;
    margin: 0 auto;
    width: 100%;
    height: 100%;
    @include _1024;
  }

  &__header {
    margin: 20px 0 0 0;
    justify-content: left;
  }

  &__heading {
    margin: 30px 0 20px 0;
  }

  &__title {
    font-weight: 600;
    font-size: 28px;
    line-height: 36px;
    margin-right: auto;
    padding: 10px 0 20px 0;
  }

  &__field {
    justify-content: space-between;
  }

  &__discussion {
    width: 100%;
    height: 100%;
    background: #FFFFFF;
    border-radius: 8px;
    padding: 20px 20px 0 20px;
  }

  &__footer {
    margin-top: 20px;
  }

  &__pagination {
    margin-top: 5px;
  }
}

.heading {
  display: flex;
  justify-content: space-between;

  &__btn {
    width: 220px;
    height: 43px;
    border: none;
    outline: none;

    &_mobile {
      display: none;
    }
  }

  &__title {
    font-weight: 500;
    font-size: 24px;
    line-height: 32px;
    color: #1D2127;
  }
}

.link {
  display: flex;
  align-items: center;
  text-decoration: none;

  &__text {
    font-size: 18px;
    line-height: 130%;
    font-weight: 500;
    align-items: center;
    color: #4C5767;
  }

  &__arrow {
    margin: 6px 10px 6px 0;
    color: #4C5767;
    font-size: 25px;
    cursor: pointer;
  }
}

.comment {
  border-radius: 5px;
  margin: 10px 0 0 0;

  &:first-child {
    margin: 0;
  }

  &__field {
    width: 100%;
    height: 100%;
    background: #fff;
    border-radius: 8px;
  }

  &__subcomment {
    background: #fff;
    width: 100%;
    height: 100%;
    padding: 20px 20px 0 20px;
  }

  &__description {
    @include text-usual;
    color: #7C838D;
    align-self: stretch;
    margin: 20px 0 25px 0;
    overflow-wrap: break-word;
    word-break: break-all;
    width: 100%;
    display: flex;
  }

  &__btn {
    display: block;
    margin-left: auto;
    margin-right: auto;
    align-items: center;
    justify-content: center;
    width: 100px;
    height: 40px;
    color: #ffffff;
    font-family: 'Inter', sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 130%;
    text-align: center;
    transition: .3s;
    background: $blue;
    border-radius: 6px;

    &:hover {
      background: #103D7C;
    }
  }

  &__footer {
    margin-top: 20px;
  }
}

.user {
  display: flex;
  justify-content: flex-start;
  align-items: center;

  &__avatar {
    flex: 0 0 32px;
    width: 32px;
    height: 32px;
    left: 0;
    top: 0;
    border-radius: 50%;
    cursor: pointer;
    object-fit: cover;
  }

  &__name {
    @include text-usual;
    color: #1D2127;
    padding: 0 10px 0 10px;
    cursor: pointer;
  }

  &__date {
    font-size: 12px;
    line-height: 130%;
    color: #AAB0B9;
  }

  &__star {
    margin-left: auto;
    width: 20px;
    height: 20px;
  }
}

.bottom {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  a.nuxt-link-active {
    text-decoration: none;
  }

  &__panel {
    display: flex;
    align-items: center;
  }

  &__btn {
    align-items: center;
    width: 150px;
    height: 33px;
    border: none;
    padding: 0;
    outline: none;
  }

  &__like {
    margin-left: auto;
    margin-top: 5px;
    color: #E9EDF2;
    font-size: 22px;
    transition: 0.5s;

    &:hover {
      color: #0083C7;
    }

    &_chosen {
      color: #0083C7;

      &:hover {
        color: #E9EDF2;
      }
    }
  }

  &__comment {
    height: 18px;
    width: 18px;
  }

  &__counter {
    font-size: 14px;
    line-height: 18px;
    color: #1D2127;
    margin: 0 22px 0 8px;
    cursor: pointer;

    &_right {
      margin: 7px;
    }
  }

  &__footer {
    display: flex;
    align-items: center;
    margin-left: auto;
  }

  &__arrow {
    margin-top: 10px;
    margin-left: auto;
    margin-right: 7px;
  }
}

.discussion {
  &__title {
    font-weight: 600;
    font-size: 24px;
    line-height: 32px;
    margin: 20px 0 10px 0;
  }

  &__date {
    font-size: 14px;
    line-height: 130%;
    margin-bottom: 20px;
    color: #AAB0B9;
  }

  &__line {
    margin-top: 20px;
  }

  &__subtitle {
    font-weight: 600;
    font-size: 18px;
    line-height: 130%;
  }

  &__block {
    margin: 10px 0 20px 0;
  }

  &__filesUploader {
    margin: 0 0 20px 0 !important;
  }

  &__bottom {
    padding-bottom: 10px;
  }
}

.block {
  display: inline-flex;
  align-items: center;
  cursor: pointer;

  &__icon {
    margin: 0 16px 0 0;
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

  &__file {
    margin: 0 10px 0 8px;
  }

  &__close {
    height: 33px;
    width: 33px;
    margin-right: 13px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.description {
  &__item {
    @include text-usual;
    color: #7C838D;
    align-self: stretch;
    margin-bottom: 20px;
  }

  &__title {
    font-size: 18px;
    line-height: 130%;
    font-weight: 600;
    margin: 20px 0 10px 0;
  }
}

.response {
  &__field {
    background: #FFFFFF;
    border-radius: 8px;
    padding: 20px;
    margin: 20px 0 20px 0;
  }

  &__title {
    font-weight: 500;
    font-size: 18px;
    line-height: 130%;
  }

  &__footer {
    width: 100%;
    align-items: flex-start;
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }

  &__btn {
    width: 220px;
    height: 43px;
    margin-left: 20px;
    outline: none;

    &:last-child {
      margin-right: 15px;
    }
  }
}

.filesUploader {
  &__files {
    display: inline-flex;
    flex-direction: row;
  }
}

.footer {
  animation: show 1s 1;
  display: flex;

  &__input {
    @include text-usual;
    width: 100%;
    border-radius: 6px;
    border: none;
    padding: 10px 15px 10px 15px;
    margin: 0 0 20px 0;
  }

  &__chain {
    padding: 0 0 0 5px;
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
    padding-right: 5px;
    width: 46px !important;
    height: 46px !important;
    background: #F7F8FA;
    margin: 10px 0 0 0;
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
    color: #0083C7;
    cursor: pointer;
    padding: 0 0 0 10px;
  }
}

@include _1199 {
  .info {
    &__body {
      max-width: 100vw;
      padding: 15px;
    }
  }
}

@include _767 {
  .heading {
    margin-left: 15px;

    &__btn {
      display: none;

      &_mobile {
        display: block;
        width: 220px;
        height: 43px;
        border: none;
        outline: none;
      }

      &-text {
        color: $blue;
        font-weight: 600;
      }
    }
  }
  .info {
    &__body {
      padding: 0;
    }

    &__header,
    &__title {
      margin-left: 15px;
    }

    &__pagination {
      margin: 0 15px;
    }
  }
  .response {
    &__footer {
      justify-content: space-between;
      gap: 5px;
    }

    &__btn {
      margin: 0;
    }
  }
}

@include _480 {
  .heading {
    &__btn {
      &_mobile {
        width: 120px;
      }
    }
  }
}
</style>

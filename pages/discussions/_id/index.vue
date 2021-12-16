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
            <button class="user__star">
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
            {{ $moment(currentDiscussion.updatedAt).format('Do MMMM YYYY, hh:mm a') }}
          </div>
          <div class="discussion__subtitle">
            {{ $t('discussions.files') }}
          </div>
          <base-uploader
            class="discussion__uploader"
            type="all"
            :items="documents"
            :is-show-empty="true"
          />
          <div class="discussion__description description">
            <hr class="discussion__line">
            <div class="description__title">
              {{ $t('discussions.descriptionTitle') }}
            </div>
            <div class="description__item">
              {{ currentDiscussion.description }}
            </div>
          </div>
          <div class="discussion__bottom bottom bottom__footer">
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
      </div>
      <div
        v-if="isAddComment"
        class="info__response response"
      >
        <div class="response__field">
          <div class="response__title">
            {{ $t('discussions.responseTitle') }}
          </div>
          <div class="response__footer footer">
            <span class="icon-link footer__chain" />
            <input
              v-model="opinion"
              class="footer__comment"
              :placeholder="$t('discussions.input')"
            >
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
              class="response__btn"
              @click="addRootCommentResponse"
            >
              {{ $t('discussions.add') }}
            </base-btn>
          </div>
        </div>
      </div>
      <div
        v-if="rootComments.count === 0"
        class="info__comment comment "
      >
        <div class="comment__field">
          {{ $t('discussions.comments.noComments') }}
        </div>
      </div>
      <div
        v-for="(comment) in rootComments.comments"
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
      page: 1,
      perPager: 4,
      isAddComment: false,
      rootCommentObjects: {},
      rootCommentArray: [],
      totalPagesValue: 1,
      discussionId: '',
      opinion: '',
      documents: [
        {
          id: '1',
          type: 'doc',
          name: 'Some_document.pdf',
          size: '1.2 MB',
          img: 'https://static6.depositphotos.com/1029473/605/i/600/depositphotos_6058054-stock-photo-abstract-3d-image.jpg',
        },
        { img: require('~/assets/img/ui/rectangle.svg'), id: 1, type: 'img' },
        { img: require('~/assets/img/ui/rectangle.svg'), id: 2, type: 'img' },
        { img: require('~/assets/img/ui/rectangle.svg'), id: 3, type: 'img' },
        { img: require('~/assets/img/ui/rectangle.svg'), id: 4, type: 'img' },
        { img: require('~/assets/img/ui/rectangle.svg'), id: 5, type: 'img' },

      ],
    };
  },
  computed: {
    ...mapGetters({
      discussionAuthor: 'discussions/getCurrentDiscussionAuthorData',
      currentDiscussion: 'discussions/getCurrentDiscussion',
      authorAvatarUrl: 'discussions/getCurrentDiscussionAuthorAvatarUrl',
      rootComments: 'discussions/getRootComments',
      subComments: 'discussions/getSubCommentsLevel2',
    }),
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
    this.discussionId = this.$route.params.id;
    await this.getCurrentDiscussion();
    await this.getRootComments();
    this.totalPages();
    this.SetLoader(false);
  },
  methods: {
    // async loadSubs(rootId, level) {
    //   const res = await this.$store.dispatch('discussions/getSubCommentsLevel', { id: rootId });
    //   const obj = {
    //     2: this.sub2Comments,
    //     3: this.sub3Comments,
    //     4: this.sub4Comments,
    //     5: this.sub5Comments,
    //   };
    //   if (obj[level].length > 0) obj[level] = [];
    //   return obj[level].push(...res.comments);
    // },
    authorName() {
      if (this.discussionAuthor) return `${this.discussionAuthor.firstName} ${this.discussionAuthor.lastName}`;
      return this.$t('user.nameless');
    },
    toInvestor(authorId) {
      this.$router.push(`/investors/${authorId}`);
    },
    totalPages() {
      return Math.ceil(this.rootCommentObjects.count / this.perPager);
    },
    async getRootComments(additionalValue) {
      const discussionId = this.currentDiscussion.id;
      this.rootCommentObjects = await this.$store.dispatch('discussions/getRootComments', { discussionId, additionalValue });
      this.rootCommentArray = this.rootCommentObjects.comments;
      this.totalPagesValue = this.totalPages();
    },
    async getCurrentDiscussion() {
      await this.$store.dispatch('discussions/getCurrentDiscussion', this.discussionId);
    },
    async addRootCommentResponse() {
      const payload = {
        text: this.opinion,
        medias: [],
      };
      await this.$store.dispatch('discussions/sendCommentOnDiscussion', { id: this.currentDiscussion.id, payload });
      this.isAddComment = false;
      this.opinion = '';
      await this.getRootComments();
    },
    async toggleFavorite(discussionId) {
      if (this.currentDiscussion && this.currentDiscussion.star) {
        await this.$store.dispatch('discussions/toggleStarOnDiscussion', { id: discussionId, like: false });
      } if (this.currentDiscussion && !this.currentDiscussion.star) {
        await this.$store.dispatch('discussions/toggleStarOnDiscussion', { id: discussionId, like: true });
      }
      await this.getCurrentDiscussion();
    },
    async toggleLikeOnDiscussion(discussionId) {
      if (this.currentDiscussion && this.currentDiscussion.liked) {
        await this.$store.dispatch('discussions/toggleLikeOnDiscussion', { id: discussionId, like: false });
      } if (this.currentDiscussion && !this.currentDiscussion.liked) {
        await this.$store.dispatch('discussions/toggleLikeOnDiscussion', { id: discussionId, like: true });
      }
      await this.getCurrentDiscussion();
    },
    async toggleLikeOnComment(comment) {
      if (comment && Object.keys(comment.commentLikes).length > 0) {
        await this.$store.dispatch('discussions/toggleLikeOnComment', { id: comment.id, like: false });
      } if (comment && Object.keys(comment.commentLikes).length === 0) {
        await this.$store.dispatch('discussions/toggleLikeOnComment', { id: comment.id, like: true });
      }
      await this.getRootComments();
    },
    addComment() {
      this.isAddComment = !this.isAddComment;
    },
  },
};

</script>
<style lang="scss" scoped>
.info {
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
    color:  #4C5767;
    font-size: 25px;
    cursor: pointer;
  }
}
.comment {
  &__field {
    width: 100%;
    height: 100%;
    background: #fff;
    border-radius: 8px;
    padding-bottom: 15px;
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
  }
  &__btn {
    display: block;
    margin-left: auto;
    margin-right: auto;
    align-items: center;
    justify-content: center;
    width: 100px;
    height: 43px;
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
    flex: 0 0 0 32px;
    width: 32px;
    height: 32px;
    left: 0;
    top: 0;
    border-radius: 50%;
    cursor: pointer;
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
    cursor: pointer;
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
.footer {
  display: flex;
  &__input {
    @include text-usual;
    width: 1040px;
    height: 40px;
    background: #F7F8FA;
    border-radius: 6px;
    border: none;
    padding: 10px 20px 10px 15px;
    margin: 0 10px 0 10px;
  }
  &__comment {
    @include text-usual;
    width: 1090px;
    height: 40px;
    background: #F7F8FA;
    border-radius: 6px;
    border: none;
    padding: 10px 20px 10px 15px;
    margin: 0 0 0 10px;
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
    display:flex;
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
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
  &__btn {
    width: 220px;
    height: 43px;
    margin-left: 20px;
    outline: none;
  }
}
.filesUploader {
  &__files{
    display: inline-flex;
    flex-direction: row;
  }
}
</style>

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
              :src="authorAvatarSrc()"
              alt="userAvatar"
              class="user__avatar"
              @click="toInvestor(discussionAuthor.id)"
            >
            <span
              class="user__name"
              @click="toInvestor(discussionAuthor.id)"
            >
              {{ authorFirstName() }}
              {{ authorLastName() }}
            </span>
            <button class="user__star">
              <img
                :src="favoriteStarSrc(currentDiscussion)"
                :alt="favoriteStarAlt(currentDiscussion)"
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
        v-for="(elem) in rootComments.comments"
        :key="elem.id"
        class="info__comment comment"
      >
        <div class="comment__field">
          <div class="comment__user user">
            <img
              :src="authorAvatarSrc(elem)"
              alt="userAvatar"
              class="user__avatar"
              @click="toInvestor(elem.author.id)"
            >
            <div
              class="user__name"
              @click="toInvestor(elem.author.id)"
            >
              {{ authorFirstName(elem) }}
              {{ authorLastName(elem) }}
            </div>
            <div class="user__date">
              {{ $moment(elem.updatedAt).format('Do MMMM YYYY, hh:mm a') }}
            </div>
          </div>
          <div class="comment__description">
            {{ elem.text }}
          </div>
          <div class="comment__bottom bottom">
            <base-btn
              class="bottom__btn"
              mode="blue"
              @click="subCommentsToggle(elem.id)"
            >
              {{ rootCommentIdArray.includes(elem.id) ? $t('discussions.hide') : $t('discussions.show') }}
            </base-btn>
            <div class="bottom__panel">
              <img
                src="~assets/img/ui/comment.svg"
                alt=""
                class="bottom__comment"
              >
              <div class="bottom__counter">
                {{ elem.amountSubComments }}
              </div>
              <button class="bottom__like">
                <span
                  :class="{'bottom__like_chosen' : elem.commentLikes.length > 0 }"
                  class="icon-heart_fill bottom__like"
                  @click="toggleLikeOnComment(elem)"
                />
              </button>
              <div class="bottom__counter bottom__counter_right">
                {{ elem.amountLikes }}
              </div>
            </div>
          </div>
          <div
            v-if="rootCommentIdArray.includes(elem.id) && subComments.count === 0"
            class="comment comment__container"
          >
            <span class="comment__text">{{ $t('discussions.comments.noComments') }}</span>
          </div>
          <div
            v-if="rootCommentIdArray.includes(elem.id) && subComments.count > 0"
            class="comment comment__container"
          >
            <answers-card
              v-for="(item) in filterSubComments(elem.id)"
              :key="item.id"
              :item="item"
              class="comment__replays"
            />
          </div>
          <base-btn
            v-if="rootCommentIdArray.includes(elem.id) && subComments.count > 0"
            mode="blue"
            class="comment__btn"
          >
            {{ $t('discussions.more') }}
          </base-btn>
          <sub-comment-field :elem="elem" />
        </div>
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
import answersCard from '~/components/ui/AnswersCard';

export default {
  components: {
    answersCard,
  },
  data() {
    return {
      rootCommentIdArray: [],
      page: 1,
      perPager: 4,
      isAddComment: false,
      rootCommentObjects: {},
      rootCommentArray: [],
      filteredSubComments: [],
      totalPagesValue: 1,
      discussionId: '',
      opinion: '',
      subCommentInput: '',
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
      subComments: 'discussions/getUsersSubCommentsOnComment',
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
    authorAvatarSrc(elem) {
      if (elem && elem.author.avatar) return elem.author.avatar.url;
      if (this.authorAvatarUrl) return this.authorAvatarUrl;
      return require('~/assets/img/app/avatar_empty.png');
    },
    authorFirstName(elem) {
      if (elem && elem.author.firstName) return elem.author.firstName;
      if (this.discussionAuthor) return this.discussionAuthor.firstName;
      return this.$t('user.nameless');
    },
    authorLastName(elem) {
      if (elem && elem.author.lastName) return elem.author.lastName;
      if (this.discussionAuthor) return this.discussionAuthor.lastName;
      return '';
    },
    favoriteStarSrc(item) {
      if (item.star) return require('~/assets/img/ui/star_checked.svg');
      return require('~/assets/img/ui/star_simple.svg');
    },
    favoriteStarAlt(item) {
      if (item.star) return 'checkedStar';
      return 'simpleStar';
    },
    subCommentsToggle(rootCommentId) {
      this.getSubComments(rootCommentId);
      this.toggleShow(rootCommentId);
    },
    async toggleShow(rootCommentId) {
      if (this.rootCommentIdArray.length === 0) {
        this.rootCommentIdArray.push(rootCommentId);
        return true;
      } if (this.rootCommentIdArray.length === 1 && this.rootCommentIdArray.includes(rootCommentId)) {
        this.rootCommentIdArray.shift();
        return false;
      } if (this.rootCommentIdArray.length === 1 && !this.rootCommentIdArray.includes(rootCommentId)) {
        this.rootCommentIdArray.shift();
        this.rootCommentIdArray.push(rootCommentId);
        return true;
      }
      await this.getSubComments(rootCommentId);
      await this.filterSubComments(rootCommentId);
      return false;
    },
    filterSubComments(rootCommentId) {
      const subComments = this.subComments.comments;
      return subComments.filter((subComment) => subComment.rootCommentId === rootCommentId);
    },
    toInvestor(authorId) {
      this.$router.push(`/investors/${authorId}`);
    },
    totalPages() {
      if (this.rootCommentObjects.comments) {
        return Math.ceil(this.rootCommentObjects.count / this.perPager);
      }
      return 0;
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
    async getSubComments(commentId) {
      await this.$store.dispatch('discussions/getUsersSubCommentsOnComment', commentId);
    },
    async addRootCommentResponse() {
      const discussionId = this.currentDiscussion.id;
      const payload = {
        text: this.opinion,
        medias: [],
      };
      await this.$store.dispatch('discussions/sendCommentOnDiscussion', { discussionId, payload });
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
    padding: 20px;
    margin-bottom: 15px;
  }
  &__description {
    @include text-usual;
    color: #7C838D;
    align-self: stretch;
    margin: 20px 0 25px 0;
  }
  &__btn {
    border: none;
    outline: none;
    align-items: center;
    width: 190px;
    height: 33px;
    border-radius: 6px;
    text-align: center;
    display: block;
    margin-left: auto;
    margin-right: auto;
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

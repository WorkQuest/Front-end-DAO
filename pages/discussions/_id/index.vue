<template>
  <div class="info info__body">
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
    <div
      v-for="(item) in discussions"
      :key="item.id"
      class="info__field"
    >
      <div class="info__discussion discussion">
        <div class=" discussion__user user">
          <img
            src="~assets/img/icons/userAvatar.svg"
            alt=""
            class="user__avatar"
          >
          <span class="user__name">
            {{ item.userName }}
          </span>
          <button class="user__star">
            <img
              v-if="!isFavorite"
              src="~assets/img/ui/star_simple.svg"
              alt="simpleStar"
              @click="toggleFavorite"
            >
            <img
              v-else
              src="~assets/img/ui/star_checked.svg"
              alt="checkedStar"
              @click="toggleFavorite"
            >
          </button>
        </div>
        <div class="discussion__title">
          {{ item.title }}
        </div>
        <div class="discussion__date">
          {{ item.date }}
        </div>
        <div class="discussion__subtitle">
          {{ $t('discussions.files') }}
        </div>
        <span
          v-for="(file) in files"
          :key="file.id "
          class="discussion__block block"
        >
          <div class="block__icon">
            <img
              src="~/assets/img/ui/pdf.svg"
              alt=""
            >
          </div>
          <div class="block__name">
            {{ file.name }}
          </div>
          <div class="block__size">
            {{ file.size }}
          </div>
          <span class="block__close">
            <img
              src="~/assets/img/ui/close.svg"
              alt=""
            >
          </span>
        </span>
        <div class="discussion__images image">
          <div
            v-for="element in images"
            :key="element.id"
          >
            <img
              :src="element.image"
              class="image__file"
            >
            <div class="icon-off_close image__close" />
          </div>
          <span class="icon-download image__download" />
        </div>
        <div class="discussion__description description">
          <hr class="discussion__line">
          <div class="description__title">
            {{ $t('discussions.descriptionTitle') }}
          </div>
          <div class="description__item">
            {{ item.description }}
          </div>
        </div>
        <div class="discussion__bottom bottom">
          <div class="bottom__footer">
            <div class="bottom__comment">
              <img
                src="~assets/img/ui/comment.svg"
                alt=""
              >
            </div>
            <div class="bottom__counter">
              {{ item.commentCounter }}
            </div>
            <button class="bottom__like">
              <span
                v-if="!isLiked"
                class="icon-heart_fill bottom__like"
                @click="toggleLiked"
              />
              <span
                v-else
                class="icon-heart_fill bottom__like bottom__like_choosen"
                @click="toggleLiked"
              />
            </button>
            <div class="bottom__counter bottom__counter_right">
              {{ item.likeCounter }}
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
            class="footer__comment"
            :placeholder="$t('discussions.input')"
          >
        </div>
        <div class="response__footer">
          <base-btn
            class="response__btn"
            mode="blue"
            @click="addComment"
          >
            {{ $t('discussions.cancel') }}
          </base-btn>
          <base-btn class="response__btn">
            {{ $t('discussions.add') }}
          </base-btn>
        </div>
      </div>
    </div>
    <div
      v-for="(elem) in comments"
      :key="elem.id"
      class="info__comment comment"
    >
      <div class="comment__field">
        <div class="comment__user user">
          <img
            src="~assets/img/icons/userAvatar.svg"
            alt=""
            class="user__image"
          >
          <div class="user__name">
            {{ elem.userName }}
          </div>
          <div class="user__date">
            {{ elem.date }}
          </div>
        </div>
        <div class="comment__description">
          {{ elem.description }}
        </div>
        <div class="comment__bottom bottom">
          <base-btn
            class="bottom__btn"
            mode="blue"
            @click="toggleShow"
          >
            <p v-if="!isShow">
              {{ $t('discussions.show') }}
            </p>
            <p v-if="isShow">
              {{ $t('discussions.hide') }}
            </p>
          </base-btn>
          <div class="bottom__panel">
            <img
              src="~assets/img/ui/comment.svg"
              alt=""
              class="bottom__comment"
            >
            <div class="bottom__counter">
              {{ elem.commentCounter }}
            </div>
            <button class="bottom__like">
              <span
                  v-if="!isVote"
                  class="icon-heart_fill bottom__like"
                  @click="toggleVote"
              />
              <span
                  v-else
                  class="icon-heart_fill bottom__like bottom__like_choosen"
                  @click="toggleVote"
              />
            </button>
            <div class="bottom__counter bottom__counter_right">
              {{ elem.likeCounter }}
            </div>
          </div>
        </div>
        <div v-if="isShow">
          <answers-card
            v-for="(item) in answers"
            :key="item.id"
            :item="item"
            class="comment__replays"
          />
        </div>
        <base-btn
          v-if="isShow"
          mode="blue"
          class="comment__btn"
        >
          {{ $t('discussions.more') }}
        </base-btn>
        <div class="comment__footer footer">
          <span class="class= icon-link footer__chain" />
          <input
            class="footer__input"
            :placeholder="$t('discussions.input')"
          >
          <span class="class= icon-send footer__arrow" />
        </div>
      </div>
    </div>
    <pagination />
  </div>
</template>

<script>

import pagination from '~/components/app/Panels/Pagination';
import answersCard from '~/components/ui/AnswersCard';

export default {
  components: {
    pagination,
    answersCard,
  },
  data() {
    return {
      show: false,
      isFavorite: false,
      isLiked: false,
      isAddComment: false,
      isShow: false,
      isChoosen: false,
      isVote: false,
      discussions: [
        {
          id: 1,
          avatar: '~assets/img/icons/userAvatar.svg',
          userName: 'Rosalia Vans',
          title: 'Lorem ipsum dolor sit amet consectetur',
          date: 'Jan 01, 2021, 12:00',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Risus lacus quam tristique neque, donec amet id. Dui velit sit sapien eu. Massa auctor viverra in augue ac nulla. Tellus duis consectetur tellus vel. Consectetur id hendrerit molestie sit etiam fames ullamcorper egestas. Tortor, velit sem volutpat sed amet, sed elit eget. Bibendum tristique volutpat vitae dolor aliquet. Lectus tellus',
          likeCounter: 50,
          commentCounter: 50,
        },
      ],
      comments: [
        {
          id: 2,
          avatar: '~assets/img/icons/userAvatar.svg',
          userName: 'Rosalia Vans',
          date: '10 days ago',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Risus lacus quam tristique neque, donec amet id. Dui velit sit sapien eu. Massa auctor viverra in augue ac nulla. Tellus duis consectetur tellus vel. Consectetur id hendrerit molestie sit etiam fames ullamcorper egestas. Tortor, velit sem volutpat sed amet, sed elit eget. Bibendum tristique volutpat vitae dolor aliquet. Lectus tellus',
          likeCounter: 50,
          commentCounter: 50,
          isCommentLiked: false,
        },
        {
          id: 3,
          avatar: '~assets/img/icons/userAvatar.svg',
          userName: 'Rosalia Vans',
          date: '10 days ago',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Risus lacus quam tristique neque, donec amet id. Dui velit sit sapien eu. Massa auctor viverra in augue ac nulla. Tellus duis consectetur tellus vel. Consectetur id hendrerit molestie sit etiam fames ullamcorper egestas. Tortor, velit sem volutpat sed amet, sed elit eget. Bibendum tristique volutpat vitae dolor aliquet. Lectus tellus',
          likeCounter: 50,
          commentCounter: 50,
          isCommentLiked: false,

        },
        {
          id: 4,
          avatar: '~assets/img/icons/userAvatar.svg',
          userName: 'Rosalia Vans',
          date: '10 days ago',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Risus lacus quam tristique neque, donec amet id. Dui velit sit sapien eu. Massa auctor viverra in augue ac nulla. Tellus duis consectetur tellus vel. Consectetur id hendrerit molestie sit etiam fames ullamcorper egestas. Tortor, velit sem volutpat sed amet, sed elit eget. Bibendum tristique volutpat vitae dolor aliquet. Lectus tellus',
          likeCounter: 50,
          commentCounter: 50,
          isCommentLiked: false,

        },
        {
          id: 5,
          avatar: '~assets/img/icons/userAvatar.svg',
          userName: 'Rosalia Vans',
          date: '10 days ago',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Risus lacus quam tristique neque, donec amet id. Dui velit sit sapien eu. Massa auctor viverra in augue ac nulla. Tellus duis consectetur tellus vel. Consectetur id hendrerit molestie sit etiam fames ullamcorper egestas. Tortor, velit sem volutpat sed amet, sed elit eget. Bibendum tristique volutpat vitae dolor aliquet. Lectus tellus',
          likeCounter: 50,
          commentCounter: 50,
          isCommentLiked: false,
        },
        {
          id: 6,
          avatar: '~assets/img/icons/userAvatar.svg',
          userName: 'Rosalia Vans',
          date: '10 days ago',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Risus lacus quam tristique neque, donec amet id. Dui velit sit sapien eu. Massa auctor viverra in augue ac nulla. Tellus duis consectetur tellus vel. Consectetur id hendrerit molestie sit etiam fames ullamcorper egestas. Tortor, velit sem volutpat sed amet, sed elit eget. Bibendum tristique volutpat vitae dolor aliquet. Lectus tellus',
          likeCounter: 50,
          commentCounter: 50,
          isCommentLiked: false,
        },
      ],
      files: [
        {
          id: 7,
          size: '1.2 MB',
          name: 'Some_document.pdf',
        },
        {
          id: 8,
          size: '1.2 MB',
          name: 'Some_document.pdf',
        },
      ],
      images: [
        {
          image: require('~/assets/img/ui/rectangle.svg'),
          id: 1,
        },
        {
          image: require('~/assets/img/ui/rectangle.svg'),
          id: 2,

        },
        {
          image: require('~/assets/img/ui/rectangle.svg'),
          id: 3,
        },
        {
          image: require('~/assets/img/ui/rectangle.svg'),
          id: 4,
        },
        {
          image: require('~/assets/img/ui/rectangle.svg'),
          id: 5,
        },
      ],
      answers: [
        {
          id: 1,
          avatar: '~assets/img/icons/userAvatar.svg',
          userName: 'Rosalia Vans',
          date: '10 days ago',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Risus lacus quam tristique neque, donec amet id. Dui velit sit sapien eu. Massa auctor viverra in augue ac nulla. Tellus duis consectetur tellus vel. Consectetur id hendrerit molestie sit etiam fames ullamcorper egestas. Tortor, velit sem volutpat sed amet, sed elit eget. Bibendum tristique volutpat vitae dolor aliquet. Lectus tellus',
          likeCounter: 50,
        },
        {
          id: 2,
          avatar: '~assets/img/icons/userAvatar.svg',
          userName: 'Rosalia Vans',
          date: '10 days ago',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Risus lacus quam tristique neque, donec amet id. Dui velit sit sapien eu. Massa auctor viverra in augue ac nulla. Tellus duis consectetur tellus vel. Consectetur id hendrerit molestie sit etiam fames ullamcorper egestas. Tortor, velit sem volutpat sed amet, sed elit eget. Bibendum tristique volutpat vitae dolor aliquet. Lectus tellus',
          likeCounter: 50,
        },
        {
          id: 3,
          avatar: '~assets/img/icons/userAvatar.svg',
          userName: 'Rosalia Vans',
          date: '10 days ago',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Risus lacus quam tristique neque, donec amet id. Dui velit sit sapien eu. Massa auctor viverra in augue ac nulla. Tellus duis consectetur tellus vel. Consectetur id hendrerit molestie sit etiam fames ullamcorper egestas. Tortor, velit sem volutpat sed amet, sed elit eget. Bibendum tristique volutpat vitae dolor aliquet. Lectus tellus',
          likeCounter: 50,
        },
      ],
    };
  },
  methods: {
    toggleFavorite() {
      this.isFavorite = !this.isFavorite;
    },
    toggleLiked() {
      this.isLiked = !this.isLiked;
    },
    addComment() {
      this.isAddComment = !this.isAddComment;
    },
    toggleShow() {
      this.isShow = !this.isShow;
    },
    toggleVote() {
      this.isVote = !this.isVote;
    },
  },
};

</script>
<style lang="scss" scoped>
.info {
  &__body{
  justify-content: center;
  max-width: 1180px;
  margin: 0 auto;
  width: 100%;
  height: 100%;
  @include _1024;
  }
  &__header{
    margin: 30px 0px 0px 0px;
    justify-content: left;
  }
  &__heading{
    margin: 30px 0px 20px 0px;
  }
  &__title {
    font-weight: 600;
    font-size: 28px;
    line-height: 36px;
    margin-right: auto;
    padding: 20px 0px 20px 0px;
  }
  &__field {
    justify-content: space-between;
  }
  &__discussion{
    width: 100%;
    height: 100%;
    background: #FFFFFF;
    border-radius: 8px;
    padding: 20px;
  }
  &__footer{
    margin-top: 20px;
  }
}
.heading{
  display: flex;
  justify-content: space-between;
  &__btn {
    width: 220px;
    height: 43px;
    border: none;
    outline: none;
  }
  &__title{
    font-weight: 500;
    font-size: 24px;
    line-height: 32px;
    color: #1D2127;
  }
}
.link{
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
    margin: 6px 10px 6px 0px;
    color:  #4C5767;
    font-size: 25px;
    cursor: pointer;
  }
}
.comment{
  &__field{
    width: 100%;
    height: 100%;
    background: #FFFFFF;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 15px;
  }
  &__description{
    @include text-usual;
    color: #7C838D;
    align-self: stretch;
    margin: 20px 0px 25px 0px;
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
  &__footer{
    margin-top: 20px;
  }
}
.user{
  display: flex;
  justify-content: flex-start;
  align-items: center;
  &__avatar{
    flex: 0 0 0 32px;
    width: 32px;
    height: 32px;
    left: 0px;
    top: 0px;
    border-radius: 50%;
  }
  &__name{
    @include text-usual;
    color: #1D2127;
    padding: 0px 10px 0px 10px;
  }
  &__date{
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
    width: 130px;
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
    &_choosen{
      color: #0083C7;
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
    margin: 0px 22px 0px 8px;
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
.footer{
  display: flex;
  &__input{
    @include text-usual;
    width: 1040px;
    height: 40px;
    background: #F7F8FA;
    border-radius: 6px;
    border: none;
    padding: 10px 20px 10px 15px;
    margin: 0px 10px 0px 10px;
  }
  &__comment{
    @include text-usual;
    width: 1090px;
    height: 40px;
    background: #F7F8FA;
    border-radius: 6px;
    border: none;
    padding: 10px 20px 10px 15px;
    margin: 0px 0px 0px 10px;
  }
  &__chain{
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
  &__arrow{
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
    margin: 20px 0px 10px 0px;
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
  &__subtitle{
    font-weight: 600;
    font-size: 18px;
    line-height: 130%;
  }
  &__block{
    margin: 10px 0px 20px 0px;
  }
}

.block{
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  &__icon{
    margin: 0px 16px 0px 0px;
  }
  &__name{
    font-size: 16px;
    line-height: 145%;
    color: #282F39;
    margin-right: 8px;
  }
  &__size{
    font-size: 13px;
    line-height: 130%;
    color: #A7AEB9;
  }
  &__file{
    margin: 0px 10px 0px 8px;
  }
  &__close{
    height: 33px;
    width: 33px;
    margin-right: 13px;
    display:flex;
    justify-content: center; /*центрируем элемент по горизонтали */
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
    margin: 20px 0px 10px 0px;
  }
}
.image {
  display:flex;
  align-items: center;
  margin-left: auto;
  position: relative;
  &__download {
    color: black;
    font-size: 30px;
    align-items: center;
    cursor: pointer;
  }
  &__close{
    position: absolute;
    top: 33px;
    left: 33px;
    display: none;
    font-size: 25px;
    color: red;
    cursor: pointer;
  }
  &__file{
    align-items: center;
    margin-right: 20px;
  }:hover {
    -webkit-filter: brightness(40%);
    filter: brightness(40%);
 }
  &__file{
    align-items: center;
    margin-right: 20px;
  }:hover .image__close{
      display: block;
   }
}
.response{
  &__field{
      background: #FFFFFF;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0 20px 0;
  }
  &__title{
    font-weight: 500;
    font-size: 18px;
    line-height: 130%;
  }
  &__footer{
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
  &__btn{
    width: 220px;
    height: 43px;
    margin-left: 20px;
    border: none;
    outline: none;
  }
}
</style>

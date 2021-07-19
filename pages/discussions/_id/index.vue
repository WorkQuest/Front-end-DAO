<template>
  <div>
    <div class="info">
      <div class="info__header header">
            <nuxt-link to="/discussions" class="header__link link">
                 <div class="link__arrow" >
                   <span class ="icon-short_left" />
                </div>
                <div class="link__text">
                  {{ $t('discussions.back') }}
                </div>
          </nuxt-link>
      </div>
      <div class="info__title">
        {{ $t('discussions.infoTitle') }}
      </div>
      <div class="info__field"
              v-for="(item) in discussions"
              :key="item.id"
              :item="item"
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
                @click='toggleFavorite'
                v-if='!isFavorite'
                src="~assets/img/ui/star_simple.svg"
                alt="simpleStar">
              <img
                @click='toggleFavorite'
                v-else
                src="~assets/img/ui/star_checked.svg"
                alt="checkedStar">
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
        <div>
          <div class=" discussion__content">
        <div class="content"
             v-for="(file) in files"
             :key="file.id "
        >
          <div class="discussion_column column">
            <div class="column__icon" >
              <img
                  src = "~/assets/img/ui/pdf.svg"
                  alt=""
              >
            </div>
            <div class="column__name"> {{ file.name }} </div>
            <div class="column__size"> {{ file.size }} </div>
              <span class="column__close">
                <img
                  src = "~/assets/img/ui/close.svg"
                    alt=""
            >
          </span>
          </div>
        </div>
          </div>
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
          </div>
          <div class="bottom__footer">
            <div class="bottom__comment">
              <button>
                <img
                    src="~assets/img/ui/comment.svg"
                    alt=""
                >
              </button>
            </div>
            <div class="bottom__counter">
              {{ item.commentCounter }}
            </div>
            <button class= "bottom__like">
              <span  @click='toggleLiked'
                     v-if="!isLiked"
                     class= "icon-heart_fill bottom__like"
              />
              <span @click='toggleLiked'
                    v-else
                    class= "icon-heart_fill bottom__like bottom__like_choosen"
              />
            </button>
            <div class="bottom__counter bottom__counter_right">
              {{ item.likeCounter }}
            </div>
          </div>
        </div>
      </div>
      </div>
        <div class="discussion__heading heading">
          <div class="heading__title">{{ $t('discussions.commentTitle') }}</div>
        <base-btn class="heading__btn">
          {{ $t('discussions.add') }}
        </base-btn>
        </div>
        <div class="info__comment comment"
        v-for="(elem) in comments"
        :key="elem.id"
        :elem="elem">
          <div class="comment__field">
            <div class="user">
            <img
                src="~assets/img/icons/userAvatar.svg"
                alt=""
                class="user__image"
            >
            <div class="user__name">{{ elem.userName}}</div>
            <div class="user__date">{{ elem.date}}</div>
          </div>
          <div class="comment__description">{{ elem.description}}</div>
            <div class="comment__bottom bottom">
              <div class="bottom__panel">
                <div class="bottom__link">
                  <nuxt-link to="/">
                    {{ $t('discussions.show') }}
                  </nuxt-link>
                </div>
              </div>
              <div class="bottom__panel">
                <div class="bottom__comment">
                  <button>
                    <img
                        src="~assets/img/ui/comment.svg"
                        alt=""
                    >
                  </button>
                </div>
                <div class="bottom__counter">
                  {{ elem.commentCounter }}
                </div>
                <button class= "bottom__like">
                  <span @click='toggleLikedComment(elem.id)'
                        v-if="!elem.isCommentLiked"
                        class= "icon-heart_fill bottom__like" />
                  <span @click='toggleLikedComment(elem.id)'
                        v-else
                        class= "icon-heart_fill bottom__like bottom__like_choosen" />
                </button>
                <div class="bottom__counter bottom__counter_right">
                  {{ elem.likeCounter }}
                </div>
            </div>
          </div>
          <div class="footer info__footer">
            <button class="footer__chain"><span class="class= icon-link"></span>
              </button>
              <input class="footer__input" :placeholder="$t('discussions.input')" />
            <button class="footer__arrow"><span class="class= icon-send"></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {

  data() {
    return {
      isFavorite: false,
      isLiked: false,
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
    };
  },
  methods: {
    toggleFavorite() {
      this.isFavorite = !this.isFavorite;
    },
    toggleLiked() {
      this.isLiked = !this.isLiked;
    },
    toggleLikedComment(id) {
      this.comments = this.comments.map(
        (comment) => (comment.id !== id ? comment : { ...comment, isCommentLiked: !comment.isCommentLiked }),
      );
    },
  },
};

</script>
<style lang="scss" scoped>
.info {
  justify-content: center;
  max-width: 1180px;
  margin: 0 auto;
  width: 100%;
  height: 100%;
  @include _1024;
  &__header{
    margin: 30px 0px 0px 0px;
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
  &__search {
    flex: 1 1 auto;
    width: 680px;
    height: 43px;
    background: #FFFFFF;
    border-radius: 6px;
    align-items: end;
    color: #D8DFE3;
    @include text-usual;
  }
  &__footer{
    margin-top: 20px;
  }
  &__heading{
    margin: 30px 0px 20px 0px;
  }
}
.heading{
  display: flex;
  justify-content: space-between;
  &__btn {
    width: 220px;
    height: 43px;
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
      margin: 6px 6px 0px 0px;
  }
}
.icon-short_left:before {
  color:  #4C5767;
  font-size: 25px;
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
  &__link {
    @include text-usual;
    color: #0083C7;
    align-items: center;
    margin: 7px 14px 7px 10px;
  }
  &__like {
    margin-left: auto;
    margin-top: 5px;
    color: #E9EDF2;
    &_choosen{
      color: #0083C7;
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
    margin: 0px 22px 0px 8px;
    cursor: pointer;
    &_right {
      margin: 7px;
    }
  }
}
.icon-heart_fill:before{
  font-size: 22px;
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
  &__chain{
    display: flex;
    width: 40px;
    height: 40px;
    background: #F7F8FA;
    border-radius: 6px;
    align-items: center;
    justify-content: center;
  }
  &__arrow{
    display: flex;
    width: 40px;
    height: 40px;
    background: #F7F8FA;
    border-radius: 6px;
    align-items: center;
    justify-content: center;
  }
}
.header{
  display: flex;
  justify-content: left;
}
.icon-send:before {
  font-size: 25px;
  color: #0083C7;
}
.icon-link:before {
  color: #000000;
  font-size: 25px;
}
.discussion {
  width: 100%;
  height: 100%;
  background: #FFFFFF;
  border-radius: 8px;
  padding: 20px;
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
}
.content {
  display: flex;
}
.column{
  display: flex;
  &__icon{
    margin: 0px 16px 0px 0px;
  }
  &__size{
    font-size: 16px;
    line-height: 145%;
    color: #282F39;
  }
  &__file{
    margin: 0px 10px 0px 8px;
  }
  &__download{
    height: 33px;
    width: 33px;
    background: #F7F8FA;;
  }
}
.icon-file_pdf{
  font-size: 28px;
}
.user {
  display: flex;
  align-items: center;
  &__name {
    @include text-usual;
    color: #1D2127;
    padding: 10px;
  }
  &__avatar {
    flex: 0 0 0 32px;
    width: 32px;
    height: 32px;
    left: 0px;
    top: 0px;
    border-radius: 50%;
  }
  &__star {
    margin-left: auto;
    width: 20px;
    height: 20px;
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
.bottom {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  &__footer {
    display: flex;
    align-items: center;
  }
  &__like {
    margin-left: auto;
  }
  &__arrow {
    margin-top: 10px;
    margin-left: auto;
    margin-right: 7px;
  }
  &__comment {
    height: 18px;
    width: 18px;
  }
  &__counter {
    font-size: 14px;
    line-height: 18px;
    color: #1D2127;
    margin: 0px 22px 0px 8px;
    &_right {
      margin: 7px;
    }
  }
}

.icon-heart_fill:before{
  font-size: 22px;
}

.files{
  padding: 0px;
  margin-top: 12px;
}
</style>

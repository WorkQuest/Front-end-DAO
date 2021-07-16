<template>
  <div>
    <div class="info">
      <div class="header">
        <div class="header__link">
        <nuxt-link to="/discussions">
          <button class="header__arrow" >  <span class ="icon-short_left" /> </button>
          {{ $t('discussions.back') }}
        </nuxt-link>
        </div>
      </div>
      <div class="info__field">
          <infoCard
              v-for="(item, i) in discussions"
              :key="i"
              :item="item"
          />
      </div>
        <div class="heading info__heading">
          <div class="heading__title">{{ $t('discussions.commentTitle') }}</div>
        <base-btn class="heading__btn">
          {{ $t('discussions.add') }}
        </base-btn>
        </div>
        <div class="comment"
        v-for="(elem, i) in comments"
        :key="i"
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
            <div class="bottom">
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
                  <span class= "icon-heart_fill" />
                </button>
                <div class="bottom__counter bottom__counter_right">
                  {{ elem.likeCounter }}
                </div>
              </div>
            </div>
            <div class="footer info__footer">
              <button class="footer__chain"><span class="class= icon-link"></span></button>
              <input class="footer__input" :placeholder="$t('discussions.input')" />
              <button class="footer__arrow"><span class="class= icon-send"></span></button>
            </div>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
import infoCard from '~/components/ui/InfoCard';

export default {
  components: {
    infoCard,
  },
  data() {
    return {
      discussions: [
        {
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
          avatar: '~assets/img/icons/userAvatar.svg',
          userName: 'Rosalia Vans',
          date: '10 days ago',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Risus lacus quam tristique neque, donec amet id. Dui velit sit sapien eu. Massa auctor viverra in augue ac nulla. Tellus duis consectetur tellus vel. Consectetur id hendrerit molestie sit etiam fames ullamcorper egestas. Tortor, velit sem volutpat sed amet, sed elit eget. Bibendum tristique volutpat vitae dolor aliquet. Lectus tellus',
          likeCounter: 50,
          commentCounter: 50,
        },
        {
          avatar: '~assets/img/icons/userAvatar.svg',
          userName: 'Rosalia Vans',
          date: '10 days ago',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Risus lacus quam tristique neque, donec amet id. Dui velit sit sapien eu. Massa auctor viverra in augue ac nulla. Tellus duis consectetur tellus vel. Consectetur id hendrerit molestie sit etiam fames ullamcorper egestas. Tortor, velit sem volutpat sed amet, sed elit eget. Bibendum tristique volutpat vitae dolor aliquet. Lectus tellus',
          likeCounter: 50,
          commentCounter: 50,
        },
        {
          avatar: '~assets/img/icons/userAvatar.svg',
          userName: 'Rosalia Vans',
          date: '10 days ago',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Risus lacus quam tristique neque, donec amet id. Dui velit sit sapien eu. Massa auctor viverra in augue ac nulla. Tellus duis consectetur tellus vel. Consectetur id hendrerit molestie sit etiam fames ullamcorper egestas. Tortor, velit sem volutpat sed amet, sed elit eget. Bibendum tristique volutpat vitae dolor aliquet. Lectus tellus',
          likeCounter: 50,
          commentCounter: 50,
        },
        {
          avatar: '~assets/img/icons/userAvatar.svg',
          userName: 'Rosalia Vans',
          date: '10 days ago',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Risus lacus quam tristique neque, donec amet id. Dui velit sit sapien eu. Massa auctor viverra in augue ac nulla. Tellus duis consectetur tellus vel. Consectetur id hendrerit molestie sit etiam fames ullamcorper egestas. Tortor, velit sem volutpat sed amet, sed elit eget. Bibendum tristique volutpat vitae dolor aliquet. Lectus tellus',
          likeCounter: 50,
          commentCounter: 50,
        },
        {
          avatar: '~assets/img/icons/userAvatar.svg',
          userName: 'Rosalia Vans',
          date: '10 days ago',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Risus lacus quam tristique neque, donec amet id. Dui velit sit sapien eu. Massa auctor viverra in augue ac nulla. Tellus duis consectetur tellus vel. Consectetur id hendrerit molestie sit etiam fames ullamcorper egestas. Tortor, velit sem volutpat sed amet, sed elit eget. Bibendum tristique volutpat vitae dolor aliquet. Lectus tellus',
          likeCounter: 50,
          commentCounter: 50,
        },
      ],
    };
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
    margin: 30px 0px 1px 10px;
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
    font-size: 16px;
    line-height: 130%;
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
.header{
    display: flex;
    align-items: center;
  a.nuxt-link-active {
    text-decoration: none;
    color: #4C5767;
  }
    &__link {
      font-size: 18px;
      line-height: 130%;
      font-weight: 500;
      align-items: center;
    }
    &__arrow {
      margin: 42px 0px 6px 4px;
  }
}
.icon-short_left:before {
  color:  #4C5767;
  font-size: 20px;
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
    font-size: 16px;
    line-height: 130%;
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
    font-size: 16px;
    line-height: 130%;
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
    font-size: 16px;
    line-height: 130%;
    color: #0083C7;
    align-items: center;
    margin: 7px 14px 7px 10px;
  }
  &__like {
    margin-left: auto;
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
  color: #E9EDF2;
}
.footer{
  display: flex;
  &__input{
    width: 1040px;
    height: 40px;
    background: #F7F8FA;
    border-radius: 6px;
    border: none;
    font-size: 16px;
    line-height: 130%;
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
.icon-send:before {
  font-size: 25px;
  color: #0083C7;
}
.icon-link:before {
  color: #000000;
  font-size: 25px;
}
</style>

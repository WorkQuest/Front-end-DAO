<template>
  <div class="discussion">
    <div class="user">
      <img
          src="~assets/img/icons/userAvatar.svg"
          alt=""
          class="user__avatar"
      >
      <span class="user__name">
        {{ item.userName }}
      </span>
      <button class="user__star"> <img
          @click="isChecked = true"
          v-if="!isChecked"
          src="~assets/img/ui/star_simple.svg"
          alt="">
        <img
            @click="isChecked = false"
            v-if="isChecked"
            src="~assets/img/ui/star_checked.svg"
            alt="">
      </button>
    </div>
    <div class="discussion__title">
      {{ item.title }}
    </div>
    <div class="discussion__date">
      {{ item.date }}
    </div>
    <div class="discussion__subtitle">{{ $t('discussions.files') }}</div>
    <div class="content"
         v-for="(file, i) in files"
         :key="i"
    >
      <div class="column">
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
    <hr class="discussion__line">
    <div class="description">
      <div class="description__title">
        {{ $t('discussions.descriptionTitle') }}
      </div>
      <div class="description__item">
        {{ item.description }}
      </div>
    </div>
    <div class="bottom">
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
        <button class= "bottom__like"
                @click="isLiked = true"
                v-if="!isLiked" >
          <span class= "icon-heart_fill" />
        </button>
        <button class= "bottom__like"
                @click="isLiked = false"
                v-if="isLiked" >
          <span class= "icon-heart_fill liked" />
        </button>
        <div class="bottom__counter bottom__counter_right">
          {{ item.likeCounter }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {

  data() {
    return {
      isChecked: false,
      isLiked: false,
    };
  },
  props:
      {
        item: {
          type: Object,
          default: () => {},
        },
      },
};
</script>
<style lang="scss" scoped>
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
    font-size: 16px;
    line-height: 130%;
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
    font-size: 16px;
    line-height: 130%;
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
.icon-short_right:before {
  color:  #0083C7;
  font-size: 25px;
}
.icon-heart_fill:before{
  font-size: 22px;
  color: #E9EDF2;
}
.liked:before{
  color: #0083C7;
}
.files{
  padding: 0px;
  margin-top: 12px;
}
</style>

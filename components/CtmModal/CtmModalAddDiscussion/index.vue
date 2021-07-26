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
      <div class="add-discussion__subtitle">
        {{ $t('modals.discussionTopic') }}
      </div>
      <base-field
        v-model="title"
        placeholder="Placeholder"
        class="add-discussion__field"
      />
      <div class="add-discussion__subtitle">
        {{ $t('modals.description') }}
      </div>
      <textarea
        v-model="discussion"
        class="add-discussion__body"
        placeholder="Placeholder"
      />
      <base-files
        :is-show-download="false"
        :is-show-close="true"
        class="add-discussion__files"
        :items="[
          {name: 'Some_document', size:'1.2Mb', id:'1'},
        ]"
      />
      <base-images
        :is-show-download="false"
        class="add-discussion__images"
        :items="[
          {img: require('~/assets/img/ui/rectangle.svg'), id: 1},
          {img: require('~/assets/img/ui/rectangle.svg'), id: 2},
          {img: require('~/assets/img/ui/rectangle.svg'), id: 3},
          {img: require('~/assets/img/ui/rectangle.svg'), id: 4},
          {img: require('~/assets/img/ui/rectangle.svg'), id: 5}
        ]"
      />
      <base-btn
        class="add-discussion__button"
        mode="lightBlue"
      >
        {{ $t('modals.addFile') }}
        <span class="icon-plus_circle_outline add-discussion__plus" />
      </base-btn>
      <div class="add-discussion__footer footer">
        <base-btn
          class="footer__buttons"
          mode="lightBlue"
          @click="hide"
        >
          {{ $t('modals.cancel') }}
        </base-btn>
        <base-btn
          class="footer__buttons"
          @click="consoleValue"
        >
          {{ $t('modals.add') }}
        </base-btn>
      </div>
    </div>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'AddDiscussion',
  data() {
    return {
      title: '',
      discussion: '',
    };
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
    }),
  },
  methods: {
    hide() {
      this.CloseModal();
    },
    consoleValue() {
      console.log(this.title, this.discussion);
      this.title = '';
      this.discussion = '';
    },
  },
};
</script>

<style lang="scss" scoped>
.add-discussion {
  &__content{
    padding: 30px 28px;
    width:  630px;
    background-color: white;
    border-radius: 6px;
  }
  &__header{
    margin-bottom: 10px;
  }
  &__field{
    width:  574px!important;
    height: 46px!important;
    background: #F3F7FA;
    justify-content: center;
    margin: 5px 0 25px 0;
    border-radius: 6px;
    padding: -20px !important;
  }
  &__body {
    width: 574px;
    height: 174px;
    background: #F7F7FA;
    border-radius: 6px;
    padding: 11px 20px 11px 20px;
    margin: 5px 0px 15px 0px;
    border: none;
    resize: none;
    &:focus {
      background: #FFFFFF;
      border: 1px solid #0083C7;
    }
    &::placeholder{
      color:#B0B3B9;
    }
  }
    &__plus {
      color: #0083C7;
      font-size: 22px;
      padding: 12px;
  }
  &__button{
    width: 162px!important;
    height: 46px!important;
    margin: 10px 0 25px auto;
    border: 0.1px solid #0083C7;
  }
  &__images{
  margin: 15px 0px 15px 0px;
  }
  &__files{
    margin-top: 90px!important;
  }
}

.header{
  display: flex;
  justify-content: space-between;
  &__title{
    font-weight: 500;
    font-size: 23px;
    line-height: 130%;
  }
  &__close{
    color: black;
    font-size: 25px;
  }
}

.footer {
  display: flex;
  justify-content: space-between;
  &__buttons{
    width: 274px!important;
  }
}

</style>

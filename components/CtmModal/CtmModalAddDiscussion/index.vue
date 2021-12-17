<template>
  <ctm-modal-box
    class="add-discussion"
    :is-header="false"
  >
    <div
      class="add-discussion__content"
    >
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
      <validation-observer
        v-slot="{handleSubmit}"
      >
        <div class="add-discussion__subtitle">
          {{ $t('modals.discussionTopic') }}
        </div>
        <base-field
          v-model="title"
          :placeholder="$t('modals.discussionTopic')"
          class="add-discussion__field"
          rules="required|text-title"
          :name="$t('modals.discussionTopic')"
        />
        <div class="add-discussion__subtitle">
          {{ $t('modals.description') }}
        </div>
        <base-textarea
          v-model="discussion"
          class="add-discussion__body"
          :placeholder="$t('modals.description')"
          rules="required|text-desc"
          mode="add-discussion"
          :name="$t('modals.description')"
        />
        <base-uploader
          class="files__container"
          type="all"
          :items="documents"
          :is-show-empty="true"
          :is-show-download="false"
        >
          <template v-slot:actionButton>
            <base-btn
              mode="lightBlue"
              class="add-discussion__button"
            >
              {{ $t('meta.addFile') }}
              <template v-slot:right>
                <span class="icon-plus_circle_outline add-discussion__plus" />
              </template>
            </base-btn>
          </template>
        </base-uploader>
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
            @click="handleSubmit(createDiscussion)"
          >
            {{ $t('modals.addDiscussion') }}
          </base-btn>
        </div>
      </validation-observer>
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
      options: 'modals/getOptions',
      currentDiscussion: 'discussions/getCurrentDiscussion',
    }),
  },
  methods: {
    async getCurrentDiscussion() {
      await this.$store.dispatch('discussions/getCurrentDiscussion', this.currentDiscussion.id);
    },
    goToCurrentDiscussion() {
      this.$router.push(`/discussions/${this.currentDiscussion.id}`);
    },
    async createDiscussion() {
      const payload = {
        title: this.title,
        description: this.discussion,
        medias: [],
      };
      await this.$store.dispatch('discussions/createDiscussion', payload);
      await this.getCurrentDiscussion();
      this.goToCurrentDiscussion();
      this.hide();
    },
    hide() {
      this.CloseModal();
    },
  },
};
</script>

<style lang="scss" scoped>
.add-discussion {
  &__content {
    padding: 30px 28px;
    width:  630px;
    background-color: white;
    border-radius: 6px;
  }
  &__header {
    margin-bottom: 10px;
  }
  &__field {
    width:  574px!important;
    height: 46px!important;
    background: #F3F7FA!important;
    justify-content: center;
    margin: 5px 0 25px 0;
    border-radius: 6px;
  }
  &__body {
    width: 574px;
    height: 174px;
    background: #F7F7FA;
    border-radius: 6px;
    padding: 11px 20px 11px 20px;
    margin: 5px 0 15px 0;
    border: none;
    resize: none;
    &:focus {
      background: #FFFFFF;
      border: 1px solid #0083C7;
    }
    &::placeholder {
      color:#B0B3B9;
    }
  }
    &__plus {
      color: #0083C7;
      font-size: 22px;
      padding: 12px;
  }
  &__button {
    width: 162px!important;
    height: 46px!important;
    margin: 10px 0 25px auto;
    border: 0.1px solid #0083C7;
  }
  &__images {
  margin: 15px 0 15px 0;
  }
  &__files {
    margin-top: 10px!important;
  }
}

.header {
  display: flex;
  justify-content: space-between;
  &__title {
    font-weight: 500;
    font-size: 23px;
    line-height: 130%;
  }
  &__close {
    color: black;
    font-size: 25px;
  }
}

.footer {
  display: flex;
  justify-content: space-between;
  &__buttons {
    width: 274px!important;
  }
}
</style>

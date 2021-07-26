<template>
  <ctm-modal-box
    class="addProposal"
    :title="$t('modals.addProposal')"
  >
    <div class="addProposal__content content">
      <div class="content__voting">
        <div class="content__field">
          <base-field
            id="votingTopicInput"
            v-model="votingTopicInput"
            :placeholder="$t('modals.votingTopic')"
            :label="$t('modals.votingTopic')"
          />
        </div>
        <div class="content__field field">
          <div class="field__picker picker">
            <label
              for="runtime__picker"
              class="picker__header"
            >
              {{ $t('modals.numberOfVotes') }}
            </label>
            <div
              id="runtime__picker"
              class="picker__container"
            >
              <div class="btn__container btn__left">
                <button
                  v-if="pickerValue > 0"
                  class="picker__btn"
                  @click="pickerValue -= 1"
                >
                  <span
                    class="icon icon__caret icon-caret_left"
                  />
                </button>
              </div>
              <div class="picker__body">
                <div class="picker__number">
                  {{ pickerValue }}
                </div>
              </div>
              <div class="btn__container btn__right">
                <button
                  class="picker__btn"
                  @click="pickerValue += 1"
                >
                  <span
                    class="icon icon__caret icon-caret_right"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="content__dates">
        <div class="content__field">
          <base-field
            id="votingStartInput"
            v-model="votingStartInput"
            :placeholder="'DD/MM/YYYY'"
            :label="$t('modals.votingStart')"
          />
        </div>
        <div class="content__field">
          <base-field
            id="votingEndInput"
            v-model="votingEndInput"
            :placeholder="'DD/MM/YYYY'"
            :label="$t('modals.votingEnd')"
          />
        </div>
      </div>
      <div class="content__field field">
        <div class="content-field__description description">
          <label
            for="descriptionInput"
            class="description__header"
          >
            {{ $t('modals.description') }}
          </label>
          <textarea
            id="descriptionInput"
            v-model="descriptionInput"
            class="description__textarea"
          />
        </div>
      </div>
      <div class="content__field field">
        <div class="field__documents">
          <base-uploader
            class="uploader"
            type="all"
            :items="documents"
            :is-show-download="false"
          >
            <template v-slot:actionButton>
              <base-btn
                mode="outline"
                class="uploader__btn"
              >
                {{ $t('meta.addFile') }}
                <template v-slot:right>
                  <span class="icon icon__plus icon-plus_circle_outline" />
                </template>
              </base-btn>
            </template>
          </base-uploader>
        </div>
      </div>
      <div class="field__action action">
        <base-btn
          mode="outline"
          class="action__cancel"
          @click="hide()"
        >
          {{ $t('meta.cancel') }}
        </base-btn>
        <base-btn class="action__add">
          {{ $t('meta.addProposal') }}
        </base-btn>
      </div>
    </div>
  </ctm-modal-box>
</template>

<script>

export default {
  name: 'ModalAddProposal',
  data() {
    return {
      votingTopicInput: '',
      pickerValue: 0,
      votingStartInput: '',
      votingEndInput: '',
      descriptionInput: '',
      documents0: [],
      documents: [
        {
          id: '1',
          type: 'doc',
          name: 'some_document1.pdf',
          size: '1.2mb',
          img: 'https://static6.depositphotos.com/1029473/605/i/600/depositphotos_6058054-stock-photo-abstract-3d-image.jpg',
        }, {
          id: '2',
          type: 'doc',
          name: 'some_doc2.pdf',
          size: '1.5mb',
          img: 'https://static6.depositphotos.com/1029473/605/i/600/depositphotos_6058054-stock-photo-abstract-3d-image.jpg',
        }, {
          id: '3',
          type: 'doc',
          name: 'some_docum2.pdf',
          size: '1.5mb',
          img: 'https://static6.depositphotos.com/1029473/605/i/600/depositphotos_6058054-stock-photo-abstract-3d-image.jpg',
        }, {
          id: '4',
          type: 'img',
          name: 'some_doc2.pdf',
          size: '1.5mb',
          img: 'https://static6.depositphotos.com/1029473/605/i/600/depositphotos_6058054-stock-photo-abstract-3d-image.jpg',
        }, {
          id: '5',
          type: 'img',
          name: 'some_doc2.pdf',
          size: '1.5mb',
          img: 'https://static6.depositphotos.com/1029473/605/i/600/depositphotos_6058054-stock-photo-abstract-3d-image.jpg',
        }, {
          id: '6',
          type: 'img',
          name: 'some_doc2.pdf',
          size: '1.5mb',
          img: 'https://static6.depositphotos.com/1029473/605/i/600/depositphotos_6058054-stock-photo-abstract-3d-image.jpg',
        }, {
          id: '7',
          type: 'img',
          name: 'some_doc2.pdf',
          size: '1.5mb',
          img: 'https://static6.depositphotos.com/1029473/605/i/600/depositphotos_6058054-stock-photo-abstract-3d-image.jpg',
        },
      ],
    };
  },
  methods: {
    hide() {
      this.CloseModal();
    },
  },
};
</script>

<style lang="scss" scoped>

.addProposal {
  min-width: 630px !important;
  &__content {
    padding: 0 28px 30px;
    margin-top: 25px;
  }
}

.content {
  &__voting {
    display: grid;
    grid-template-columns: 3fr 1fr;
    align-items: flex-end;
    grid-gap: 25px;
  }
  &__dates {
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: flex-end;
    grid-gap: 25px;
  }
}

.field {
  &__description {
    min-height: 200px;
  }

  &__action {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 20px;
    margin-top: 20px;
  }
}

.icon {
  &__plus {
    color: #0083C7;
    font-size: 20px;
    margin-left: 7px;
  }
  &__caret {
    display: inline-block;
    height: 100%;
    width: 100%;
    font-size: 25px;
    color: #AAB0B9;
    padding-top: 10px;
    &:hover {
      color: #0083C7;
    }
  }
}

.picker {

  &__header {
    letter-spacing: -0.025em;
    margin-bottom: 13px;
    height: 24px;
    color: #1D2127;
  }

  &__container {
    display: grid;
    grid-template-columns: 1fr 2fr 1fr;
    background: #F3F7FA;
    border-radius: 6px;
    border: 1px solid transparent;
    height: 100%;
    min-height: 46px;
    margin-bottom: 23px;
  }

  &__btn {
    width: 100%;
    height: 100%;
  }
  &__body {
    @include text-simple;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &__number {
    @include text-simple;
    font-weight: 400;
    font-size: 16px;
    color: #1D2127;
  }
}

.description {
  &__header {
    @extend .picker__header;
  }

  &__textarea {
    resize: none;
    background: #f3f7fa;
    border: none;
    border-radius: 6px;
    min-height: 174px;
    width: 100%;
    padding: 10px 20px;
    &:focus {
      background: #FFFFFF;
      border: 1px solid #0083C7;
    }
  }
}

.uploader {
  &__btn {
    height: 46px !important;
    width: 162px !important;
    margin-left: auto;
    margin-top: 15px;
  }
}
</style>

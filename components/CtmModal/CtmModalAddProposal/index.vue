<template>
  <ctm-modal-box
    class="addProposal"
    :title="$t('modals.addProposal')"
  >
    <div class="addProposal__content content">
      <div class="content__grid content__grid_three-to-one">
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
                  class="picker__btn"
                  @click="pickerValue > 0 ? pickerValue -= 1 : pickerValue"
                  @mouseover="isCaretLeftHovered = true"
                  @mouseleave="isCaretLeftHovered = false"
                >
                  <span
                    class="icon icon__caret icon-caret_left"
                    :class="[{'icon__caret_blue': isCaretLeftHovered}]"
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
                  @mouseover="isCaretRightHovered = true"
                  @mouseleave="isCaretRightHovered = false"
                >
                  <span
                    class="icon icon__caret icon-caret_right"
                    :class="[{'icon__caret_blue': isCaretRightHovered}]"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="content__grid">
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
          <base-files
            class="uploader"
            :items="files"
            :is-show-close="true"
            :is-show-empty="false"
            :is-show-download="false"
          />
        </div>
        <div class="field__uploader uploader">
          <base-btn
            mode="outline"
            class="uploader__btn"
            @click="callUploader"
          >
            {{ $t('meta.addFile') }}
            <template v-slot:right>
              <span class="icon icon__plus icon-plus_circle_outline" />
            </template>
          </base-btn>
          <uploader
            ref="uploader"
            class="uploader_hidden"
          />
        </div>
      </div>
      <div class="field__action action">
        <base-btn
          :mode="'outline'"
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
import uploader from '~/components/ui/Uploader';

export default {
  name: 'ModalAddProposal',
  components: { uploader },
  data() {
    return {
      votingTopicInput: '',
      pickerValue: 0,
      votingStartInput: '',
      votingEndInput: '',
      descriptionInput: '',
      isCaretLeftHovered: false,
      isCaretRightHovered: false,
      files0: [],
      files: [
        {
          id: '1',
          type: 'pdf',
          name: 'some_document1.pdf',
          size: '1.2mb',
        },
        {
          id: '2',
          type: 'pdf',
          name: 'some_document2.pdf',
          size: '1.5mb',
        },
      ],
    };
  },
  methods: {
    hide() {
      this.CloseModal();
    },
    callUploader() {
      this.$refs.uploader.$children[0].$el.click();
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
  &__grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: flex-end;
    grid-gap: 25px;
    &_three-to-one {
      grid-template-columns: 3fr 1fr;
    }
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
    color: $blue;
    font-size: 20px;
    margin-left: 7px;
  }
  &__caret {
    font-size: 25px;
    color: #AAB0B9;
    &_blue {
      color: $blue;
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
    padding-top: 5px;
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
    color: $black800;
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
  &_hidden {
    display: none;
  }
}
</style>

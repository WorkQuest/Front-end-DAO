<template>
  <ctm-modal-box
    class="addProposal"
    :title="$t('modals.addProposal')"
  >
    <div class="ctm-modal__content">
      <div class="grid__2col grid__2col_3to1">
        <div class="ctm-modal__content-field">
          <base-field
            id="votingTopic_input"
            v-model="votingTopic_input"
            :placeholder="$t('modals.votingTopic')"
            :label="$t('modals.votingTopic')"
          />
        </div>
        <div class="ctm-modal__content-field content-field">
          <div class="content-field__picker picker">
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
                    class="icon-caret_left"
                    :class="[{'icon-caret_left_blue': isCaretLeftHovered}]"
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
                    class="icon-caret_right"
                    :class="[{'icon-caret_right_blue': isCaretRightHovered}]"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="grid__2col">
        <div class="ctm-modal__content-field">
          <base-field
            id="votingStart_input"
            v-model="votingStart_input"
            :placeholder="'DD/MM/YYYY'"
            :label="$t('modals.votingStart')"
          />
        </div>
        <div class="ctm-modal__content-field">
          <base-field
            id="votingEnd_input"
            v-model="votingEnd_input"
            :placeholder="'DD/MM/YYYY'"
            :label="$t('modals.votingEnd')"
          />
        </div>
      </div>
      <div class="ctm-modal__content-field content-field">
        <div class="content-field__description description">
          <label
            for="description_input"
            class="description__header"
          >
            {{ $t('modals.description') }}
          </label>
          <textarea
            id="description_input"
            v-model="description_input"
            class="description__textarea"
          />
        </div>
      </div>
      <div class="ctm-modal__content-field content-field">
        <div class="content-field__documents">
          <base-files
            class="uploader"
            :items="files"
            :is-show-close="true"
            :is-show-empty="false"
            :is-show-download="false"
          />
        </div>
        <div class="content-field__uploader uploader">
          <base-btn
            mode="outline"
            class="uploader__btn"
            @click="callUploader"
          >
            {{ $t('meta.addFile') }}
            <template v-slot:right>
              <span class="icon icon-plus_circle_outline" />
            </template>
          </base-btn>
          <uploader
            ref="uploader"
            class="uploader_hidden"
          />
        </div>
      </div>
      <div class="content-field__action action">
        <base-btn
          :mode="'outline'"
          class="action__cancel"
          @click="hide()"
        >
          {{ $t('meta.cancel') }}
        </base-btn>
        <base-btn class="action__add-proposal">
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
      votingTopic_input: '',
      pickerValue: 0,
      votingStart_input: '',
      votingEnd_input: '',
      description_input: '',
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
    display: grid;
    grid-template-columns: 1fr;
    justify-items: center;
    grid-gap: 20px;
  }
  &__action {
    margin-top: 10px;
  }
}

.ctm-modal {
  @include modalKit;
}

.content-field {
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

.grid {
  &__2col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: flex-end;
    grid-gap: 25px;
    &_3to1 {
      grid-template-columns: 3fr 1fr;
    }
  }
}

.icon {
  &-plus_circle_outline {
    color: $blue;
    font-size: 20px;
    margin-left: 7px;
  }
  &-caret_left {
    font-size: 25px;
    color: #AAB0B9;
    &_blue {
      color: $blue;
    }
  }
  &-caret_right {
    color: #AAB0B9;
    font-size: 25px;
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

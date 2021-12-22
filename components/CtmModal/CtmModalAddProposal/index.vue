<template>
  <ctm-modal-box
    class="addProposal"
    :title="$t('modals.addProposal')"
  >
    <div class="addProposal__content content">
      <validation-observer v-slot="{ handleSubmit, valid }">
        <div class="content__voting">
          <div class="content__field">
            <base-field
              id="votingTopicInput"
              v-model="votingTopicInput"
              :placeholder="$t('modals.votingTopic')"
              :label="$t('modals.votingTopic')"
              rules="required|max:78|min:3"
              :name="$t('modals.votingTopicField')"
            />
          </div>
        </div>
        <div class="content__dates">
          <div class="content__field">
            {{ $t('modals.votingStart') }}
            <div class="date-field">
              {{ votingStartInput }}
            </div>
          </div>
          <div class="content__field">
            {{ $t('modals.votingEnd') }}
            <div class="date-field">
              {{ votingEndInput }}
            </div>
          </div>
        </div>
        <div class="content__field field">
          <div class="content-field__description description">
            <label
              for="description"
              class="description__header"
            >
              {{ $t('modals.description') }}
            </label>
            <validation-provider
              v-slot="{ errors }"
              rules="required|max:2000|min:20"
            >
              <textarea
                id="description"
                v-model="descriptionInput"
                class="description__textarea"
                name="description"
              />
              <div class="description__error">
                {{ errors[0] }}
              </div>
            </validation-provider>
          </div>
        </div>
        <div class="content__field field">
          <div class="field__documents">
            <base-uploader
              class="uploader"
              type="all"
              :items="documents"
              :is-show-download="false"
              rules="required|alpha_num"
              :name="$t('modals.recepientAddressField')"
              @remove="removeDocument"
            >
              <template v-slot:actionButton>
                <input
                  ref="fileUpload"
                  class="uploader__btn_hidden"
                  type="file"
                  :accept="accept"
                  @change="handleFileSelected($event)"
                >
                <base-btn
                  mode="outline"
                  class="uploader__btn"
                  :disabled="isDocumentsLimitReached"
                  @click="$refs.fileUpload.click()"
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
            @click="close()"
          >
            {{ $t('meta.cancel') }}
          </base-btn>
          <base-btn
            class="action__add"
            :disabled="!valid"
            @click="handleSubmit(addProposal)"
          >
            {{ $t('meta.addProposal') }}
          </base-btn>
        </div>
      </validation-observer>
    </div>
  </ctm-modal-box>
</template>

<script>

import { mapGetters } from 'vuex';
import { Chains } from '~/utils/enums';

export default {
  name: 'ModalAddProposal',
  data() {
    return {
      votingTopicInput: '',
      votingStartInput: '',
      votingEndInput: '',
      descriptionInput: '',
      fileId: 0,
      documents: [],
      docsLimit: 10,
      accept: 'application/msword, application/pdf, image/png, image/jpeg',
      acceptedTypes: [],
    };
  },
  computed: {
    ...mapGetters({
      isConnected: 'web3/getWalletIsConnected',
    }),
    isDocumentsLimitReached() {
      return this.documents.length >= this.docsLimit;
    },
  },
  async mounted() {
    this.acceptedTypes = this.accept.replace(/\s/g, '').split(',');
    const start = this.$moment();
    this.votingStartInput = this.$moment(start).format('DD/MM/YYYY');
    this.votingEndInput = this.$moment(start).add(1, 'M').format('DD/MM/YYYY');
  },
  methods: {
    close() {
      this.CloseModal();
    },
    async addProposal() {
      await this.$store.dispatch('web3/checkMetamaskStatus', Chains.ETHEREUM);
      if (!this.isConnected) return;
      this.SetLoader(true);
      this.descriptionInput = this.descriptionInput.trim();
      this.votingTopicInput = this.votingTopicInput.trim();
      const medias = await this.uploadFiles(this.documents);
      const { address } = await this.$store.dispatch('web3/getAccount');
      const res = await this.$store.dispatch('proposals/createProposal', {
        proposer: address,
        title: this.votingTopicInput,
        description: this.descriptionInput,
        medias,
      });
      if (res.ok) {
        const { nonce } = res.result;
        await this.$store.dispatch('web3/addProposal', { description: this.descriptionInput, nonce });
        await this.$store.dispatch('proposals/getProposals', {});
      }
      this.close();
      this.SetLoader(false);
    },
    removeDocument(doc) {
      this.documents = this.documents.filter((item) => item.id !== doc.id);
    },
    checkContentType(file) {
      return this.acceptedTypes.indexOf(file.type) !== -1;
    },
    handleFileSelected(e) {
      if (this.isDocumentsLimitReached) return;
      if (!e.target.files[0]) return;
      const file = e.target.files[0];
      const type = file.type.split('/').shift() === 'image' ? 'img' : 'doc';

      if (!this.checkContentType(file)) {
        return;
      }

      const { size, name } = file;
      const sizeKb = size / 1000;
      const sizeMb = sizeKb / 1000;
      if (sizeMb > 20) return; // more 20mb
      let fileSize;
      if (sizeMb < 0.1) {
        fileSize = `${Math.round(sizeKb * 10) / 10}kb`;
      } else {
        fileSize = `${Math.round(sizeMb * 10) / 10}mb`;
      }
      this.documents.push({
        id: this.fileId,
        img: URL.createObjectURL(file),
        type,
        file,
        name,
        size: fileSize,
      });
      this.fileId += 1;
    },
  },
};
</script>

<style lang="scss" scoped>

.addProposal {
  min-width: 630px;
  &__content {
    padding: 0 28px 30px;
    margin-top: 25px;
  }
}

.content {
  &__voting {
    width: 100%;
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
  &__field{
    min-width: 72px;
    text-align: center;
  }

  &__container {
    display: grid;
    grid-template-columns: 1fr 2fr 1fr;
    background: $black0;
    border-radius: 6px;
    border: 1px solid transparent;
    height: 46px;
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
    background: $black0;
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

  &__error {
    color: #F82727;
    font-size: 12px;
    min-height: 23px;
  }
}

.uploader {
  &__btn {
    height: 46px !important;
    width: 162px !important;
    margin-left: auto;
    margin-top: 15px;
    &_hidden {
      display: none;
    }
  }
}
.date-field {
  margin-bottom: 25px;
  margin-top: 5px;
  background: #F7F8FA;
  border-radius: 6px;
  height: 46px;
  padding: 12.5px 15px;
  font-size: 16px;
  line-height: 130%;
}
@include _767 {
  .addProposal {
    min-width: 550px;
  }
}
@include _575 {
  .addProposal {
    min-width: 90vw;
  }
  .content {
    &__voting {
      grid-gap: 5px;
      align-items: flex-end;
    }
  }
}
</style>

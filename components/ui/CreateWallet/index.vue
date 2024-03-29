<template>
  <div
    class="wallet"
    :class="{ wallet_hidden: step === walletState.Default }"
  >
    <div
      v-if="step === walletState.SaveMnemonic"
      class="wallet__container"
    >
      <div class="wallet__text wallet__text_title">
        {{ $t('createWallet.savePhrase') }}
      </div>
      <form
        class="wallet__fields"
        @submit.prevent="$emit('goStep', walletState.ConfirmMnemonic)"
      >
        <div class="wallet__mnemonic">
          <input
            v-model="mnemonic"
            :type="inputType"
            disabled
            class="wallet__phrase-input"
            data-selector="MNEMONIC"
          >
          <button-copy
            :copy-value="mnemonic"
            mode="mnemonic"
            :is-show-toast-success="false"
            class="wallet__mnemonic_copy"
            @click="showCopySuccess"
          />
        </div>
        <div class="wallet__confirm-phrase">
          <input
            id="showMnemonic"
            v-model="isShowMnemonic"
            type="checkbox"
            class="wallet__confirm-phrase_box"
          >
          <label
            for="showMnemonic"
            class="wallet__confirm-phrase_label"
          >
            {{ $t('createWallet.showSecretPhrase') }}
          </label>
        </div>
        <div class="wallet__confirm-phrase">
          <input
            id="savedMnemonic"
            v-model="savedMnemonicValue"
            type="checkbox"
            class="wallet__confirm-phrase_box"
          >
          <label
            for="savedMnemonic"
            class="wallet__confirm-phrase_label"
          >
            {{ $t('createWallet.keptPhrase') }}
          </label>
        </div>

        <div class="wallet__action">
          <base-btn :disabled="!savedMnemonicValue">
            {{ $t('meta.next') }}
          </base-btn>
        </div>
      </form>
    </div>
    <ValidationObserver
      v-if="step === walletState.ConfirmMnemonic"
      v-slot="{ handleSubmit, valid }"
      class="wallet__container"
    >
      <div class="wallet__text wallet__text_title">
        {{ $t('createWallet.confirmSecretPhrase') }}
      </div>
      <form
        class="wallet__fields"
        @submit.prevent="submitNewWallet"
      >
        <base-field
          v-model="confirmMnemonic.first"
          :rules="`required|is:${confirmMnemonicData.first}`"
          :placeholder="$t('createWallet.typeSecret', { a: confirmMnemonicData.firstIndex })"
          :name="$t('createWallet.secret', { a: confirmMnemonicData.firstIndex })"
          data-selector="CONFIRM-MNEMONIC-FIRST"
          type="password"
          class="wallet__input"
        />
        <base-field
          v-model="confirmMnemonic.second"
          :rules="`required|is:${confirmMnemonicData.second}`"
          :placeholder="$t('createWallet.typeSecret', { a: confirmMnemonicData.secondIndex })"
          :name="$t('createWallet.secret', { a: confirmMnemonicData.secondIndex })"
          data-selector="CONFIRM-MNEMONIC-SECOND"
          type="password"
          class="wallet__input"
        />
        <div class="wallet__action">
          <base-btn :disabled="!valid || isLoading">
            <slot name="actionText">
              {{ $t('createWallet.create') }}
            </slot>
          </base-btn>
        </div>
      </form>
    </ValidationObserver>
    <div
      v-if="step === walletState.ImportOrCreate"
      class="wallet_container"
    >
      <div class="wallet__text wallet__text_title">
        {{ $t('createWallet.createOrImport') }}
      </div>
      <div class="wallet__action">
        <base-btn @click="$emit('goStep', walletState.SaveMnemonic)">
          <slot>
            {{ $t('createWallet.create') }}
          </slot>
        </base-btn>
      </div>
      <div class="wallet__action">
        <base-btn @click="$emit('goStep', walletState.ImportMnemonic)">
          <slot>
            {{ $t('createWallet.importWallet') }}
          </slot>
        </base-btn>
      </div>
    </div>
    <ValidationObserver
      v-if="step === walletState.ImportMnemonic"
      v-slot="{ handleSubmit, valid }"
      class="wallet__container"
    >
      <div class="wallet__text wallet__text_title">
        {{ $t('createWallet.importWallet') }}
      </div>
      <form
        class="wallet__fields"
        @submit.prevent="handleSubmit(importWallet)"
      >
        <base-field
          v-model="mnemonicInput"
          rules="required|mnemonic"
          :placeholder="$t('createWallet.typeSecretPhrase')"
          :name="$t('createWallet.secretPhrase')"
          :type="inputType"
          data-selector="MNEMONIC-INPUT"
          class="wallet__input"
        />
        <div class="wallet__confirm-phrase">
          <input
            id="showMnemonicImport"
            v-model="isShowMnemonic"
            type="checkbox"
            class="wallet__confirm-phrase_box"
          >
          <label
            for="showMnemonicImport"
            class="wallet__confirm-phrase_label"
          >
            {{ $t('createWallet.showSecretPhrase') }}
          </label>
        </div>
        <div class="wallet__action">
          <base-btn :disabled="!valid || isLoading">
            <slot name="actionText">
              {{ $t('createWallet.importWallet') }}
            </slot>
          </base-btn>
        </div>
      </form>
    </ValidationObserver>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { createWallet, generateMnemonic } from '~/utils/wallet';

const { WalletState } = require('~/utils/enums');

export default {
  name: 'CreateWallet',
  props: {
    step: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      isShowMnemonic: false,
      savedMnemonicValue: false,
      mnemonic: '',
      mnemonicInput: '',
      confirmMnemonic: {
        first: '',
        second: '',
      },
      confirmMnemonicData: {
        firstIndex: null,
        secondIndex: null,
        first: '',
        second: '',
      },
      inputType: 'password',
    };
  },
  computed: {
    ...mapGetters({
      isLoading: 'main/getIsLoading',
    }),
    walletState() {
      return WalletState;
    },
  },
  watch: {
    step(newVal) {
      if (newVal === WalletState.Default) {
        this.generate();
        this.mnemonicInput = '';
      }
    },
    isShowMnemonic(newVal) {
      this.inputType = newVal ? 'text' : 'password';
    },
  },
  mounted() {
    this.generate();
  },
  methods: {
    showCopySuccess() {
      this.ShowToast(this.$t('modals.textCopy'), this.$t('createWallet.secretPhrase'));
    },
    generate() {
      this.mnemonic = generateMnemonic();
      const s = this.mnemonic.split(' ');

      const len = s.length;
      const first = Math.floor(Math.random() * len);
      let second = Math.floor(Math.random() * len);
      while (second === first) second = Math.floor(Math.random() * len);

      this.confirmMnemonicData = {
        firstIndex: first + 1,
        secondIndex: second + 1,
        first: s[first],
        second: s[second],
      };
    },
    submitNewWallet() {
      const wallet = createWallet(this.mnemonic);
      this.$emit('submit', {
        publicKey: wallet.publicKey,
        privateKey: wallet.privateKey,
        address: wallet.address,
        mnemonic: { phrase: this.mnemonic },
      });
    },
    importWallet() {
      const wallet = createWallet(this.mnemonicInput);
      this.$emit('import', {
        publicKey: wallet.publicKey,
        privateKey: wallet.privateKey,
        address: wallet.address,
        mnemonic: { phrase: this.mnemonicInput },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.wallet {
  &_hidden {
    display: none;
  }
  &_light {
    color: white !important;
  }
  &__back {
    cursor: pointer;
  }
  &__input {
    height: 46px;
    margin-bottom: 30px;
  }
  &__container {
    display: grid;
    grid-template-rows: auto;
  }
  &__text {
    font-family: 'Inter', sans-serif;
    font-style: normal;
    line-height: 130%;
    &_title {
      font-weight: 600;
      font-size: 34px;
      color: $black800;
    }
    &_simple {
      color: #000000;
      font-weight: 300;
      font-size: 16px;
      padding-top: 15px;
    }
    &_link {
      padding-left: 5px;
      font-weight: 300;
      font-size: 16px;
      color: #0083C7;
      text-decoration: underline;
    }
  }
  &__fields {
    padding-top: 30px;
    display: grid;
  }
  &__action {
    padding-top: 20px;
  }
  &__mnemonic {
    position: relative;
    padding: 10px 40px 10px 10px;
    background: $grey;
    border-radius: 12px;
    font-weight: 500;
    max-height: 46px;
    margin-bottom: 20px;
    ::before {
      color: $black600;
    }
    &_copy {
      position: absolute;
      right: 10px;
      top: 0;
      height: 100%;
      font-size: 28px;
      cursor: pointer;
      &:hover::before {
        color: $blue;
      }
    }
  }
  &__phrase-input {
    border: none;
    width: 100%;
    height: 100%;
  }
  &__confirm-phrase {
    margin-top: 20px;
    display: flex;
    align-items: center;
    &_label {
      color: $black700;
      margin: 0 0 0 10px !important;
      user-select: none;
    }
    &_box {
      width: 20px !important;
      height: 20px !important;
      cursor: pointer;
    }
  }
}
@include _1199 {
  .wallet {
    &__text {
      &_title {
        font-size: 28px;
      }
    }
  }
}
</style>

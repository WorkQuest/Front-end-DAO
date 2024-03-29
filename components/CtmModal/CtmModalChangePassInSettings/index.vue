<template>
  <ctm-modal-box
    class="password"
    :title="$t('settings.changePass')"
  >
    <div class="password__content content">
      <div class="content__error">
        {{ errorMsg ? $t('errors.incorrectPass') : null }}
      </div>
      <div class="content__field field">
        <base-field
          v-model="currentPasswordInput"
          :is-hide-error="true"
          placeholder="******"
          :label="$t('modals.currentPassword')"
          data-selector="CURRENT-PASSWORD"
          mode="icon"
          :type="isVisibleCurrent ? 'text': 'password'"
          class="field__input"
        >
          <template
            v-slot:left
            class="field__template"
          >
            <span class="icon-Lock field__picture" />
          </template>
          <template
            v-slot:right-absolute
            class="field__block"
          >
            <base-btn
              mode="max"
              :selector="`IS-VISIBLE-CURRENT-PASS-${isVisibleCurrent}`"
              class="field__button"
              :disabled="currentPasswordInput===''"
              @click="isVisibleCurrent=!isVisibleCurrent"
            >
              <span
                class="field__picture"
                :class="{'icon-show': isVisibleCurrent, 'icon-hide': !isVisibleCurrent }"
              />
            </base-btn>
          </template>
        </base-field>
      </div>
      <base-field
        v-model="newPasswordInput"
        :is-hide-error="true"
        placeholder="******"
        data-selector="NEW-PASSWORD"
        :label="$t('modals.newPassword')"
        mode="icon"
        :type="isVisible ? 'text': 'password'"
        class="field__input"
      >
        <template
          v-slot:left
          class="field__template"
        >
          <span class="icon-Lock field__picture" />
        </template>
        <template
          v-slot:right-absolute
          class="field__block"
        >
          <base-btn
            mode="max"
            :selector="`IS-VISIBLE-PASS-${isVisible}`"
            class="field__button"
            :disabled="newPasswordInput===''"
            @click="isVisible=!isVisible"
          >
            <span
              class="field__picture"
              :class="{'icon-show': isVisible, 'icon-hide': !isVisible }"
            />
          </base-btn>
        </template>
      </base-field>
      <base-field
        v-model="confirmNewPasswordInput"
        :is-hide-error="true"
        placeholder="******"
        data-selector="CONFIRM-NEW-PASSWORD"
        :label="$t('modals.confirmNewPassword')"
        mode="icon"
        :type="isVisibleConfirm ? 'text': 'password'"
      >
        <template v-slot:left>
          <span class="icon-Lock" />
        </template>
        <template
          v-slot:right-absolute
          class="field__block"
        >
          <base-btn
            mode="max"
            :selector="`IS-VISIBLE-CONFIRM-PASS-${isVisibleConfirm}`"
            class="field__button"
            :disabled="confirmNewPasswordInput===''"
            @click="isVisibleConfirm=!isVisibleConfirm"
          >
            <span
              class="field__picture"
              :class="{'icon-show': isVisibleConfirm, 'icon-hide': !isVisibleConfirm }"
            />
          </base-btn>
        </template>
      </base-field>
      <div class="content__buttons buttons">
        <div class="buttons__group">
          <base-btn
            class="buttons__button"
            selector="CHANGE"
            @click="hide()"
          >
            {{ $t('meta.change') }}
          </base-btn>
        </div>
      </div>
    </div>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';
import modals from '~/store/modals/modals';

export default {
  name: 'ModalChangePassSetting',
  data() {
    return {
      isVisible: false,
      isVisibleCurrent: false,
      isVisibleConfirm: false,
      currentPasswordInput: '',
      newPasswordInput: '',
      confirmNewPasswordInput: '',
      errorMsg: '',
    };
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
      email: 'user/getUserEmail',
    }),
  },
  methods: {
    async hide() {
      if (this.newPasswordInput.trim() !== this.confirmNewPasswordInput.trim() || this.newPasswordInput === '') {
        this.errorMsg = true;
        return;
      }
      const payload = {
        oldPassword: this.currentPasswordInput.trim(),
        newPassword: this.newPasswordInput.trim(),
      };
      this.SetLoader(true);
      try {
        const response = await this.$store.dispatch('user/editUserPassword', payload);
        if (response?.ok) {
          await this.$store.dispatch('user/signIn', {
            email: this.email,
            password: this.confirmNewPasswordInput,
          });
          this.ShowModal({
            key: modals.changePassword,
          });
        }
      } catch (e) {
        this.errorMsg = e;
        console.log(e);
      }
      this.SetLoader(false);
    },
  },
};
</script>

<style lang="scss" scoped>

.password {
  max-width: 382px !important;

  &__content {
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 20px;
    padding: 0 28px 30px 28px;
  }
}

.content__error {
  color: red;
}

.icon-show, .icon-hide {
  color: $blue;
  font-size: 25px;
}

.icon-Lock:before {
  color: $blue;
  font-size: 25px;
}

.buttons {
  &__button {
    background: transparent;
  }

  &__group {
    display: grid;
    grid-gap: 20px;
    gap: 20px;
    margin-top: 25px;
  }
}

.field {
  &__button {
    background-color: transparent !important;
    border: none !important;
  }
}

</style>

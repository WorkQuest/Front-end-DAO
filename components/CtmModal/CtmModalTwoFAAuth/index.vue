<template>
  <!--  TODO: Refactoring needed-->
  <ctm-modal-box
    class="messageSend"
    :title="$tc('modals.twoFAAuth')"
  >
    <div class="ctm-modal__content">
      <validation-observer
        v-slot="{ handleSubmit }"
        ref="twoFA"
      >
        <div class="step-panel">
          <div
            class="step-panel__step"
            :class="[{'step-panel__step_active': step === 1 || step === 2 || step === 3 || step === 4}]"
          >
            <span :class="[{'hide': step === 2 || step === 3 || step === 4}]">
              {{ $t('modals.step') }}
            </span>
            <span :class="[{'step__number': step === 2 || step === 3 || step === 4}]">
              1
            </span>
          </div>
          <div
            class="line"
            :class="[
              {'line__active': step === 2 || step === 3 || step === 4},
            ]"
          />
          <div
            class="step-panel__step"
            :class="[
              {'step-panel__step_active': step === 2 || step === 3 || step === 4},
            ]"
          >
            <span
              :class="[
                {'hide': step === 3 || step === 4},
              ]"
            >{{ $t('modals.step') }}</span>
            <span
              :class="[
                {'step__number': step === 3 || step === 4},
              ]"
            >2</span>
          </div>
          <div
            class="line"
            :class="[
              {'line__active': step === 3 || step === 4},
            ]"
          />
          <div
            class="step-panel__step"
            :class="[
              {'step-panel__step_active': step === 3 || step === 4},
            ]"
          >
            <span
              :class="[
                {'hide': step === 4},
              ]"
            >{{ $t('modals.step') }}</span>
            <span
              :class="[
                {'step__number': step === 2 || step === 3 || step === 4},
              ]"
            >3</span>
          </div>
          <div
            class="line"
            :class="[
              {'line__active': step === 4}
            ]"
          />
          <div
            class="step-panel__step"
            :class="[{'step-panel__step_active': step === 4}]"
          >
            <span> {{ $t('modals.step') }}</span>
            <span>4</span>
          </div>
        </div>
        <!-- Steps -->
        <div
          v-if="step === 1"
          class="step__container"
        >
          <div
            class="ctm-modal__content-field"
          >
            <div>
              <span class="content__text">{{ $t('modals.installGoogleAuth') }}</span>
            </div>
            <div class="btn__container">
              <div class="btn__wrapper">
                <div>
                  <base-btn mode="black">
                    {{ $t('modals.appleStore') }}
                    <template v-slot:left>
                      <img
                        :alt="$t('modals.appleStore')"
                        src="~/assets/img/ui/apple-icon.svg"
                      >
                    </template>
                  </base-btn>
                </div>
              </div>
              <div class="btn__wrapper">
                <div>
                  <base-btn mode="black">
                    {{ $t('modals.googlePlay') }}
                    <template v-slot:left>
                      <img
                        :alt="$t('modals.googlePlay')"
                        src="~/assets/img/ui/google-play-icon.svg"
                      >
                    </template>
                  </base-btn>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="step === 2"
          class="step__container"
        >
          <div class="ctm-modal__content-field">
            <span class="content__text">{{ $t('modals.useYourGoogleAuth') }}</span>
            <div class="qr__container">
              <qrcode
                v-if="qrLink"
                :value="qrLink"
                :options="{ width: 200 }"
              />
            </div>
            <span class="content__text">{{ $t('modals.ifYouCantScanBarcode') }}</span>
            <div class="flex__two-cols">
              <div class="code__container">
                <span class="code__text">{{ twoFACode }}</span>
              </div>
              <div>
                <button
                  v-clipboard:copy="twoFACode"
                  v-clipboard:success="ClipboardSuccessHandler"
                  v-clipboard:error="ClipboardErrorHandler"
                  class="btn__copy"
                  type="button"
                >
                  <span class="icon-copy" />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="step === 3"
          class="step__container"
        >
          <div class="ctm-modal__content-field">
            <span class="content__text">{{ $t('modals.pleaseSaveThisKey') }}</span>
            <div class="flex__two-cols">
              <div class="code__container">
                <span class="code__text">{{ twoFACode }}</span>
              </div>
              <div>
                <button
                  v-clipboard:success="ClipboardSuccessHandler"
                  v-clipboard:error="ClipboardErrorHandler"
                  v-clipboard:copy="twoFACode"
                  class="btn__copy"
                  type="button"
                >
                  <span class="icon-copy" />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="step === 4"
          class="step__container"
        >
          <div class="ctm-modal__content-field">
            <div class="content__text">
              {{ $t('modals.switchOnGoogleAuth') }}
            </div>
            <div class="content__text_grey">
              {{ $t('modals.toYourEmail') }} {{ userData.email }} {{ $t('modals.codeHasBeenSent') }}
            </div>
          </div>
          <div
            v-for="item in inputs"
            :key="item.id"
            class="ctm-modal__content-field"
          >
            <label
              :for="item.id"
              class="ctm-modal__label"
            >{{ item.label }}
            </label>
            <base-field
              :id="item.id"
              v-model="models[item.model]"
              :vid="item.id"
              :name="item.name"
              :data-selector="item.selector"
              :is-hide-error="false"
              :placeholder="item.placeholder"
              :rules="item.rules"
            />
          </div>
        </div>
        <!-- Steps btns -->
        <div class="btn__container">
          <div
            v-if="step !== 2 && step !== 3 && step !== 4"
            class="btn__onebtn"
          >
            <span
              v-if="step === 1"
              class="step__container"
            >
              <base-btn
                class="message__action"
                @click="nextStepWithEnable2FA()"
              >
                {{ $t('meta.next') }}
              </base-btn>
            </span>
          </div>
          <div
            v-if="step !==1"
            class="btn__wrapper"
          >
            <span
              v-if="step === 2"
              class="step__container"
            >
              <base-btn
                class="message__action"
                @click="nextStep()"
              >
                {{ $t('meta.next') }}
              </base-btn>
            </span>
            <span
              v-if="step === 3"
              class="step__container"
            >
              <base-btn
                class="message__action"
                @click="nextStep()"
              >
                {{ $t('meta.next') }}
              </base-btn>
            </span>
            <span
              v-if="step === 4"
              class="step__container"
            >
              <base-btn
                class="message__action"
                @click="handleSubmit(confirm)"
              >
                {{ $t('meta.next') }}
              </base-btn>
            </span>
          </div>
          <div
            v-if="step !==1"
            class="btn__wrapper"
          >
            <base-btn
              mode="outline"
              class="message__action"
              @click="previousStep()"
            >
              {{ $t('meta.back') }}
            </base-btn>
          </div>
        </div>
      </validation-observer>
    </div>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';
import modals from '~/store/modals/modals';

export default {
  name: 'ModalDeposit',
  data() {
    return {
      step: 1,
      qrLink: '',
      models: {
        confirmCode: '',
        totp: '',
      },
    };
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
      userData: 'user/getUserData',
      twoFACode: 'user/getTwoFACode',
    }),
    inputs() {
      return [
        {
          id: 'confirmCode',
          model: 'confirmCode',
          label: this.$t('modals.conformationCodeFromMail'),
          placeholder: this.$t('modals.conformationCodeFromMail'),
          rules: 'required|alpha_num',
          name: this.$t('modals.emailVerificationCodeField'),
          selector: 'CONFIRM-CODE',
        },
        {
          id: 'totp',
          model: 'totp',
          label: this.$t('modals.twoFAConfirmationCode'),
          placeholder: this.$t('modals.twoFAConfirmationCode'),
          rules: 'required|alpha_num',
          name: this.$t('modals.googleVerificationCodeField'),
          selector: 'GOOGLE-VERIFICATION-CODE',
        },
      ];
    },
  },
  methods: {
    async enable2FA() {
      const response = await this.$store.dispatch('user/enable2FA');
      if (response.ok) {
        this.qrLink = `otpauth://totp/${this.userData.email}?secret=${this.twoFACode}&issuer=WorkQuest.co`;
      }
    },
    async confirm() {
      const response = await this.$store.dispatch('user/confirmEnable2FA', {
        confirmCode: this.models.confirmCode,
        totp: this.models.totp,
      });
      if (response.ok) {
        this.hide();
        this.showModalSuccess();
      } else this.validationErrorFields(response.data);
    },
    validationErrorFields(data) {
      data.forEach(async (obj) => {
        const { field } = obj;
        const { name } = this.inputs.find((input) => input.id === field);
        const err = {
          [field]: [this.$t('messages.excluded', { _field_: name })],
        };
        await this.$refs.twoFA.setErrors(err);
      });
    },
    showModalSuccess() {
      this.ShowModal({
        key: modals.status,
        img: require('~/assets/img/ui/questAgreed.svg'),
        title: this.$t('modals.2FAStatus'),
        subtitle: this.$t('modals.2FAEnabled'),
      });
    },
    hide() {
      this.CloseModal();
    },
    previousStep() {
      this.step -= 1;
    },
    nextStep() {
      this.step += 1;
    },
    nextStepWithEnable2FA() {
      this.enable2FA();
      this.step += 1;
    },
  },
};
</script>

<style lang="scss" scoped>

.flex {
  &__two-cols {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }
}

.content {
  &__text {
    @include text-simple;
    margin: 20px 0;
    font-weight: 400;
    color: $black700;
    font-size: 18px;

    &_grey {
      @extend .content__text;
      font-size: 16px;
      color: $black400;
    }
  }
}

.icon {
  &-copy:before {
    content: "\e996";
    color: $blue;
    font-size: 20px;
  }
}

.qr {
  &__container {
    width: 100%;
    display: flex;
    justify-content: center;
    margin: 20px 0;
  }
}

.code {
  &__container {
    display: flex;
    border: 1px solid $black0;
    border-radius: 6px;
    justify-content: space-between;
    padding: 11px 15px;
    margin: 33px 10px 0 0;
    width: 100%;
  }

  &__text {
    font-weight: 400;
    font-size: 16px;
    line-height: 21px;
    color: $black800;
  }
}

.hide {
  display: none;
}

.grid {
  &__2col {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    justify-content: space-between;
    align-items: flex-end;
    grid-gap: 10px;
  }

  &__3col {
    display: grid;
    grid-template-columns: 6fr 1fr 6fr;
    justify-content: space-between;
    align-items: flex-end;
  }
}

.step {
  &__container {
    &_grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
    }
  }
}

.step-panel {
  display: flex;
  flex-direction: row;
  align-items: flex-start;

  &__step {
    display: inline-flex;
    justify-content: center;
    white-space: nowrap;
    height: 44px;
    min-width: 44px;
    line-height: 24px;

    @include text-simple;
    background: rgba(0, 131, 199, 0.1);
    border-radius: 6px;
    font-weight: 400;
    font-size: 16px;
    color: $black500;
    padding: 10px;

    & span:first-child {
      margin-right: 10px;
    }

    &_active {
      @extend .step-panel__step;
      color: $white;
      background: $blue;
    }
  }
}

.line {
  display: block;
  height: 1px;
  border-top: 1px solid rgba(0, 131, 199, 0.1);
  margin: auto 0;
  padding: 0;
  width: 35px;

  &__active {
    @extend .line;
    border-top: 1px solid $blue;
  }
}

.ctm-modal {
  &__content-field {
    margin: 15px 0 0 0;
  }

  &__equal {
    margin: 0 0 35px 10px;
  }
}

.ctm-modal {
  @include modalKit;
}

.input {
  &_white {
    border-radius: 6px;
    border: 1px solid $black0;
    padding: 11px 20px 11px 15px;
    height: 46px;
    width: 100%;
    background-color: $white;
    resize: none;

    &::placeholder {
      color: $black800;
    }
  }
}

.btn {
  &__container {
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
    margin: 15px 0 0 0;
  }

  &__wrapper {
    width: 45%;
  }

  &__onebtn {
    width: 100%;
  }

  &__copy {
    background: $white;
    border: 1px solid $black0;
    padding: 11px;
    border-radius: 6px;
    font-size: 0px;
  }
}

.messageSend {
  max-width: 430px !important;

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
</style>

<template>
  <div class="wq-profile">
    <validation-observer v-slot="{handleSubmit}">
      <div class="wq-profile__body">
        <div
          v-if="!localUserData.isVerified"
          class="wq-profile__banner banner"
        >
          <transition name="fade-fast">
            <div class="banner__body">
              <div class="banner__container">
                <div class="banner__title">
                  {{ $t('settings.addInfo') }}
                </div>
                <div class="banner__subtitle">
                  {{ $t('settings.alsoRating') }}
                </div>
                <div class="banner__verification">
                  <base-btn mode="ver">
                    {{ $t('settings.getVerification') }}
                  </base-btn>
                </div>
              </div>
              <div class="banner__image">
                <img src="~/assets/img/ui/goldStatus.svg">
              </div>
            </div>
          </transition>
        </div>
        <div
          class="wq-profile__header"
          :class="{ 'wq-profile__header_noMarginTop': localUserData.isVerified }"
        >
          {{ $t('profile.title') }}
        </div>
        <div class="wq-profile__info info">
          <div class="info__base">
            <div class="info__avatar avatar">
              <img
                v-if="imageData"
                id="userAvatar"
                class="avatar__img"
                :src="imageData"
                alt=""
              >
              <img
                v-else
                id="userAvatarTwo"
                class="avatar__img"
                src="~/assets/img/app/avatar_empty.png"
                alt="empty avatar"
              >
              <label
                v-if="isProfileEdit"
                class="avatar__edit edit"
              >
                <span class="edit__icon icon-edit" />
                <ValidationProvider
                  v-slot="{ validate }"
                  class="edit__validator"
                  rules="required|ext:png,jpeg,jpg"
                  tag="div"
                >
                  <input
                    id="coverUpload"
                    type="file"
                    accept="image/*"
                    @change="processFile($event, validate)"
                  >
                </ValidationProvider>
              </label>
            </div>

            <div class="info__contacts contacts">
              <div
                class="contacts__status status"
                :class="{ 'status_verified': localUserData.isVerified }"
              >
                {{ localUserData.isVerified ? $t('settings.verified') : $t('settings.notVerified') }}
                <span class="status__icon icon icon-check_all_big" />
              </div>

              <base-field
                v-if="firstName"
                v-model="localUserData.firstName"
                :placeholder="firstName || $t('settings.nameInput')"
                :disabled="!isProfileEdit"
                rules="required|alpha_num"
                :name="$t('modals.nameField')"
                mode="icon"
                mode-error="small"
              >
                <template v-slot:left>
                  <span class="icon icon__input icon-user" />
                </template>
              </base-field>
              <base-field
                v-if="lastName"
                v-model="localUserData.lastName"
                :placeholder="$t('settings.lastNameInput')"
                :disabled="!isProfileEdit"
                rules="required|alpha_num"
                :name="$t('modals.lastNameField')"
                mode="icon"
                mode-error="small"
              >
                <template v-slot:left>
                  <span class="icon icon__input icon-user" />
                </template>
              </base-field>
            </div>
            <div class="info__contacts contacts">
              <div class="info__space" />
              <base-field
                v-model="localUserData.address"
                :placeholder="address || $t('settings.addressInput')"
                :disabled="!isProfileEdit"
                mode="icon"
                :name="$t('modals.addressField')"
                mode-error="small"
              >
                <template v-slot:left>
                  <span class="icon icon__input icon-location" />
                </template>
              </base-field>
              <base-field
                v-model="localUserData.firstMobileNumber"
                :placeholder="firstMobileNumber || $t('settings.telInput')"
                :disabled="!isProfileEdit"
                type="tel"
                inputmode="numeric"
                rules="required|telephone|max:15"
                :name="$t('modals.firstMobileField')"
                mode="icon"
                mode-error="small"
              >
                <template v-slot:left>
                  <span class="icon icon__input icon-phone" />
                </template>
              </base-field>
            </div>
            <div class="info__contacts contacts">
              <div class="info__space" />
              <base-field
                v-model="localUserData.userEmail"
                :placeholder="userEmail || $t('settings.addressInput')"
                :disabled="!isProfileEdit"
                mode="icon"
                rules="required|email"
                :name="$t('modals.emailField')"
                mode-error="small"
              >
                <template v-slot:left>
                  <span class="icon icon__input icon-mail" />
                </template>
              </base-field>
              <base-field
                v-model="localUserData.secondMobileNumber"
                :name="$t('modals.secondMobileField')"
                :placeholder="secondMobileNumber || $t('settings.telInput')"
                :disabled="!isProfileEdit"
                type="tel"
                inputmode="numeric"
                rules="telephone|max:15"
                mode="icon"
                mode-error="small"
              >
                <template v-slot:left>
                  <span class="icon icon__input icon-phone" />
                </template>
              </base-field>
            </div>
          </div>
          <div class="info__additional">
            <div class="info__about about">
              <div class="about__title">
                {{ $t('profile.aboutMe') }}
              </div>
              <textarea
                id="textarea"
                v-model="localUserData.additionalInfo.description"
                class="about__textarea"
                :class="{ 'about__textarea_disabled': !isProfileEdit }"
                :placeholder="$t('profile.aboutMe')"
                :disabled="!isProfileEdit"
              />
            </div>
            <div class="info__social social">
              <base-field
                v-model="localUserData.additionalInfo.socialNetwork.instagram"
                :name="$t('modals.instagramField')"
                :placeholder="userInstagram || $t('settings.socialInput')"
                :disabled="!isProfileEdit"
                mode="icon"
                type="text"
                mode-error="small"
              >
                <template v-slot:left>
                  <span class="icon icon__input icon-instagram" />
                </template>
              </base-field>
              <base-field
                v-model="localUserData.additionalInfo.socialNetwork.twitter"
                :name="$t('modals.twitterField')"
                :placeholder="userTwitter || $t('settings.socialInput')"
                :disabled="!isProfileEdit"
                mode="icon"
                type="text"
                mode-error="small"
              >
                <template v-slot:left>
                  <span class="icon icon__input icon-twitter" />
                </template>
              </base-field>
              <base-field
                v-model="localUserData.additionalInfo.socialNetwork.linkedin"
                :name="$t('modals.linkedInField')"
                :placeholder="userLinkedin || $t('settings.socialInput')"
                :disabled="!isProfileEdit"
                mode="icon"
                type="text"
                mode-error="small"
              >
                <template v-slot:left>
                  <span class="icon icon__input icon-LinkedIn" />
                </template>
              </base-field>
              <base-field
                v-model="localUserData.additionalInfo.socialNetwork.facebook"
                :name="$t('modals.facebookField')"
                :placeholder="userFacebook || $t('settings.socialInput')"
                :disabled="!isProfileEdit"
                mode="icon"
                type="text"
                mode-error="small"
              >
                <template v-slot:left>
                  <span class="icon icon__input icon-facebook" />
                </template>
              </base-field>
            </div>
          </div>
          <div class="info__action action">
            <base-btn
              v-if="isProfileEdit"
              mode="lightBlue"
              class="action__save"
              @click="handleSubmit(editUserData())"
            >
              {{ $t('profile.save') }}
            </base-btn>
            <base-btn
              v-else
              mode="lightBlue"
              class="action__change"
              @click="showModalWarning()"
            >
              {{ $t('profile.change') }}
            </base-btn>
          </div>
        </div>
        <div
          v-if="isProfileEdit"
          class="wq-profile__header"
        >
          {{ $t('profile.security') }}
        </div>
        <div
          v-if="isProfileEdit"
          class="wq-profile__security security"
        >
          <div class="security__password">
            <div class="security__title">
              {{ $t('profile.changePass') }}
            </div>
            <base-btn
              class="security__btn"
              mode="lightBlue"
              @click="modalChangePassword()"
            >
              {{ $t('profile.change') }}
            </base-btn>
          </div>
          <div class="security__auth">
            <div class="security__title">
              {{ $t('profile.2FA') }}
            </div>
            <base-btn
              class="security__btn"
              mode="lightBlue"
              @click="modalTwoFAAuth()"
            >
              {{ $t('profile.switchOn') }}
            </base-btn>
          </div>
        </div>
      </div>
    </validation-observer>
  </div>
</template>

<script>

import { mapGetters } from 'vuex';
import modals from '~/store/modals/modals';

export default {
  name: 'Settings',
  data() {
    return {
      sms: false,
      allRegisterUser: false,
      allPeopleInInternet: false,
      onlyWhenSubmitedWork: false,
      onlyUrgentProposals: false,
      onlyInplemention: false,
      onlyReadyForExecution: false,
      allRegisteredUsers: false,
      isVerified: false,
      localUserData: {
        avatarId: null,
        firstName: null,
        lastName: null,
        userEmail: null,
        firstMobileNumber: null,
        secondMobileNumber: null,
        address: null,
        additionalInfo: {
          description: null,
          skills: [],
          educations: [],
          workExperiences: [],
          CEO: null,
          company: null,
          website: null,
          socialNetwork: {
            instagram: null,
            twitter: null,
            linkedin: null,
            facebook: null,
            workQuest: null,
          },
        },
      },
      avatar_change: {
        data: {},
        file: {},
      },
    };
  },
  computed: {
    ...mapGetters({
      tags: 'ui/getTags',
      userRole: 'user/getUserRole',
      userData: 'user/getUserData',
      firstName: 'user/getFirstName',
      lastName: 'user/getLastName',
      address: 'user/getUserAddress',
      company: 'user/getUserCompany',
      userCEO: 'user/getUserCEO',
      userDesc: 'user/getUserDesc',
      userWorkExp: 'user/getUserWorkExp',
      userEducations: 'user/getUserEducations',
      userWebsite: 'user/getUserWebsite',
      userInstagram: 'user/getUserInstagram',
      userTwitter: 'user/getUserTwitter',
      userLinkedin: 'user/getUserLinkedin',
      userFacebook: 'user/getUserFacebook',
      userEmail: 'user/getUserEmail',
      userWorkQuest: 'user/getUserWorkQuest',
      firstMobileNumber: 'user/getUserFirstMobileNumber',
      secondMobileNumber: 'user/getUserSecondMobileNumber',
      imageData: 'user/getImageData',
      additionalInfo: 'user/getAdditionalInfo',
      isProfileEdit: 'user/isProfileEdit',
    }),
  },
  async mounted() {
    this.SetLoader(true);
    this.isVerified = Boolean(this.userData.statusKYC);
    this.localUserData = {
      avatarId: this.userData.avatarId,
      firstName: this.userData.firstName,
      lastName: this.userData.lastName,
      userEmail: this.userEmail,
      firstMobileNumber: this.firstMobileNumber,
      secondMobileNumber: this.secondMobileNumber,
      address: this.address,
      additionalInfo: JSON.parse(JSON.stringify(this.userData.additionalInfo)),
    };
    this.SetLoader(false);
  },
  methods: {
    // eslint-disable-next-line consistent-return
    async processFile(e, validate) {
      const isValid = await validate(e);
      const file = e.target.files[0];
      if (isValid.valid) {
        const MAX_SIZE = 20e6; // макс размер - тут 2мб
        if (!file) {
          return false;
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);

        this.avatar_change.data = await this.$store.dispatch('user/imageType', { contentType: file.type });
        this.avatar_change.file = file;
        let output = document.getElementById('userAvatar');
        if (!output) {
          output = document.getElementById('userAvatarTwo');
        }
        output.src = URL.createObjectURL(file);
        // eslint-disable-next-line func-names
        output.onload = function () {
          URL.revokeObjectURL(output.src);
        };
        this.showModalImageOk();
        reader.onerror = (evt) => {
          console.error(evt);
        };
      }
    },
    showModalImageOk() {
      this.ShowModal({
        key: modals.status,
        img: require('~/assets/img/ui/questAgreed.svg'),
        title: 'Image loaded successful',
        subtitle: 'Please press save button',
      });
    },
    showModalSave() {
      this.ShowModal({
        key: modals.status,
        img: require('~/assets/img/ui/questAgreed.svg'),
        title: 'Saved',
        subtitle: 'User data has been saved',
      });
      this.$store.dispatch('user/changeProfile', false);
    },
    showModalWarning() {
      this.ShowModal({
        key: modals.warning,
      });
    },
    modalChangePassword() {
      this.ShowModal({
        key: modals.changePassInSettings,
      });
    },
    modalTwoFAAuth() {
      this.ShowModal({
        key: modals.twoFAAuth,
      });
    },
    switch2Fa() {
      this.twoFa = !this.twoFa;
    },
    switchSms() {
      this.sms = !this.sms;
      this.$router.push('/sms-verification');
    },
    transitionToChange() {
      this.$router.push('/profile?v=change');
      this.isProfileEdit = true;
    },
    async editUserData() {
      console.log('edit');
      const formData = new FormData();
      formData.append('image', this.avatar_change.file);
      try {
        if (this.avatar_change.data.ok) {
          const data = {
            url: this.avatar_change.data.result.url,
            formData: this.avatar_change.file,
            type: this.avatar_change.file.type,
          };
          await this.$store.dispatch('user/setImage', data);
        }
      } catch (error) {
        console.log(error);
      }
      let payload = {};
      const checkAvatarID = this.avatar_change.data.ok ? this.avatar_change.data.result.mediaId : this.userData.avatarId;
      if (this.userRole === 'employer') {
        payload = {
          ...this.localUserData,
          avatarId: checkAvatarID,
          additionalInfo: {
            ...this.localUserData.additionalInfo,
            ...{
              educations: undefined,
              workExperiences: undefined,
              skills: undefined,
            },
          },
        };
      } else {
        payload = {
          ...this.localUserData,
          avatarId: checkAvatarID,
          additionalInfo: {
            ...this.localUserData.additionalInfo,
            ...{
              company: undefined,
              CEO: undefined,
              website: undefined,
            },
          },
        };
      }
      console.log('qq');
      try {
        await this.$store.dispatch('user/editUserData', payload);
        this.showModalSave();
      } catch (e) {
        console.log(e);
      }
    },
  },
};
</script>

<style lang="scss" scoped>

.wq-profile {
  @include main;
  @include text-simple;
  &__body {
    margin-top: 30px;
    max-width: 1180px;
    height: 100%;
  }
  &__header {
    font-weight: 600;
    font-size: 28px;
    line-height: 36px;

    margin-top: 25px;
    &_noMarginTop {
      margin-top: 0;
    }
  }
  &__info {
    display: grid;
    grid-template-rows: 151px 112px 43px;
    grid-gap: 20px;

    margin-top: 20px;
    padding: 20px;

    background: #FFFFFF;
    border-radius: 6px;
  }

  &__security {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 20px;
  }
}

.banner {
  background-color: #0083C7;
  color: #FFFFFF;
  border-radius: 6px;

  &__body {
    display: grid;
    grid-template-columns: 1fr 1fr;

    width: 100%;
  }

  &__container {
    padding: 20px 0 20px 20px;
  }

  &__title {
    font-weight: 500;
    font-size: 25px;
    line-height: 32px;

  }

  &__subtitle {
    font-size: 16px;
    line-height: 21px;

    margin-top: 10px;
  }

  &__verification {
    width: 250px;

    margin-top: 29px;
  }

  &__image {
    width: max-content;
    height: 100%;

    margin-left: auto;
  }
}

.info {
  &__base {
    display: grid;
    grid-template-columns: 151px repeat(3, 1fr);
    grid-gap: 20px;
  }

  &__avatar {
    width: 100%;
    height: 151px;
    border-radius: 6px;
    overflow: hidden;
  }

  &__contacts {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }

  &__additional {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 20px;
    height: 100%;
  }

  &__social {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    grid-column-gap: 20px;
    grid-row-gap: 5px;
    height: 100%;
  }
  &__space{
    height: 44px;
  }
}

.contacts {
  &__input {
    width: 100%;
  }
  &__status{
    margin-bottom: 10px;
  }
}

.status {
  display: flex;
  max-width: max-content;
  height: 34px;
  padding: 8px 13px;

  background: #E9EDF2;
  color: #AAB0B9;
  border-radius: 36px;

  font-size: 14px;
  line-height: 18px;
  &__icon {
    font-size: 23px;
    color: #AAB0B9;

    margin-left: 10px;
    margin-top: -3px;
  }

  &_verified {
    color: #0083C7;
    background: rgba(0, 131, 199, 0.1);

    & .status__icon {
      color: #0083C7;
    }
  }
}

.avatar {
  border: 1px solid $black0;
  &:hover .edit {
    opacity: 1;
  }
  &__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  &__edit {
    position: relative;
    top: -60%;
    left: 35%;
    opacity: 0;

    width: 40px;
    height: 40px;

    background: #F7F8FA;
    border-radius: 6px;

    -moz-transition: all 0.5s;
    -webkit-transition: all 0.5s;
    -o-transition: all 0.5s;
    transition: all 0.5s;

    &:hover {
      background: #0083C7;
      & .edit__icon {
        color: #FFFFFF;
      }
    }
  }
}

.edit {
  cursor: pointer;
  &__validator {
    width: 100%;
    height: 100%;
    opacity: 0;
    overflow: hidden;
    position: absolute;
    z-index: -1;
    & input {
      width: 100%;
      height: 100%;
    }
  }
  &__icon {
    position: absolute;
    top: 50%;
    margin-right: -50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #0083C7;
    font-size: 20px;
  }
}

.about {
  display: flex;
  flex-direction: column;
  &__title {
    color: #1D2127;
    font-size: 16px;
    line-height: 21px;

    margin-bottom: 5px;
  }
  &__textarea {
    height: 86px;
    padding: 10px 10px 0 10px;
    border: none;
    border-radius: 6px;
    color: #1D2127;
    background-color: #F7F8FA;
    resize: none;

    &:focus {
      background-color: #FFFFFF;
      border: 1px solid #F3F7FA;
    }

    &_disabled {
      background-color: #FFFFFF;
      border: 1px solid #F3F7FA;
    }
    &::placeholder {
      color: #D8DFE3;
    }
  }
}

.social {
  &__container {
    display: flex;
    flex-direction: column;
    & div:first-child {
      //margin-bottom: 15px;
    }
  }
}

.action {
  display: flex;
  justify-content: flex-end;
  &__save {
    max-width: 250px;
  }
  &__change {
    @extend .action__save;
  }
}

.security {
  margin-top: 20px;
  &__title {
    font-weight: 500;
    font-size: 22px;
    line-height: 39px;

    color: #000000;
  }

  &__btn {
    width: 250px;
  }
  &__password {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    background: #FFFFFF;
    border-radius: 6px;
    padding: 20px;
  }
  &__auth {
    @extend .security__password;
  }
}

.icon {
  &__input {
    font-size: 23px;
    color: #0083C7;
    line-height: 36px;
  }
}
@include _991 {
  .wq-profile {
    &__info {
      grid-template-rows: 1fr auto auto;
    }
    &__body {
      margin: 0 10px;
      max-width: 100vw;
    }
  }
  .info {
    width: 100vw;
    &__base {
      grid-template-columns: 1fr 1fr;
      grid-column-gap: 20px;
      grid-row-gap: 5px;
    }
    &__avatar {
      width: 200px;
      height: 200px;
      margin-bottom: 10px;
    }
    &__space {
      display: none;
    }
    &__additional {
      grid-template-columns: 1fr;
    }
  }
  .security {
    justify-content: space-around;
    grid-template-columns: 374px 374px;
  }
}
@include _767 {
  .wq-profile {
    &__info {
      grid-template-rows: 1fr auto auto;
    }
    &__security {
      grid-template-columns: 1fr;
    }
  }
  .info {
    &__base {
      grid-template-columns: 1fr;
      grid-gap: 0px;
    }
    &__avatar {
      width: 200px;
      height: 200px;
      margin-bottom: 10px;
    }
    &__space {
      display: none;
    }
    &__additional {
      grid-template-columns: 1fr;
    }
  }
}
@include _480 {
  .banner {
    &__image {
      display: none;
    }
  }
}
</style>

<template>
  <div class="wq-profile">
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
      <div class="profile-cont">
        <div class="profile-cont__grid-container">
          <div class="profile-cont__main-data">
            <div class="profile-cont__avatar avatar">
              <img
                id="userAvatar"
                class="avatar__img"
                :src="imageData || require('~/assets/img/app/avatar_empty.png')"
                :alt="imageData ? 'avatar' : 'empty avatar'"
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
            <div
              class="profile-cont__status status"
              :class="{ 'status_verified': localUserData.isVerified }"
            >
              {{ $t(`settings.${localUserData.isVerified ? 'verified' : 'notVerified'}`) }}
              <span class="status__icon icon icon-check_all_big" />
            </div>
            <base-field
              v-for="(cell, i) in nameInputsArr"
              :key="i"
              v-model="cell.model"
              :placeholder="cell.placeholder || $t('settings.nameInput')"
              :disabled="!isProfileEdit"
              rules="required"
              :name="$t('modals.nameField')"
              mode="icon"
              mode-error="small"
            >
              <template v-slot:left>
                <span class="icon icon__input icon-user" />
              </template>
            </base-field>
            <base-field
              v-model="localUserData.additionalInfo.address"
              :placeholder="address || $t('settings.addressInput')"
              :disabled="!isProfileEdit"
              :is-with-loader="true"
              mode="icon"
              :name="$t('modals.addressField')"
              mode-error="small"
              @focus="changeFocusValue"
              @input="getPositionData"
            >
              <template v-slot:left>
                <span class="icon icon__input icon-location" />
              </template>
              <template v-slot:right-absolute>
                <div
                  v-if="isPositionSearch"
                  class="loader-cont"
                >
                  <loader
                    class="loader-cont__loader"
                    :is-mini-loader="true"
                  />
                </div>
              </template>
              <template v-slot:selector>
                <div
                  v-if="addresses.length && isGeoInputOnFocus"
                  class="selector"
                >
                  <div class="selector__items">
                    <div
                      v-for="(address, i) in addresses"
                      :key="i"
                      class="selector__item"
                      @click="selectAddress(address)"
                    >
                      {{ address.formatted }}
                    </div>
                  </div>
                </div>
              </template>
            </base-field>
            <base-field
              v-model="localUserData.email"
              :placeholder="localUserData.email || $t('settings.addressInput')"
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
            <div
              v-for="cell in phoneInputsArr"
              :key="cell.id"
            >
              <vue-phone-number-input
                v-if="isProfileEdit"
                v-model="localUserData.additionalInfo.secondMobileNumber"
                class="input-phone"
                error-color="#EB5757"
                clearable
                show-code-on-list
                required
                size="lg"
                @update="updatedPhone = $event"
              />
              <base-field
                v-else
                v-model="cell.model"
                :placeholder="cell.placeholder || $t('settings.telInput')"
                :disabled="true"
                is-hide-error
                inputmode="numeric"
                mode="icon"
              >
                <template v-slot:left>
                  <span class="icon icon__input icon-phone" />
                </template>
              </base-field>
            </div>
          </div>
          <div class="profile-cont__about about">
            <div class="about__title">
              {{ $t('profile.aboutMe') }}
            </div>
            <textarea
              v-model="localUserData.additionalInfo.description"
              class="about__textarea"
              :class="{ 'about__textarea_disabled': !isProfileEdit }"
              :placeholder="$t('profile.aboutMe')"
              :disabled="!isProfileEdit"
            />
          </div>
          <div class="profile-cont__social social">
            <base-field
              v-for="cell in socialInputs"
              :key="cell.id"
              v-model="cell.model"
              :placeholder="cell.placeholder || $t('settings.socialInput')"
              :disabled="!isProfileEdit"
              is-hide-error
              mode="icon"
              type="text"
              mode-error="small"
              @input="handleChangeSocial($event, cell.id)"
            >
              <template v-slot:left>
                <span
                  class="icon icon__input"
                  :class="cell.imgClass"
                />
              </template>
            </base-field>
          </div>
          <div class="profile-cont__action action">
            <base-btn
              mode="lightBlue"
              class="action__btn"
              @click="handleClickEditBtn"
            >
              {{ $t(`profile.${isProfileEdit ? 'save' : 'change'}`) }}
            </base-btn>
          </div>
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
  </div>
</template>

<script>

import { mapGetters } from 'vuex';
import { GeoCode } from 'geo-coder';
import modals from '~/store/modals/modals';
import 'vue-phone-number-input/dist/vue-phone-number-input.css';

export default {
  name: 'Settings',
  data() {
    return {
      updatedPhone: null,
      isProfileEdit: false,
      isPositionSearch: false,
      isGeoInputOnFocus: false,
      addresses: [],
      geoCode: null,
      delay: 0,
      sms: false,
      isVerified: false,
      localUserData: null,
      avatar_change: null,
      socialInputs: [],
      phoneInputsArr: [],
      nameInputsArr: [],
      coordinates: undefined,
    };
  },
  computed: {
    ...mapGetters({
      userRole: 'user/getUserRole',
      userData: 'user/getUserData',
      firstName: 'user/getFirstName',
      lastName: 'user/getLastName',
      address: 'user/getUserAddress',
      userInstagram: 'user/getUserInstagram',
      userTwitter: 'user/getUserTwitter',
      userLinkedin: 'user/getUserLinkedin',
      userFacebook: 'user/getUserFacebook',
      userEmail: 'user/getUserEmail',
      firstMobileNumber: 'user/getUserFirstMobileNumber',
      secondMobileNumber: 'user/getUserSecondMobileNumber',
      imageData: 'user/getImageData',
    }),
  },
  beforeMount() {
    this.isVerified = !!this.userData.statusKYC;

    this.setCurrData();
  },
  mounted() {
    this.SetLoader(false);
  },
  methods: {
    setCurrData() {
      this.localUserData = JSON.parse(JSON.stringify(this.userData));

      const {
        localUserData, firstMobileNumber, secondMobileNumber, firstName, lastName, userInstagram, userFacebook, userLinkedin, userTwitter,
      } = this;

      const {
        instagram, facebook, linkedin, twitter,
      } = localUserData.additionalInfo.socialNetwork;

      this.socialInputs = [{
        id: 'instagram',
        model: instagram,
        placeholder: userInstagram,
        imgClass: 'icon-instagram',
      },
      {
        id: 'facebook',
        model: facebook,
        placeholder: userFacebook,
        imgClass: 'icon-facebook',
      },
      {
        id: 'linkedin',
        model: linkedin,
        placeholder: userLinkedin,
        imgClass: 'icon-LinkedIn',
      },
      {
        id: 'twitter',
        model: twitter,
        placeholder: userTwitter,
        imgClass: 'icon-twitter',
      }];

      // this.phoneInputsArr = [{
      //   id: 'firstMobileNumber',
      //   model: localUserData.tempPhone,
      //   placeholder: firstMobileNumber,
      // }];

      // if (this.userRole === 'employer') {
      this.phoneInputsArr = [{
        id: 'secondMobileNumber',
        model: localUserData.additionalInfo.secondMobileNumber,
        placeholder: secondMobileNumber,
      }];
      // }

      this.nameInputsArr = [{
        model: localUserData.firstName,
        placeholder: firstName,
      },
      {
        model: localUserData.lastName,
        placeholder: lastName,
      }];
    },
    handleClickEditBtn() {
      if (this.isProfileEdit) {
        this.editUserData();
      } else {
        this.showModalWarning();
      }
    },
    handleChangeSocial(val, key) {
      if (!val) this.localUserData.additionalInfo.socialNetwork[key] = null;
    },
    selectAddress(address) {
      this.localUserData.additionalInfo.address = address.formatted;
      this.localUserData.location = {
        longitude: address.lng,
        latitude: address.lat,
      };
    },
    changeFocusValue(arg) {
      setTimeout(() => {
        this.isGeoInputOnFocus = arg;
      }, 300);
    },
    getPositionData(address) {
      this.addresses = [];

      if (!address) {
        this.localUserData.additionalInfo.address = null;
        this.localUserData.location = null;
        return;
      }

      if (!this.geoCode) this.geoCode = new GeoCode('google', { key: process.env.GMAPKEY });

      const { geoCode } = this;

      this.isPositionSearch = true;

      this.setDelay(async () => {
        try {
          const response = await geoCode.geolookup(address);
          this.addresses = JSON.parse(JSON.stringify(response));
          this.isPositionSearch = false;
        } catch (e) {
          console.log(e);
          this.isPositionSearch = false;
        }
      }, 500);
    },
    setDelay(f, t) {
      clearTimeout(this.delay);
      this.delay = setTimeout(f, t);
    },
    async processFile(e, validate) {
      const file = e.target.files[0];
      if (!file) return;
      const isValid = await validate(e);

      if (isValid.valid) {
        const MAX_SIZE = 20e6; // макс размер - тут 2мб

        const reader = new FileReader();
        reader.readAsDataURL(file);

        const { ok, result } = await this.$store.dispatch('user/imageType', { contentType: file.type });

        if (!ok) {
          this.avatar_change = null;
          return;
        }

        this.avatar_change = {
          data: result,
          file,
        };

        this.localUserData.avatarId = result.mediaId;

        const output = document.getElementById('userAvatar');
        output.src = URL.createObjectURL(file);
        output.onload = () => {
          URL.revokeObjectURL(output.src);
          this.showModalImageOk();
        };

        reader.onerror = (evt) => {
          console.error(evt);
        };
      }
    },
    showModalImageOk() {
      this.ShowModal({
        key: modals.status,
        img: require('~/assets/img/ui/questAgreed.svg'),
        title: this.$t('modals.imageLoadedSuccessful'),
        subtitle: this.$t('modals.pleasePressSaveButton'),
      });
    },
    showModalSave() {
      this.isProfileEdit = false;

      this.ShowModal({
        key: modals.status,
        img: require('~/assets/img/ui/questAgreed.svg'),
        title: this.$t('modals.saved'),
        subtitle: this.$t('modals.userDataHasBeenSaved'),
      });
    },
    showModalWarning() {
      this.ShowModal({
        key: modals.warning,
        callback: () => {
          this.isProfileEdit = true;
        },
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
    async editUserData() {
      const {
        avatarId, firstName, lastName, location, additionalInfo: {
          secondMobileNumber, address, socialNetwork, description, company, CEO, website,
        }, priority, workplace, wagePerHour, specializationKeys, educations, workExperiences,
      } = this.localUserData;

      if (!firstName || !lastName || (secondMobileNumber && !this.updatedPhone?.isValid)) return;

      const { avatar_change, userRole } = this;

      if (avatar_change) {
        const { file, data: { url } } = avatar_change;

        const formData = new FormData();
        formData.append('image', file);
        try {
          const response = {
            url,
            formData: file,
            type: file.type,
          };
          await this.$store.dispatch('user/setImage', response);
        } catch (error) {
          console.log(error);
        }
      }

      let config = {
        avatarId,
        firstName,
        lastName,
        location,
      };

      const additionalInfo = {
        address,
        socialNetwork,
        description,
        secondMobileNumber,
      };

      if (userRole === 'employer') {
        config = {
          ...config,
          additionalInfo: {
            ...additionalInfo,
            company,
            CEO,
            website,
          },
        };
      } else {
        config = {
          ...config,
          priority,
          workplace,
          wagePerHour,
          specializationKeys,
          additionalInfo: {
            ...additionalInfo,
            skills: [],
            educations,
            workExperiences,
          },
        };
      }
      const method = `/v1/${userRole}/profile/edit`;

      const payload = {
        config,
        method,
      };

      await this.$store.dispatch('user/editProfile', payload);
      this.showModalSave();
      this.setCurrData();
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
    margin: 25px 0 20px 0;

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

.profile-cont {
  background-color: #fff;
  border-radius: 6px;

  &__grid-container {
    display: grid;
    gap: 20px;
    padding: 20px;
  }

  &__main-data {
    display: grid;
    gap: 20px;
    row-gap: 3px;
    grid-template-columns: 151px repeat(2, 1fr);
  }

  &__avatar {
    height: 151px;
    border-radius: 6px;
    overflow: hidden;
    grid-column: 1;
    grid-row: 1/5;
  }

  &__status{
    grid-column: 2/4;
    margin-bottom: 15px;
  }

  &__social {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
  }
}

.info {
  &__base {
    display: grid;
    grid-template-columns: 151px repeat(3, 1fr);
    grid-gap: 20px;
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
  &__space{
    height: 44px;
  }
}

.contacts {
  &__input {
    width: 100%;
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
  &__btn {
    max-width: 250px;
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

.selector {
  @include box;
  width: 100%;
  z-index: 140;
  &_hide {
    display: none;
  }
  &__items {
    background: #FFFFFF;
    display: grid;
    grid-template-columns: 1fr;
    width: 100%;
  }
  &__item {
    @include text-simple;
    padding: 15px 20px;
    background: #FFFFFF;
    font-weight: 500;
    font-size: 16px;
    color: $black800;
    cursor: pointer;
    transition: .3s;
    &:hover {
      background: #F3F7FA;
    }
  }
}

.loader-cont {
  height: 20px;
  width: 20px;
  position: relative;

  &__loader {
    position: absolute !important;
    background: transparent !important;
  }
}

</style>

<style lang="scss">
.input-phone {
  input {
    background-color: #F7F8FA !important;
    border: unset !important;
    height: 46px !important;
    min-height: 46px !important;

    &:focus {
      background-color: #FFFFFF !important;
      border: 1px solid #0083C7 !important;
    }
  }

  .country-selector__input {
    border-top-left-radius: 6px !important;
    border-bottom-left-radius: 6px !important;
  }

  .input-tel__input {
    border-top-right-radius: 6px !important;
    border-bottom-right-radius: 6px !important;
    border-left: 1px solid #ccc !important;
  }
}
</style>

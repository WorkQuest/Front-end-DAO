<template>
  <div class="wq-profile">
    <div class="wq-profile__body">
      <div
        v-if="userData.statusKYC === $options.SumSubStatuses.NOT_VERIFIED"
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
                <base-btn
                  mode="ver"
                  @click="getVerification"
                >
                  {{ $t('settings.getVerification') }}
                </base-btn>
              </div>
            </div>
            <div class="banner__image">
              <img
                src="~/assets/img/ui/goldStatus.svg"
                alt=""
              >
            </div>
          </div>
        </transition>
      </div>
      <div class="wq-profile__header">
        {{ $t('profile.title') }}
      </div>
      <validation-observer
        v-slot="{ invalid, handleSubmit}"
        class="profile-cont"
        tag="div"
      >
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
                  rules="ext:png,jpeg,jpg,heic"
                  tag="div"
                >
                  <input
                    id="coverUpload"
                    type="file"
                    accept="image/png, image/jpeg, image/heic"
                    @change="processFile($event, validate)"
                  >
                </ValidationProvider>
              </label>
            </div>
            <div
              class="profile-cont__status status"
              :class="{ 'status_verified': userData.statusKYC === $options.SumSubStatuses.VERIFIED }"
            >
              {{ $t(`settings.${userData.statusKYC === $options.SumSubStatuses.VERIFIED ? 'verified' : 'notVerified'}`) }}
              <span class="status__icon icon icon-check_all_big" />
            </div>
            <base-field
              v-for="(cell, i) in nameInputsArr"
              :key="i"
              v-model="localUserData[cell.key]"
              :placeholder="cell.placeholder || $t('settings.nameInput')"
              :disabled="!isProfileEdit"
              :rules="cell.rules"
              :data-selector="cell.selector"
              :name="$t(`signUp.${cell.key}`)"
              mode="icon"
              mode-error="small"
              class="profile-cont__field"
            >
              <template v-slot:left>
                <span class="icon icon__input icon-user" />
              </template>
            </base-field>
            <base-field
              v-model="localUserData.additionalInfo.address"
              v-click-outside="hideAddressSelector"
              :placeholder="address || $t('settings.addressInput')"
              :disabled="!isProfileEdit"
              :is-with-loader="true"
              mode="icon"
              data-selector="BASE-INPUT-FIELD-ADDRESS"
              :name="$t('modals.addressField')"
              mode-error="small"
              :rules="isProfileEdit ? 'required' : ''"
              class="profile-cont__field"
              @focus="isGeoInputOnFocus = true"
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
                    is-mini-loader
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
              disabled
              mode="icon"
              :name="$t('modals.emailField')"
              data-selector="BASE-INPUT-FIELD-ADDRESS"
              mode-error="small"
              class="profile-cont__field"
            >
              <template v-slot:left>
                <span class="icon icon__input icon-mail" />
              </template>
            </base-field>
            <div
              v-for="cell in phoneInputsArr"
              :key="cell.type"
              class="profile-cont__field field__phone"
            >
              <label
                v-if="isProfileEdit"
                class="profile-cont__label"
                :for="cell.label"
              >
                {{ cell.label }}
              </label>
              <vue-phone-number-input
                v-if="isProfileEdit"
                :id="cell.label"
                v-model="phone[cell.type].fullPhone"
                class="input-phone"
                error-color="#EB5757"
                data-selector="FIELD-MAIN-PHONE"
                clearable
                show-code-on-list
                :required="cell.required"
                :disabled="cell.disabled"
                :default-country-code="phone[cell.type].codeRegion"
                size="lg"
                @update="updatedPhone[cell.type] = $event"
              />
              <base-field
                v-else
                :label="cell.label"
                :data-selector="cell.selector"
                :value="cell.fullNumber"
                class="field__input"
                :placeholder="cell.placeholder"
                :disabled="true"
                is-hide-error
                mode="icon"
              >
                <template v-slot:left>
                  <span class="icon icon__input icon-phone" />
                </template>
              </base-field>
            </div>
          </div>
          <base-textarea
            v-model="localUserData.additionalInfo.description"
            class="about"
            rules="max:650"
            :label="$t('profile.aboutMe')"
            :placeholder="$t('profile.aboutMe')"
            :disabled="!isProfileEdit"
            data-selector="TEXTAREA-ABOUT-ME"
          />
          <div class="profile-cont__social social">
            <base-field
              v-for="cell in socialInputs"
              :key="cell.key"
              v-model="localUserData.additionalInfo.socialNetwork[cell.key]"
              :placeholder="cell.placeholder || $t('settings.socialInput')"
              :disabled="!isProfileEdit"
              :data-selector="cell.selector"
              :name="cell.key"
              mode="icon"
              type="text"
              mode-error="small"
              class="profile-cont__social-input"
              rules="max:50"
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
              mode="outline"
              class="action__btn"
              :disabled="invalid"
              @click="handleSubmit(handleClickEditBtn)"
            >
              {{ $t(`profile.${isProfileEdit ? 'save' : 'change'}`) }}
            </base-btn>
          </div>
        </div>
      </validation-observer>
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
            @click="totpToggle"
          >
            {{ userData.totpIsActive ? $t('profile.switchOff') : $t('profile.switchOn') }}
          </base-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { mapGetters } from 'vuex';
import ClickOutside from 'vue-click-outside';
import { GeoCode } from 'geo-coder';
import modals from '~/store/modals/modals';
import { UserRole, SumSubStatuses } from '~/utils/enums';
import 'vue-phone-number-input/dist/vue-phone-number-input.css';

export default {
  name: 'Settings',
  SumSubStatuses,
  directives: {
    ClickOutside,
  },
  data() {
    return {
      updatedPhone: {
        main: null,
        second: null,
      },
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
      nameInputsArr: [],
      coordinates: undefined,
      profileVisibility: {
        network: this.userData?.profileVisibilitySetting?.network ?? 0,
        ratingStatus: this.userData?.profileVisibilitySetting?.ratingStatus ?? 0,
      },
      phone: {
        main: {
          fullPhone: null,
          codeRegion: null,
        },
        second: {
          fullPhone: null,
          codeRegion: null,
        },
      },
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
    phoneInputsArr() {
      const phones = [];
      const { phone, tempPhone, additionalInfo } = this.userData;
      const mainPhone = {
        type: 'main',
        label: this.$t('settings.firstNumber'),
        fullNumber: null,
        selector: 'MAIN-PHONE',
        placeholder: this.$t('settings.mainNumberMissing'),
        isVerify: false,
        disabled: false,
        required: true,
      };
      mainPhone.fullNumber = phone ? phone?.fullPhone : tempPhone?.fullPhone;
      mainPhone.isVerify = !!phone;
      phones.push(mainPhone);

      if (this.userRole === UserRole.EMPLOYER) {
        const secondPhone = {
          type: 'second',
          label: this.$t('settings.secondNumber'),
          fullNumber: null,
          selector: 'SECOND-PHONE',
          placeholder: this.$t('settings.secondNumberMissing'),
          isVerify: false,
          disabled: false,
          required: false,
        };
        secondPhone.fullNumber = additionalInfo.secondMobileNumber?.fullPhone || null;
        phones.push(secondPhone);
      }
      return phones;
    },
  },
  beforeMount() {
    this.isVerified = !!this.userData.statusKYC;
    this.setCurrData();
  },
  methods: {
    hideAddressSelector() {
      this.isGeoInputOnFocus = false;
    },
    totpToggle() {
      const mode = this.userData.totpIsActive ? 'disableTwoFAAuth' : 'twoFAAuth';
      this.ShowModal({
        key: modals[mode],
      });
    },
    getVerification() {
      this.$router.push('/KYC');
    },
    setCurrData() {
      this.localUserData = JSON.parse(JSON.stringify(this.userData));

      const {
        localUserData, firstName, lastName, userInstagram, userFacebook, userLinkedin, userTwitter,
      } = this;
      this.localUserData.additionalInfo.address = this.userData?.locationPlaceName;
      this.phone.main = localUserData.phone || localUserData.tempPhone || { fullPhone: null, codeRegion: 'RU' };

      this.phone.second = localUserData.additionalInfo.secondMobileNumber || { fullPhone: null, codeRegion: 'RU' };

      this.socialInputs = [{
        key: 'instagram',
        placeholder: userInstagram,
        imgClass: 'icon-instagram',
        selector: 'INSTAGRAM',
      },
      {
        key: 'facebook',
        placeholder: userFacebook,
        imgClass: 'icon-facebook',
        selector: 'FACEBOOK',
      },
      {
        key: 'linkedin',
        placeholder: userLinkedin,
        imgClass: 'icon-LinkedIn',
        selector: 'LINKEDIN',
      },
      {
        key: 'twitter',
        placeholder: userTwitter,
        imgClass: 'icon-twitter',
        selector: 'TWITTER',
      }];

      this.nameInputsArr = [{
        key: 'firstName',
        model: localUserData.firstName,
        selector: 'FIRST-NAME',
        placeholder: firstName,
        rules: 'required|max:15|alpha_spaces_dash',
      },
      {
        key: 'lastName',
        model: localUserData.lastName,
        selector: 'LAST-NAME',
        placeholder: lastName,
        rules: 'required|max:15|alpha_spaces_dash',
      }];
    },
    handleClickEditBtn() {
      if (this.isProfileEdit) this.editUserData();
      else {
        this.ShowModal({
          key: modals.warning,
          callback: () => {
            this.isProfileEdit = true;
          },
        });
      }
    },
    handleChangeSocial(val, key) {
      if (!val && key) this.localUserData.additionalInfo.socialNetwork[key] = null;
    },
    selectAddress(address) {
      this.localUserData.additionalInfo.address = address.formatted;
      this.localUserData.location = {
        longitude: address.lng,
        latitude: address.lat,
      };
      this.hideAddressSelector();
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
      let file = e.target.files[0];
      if (!file) return;

      if (file.type === 'image/heic') {
        file = await this.HEICConvertTo(file, 'image/jpeg');
      }

      const isValid = await validate(e);

      if (isValid.valid) {
        const MAX_SIZE = 20e6; // макс размер - тут 2мб

        const reader = new FileReader();
        reader.readAsDataURL(file);

        const result = await this.$store.dispatch('user/getUploadFileLink', { contentType: file.type });

        if (!result) {
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
          this.ShowModal({
            key: modals.status,
            img: require('~/assets/img/ui/questAgreed.svg'),
            title: this.$t('modals.imageLoadedSuccessful'),
            subtitle: this.$t('modals.pleasePressSaveButton'),
          });
          output.onload = null;
        };
        reader.onerror = (evt) => {
          console.error(evt);
        };
      }
    },
    modalChangePassword() {
      this.ShowModal({
        key: modals.changePassInSettings,
      });
    },
    async editUserData() {
      const {
        avatarId, firstName, lastName, location, additionalInfo: {
          address, socialNetwork, description, company, CEO, website,
        }, priority, workplace, payPeriod, costPerHour, userSpecializations, educations, workExperiences,
      } = this.localUserData;

      const mainPhone = this.updatedPhone.main;
      const secondPhone = this.updatedPhone.second;

      let phoneNumber = {
        phone: mainPhone?.phoneNumber || null,
        fullPhone: mainPhone?.formattedNumber || null,
        codeRegion: mainPhone?.countryCode,
      };
      let secondMobileNumber = {
        phone: secondPhone?.phoneNumber || null,
        fullPhone: secondPhone?.formattedNumber || null,
        codeRegion: secondPhone?.countryCode,
      };
      if (!phoneNumber.fullPhone) phoneNumber = null;
      if (!secondMobileNumber.fullPhone) secondMobileNumber = null;

      const { avatar_change, userRole } = this;

      if (avatar_change) {
        const { file, data: { url } } = avatar_change;

        const formData = new FormData();
        formData.append('image', file);
        const response = {
          url,
          formData: file,
          type: file.type,
        };
        await this.$store.dispatch('user/setImage', response);
      }
      let config = {
        avatarId,
        firstName,
        lastName,
        phoneNumber,
        locationFull: {
          location,
          locationPlaceName: this.localUserData.additionalInfo.address,
        },
      };

      // eslint-disable-next-line no-restricted-syntax
      for (const key in socialNetwork) {
        if (!socialNetwork[key]) socialNetwork[key] = null;
        else socialNetwork[key] = socialNetwork[key].trim();
      }

      const additionalInfo = {
        address,
        socialNetwork,
        description: description || null,
      };

      if (userRole === UserRole.EMPLOYER) {
        const { arrayRatingStatusCanRespondToQuest, arrayRatingStatusInMySearch } = this.localUserData.employerProfileVisibilitySetting;
        config = {
          ...config,
          profileVisibility: {
            ratingStatusCanRespondToQuest: arrayRatingStatusCanRespondToQuest,
            ratingStatusInMySearch: arrayRatingStatusInMySearch,
          },
          additionalInfo: {
            ...additionalInfo,
            secondMobileNumber,
            company,
            CEO,
            website,
          },
        };
      } else {
        const { arrayRatingStatusCanInviteMeOnQuest, arrayRatingStatusInMySearch } = this.localUserData.workerProfileVisibilitySetting;
        config = {
          ...config,
          profileVisibility: {
            ratingStatusCanInviteMeOnQuest: arrayRatingStatusCanInviteMeOnQuest,
            ratingStatusInMySearch: arrayRatingStatusInMySearch,
          },
          priority,
          workplace,
          payPeriod,
          costPerHour,
          specializationKeys: userSpecializations.map((spec) => spec.path),
          additionalInfo: {
            ...additionalInfo,
            skills: [],
            educations,
            workExperiences,
          },
        };
      }
      const method = `/v1/${userRole}/profile/edit`;
      const ok = await this.$store.dispatch('user/editProfile', { config, method });
      if (ok) {
        this.isProfileEdit = false;
        this.ShowModal({
          key: modals.status,
          img: require('~/assets/img/ui/questAgreed.svg'),
          title: this.$t('modals.saved'),
          subtitle: this.$t('modals.userDataHasBeenSaved'),
        });
      }
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
    max-width: 1180px;
    height: 100%;
  }

  &__header {
    color: $black800;
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

    background: $white;
    border-radius: 6px;
  }

  &__security {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 20px;
  }
}

.banner {
  color: $white;
  border-radius: 6px;
  margin-top: 30px;

  &__body {
    display: grid;
    grid-template-columns: 1fr 1fr;
    background: $blue;
    border-radius: 6px;
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
    height: 100%;
    margin-left: auto;
    width: auto;
  }
}

.profile-cont {
  background-color: $white;
  border-radius: 6px;

  &__social-input {
    height: 46px;
  }

  &__field {
    height: 46px;
    margin-bottom: 15px;
  }

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

  &__status {
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

  &__space {
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
    color: $blue;
    background: rgba(0, 131, 199, 0.1);

    & .status__icon {
      color: $blue;
    }
  }
}

.avatar {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover .edit {
    opacity: 1;
  }

  &__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__edit {
    position: absolute;
    opacity: 0;

    width: 40px;
    height: 40px;

    background: $black0;
    border-radius: 6px;

    -moz-transition: all 0.5s;
    -webkit-transition: all 0.5s;
    -o-transition: all 0.5s;
    transition: all 0.5s;

    &:hover {
      background: $blue;

      & .edit__icon {
        color: $white;
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
    transition: none;

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
    color: $blue;
    font-size: 20px;
  }
}

.about {
  :deep(.ctm-field__body) {
    height: 114px;
  }
}

.social {
  &__container {
    display: flex;
    flex-direction: column;
  }
}

.action {
  display: flex;
  justify-content: flex-end;
  margin-top: 15px;
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
    color: $black800;
  }

  &__btn {
    width: 250px;
  }

  &__password {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    background: $white;
    border-radius: 6px;
    padding: 20px;
  }

  &__auth {
    @extend .security__password;
  }
}

.icon__input {
  font-size: 23px;
  color: $blue;
  line-height: 36px;
}

.selector {
  @include box;
  width: 100%;
  z-index: 140;

  &_hide {
    display: none;
  }

  &__items {
    background: $white;
    display: grid;
    grid-template-columns: 1fr;
    width: 100%;
  }

  &__item {
    @include text-simple;
    padding: 15px 20px;
    background: $white;
    font-weight: 500;
    font-size: 16px;
    color: $black800;
    cursor: pointer;
    transition: .3s;

    &:hover {
      background: $black100;
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

@include _1199 {
  .wq-profile {

    &__body {
      padding: 0 20px;
    }
  }
}

@include _991 {
  .banner {
    &__body {
      grid-template-columns: 1fr;
    }

    &__image {
      grid-row: 1;
    }
  }
  .profile-cont {
    &__avatar {
      grid-row: 1/7;
    }

    &__social {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  .security {
    &__password,
    &__auth {
      display: grid;
      gap: 10px;
      justify-items: center;
      justify-content: center;
    }
  }
}

@include _767 {
  .field__phone {
    height: fit-content;
  }
  .avatar__img {
    height: 149px;
    width: 149px;
    border-radius: 6px;
  }
  .profile-cont {
    &__label {
      display: flex;
    }

    &__main-data {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    &__status {
      display: flex;
    }

    &__avatar {
      display: flex;
      justify-content: center;
      margin-bottom: 17px;
    }
  }

  .wq-profile {
    &__security {
      grid-template-columns: 1fr;
    }
  }

  @include _575 {
    &__social {
      grid-template-columns: 1fr;
    }

    .security {
      &__password,
      &__auth {
        display: grid;
        gap: 10px;
        justify-items: center;
        justify-content: center;
      }
    }
  }
}

@include _575 {
  .profile-cont {
    &__social {
      grid-template-columns: 1fr;
    }
  }
}

@include _380 {
  :deep(.country-selector.lg .country-selector__label) {
    font-size: 10px;
  }
  :deep(.input-tel.lg .input-tel__label) {
    font-size: 10px;
  }
  :deep(.vue-phone-number-input .select-country-container) {
    min-width: unset !important;
    max-width: 100px !important;
    flex: 0 0 100px !important;
  }

  .profile-cont {
    &__grid-container {
      padding: 10px;
    }
  }

  .wq-profile {
    &__body {
      padding: 0 10px;
    }
  }
}

</style>

<style lang="scss">
.input-phone {
  input {
    background-color: $black100 !important;
    border: unset !important;
    height: 46px !important;
    min-height: 46px !important;

    &:focus {
      background-color: $white !important;
      border: 1px solid $blue !important;
    }
  }

  .country-selector__input {
    border-top-left-radius: 6px !important;
    border-bottom-left-radius: 6px !important;
  }

  .input-tel__input {
    border-top-right-radius: 6px !important;
    border-bottom-right-radius: 6px !important;
    border-left: 1px solid $black200 !important;
  }
}
</style>

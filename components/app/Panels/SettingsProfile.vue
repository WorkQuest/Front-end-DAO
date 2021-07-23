<template>
  <div class="dynamic__page page">
    <div class="page__profile">
      <div class="avatar__row">
        <div class="avatar__container">
          <img
            v-if="imageData"
            id="userAvatar"
            class="profile__img"
            :src="imageData"
            alt=""
          >
          <img
            v-if="!imageData"
            id="userAvatarTwo"
            class="profile__img"
            src="~/assets/img/app/avatar_empty.png"
            alt=""
          >
          <label class="user_edit_avatar">
            <div class="icon-edit" />
            <ValidationProvider
              v-slot="{ validate }"
              rules="required|ext:png,jpeg,jpg"
              tag="div"
            >
              <input
                id="coverUpload"
                class="edit_avatar"
                type="file"
                accept="image/*"
                @change="processFile($event, validate)"
              >
            </ValidationProvider>
          </label>
        </div>
        <div>
          <span
            class="profile__status"
          >
            {{ $t('settings.notVerified') }}
            <span class="icon-check_all_big" />
          </span>
          <div class="profile__main-data">
            <base-field
              v-if="firstName"
              v-model="localUserData.firstName"
              :placeholder="firstName || $t('settings.nameInput')"
              :disabled="!this.$route.query.v"
              mode="icon"
            >
              <template v-slot:left>
                <span class="icon-user" />
              </template>
            </base-field>
            <base-field
              v-model="localUserData.additionalInfo.address"
              :placeholder="address || $t('settings.addressInput')"
              :disabled="!this.$route.query.v"
              mode="icon"
            >
              <template v-slot:left>
                <span class="icon-location" />
              </template>
            </base-field>
            <base-field
              v-model="userEmail"
              :placeholder="userEmail || $t('settings.addressInput')"
              :disabled="true"
              mode="icon"
            >
              <template v-slot:left>
                <span class="icon-mail" />
              </template>
            </base-field>
            <base-field
              v-if="lastName"
              v-model="localUserData.lastName"
              :placeholder="$t('settings.lastNameInput')"
              :disabled="!this.$route.query.v"
              mode="icon"
            >
              <template v-slot:left>
                <span class="icon-user" />
              </template>
            </base-field>
            <base-field
              v-model="localUserData.additionalInfo.secondMobileNumber"
              :placeholder="secondMobileNumber || $t('settings.telInput')"
              :disabled="!this.$route.query.v"
              mode="icon"
            >
              <template v-slot:left>
                <span class="icon-phone" />
              </template>
            </base-field>
            <base-field
              v-model="localUserData.additionalInfo.secondMobileNumber"
              :placeholder="secondMobileNumber || $t('settings.telInput')"
              :disabled="!this.$route.query.v"
              mode="icon"
            >
              <template v-slot:left>
                <span class="icon-phone" />
              </template>
            </base-field>
          </div>
        </div>
      </div>
      <div
        class="profile__additional-data"
      >
        <div class="profile__about">
          <label>{{ $t('profile.aboutMe') }}</label>
          <textarea
            id="textarea"
            v-model="localUserData.additionalInfo.description"
            class="profile__textarea"
            :class="!this.$route.query.v ? 'profile__textarea_disabled' : ''"
            :title="'test'"
            :placeholder="userDesc || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam, purus sit amet luctus venenatis, lectus magna fringilla urna, porttitor rhoncus dolor purus non enim praesent elementum facilisis leo, vel'"
            :disabled="!this.$route.query.v"
          />
        </div>
        <div class="profile__social">
          <base-field
            v-model="localUserData.additionalInfo.socialNetwork.instagram"
            :placeholder="userInstagram || $t('settings.socialInput')"
            :disabled="!this.$route.query.v"
            mode="icon"
          >
            <template v-slot:left>
              <span class="icon-instagram" />
            </template>
          </base-field>
          <base-field
            v-model="localUserData.additionalInfo.socialNetwork.twitter"
            :placeholder="userTwitter || $t('settings.socialInput')"
            :disabled="!this.$route.query.v"
            mode="icon"
          >
            <template v-slot:left>
              <span class="icon-twitter" />
            </template>
          </base-field>
          <base-field
            v-model="localUserData.additionalInfo.socialNetwork.linkedin"
            :placeholder="userLinkedin || $t('settings.socialInput')"
            :disabled="!this.$route.query.v"
            mode="icon"
          >
            <template v-slot:left>
              <span class="icon-LinkedIn" />
            </template>
          </base-field>
          <base-field
            v-model="localUserData.additionalInfo.socialNetwork.facebook"
            :placeholder="userFacebook || $t('settings.socialInput')"
            :disabled="!this.$route.query.v"
            mode="icon"
          >
            <template v-slot:left>
              <span class="icon-facebook" />
            </template>
          </base-field>
        </div>
      </div>
      <div class="profile__button">
        <base-btn
          v-if="this.$route.query.v"
          class="btn__save"
          @click="editUserData()"
        >
          {{ $t('profile.save') }}
        </base-btn>
        <base-btn
          v-else
          class="btn__save"
          @click="transitionToChange()"
        >
          {{ $t('profile.change') }}
        </base-btn>
      </div>
    </div>
    <h2
      v-if="this.$route.query.v"
      class="page__title"
    >
      {{ $t('profile.security') }}
    </h2>
    <div
      v-if="this.$route.query.v"
      class="page__security security"
    >
      <div class="security__action">
        <label class="security__title">{{ $t('profile.changePass') }}</label>
        <base-btn
          class="security__btn"
          @click="modalChangePassword()"
        >
          {{ $t('profile.change') }}
        </base-btn>
      </div>
      <div class="security__action">
        <label class="security__title"> {{ $t('profile.2FA') }}</label>
        <base-btn
          class="security__btn"
          @click="modalTwoFAAuth()"
        >
          {{ $t('profile.switchOn') }}
        </base-btn>
      </div>
    </div>
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
      isShowInfo: true,
      localUserData: {
        avatarId: null,
        firstName: null,
        lastName: null,
        additionalInfo: {
          secondMobileNumber: null,
          address: null,
          socialNetwork: {
            instagram: null,
            twitter: null,
            linkedin: null,
            facebook: null,
          },
          description: null,
          skills: [],
          educations: [],
          workExperiences: [],
          CEO: null,
          company: null,
          website: null,
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
      firstMobileNumber: 'user/getUserFirstMobileNumber',
      secondMobileNumber: 'user/getUserSecondMobileNumber',
      imageData: 'user/getImageData',
      additionalInfo: 'user/getAdditionalInfo',
    }),
  },
  async mounted() {
    this.SetLoader(true);
    this.localUserData = {
      avatarId: this.userData.avatarId,
      firstName: this.userData.firstName,
      lastName: this.userData.lastName,
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
        path: '/settings',
      });
    },
    showModalSave() {
      this.ShowModal({
        key: modals.status,
        img: require('~/assets/img/ui/questAgreed.svg'),
        title: 'Saved',
        subtitle: 'User data has been saved',
        path: '/settings',
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
    isCloseInfo() {
      this.isShowInfo = !this.isShowInfo;
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
    },
    async editUserData() {
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

.icon {
  font-size: 25px;
  color: $blue;
  align-items: center;
  &__gradient {
    color: transparent;
    -webkit-background-clip: text;
    background-image: linear-gradient(135deg, #0083C7 0%, #00AA5B 100%);
  }
  &-check_all_big:before {
    @extend .icon;
    content: "\ea00";
    color: $white;
    padding: 0 0 0 10px;
  }
  &-Lock:before {
    @extend .icon;
    @extend .icon__gradient;
    content: "\ea24";
  }
  &-user_pin:before {
    @extend .icon;
    @extend .icon__gradient;
    content: "\e908";
  }
  &-caret_right:before {
    @extend .icon;
    @extend .icon__gradient;
    content: "\ea4a";
    color: $black200;
  }
  &-data:before {
    @extend .icon;
    @extend .icon__gradient;
    content: "\e914";
  }
  &-group_alt:before {
    @extend .icon;
    @extend .icon__gradient;
    content: "\e900";
  }
  &-home_alt_check:before {
    @extend .icon;
    @extend .icon__gradient;
    content: "\e961";
  }
  &-credit_card:before {
    @extend .icon;
    @extend .icon__gradient;
    content: "\ea0e";
  }
  &-Case:before {
    @extend .icon;
    @extend .icon__gradient;
    content: "\e9ff";
  }
  &-line_chart_up:before {
    @extend .icon;
    @extend .icon__gradient;
    content: "\e9cb";
  }
  &-settings:before {
    @extend .icon;
    content: "\ea34";
  }
  &-chevron_big_right:before {
    @extend .icon;
    content: "\ea4e";
    color: $black200;
  }
  &-plus_circle:before {
    @extend .icon;
    content: "\e9a6";
  }
  &-Case:before {
    @extend .icon;
    content: "\e9ff";
  }
  &-id_card:before {
    @extend .icon;
    content: "\e902";
  }
  &-Earth:before {
    @extend .icon;
    content: "\ea11";
  }
  &-facebook:before {
    @extend .icon;
    content: "\e9e5";
  }
  &-LinkedIn::before {
    @extend .icon;
    content: "\e9ed";
  }
  &-twitter::before {
    @extend .icon;
    content: "\e9fa";
  }
  &-instagram::before {
    @extend .icon;
    content: "\e9ea";
  }
  &-phone::before {
    @extend .icon;
    content: "\ea2d";
  }
  &-mail::before {
    @extend .icon;
    content: "\ea27";
  }
  &-location::before {
    @extend .icon;
    content: "\ea23";
  }
  &-user::before {
    @extend .icon;
    content: "\e90c";
  }
  &-close_big::before {
    content: "\e948";
    color: #2e3a59;
    font-size: 26px;
  }
  &__close {
    position: absolute;
    bottom: 155px;
    right: 25px;
    z-index: 2;
    &_closed {
      display: none;
    }
  }
  &-edit {
    position: absolute;
    top: 50%;
    margin-right: -50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  &-edit::before {
    @extend .icon;
    content: "\e997"
  }
}
.user_edit_avatar {
  opacity: 0;
  width: 40px;
  height: 40px;
  background: #F7F8FA;
  position: relative;
  top: -60%;
  left: 35%;
  border-radius: 6px;
  -moz-transition: all 0.5s;
  -webkit-transition: all 0.5s;
  -o-transition: all 0.5s;
  transition: all 0.5s;
}
.avatar__container:hover .user_edit_avatar{
  opacity: 1;
}

.avatar {
  &__row {
    display: grid;
    grid-template-columns: 151px 1fr;
    grid-gap: 20px;
    margin: 20px 20px 0px 20px;
    padding-top: 20px;
  }
  &__container {
    height: 151px;
  }
}
.btn {
  width: 100%;
  &__save {
    @extend .btn;
    margin-bottom: 20px;
    max-width: 220px;
  }
}

.security {
  &__action {
    background-color: #fff;
    border-radius: 6px;
    padding: 20px;
    grid-gap: 20px;
    width: 49%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  &__title {
    font-weight: 500;
    font-size: 22px;
    line-height: 130%;
  }
  &__btn {
    @extend .btn;
    max-width: 220px;
  }
}

.profile {
  display: grid;
  justify-content: space-between;
  max-width: 1180px;
  &__status {
    max-width: 159px;
    margin: 0 0 10px 0;
    padding: 8px 13px;
    display: flex;
    background: $blue;
    color: $white;
    border-radius: 36px;
  }
  &__img {
    height: 151px;
    width: 151px;
    border-radius: 6px;
    object-fit: cover;
  }
  &__additional-data {
    @extend .profile;
    grid-template-columns: repeat(2, 1fr);
    width: 100%;
    grid-gap: 0 20px;
    padding: 0 20px;
  }
  &__social {
    @extend .profile;
    grid-template-columns: repeat(2, 1fr);
    width: 100%;
    grid-gap: 0 20px;
    margin-top: 30px;
  }
  &__about {
    display: flex;
    flex-direction: column;
  }
  &__main-data {
    @extend .profile;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 0 20px;
    width: 100%;
  }
  &__button {
    display: flex;
    justify-content: flex-end;
    padding: 0 20px;
    max-height: 63px;
  }
  &__textarea {
    padding: 10px 10px 0 10px;
    border-radius: 6px;
    height: 114px;
    border: 0;
    background-color: #F7F8FA;
    resize: none;
    &_disabled {
      background-color: #FFFFFF;
      border-radius: 6px;
      border: 1px solid #F3F7FA;
    }
    &::placeholder {
      color: $black200;
    }
  }
  &__title {
    margin: 20px 0 0 20px;
    padding: 20px 0 0 0;
  }
}
.page {
  &__title {
    margin: 20px 0 20px 0;
    font-weight: 500;
    font-size: 25px;
    color: $black800;
  }
  &__profile {
    @include main-white;
    justify-content: flex-start;
    border-radius: 6px;
    margin: 20px 0 20px 0;
    display: inherit;
  }
  &__security {
    display: flex;
    justify-content: space-between;
  }
}

.user {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  margin: 0 16px;
  &__icon {
    padding: 10px 0 0 0;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
  }
}

.edit_avatar {
  width: 100%;
  height: 100%;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  z-index: -1;
}
@include _1199 {
  .page {
    &__title {
      margin: 20px 0 20px 20px;
    }
    &__badge {
      text-align: center;
    }
    &__profile {
      margin: 20px;
    }
  }
  .settings {
    margin: 20px;
  }
  .page__security {
    margin: 20px;
  }
}
@include _991 {
  .settings {
    grid-auto-rows: auto auto;
    grid-template-columns: 5fr;
  }
  .icon {
    &__close {
      bottom: 154px;
      right: 10px;
    }
  }
  .profile {
    &__main-data {
      grid-template-columns: repeat(2, 1fr);
    }
    &__button {
      max-height: 100%;
    }
  }
}

@include _767 {
  .avatar {
    &__row {
      margin: 20px 20px 0 20px;
    }
  }
  .company {
    &__inputs {
      grid-template-columns: 1fr;
      grid-gap: 0;
    }
  }
  .icon {
    &__close {
      bottom: 154px;
    }
  }
  .avatar {
    &__row {
      flex-direction: column;
    }
    &__container {
      justify-self: center;
    }
  }
  .profile {
    &__main-data {
      grid-template-columns: 1fr;
    }
    &__button {
      grid-template-columns: 1fr;
    }
  }

  .settings {
    grid-template-columns: 1fr;
    &__left {
      padding: 20px 0 20px 20px;
    }
  }
}

@include _575 {
  .page__security {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    grid-gap: 20px;
  }
  .security {
    &__action {
      flex-direction: column;
      grid-gap: 20px;
      width: 100%;
    }
  }
  .profile {
    &__additional-data{
      grid-template-columns: 1fr;
      grid-gap: 20px;
    }
    &__button {
      justify-content: center;
    }
  }
  .avatar {
    &__row {
      grid-template-columns: 1fr;
    }
  }
  .page {
    &__info-title {
      font-size: 18px;
    }
  }
  .icon {
    &__close {
      bottom: 137px;
      right: 10px;
    }
  }
}
@include _480 {
  .main-white {
    width: calc(98vw - 71px);
  }
  .btn {
    &__save {
      margin-bottom: 20px;
      max-width: 100% !important;
    }
  }
  .icon {
    &__close {
      bottom: 157px;
      right: 6px;
    }
  }
}

@include _380 {
  .icon {
    &__close {
      bottom: 195px;
      right: 5px;
    }
  }
  .user {
    grid-template-columns: 11fr 1fr;
  }
  .icons {
    padding: 16px 0 0 16px;
  }
}
</style>

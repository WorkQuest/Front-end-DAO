<template>
  <div
    ref="templateScroll"
    class="primary"
  >
    <div class="primary__template template">
      <div class="template__content">
        <div
          v-click-outside="closeAll"
          class="template__header header"
        >
          <div class="header__body">
            <div class="header__left">
              <div class="header__logo">
                <img
                  src="~assets/img/app/logo.svg"
                  alt="WorkQuest"
                >
                <span class="header__text">WorkQuest</span>
              </div>
              <div class="header__links">
                <nuxt-link
                  v-for="(link, index) in mobileMenuLinks"
                  :key="index"
                  :to="link.path"
                  class="header__link"
                  :exact-active-class="'header__link_active'"
                >
                  {{ link.title }}
                </nuxt-link>
              </div>
            </div>
            <div class="header__right">
              <div
                class="header__button header__button_locale"
                data-selector="ACTION-BTN-SHOW-LOCALE"
                @click="showLocale()"
              >
                <span class="header__button_locale-name">
                  {{ currentLocale.toUpperCase() }}
                </span>
                <span class="icon icon-caret_down" />
                <transition name="fade">
                  <ul
                    v-if="isShowLocale"
                    class="locale"
                  >
                    <li
                      v-for="(item, i) in locales"
                      :key="item.localeCode"
                      class="locale__item"
                      :class="[{'locale__item_active' : currentLocale === item.localeCode}]"
                      :data-selector="`ACTION-BTN-SET-LOCALE-${i}`"
                      @click="setLocale(item)"
                    >
                      <img
                        :src="require(`assets/img/lang/${item.localeSrc}`)"
                        :alt="item.localeText"
                        class="locale__icon"
                      >
                      <span class="locale__text">
                        {{ item.localeText.toUpperCase() }}
                      </span>
                    </li>
                  </ul>
                </transition>
              </div>
              <!-- Кнопка мобильного меню -->
              <div
                class="ctm-menu__toggle"
                @click="toggleMobileMenu()"
              >
                <button class="header__button header__button_menu">
                  <span
                    v-if="!isMobileMenu"
                    class="icon-hamburger"
                  />
                  <span
                    v-if="isMobileMenu"
                    class="icon-close_big"
                  />
                </button>
              </div>
              <button
                class="header__button header__button_profile"
                @click="showProfile()"
              >
                <span class="icon-hamburger" />
                <transition name="fade">
                  <div
                    v-if="isShowProfile"
                    class="profile"
                  >
                    <div
                      class="profile__header"
                      @click="redirectToProfile"
                    >
                      <div class="profile__avatar">
                        <img
                          v-if="imageData"
                          id="userAvatarThree"
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
                      </div>
                      <div class="profile__info">
                        <div class="profile__text">
                          {{ userData.firstName }} {{ userData.lastName }}
                        </div>
                        <div
                          v-if="userRole === 'employer'"
                          class="profile__text profile__text_blue"
                        >
                          {{ $t('role.employer') }}
                        </div>
                        <div
                          v-if="userRole === 'worker'"
                          class="profile__text profile__text_green"
                        >
                          {{ $t('role.worker') }}
                        </div>
                      </div>
                    </div>
                    <div class="profile__items">
                      <nuxt-link
                        v-for="item in profileLinks"
                        :key="`item-${item.title}`"
                        tag="button"
                        class="profile__item"
                        :to="item.path"
                      >
                        {{ item.title }}
                      </nuxt-link>
                      <button
                        class="profile__item profile__item_red"
                        @click="logout()"
                      >
                        {{ $t('ui.profile.logout') }}
                      </button>
                    </div>
                  </div>
                </transition>
              </button>
            </div>
          </div>
        </div>
        <div
          :class="[{'ctm-open': isMobileMenu},
                   {'ctm-open': isNotFlexContainer}]"
        >
          <!-- Меню -->
          <transition name="fade-fast">
            <div
              class="ctm-menu"
              :class="{'ctm-menu_opened': isMobileMenu}"
            >
              <div class="ctm-menu__content">
                <div
                  v-if="isMobileMenu"
                  class="user"
                  @click="toggleUserDD()"
                >
                  <div class="user__container">
                    <div class="user-container__avatar">
                      <img
                        v-if="imageData"
                        id="userAvatarOne"
                        class="profile__img"
                        :src="imageData"
                      >
                      <img
                        v-if="!imageData"
                        id="userAvatar"
                        class="profile__img"
                        src="~/assets/img/app/avatar_empty.png"
                      >
                    </div>
                    <div class="user-container__user">
                      <div class="user__name">
                        {{ userData.firstName }} {{ userData.lastName }}
                      </div>
                      <div
                        v-if="userRole === 'employer'"
                        class="user__role"
                      >
                        {{ $t('role.employer') }}
                      </div>
                      <div
                        v-if="userRole === 'worker'"
                        class="user__role"
                      >
                        {{ $t('role.worker') }}
                      </div>
                    </div>
                  </div>
                  <div class="user-container__dropdown">
                    <div class="user__container">
                      <div class="user__dropdown">
                        <span
                          v-if="!isUserDDOpened"
                          class="icon-caret_down"
                        />
                        <span
                          v-if="isUserDDOpened"
                          class="icon-caret_up"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  v-if="isUserDDOpened === true"
                  class="user-dropdown__container"
                >
                  <div
                    v-for="(item, i) in userDDLinks"
                    :key="i"
                  >
                    <div
                      class="user-dropdown__link"
                      @click="item.title === 'Logout' ? logout(): toRoute(item.link)"
                    >
                      {{ item.title }}
                    </div>
                  </div>
                </div>
                <div
                  v-if="isMobileMenu"
                  class="mobile__links"
                >
                  <div
                    v-for="(item, i) in mobileMenuLinks"
                    :key="i"
                  >
                    <div
                      class="mobile__link"
                      @click="toRoute(item.path)"
                    >
                      {{ item.title }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </transition>
          <div class="template__main">
            <nuxt />
          </div>
        </div>
        <!-- footer -->
        <div class="template__footer">
          <div class="footer">
            <div class="footer__logo">
              <img
                src="/img/app/logo_gray.svg"
                alt="Logo"
              >
              <span>WorkQuest</span>
            </div>
            <div class="footer__content">
              <div class="footer__links links">
                <div class="links__item">
                  <p class="links__header">
                    {{ $t('layout.download') }}
                  </p>
                  <div class="links__links">
                    <a
                      class="links__store"
                      href="#"
                      target="_blank"
                    >
                      <img
                        src="~/assets/img/app/googleplay.svg"
                        alt="GooglePlay"
                      >
                    </a>
                    <a
                      class="links__store"
                      href="#"
                      target="_blank"
                    >
                      <img
                        src="~/assets/img/app/appstore.svg"
                        alt="AppStore"
                      >
                    </a>
                  </div>
                </div>
                <div class="links__item">
                  <p class="links__header">
                    {{ $t('layout.follow') }}
                  </p>
                  <div class="links__links">
                    <a
                      v-for="(link, i) in socialLinks"
                      :key="i"
                      class="links__social"
                      :class="`links__social_${link.class}`"
                      :href="link.url"
                      target="_blank"
                    />
                  </div>
                </div>
              </div>
              <div class="footer__menu">
                <p class="footer__subtitle">
                  {{ $t('ui.menu.menu') }}
                </p>
                <div class="footer__menu-inside">
                  <nuxt-link
                    v-for="(item, i) in mobileMenuLinks"
                    :key="i"
                    class="footer__link"
                    :to="item.path"
                  >
                    {{ item.title }}
                  </nuxt-link>
                </div>
              </div>
            </div>
            <div class="footer__bottom bottom">
              <div class="bottom__left">
                <div class="bottom__rights">
                  <div class="bottom__text bottom__text_rights">
                    © WorkQuest {{ new Date().getFullYear() }}
                  </div>
                  <div class="bottom__text bottom__text_rights">
                    {{ $t('ui.footer.rights') }}
                  </div>
                </div>
              </div>
              <div class="bottom__right">
                <div class="bottom__links">
                  <div class="bottom__link">
                    {{ $t('layout.links.terms') }}
                  </div>
                  <div class="bottom__link">
                    {{ $t('layout.links.privacy') }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- /footer -->
      </div>
    </div>
    <transition name="fade">
      <loader v-show="isLoading" />
    </transition>
    <ctm-modal />
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import ClickOutside from 'vue-click-outside';
import moment from 'moment';
import { Path } from '~/utils/enums';
import modals from '~/store/modals/modals';

export default {
  scrollToTop: true,
  name: 'DefaultLayout',
  middleware: 'auth',
  components: {},
  directives: {
    ClickOutside,
  },
  data() {
    return {
      localUserData: {},
      isInstrumentDropdownOpened: false,
      isUserDDOpened: false,
      isShowProfile: false,
      isShowNotify: false,
      isShowAdditionalMenu: false,
      isShowLocale: false,
      isMobileMenu: false,
      isNotFlexContainer: true,
      notification: 1,
      mobileMenuLinks: [
        { path: '/proposals', title: this.$t('ui.proposals') },
        { path: '/wallet', title: this.$t('ui.wallet') },
        { path: '/investors', title: this.$t('ui.investors') },
        { path: '/discussions', title: this.$t('ui.discussions') },
        { path: '/validators', title: this.$t('ui.validators') },
        { path: '/KYC', title: this.$t('ui.KYC') },
      ],
      userDDLinks: [
        { link: '/profile', title: 'My profile' },
        { link: '/', title: 'Logout' },
      ],
      socialLinks: [
        { url: 'https://twitter.com/workquest_co', class: 'twitter' },
        { url: 'https://www.youtube.com/channel/UCpQTdOMynXejrRTVf4ksKPA', class: 'youtube' },
        { url: 'https://www.reddit.com/user/WorkQuest_co', class: 'reddit' },
        { url: 'https://m.facebook.com/WorkQuestOfficial/', class: 'facebook' },
        { url: 'https://www.linkedin.com/company/workquestofficial', class: 'linkedin' },
        { url: 'https://www.instagram.com/workquestofficial/', class: 'instagram' },
        { url: 'https://t.me/WorkQuest', class: 'telegram' },
      ],
    };
  },
  computed: {
    ...mapGetters({
      isLoading: 'main/getIsLoading',
      userData: 'user/getUserData',
      imageData: 'user/getImageData',
      userRole: 'user/getUserRole',
      currentLocale: 'user/getCurrentLang',

      connections: 'main/notificationsConnectionStatus',
      token: 'user/accessToken',
    }),
    locales() {
      return this.$i18n.locales.map((item) => ({
        localeSrc: `${item}.svg`,
        localeText: this.$t(`ui.locals.${item}`),
        localeCode: item,
      }));
    },
    profileLinks() {
      return [
        { title: this.$t('ui.profile.myProfile'), path: '/profile' },
      ];
    },
  },
  watch: {
    $route() {
      this.$refs.templateScroll.scrollTop = 0;
    },
  },
  async beforeCreate() {
    await this.$store.dispatch('wallet/fetchCommonTokenInfo');
  },
  async mounted() {
    this.GetLocation();
    this.localUserData = JSON.parse(JSON.stringify(this.userData));
    this.$store.commit('user/setLang', this.$i18n.localeProperties.code);

    const res = await this.$store.dispatch('wallet/getVotesByAddresses', [this.userData?.wallet?.address]);
    if (res.ok && !+res.result[0]) {
      this.ShowModal({
        key: modals.status,
        img: require('~/assets/img/ui/warning.svg'),
        subtitle: this.$t('proposals.votingInfo'),
        buttonText: this.$t('meta.delegateNow'),
        closeCallback: () => {
          this.$router.push(`${Path.INVESTORS}/${this.userData.id}`);
        },
      });
    }

    // notifications
    const { notifsConnection } = this.connections;
    const {
      $wsNotifs, token,
    } = this;
    if (!notifsConnection) {
      await $wsNotifs.connect(token);
    }
    // wallet txs
    await this.$store.dispatch('wallet/subscribeWS', {
      hexAddress: this.userWalletAddress,
      timestamp: this.$moment(),
    });
  },
  methods: {
    setLocale(item) {
      this.$store.commit('user/setLang', item.localeCode);
      this.$i18n.setLocale(item.localeCode);
      moment.locale(item.localeCode);
    },
    toRoute(path) {
      this.$router.push(path);
      this.toggleMobileMenu();
    },
    toggleUserDD() {
      this.isUserDDOpened = !this.isUserDDOpened;
    },
    toggleInstrumentDD() {
      this.isInstrumentDropdownOpened = !this.isInstrumentDropdownOpened;
    },
    closeMenu() {
      this.isMobileMenu = false;
      this.closeAnother('mobile');
    },
    toggleMobileMenu() {
      this.isMobileMenu = !this.isMobileMenu;
      this.isNotFlexContainer = !this.isNotFlexContainer;
      this.closeAnother('mobile');
    },
    goToMessages() {
      this.$router.push('/messages');
      this.closeAll();
    },
    showProfile() {
      this.closeAnother('profile');
      this.isShowProfile = !this.isShowProfile;
    },
    showNotification() {
      this.closeAnother('notify');
      this.isShowNotify = !this.isShowNotify;
    },
    showAdditionalMenu() {
      this.closeAnother('instruments');
      this.isShowAdditionalMenu = !this.isShowAdditionalMenu;
    },
    showLocale() {
      this.closeAnother('locale');
      this.isShowLocale = !this.isShowLocale;
    },
    closeAnother(value) {
      switch (value) {
        case 'mobile':
          this.isShowProfile = false;
          this.isShowNotify = false;
          this.isShowLocale = false;
          this.isShowAdditionalMenu = false;
          break;
        case 'instruments':
          this.isShowProfile = false;
          this.isShowNotify = false;
          this.isShowLocale = false;
          break;
        case 'profile':
          this.isShowAdditionalMenu = false;
          this.isShowNotify = false;
          this.isShowLocale = false;
          break;
        case 'locale':
          this.isShowAdditionalMenu = false;
          this.isShowNotify = false;
          this.isShowProfile = false;
          break;
        case 'notify':
          this.isShowAdditionalMenu = false;
          this.isShowProfile = false;
          this.isShowLocale = false;
          break;
        default:
          break;
      }
    },
    async logout() {
      await this.$store.dispatch('user/logout');
      await this.$router.push('/');
    },
    closeAll() {
      this.isShowProfile = false;
      this.isShowNotify = false;
      this.isShowAdditionalMenu = false;
      this.isShowLocale = false;
    },
    redirectToProfile() {
      this.$router.push(`${Path.PROFILE}`);
    },
  },
};
</script>
<style lang="scss" scoped>

.hidden {
  display: none;
}

.mobile {
  &-dropdown {
    border-bottom: 1px solid $black0;

    &__btn {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
    }

    &__title {
      padding: 16px 0 20px 20px;
    }

    &__arrow {
      justify-self: flex-end;
      padding: 16px 20px 0 0;
    }
  }

  &__links {
    display: none;
    flex-direction: column;
  }

  &__link {
    padding: 16px 20px 16px 20px;
    font-weight: 400;
    font-size: 16px;
    color: $black800;
    border-bottom: 1px solid $black0;
    transition: 1s;
    text-decoration: none;

    &:hover {
      @extend .mobile__link;
      background: $blue;
      color: $white;
      font-weight: 600;
    }
  }
}

.instrument-dropdown {
  &__link {
    @extend .mobile__link;
    display: flex;
    flex-direction: column;
    color: $black600;
    padding: 16px 0 20px 35px;
  }
}

.user {
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  &-dropdown {
    &__link {
      @extend .mobile__link;
      display: flex;
      flex-direction: column;
      background: $black0;
      padding: 16px 0 20px 20px;
    }
  }

  &-container {
    &__avatar {
      padding: 15px;
      max-width: 80px;
      max-height: 80px;
      width: 100%;
      height: 100%;
    }

    &__user {
      padding: 15px 0 0 0;
      display: grid;
    }
  }

  &__dropdown {
    align-self: center;
  }

  &__container {
    display: flex;
    flex-direction: row;
    background: $black0;
    max-height: 70px;
    height: 100%;
    max-width: 100%;
    width: 100%;
    padding: 0 20px 0 0;
  }

  &__avatar {
    max-height: 40px;
    height: 100%;
    max-width: 40px;
    width: 100%;
    border-radius: 137px;
  }

  &__name {
    font-weight: 500;
    font-size: 16px;
    color: $black800;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__role {
    font-weight: 400;
    font-size: 12px;
    color: $blue;
    padding: 0 0 11px 0;
  }
}

.icon {
  font-size: 20px;

  &-caret_down:before {
    @extend .icon;
    content: "\ea48";
    color: #2e3a59;
  }

  &-caret_up:before {
    @extend .icon;
    content: "\ea4b";
    color: #2e3a59;
  }

  &-close_big:before {
    @extend .icon;
    content: "\e948";
    color: #2e3a59;
  }
}

.locale {
  position: absolute;
  top: 73px;
  background: $white;
  box-shadow: 0 17px 17px rgba(0, 0, 0, 0.05), 0 5.125px 5.125px rgba(0, 0, 0, 0.03), 0 2.12866px 2.12866px rgba(0, 0, 0, 0.025), 0 0.769896px 0.769896px rgba(0, 0, 0, 0.0174206);
  border-radius: 6px;
  z-index: 10000000;
  padding: 15px 20px;

  &__item {
    width: 46px;
    display: flex;
    align-items: center;
    opacity: 0.7;
    grid-gap: 5px;

    &_active {
      opacity: 1;
    }

    &:hover {
      opacity: 1;
    }
  }

  &__item:not(:last-child) {
    margin-bottom: 15px;
  }

  &__icon {
    display: block;
    margin-right: 10px;
    border-radius: 50%;
    width: 15px;
    height: 15px;
  }

  &__text {
    @include text-simple;
    font-weight: 500;
    font-size: 16px;
    line-height: 130%;
    color: $black500;
  }
}

.ctm {
  &-open {
    display: flex;
    width: 100%;
  }

  &__actions {
    padding: 20px;
  }

  &-menu {
    display: none;
    transition: .2s;

    &_opened {
      overflow-y: auto;
      background: $white;
      display: flex;
      width: 100%;
      position: fixed;
      top: 73px;
      bottom: 0;
      right: 0;
      left: 0;
      z-index: 100;
    }

    &__content {
      height: 100%;
      width: 100%;
      display: flex;
      flex-direction: column;
      background: $white;
      border-radius: 0 0 5px 5px;

      &_hide {
        width: 0;
      }
    }
  }
}

.primary {
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
}

.template {
  background: #F7F8FA;
  min-height: 100vh;

  &__content {
    display: grid;
    grid-template-rows: 72px 1fr 352px;
    min-height: 100vh;
  }

  &__main {
    display: grid;
    padding-bottom: 20px;
    transition: 1s;
    width: 100%;
    max-width: 100vw;
  }

  &__footer {
    background: $white;
    width: 100%;
    min-height: 353px;
  }
}

.notify {
  position: absolute;
  top: calc(72px + 5px);
  right: calc(100% - 43px);
  background: #FFFFFF;
  box-shadow: 0 17px 17px rgba(0, 0, 0, 0.05), 0 5.125px 5.125px rgba(0, 0, 0, 0.0325794), 0 2.12866px 2.12866px rgba(0, 0, 0, 0.025), 0 0.769896px 0.769896px rgba(0, 0, 0, 0.0174206);
  border-radius: 6px;
  min-width: 441px;
  z-index: 10000000;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    height: 64px;
    border-bottom: 1px solid #F7F8FA;

    span:before {
      color: $shade700 !important;
      font-size: 24px;
    }
  }

  &__title {
    font-family: 'Inter', sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 18px;
    line-height: 130%;
    color: $black800;
  }

  &__btn {
    background: #F7F8FA;
    border-radius: 3px;
    height: 44px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;

    span:before {
      color: #0083C7;
      font-size: 24px;
    }
  }

  &__action {
    padding-top: 12px;
  }

  &__content {
    width: 100%;
    height: 100%;
    padding: 20px;
  }

  &__reason {
    padding-top: 12px;
  }

  &__text {
    font-family: 'Inter', sans-serif;
    font-style: normal;
    font-weight: normal;
    line-height: 130%;

    &_date {
      font-size: 12px;
      text-align: right;
      color: $black300;
    }

    &_name {
      font-size: 16px;
      color: $black800;
    }

    &_grey {
      font-size: 12px;
      color: $black500;
    }

    &_blue {
      font-size: 16px;
      color: $blue;
      text-align: left;
    }

    &_btn {
      font-size: 16px;
      color: $black800;
    }
  }

  &__items {
    display: grid;
    grid-template-columns: 1fr;
  }

  &__user {
    display: grid;
    grid-template-columns: 40px 1fr;
    grid-gap: 10px;
  }

  &__info {
    grid-gap: 5px;
    display: grid;
    text-align: left;
    align-items: center;
  }

  &__avatar {
    max-height: 40px;
    max-width: 40px;
    border-radius: 100%;
  }

  &__top {
    display: flex;
    justify-content: space-between;
  }

  &__item {
    min-height: 167px;
    border-bottom: 1px solid #F7F8FA;
    width: 100%;
    display: flex;
    justify-items: flex-start;
    align-items: center;
  }
}

.profile {
  position: absolute;
  top: 57px;
  right: calc(100% - 43px);
  z-index: 10000000;

  background: #FFFFFF;
  box-shadow: 0 17px 17px rgba(0, 0, 0, 0.05), 0 5.125px 5.125px rgba(0, 0, 0, 0.03), 0 2.12866px 2.12866px rgba(0, 0, 0, 0.025), 0 0.769896px 0.769896px rgba(0, 0, 0, 0.0174206);
  border-radius: 6px;

  min-width: 223px;
  width: 100%;
  min-height: 100%;
  overflow: hidden;

  &__header {
    border-bottom: 1px solid #F7F8FA;
    display: grid;
    grid-template-columns: 40px 1fr;
    padding: 15px;
    grid-gap: 10px;
  }

  &__avatar {
    display: flex;
    flex-wrap: nowrap;
    max-width: 40px;
    max-height: 40px;
    width: 100%;
    height: 100%;
    border-radius: 100%;
  }

  &__img {
    max-width: 40px;
    max-height: 40px;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }

  &__items {
    display: grid;
    grid-template-columns: 1fr;
    justify-items: flex-start;
  }

  &__item {
    height: 41px;
    background: #FFFFFF;
    display: flex;
    align-items: center;
    padding: 0 15px;
    font-family: 'Inter', sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 130%;
    color: $black800;
    width: 100%;
    transition: .3s;

    &_red {
      color: $red;
    }

    &:hover {
      background: #F7F8FA;
    }
  }

  &__text {
    font-family: 'Inter', sans-serif;
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 130%;
    color: $black800;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    &_blue {
      font-weight: normal;
      font-size: 12px;
      color: $blue;
    }

    &_green {
      font-weight: normal;
      font-size: 12px;
      color: $green;
    }
  }

  &__info {
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 5px;
    text-align: left;
    min-width: 0;
  }
}

.header {
  position: sticky;
  top: 0;
  z-index: 1300;
  min-height: 72px;
  background: #FFFFFF;
  box-shadow: 0 1px 0 #E6E9EC;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  &__body {
    max-width: 1180px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__left {
    display: grid;
    align-items: center;
    grid-template-columns: auto 1fr;
    grid-gap: 35px;
  }

  &__link {
    font-family: 'Inter', sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 130%;
    color: $black400;
    text-decoration: none;

    &_active {
      color: $black800;
    }

    &_menu {
      display: flex;
      align-items: center;
      position: relative;

      span::before {
        color: $black400;
        font-size: 24px;
        padding-left: 5px;
      }
    }
  }

  &__button {
    font-family: 'Inter', sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 130%;
    color: $black600;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    width: 43px;
    height: 43px;
    border: 1px solid transparent;

    &:hover {
      border: 1px solid $black100;
    }

    span:before {
      color: $black400;
      font-size: 24px;
    }

    &_profile {
      position: relative;
    }

    &_menu {
      position: relative;
      display: none;
    }

    &_notify {
      position: relative;
    }

    &_locale {
      width: 86px;
      height: 46px;
      cursor: pointer;

      span {
        padding-left: 10px;
      }
    }
  }

  &__links {
    display: grid;
    align-items: center;
    grid-template-columns: repeat(6, auto);
    grid-gap: 25px;
  }

  &__right {
    display: grid;
    grid-template-columns: repeat(2, auto);
    grid-gap: 10px;
    align-items: center;
  }

  &__logo {
    display: grid;
    align-items: center;
    grid-template-columns: 40px 1fr;
    grid-gap: 5px;
    cursor: pointer;

    span {
      font-family: 'Inter', sans-serif;
      font-style: normal;
      font-weight: bold;
      font-size: 23px;
      line-height: 130%;
      color: $black700;
    }

    img {
      height: 30px;
      width: 40px;
    }
  }
}

.menu {
  position: absolute;
  top: 72px;
  background: #FFFFFF;
  box-shadow: 0 17px 17px rgba(0, 0, 0, 0.05), 0 5.125px 5.125px rgba(0, 0, 0, 0.03), 0 2.12866px 2.12866px rgba(0, 0, 0, 0.025), 0 0.769896px 0.769896px rgba(0, 0, 0, 0.0174206);
  border-radius: 6px;
  min-width: 790px;
  width: 100%;
  min-height: 230px;
  z-index: 10000000;

  &__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;

    span::before {
      transition: .1s;
      visibility: hidden;
      font-size: 24px;
      color: #2E3A59;
    }
  }

  &__text {
    font-family: 'Inter', sans-serif;
    font-style: normal;
    font-weight: normal;

    &_header {
      font-size: 16px;
      line-height: 130%;
      color: $black800;
    }

    &_grey {
      font-size: 14px;
      line-height: 130%;
      color: $black500;
    }
  }

  &__items {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    padding: 20px;
    grid-gap: 10px;
  }

  &__item {
    transition: .3s;
    background: #FFFFFF;
    border-radius: 6px;
    border: 1px solid transparent;
    min-height: 90px;
    display: flex;
    align-items: flex-start;
    text-align: left;
    flex-direction: column;
    justify-content: space-between;
    padding: 10px;

    &:hover {
      border: 1px solid $black100;

      .menu {
        &__top {
          span::before {
            visibility: initial;
          }
        }
      }
    }
  }
}

.locale {
  position: absolute;
  top: calc(72px + 5px);
  background: #FFFFFF;
  box-shadow: 0 17px 17px rgba(0, 0, 0, 0.05), 0 5.125px 5.125px rgba(0, 0, 0, 0.03), 0 2.12866px 2.12866px rgba(0, 0, 0, 0.025), 0 0.769896px 0.769896px rgba(0, 0, 0, 0.0174206);
  border-radius: 6px;
  min-width: 86px;
  z-index: 10000000;

  &__items {
    padding: 10px 15px;
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 15px;
  }

  &__item {
    display: grid;
    grid-template-columns: 15px 1fr;
    grid-gap: 5px;
    align-items: center;
    min-height: 20px;
  }

  &__icon {
    border-radius: 100%;
  }

  &__text {
    font-family: 'Inter', sans-serif;
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 130%;
    color: $black500;
  }
}

.footer {
  margin: 0 auto;
  padding-top: 32px;
  width: 1180px;

  &__content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    margin-bottom: 15px;
  }

  &__logo {
    display: flex;

    span {
      color: $black400;
      font-size: 23px;
      font-weight: bold;
      margin-left: 5px;
    }
  }

  &__subtitle {
    margin-bottom: 15px;
  }

  &__menu-inside {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  &__link {
    color: $black500;
    margin-bottom: 10px;

    &:hover {
      text-decoration: none;
    }
  }
}

.links {
  &__header {
    @include text-simple;
    @include text-usual;
    font-weight: 500;
    color: $black700;
    margin: 15px 0;
  }

  &__links {
    display: flex;
    grid-gap: 15px;
  }

  &__social {
    width: 40px;
    height: 40px;
    transition: all 0.5s;
    border-radius: 11px;

    &_twitter {
      background: center / contain no-repeat url('~assets/img/social/footer_twitter.svg') $white;
    }

    &_twitter:hover {
      background: center / contain no-repeat url('~assets/img/social/footer_twitter_active.svg') $white;
    }

    &_youtube {
      background: center / contain no-repeat url('~assets/img/social/footer_youtube.svg') $white;
    }

    &_youtube:hover {
      background: center / contain no-repeat url('~assets/img/social/footer_youtube_active.svg') $white;
    }

    &_reddit {
      background: center / contain no-repeat url('~assets/img/social/footer_reddit.svg') $white;
    }

    &_reddit:hover {
      background: center / contain no-repeat url('~assets/img/social/footer_reddit_active.svg') $white;
    }

    &_facebook {
      background: center / contain no-repeat url('~assets/img/social/footer_facebook.svg') $white;
    }

    &_facebook:hover {
      background: center / contain no-repeat url('~assets/img/social/footer_facebook_active.svg') $white;
    }

    &_linkedin {
      background: center / contain no-repeat url('~assets/img/social/footer_linkedin.svg') $white;
    }

    &_linkedin:hover {
      background: center / contain no-repeat url('~assets/img/social/footer_linkedin_active.svg') $white;
    }

    &_instagram {
      background: center / contain no-repeat url('~assets/img/social/footer_instagram.svg') $white;
    }

    &_instagram:hover {
      background: center / contain no-repeat url('~assets/img/social/footer_instagram_active.svg') $white;
    }

    &_telegram {
      background: center / contain no-repeat url('~assets/img/social/footer_telegram.svg') $white;
    }

    &_telegram:hover {
      background: center / contain no-repeat url('~assets/img/social/footer_telegram_active.svg') $white;
    }
  }

  &__store {
    &:hover {
      text-decoration: none;
    }
  }
}

.bottom {
  width: 100%;
  display: flex;
  justify-content: space-between;
  border-top: 1px solid $black100;
  height: 72px;
  align-items: center;

  &__links {
    display: grid;
    grid-template-columns: repeat(2, auto);
    grid-gap: 20px;
  }

  &__link {
    font-family: 'Inter', sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 130%;
    color: $blue;
    cursor: pointer;
  }

  &__text {
    font-family: 'Inter', sans-serif;
    font-style: normal;
    font-weight: normal;

    &_rights {
      font-size: 14px;
      line-height: 130%;
      color: $black500;
    }
  }

  &__rights {
    display: grid;
    grid-template-columns: repeat(2, auto);
    grid-gap: 20px;
  }
}

.ctm-menu {
  &__toggle {
    display: none;
  }
}

@include _1199 {
  .header {
    max-width: 100vw;

    &__button_menu {
      display: flex;
    }

    &__body {
      max-width: calc(100vw - 30px);
      margin: 0 15px;
    }
  }
  .bottom {
    width: calc(100vw - 30px);
  }
  .footer {
    padding-left: 15px;
  }
}

@include _991 {
  .ctm-menu {
    &__toggle {
      display: flex;
    }
  }
  .header {
    &__links {
      display: none;
    }

    &__button_profile {
      display: none;
    }
  }
  .mobile {
    &__links {
      display: flex;
    }
  }
  .template {
    min-height: 100vh;

    &__content {
      min-height: 100vh;
    }
  }
  .header {
    &__btn {
      display: none !important;
    }

    &__right {
      margin-left: 10px;
      grid-gap: 5px;
    }
  }
  .template {
    &__content {
      grid-template-rows: 72px 1fr auto;
    }
  }
  .footer {
    padding: 32px 15px 0 15px;
    width: 100vw;
  }
}

@include _767 {
  .footer {
    &__content {
      display: flex;
      flex-direction: column-reverse;
    }

    &__menu-inside {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-gap: 20px;
      margin: 30px 0;
    }

    &__subtitle {
      display: none;
    }

    &__link {
      margin: 0;
    }
  }
  .links {
    display: flex;
    flex-direction: column-reverse;
    gap: 20px;
  }
  .template {
    &__main {
      padding-bottom: 20px;
    }
  }
}

@include _575 {
  .header {
    &__logo {
      span {
        display: none;
      }
    }

    &__btn {
      display: none !important;
    }

    &__left {
      grid-gap: 15px;
    }

    &__right {
      grid-gap: 2px;
    }
  }
  .notify {
    min-width: 350px;
  }
  .footer {
    &__bottom {
      justify-content: space-between;
    }

    &__links {
      display: flex;
    }

    &__top {
      display: grid;
      grid-template-columns: 1fr;
      grid-gap: 30px;
    }

    &__items {
      grid-template-columns: repeat(2, 1fr);
      grid-gap: 20px;

      &_links {
        grid-template-columns: 1fr;
      }
    }
  }
  .bottom {
    &__links, &__rights {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }
  }
}

@include _480 {
  .notify {
    min-width: 300px;
  }
}

@include _380 {
  .notify {
    min-width: 250px;
  }
}
</style>

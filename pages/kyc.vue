<template>
  <div class="kyc">
    <div class="kyc__body">
      <div class="kyc__header">
        {{ $t('kyc.KYC') }}
      </div>
      <div class="kyc__content">
        <div id="sumsub-websdk-container" />
      </div>
    </div>
  </div>
</template>

<script>
import snsWebSdk from '@sumsub/websdk';
import { mapGetters } from 'vuex';

export default {
  name: 'KYC',
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      accessToken: 'sumsub/getSumSubBackendToken',
      userData: 'user/getUserData',
    }),
  },
  async mounted() {
    this.SetLoader(true);
    await this.createAccessToken();
    this.initSumSub();
    this.SetLoader(false);
  },
  methods: {
    async createAccessToken() {
      await this.$store.dispatch('sumsub/createAccessTokenBackend', { userId: this.accessToken.userId });
    },
    initSumSub() {
      const accessToken = this.accessToken.token;
      const applicantEmail = this.userData.email;
      const applicantPhone = this.userData.phone;

      try {
        const snsWebSdkInstance = snsWebSdk.Builder('https://test-api.sumsub.com', 'basic-kyc')
          .withAccessToken(accessToken, () => {
          })
          .withConf({
            lang: 'en',
            email: applicantEmail,
            phone: applicantPhone, // if available
            onMessage: (type, payload) => {
              console.log('WebSDK onMessage', type, payload);
            },
            onError: (error) => {
              console.log('WebSDK onError', error);
            },
          }).build();

        snsWebSdkInstance.launch('#sumsub-websdk-container');
      } catch (e) {
        console.error('Error with snsWebSdkInstance. ', e);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.kyc {
  @include main;
  @include text-simple;
  &__body {
    max-width: 1180px;
    height: 100%;
  }
  &__header {
    font-weight: 600;
    font-size: 28px;
    line-height: 36px;
    color: #000000;
    margin: 30px 0 20px;
  }
  &__content {
    height: calc(100% - 86px);
    background: #FFFFFF;
    border-radius: 6px;
  }
}
</style>

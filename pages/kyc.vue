<template>
  <div class="kyc">
    <div class="kyc__body">
      <div class="kyc__header">
        {{ $t('kyc.KYC') }}
      </div>
      <div class="kyc__content">
        <div
          v-if="statusKYC === $options.SumSubStatuses.NOT_VERIFIED"
          id="sumsub-websdk-container"
        />
        <div
          v-if="statusKYC === $options.SumSubStatuses.VERIFIED"
          class="kyc__verified"
        >
          <img
            class="kyc__image"
            src="~/assets/img/ui/questAgreed.svg"
            alt=""
          >
          <div class="kyc__text">
            {{ $t('kyc.alreadyVerified') }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import snsWebSdk from '@sumsub/websdk';
import { mapGetters } from 'vuex';
import { SumSubStatuses } from '~/utils/enums';

export default {
  name: 'KYC',
  SumSubStatuses,
  computed: {
    ...mapGetters({
      accessToken: 'sumsub/getSumSubBackendToken',
      userData: 'user/getUserData',
      statusKYC: 'user/getStatusKYC',
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
      if (this.statusKYC === SumSubStatuses.NOT_VERIFIED) await this.$store.dispatch('sumsub/createAccessTokenBackend', { userId: this.accessToken.userId });
    },
    initSumSub() {
      if (this.statusKYC === SumSubStatuses.VERIFIED) return;
      const accessToken = this.accessToken.token;
      const { email, phone } = this.userData;
      try {
        const snsWebSdkInstance = snsWebSdk.Builder('https://test-api.sumsub.com', 'basic-kyc')
          .withAccessToken(accessToken, () => {
          })
          .withConf({
            lang: 'en',
            email,
            phone,
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
    color: $black800;
    margin: 30px 0 20px;
  }

  &__image {
    height: 100px;
    width: 100px;
  }

  &__text {
    margin-top: 10px;
  }

  &__verified {
    padding: 20px 0 20px 0;
    display: flex;
    align-items: center;
    flex-direction: column;
  }

  &__content {
    display: flex;
    height: calc(100% - 86px);
    background: $white;
    border-radius: 6px;
    justify-content: center;
    align-items: center;
  }
}

@include _767 {
  .kyc {
    &__header {
      margin-left: 15px;
    }
  }
}
</style>

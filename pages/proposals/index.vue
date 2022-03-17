<template>
  <div class="main">
    <div class="main__body main__body_large">
      <div
        class="quests__top"
        :class="[{'top-disabled': isShowInfo === false}]"
      >
        <transition name="fade-fast">
          <div class="page__info">
            <div class="page__grid">
              <div class="page__info info">
                <h2 class="info__title">
                  {{ $t('proposals.title') }}
                </h2>
                <div class="info__subtitle">
                  {{ $t('proposals.textBanner') }}
                </div>
                <div class="info__btn-container">
                  <base-btn
                    v-if="!isMobile"
                    mode="ver"
                    @click="addProposalModal"
                  >
                    {{ $t('proposals.addProposals') }}
                  </base-btn>
                </div>
              </div>
              <div>
                <img
                  class="higher-level__img"
                  src="~/assets/img/ui/proposals-img.svg"
                  alt=""
                >
              </div>
            </div>
          </div>
        </transition>
      </div>
      <proposalCards />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import proposalCards from '~/components/app/Cards/proposalCards';
import modals from '~/store/modals/modals';
import { Chains } from '~/utils/enums';
import { getStyledAmount } from '~/utils/wallet';

export default {
  name: 'Proposals',
  components: {
    proposalCards,
  },
  data() {
    return {
      isShowInfo: true,
      firstLoading: true,
      isMobile: false,
    };
  },
  computed: {
    ...mapGetters({
      isWalletConnected: 'wallet/getIsWalletConnected',
      userWalletAddress: 'user/getUserWalletAddress',
      proposalThreshold: 'proposals/proposalThreshold',
    }),
  },
  async beforeCreate() {
    await this.$store.dispatch('wallet/checkWalletConnected', { nuxt: this.$nuxt });
  },
  methods: {
    isCloseInfo() {
      this.isShowInfo = !this.isShowInfo;
    },
    async addProposalModal() {
      this.SetLoader(true);
      let delegated;
      let { proposalThreshold } = this;
      if (!proposalThreshold) {
        const [delegatedRes, proposalThresholdRes] = await Promise.all([
          this.$store.dispatch('wallet/getVotesByAddresses', [this.userWalletAddress]),
          this.$store.dispatch('wallet/getProposalThreshold'),
        ]);
        console.log(delegatedRes, 'THRESHOLD:', proposalThresholdRes);
        delegated = getStyledAmount(delegatedRes.result[0], true);
        proposalThreshold = proposalThresholdRes.result;
        await this.$store.dispatch('proposals/setProposalThreshold', proposalThreshold);
      } else {
        const delegatedRes = await this.$store.dispatch('wallet/getVotesByAddresses', [this.userWalletAddress]);
        delegated = getStyledAmount(delegatedRes.result[0], true);
      }
      this.SetLoader(false);
      if (+delegated < +proposalThreshold) {
        this.ShowToast(this.$t('proposal.errors.notEnoughFunds', { a: proposalThreshold, b: delegated }),
          this.$t('proposal.errors.addProposal'));
      } else {
        this.showAddProposal();
      }
    },
    showAddProposal() {
      this.ShowModal({
        key: modals.addProposal,
        callback: async () => await this.$store.dispatch('proposals/getProposals', { limit: 12, offset: 0 }),
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.main {
  @include main;
  &-white {
    @include main;
    background: $white;
    margin: 0 0 20px 0;
    border-radius: 6px;
    justify-content: center;
  }
  &__body_large {
    margin: 30px 15px 0 15px;
  }
}
.page {
  &__grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    border-radius: 6px;
    background: linear-gradient(135deg, #0083C7 0%, #103D7C 100%);
  }
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
  &__checkbox {
    margin: 50px 0 20px 20px;
    display: flex;
    flex-direction: row;
  }
  &__part {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    &_left {
      display: grid;
    }
    &_right {
      display: grid;
    }
  }
  &__info {
    border-radius: 6px;
    color: $white;
    min-height: 85px;
  }
  &__badge {
    background: rgba(0, 131, 199, 0.1);
    border-radius: 44px;
    margin: 10px;
    color: $blue;
    padding: 5px 6px;
    display: flex;
    text-align: center;
    &-skills {
      padding: 15px;
    }
  }
  &__skills {
    flex-direction: row;
    flex-wrap: wrap;
    display: flex;
    max-width: 1180px;
    width: 100%;
    justify-content: flex-start;
  }
}
.info{
  padding: 40px 0 40px 20px;
  &__title {
    line-height: 58px;
    font-size: 45px;
    font-weight: 500;
  }
  &__subtitle {
    margin-top: 9px;
    line-height: 23px;
    font-size: 16px;
    font-weight: 500;
    opacity: 0.5;
  }
  &__btn-container {
    display: flex;
    margin-top: 25px;
    max-width: 220px;
  }
}

.higher-level {
  &__img {
    z-index: 1;
    height: 100%;
    width: 100%;
    max-height: 285px;
    padding: 0 0 0 30px;
  }
}

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
    position: relative;
    bottom: 200px;
    right: 10px;
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
@include _991 {
  .higher {
    &-level {
      &__img {
        display: none;
      }
    }
  }
  .icon {
    &__close {
      bottom: 154px;
    }
  }
}
@include _767 {
  .main {
    &__body {
      max-width: calc(100vw - 30px);
    }
  }
  .page {
    &__grid {
      grid-template-columns: 1fr;
    }
  }
}
</style>

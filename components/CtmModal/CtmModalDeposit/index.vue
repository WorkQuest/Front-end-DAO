<template>
  <ctm-modal-box
    class="walletDeposit"
    :title="$tc('modals.deposit')"
  >
    <div class="ctm-modal__content">
      <div class="step-panel">
        <div
          class="step-panel__step"
          :class="[{'step-panel__step_active': step === 'wallet'}]"
          @click="step = 'wallet'"
        >
          {{ $t('wallet.walletAddress') }}
        </div>
        <div
          class="step-panel__step"
          :class="[{'step-panel__step_active': step === 'bank'}]"
          @click="step = 'bank'"
        >
          {{ $t('wallet.bankCard') }}
        </div>
      </div>
      <div
        v-if="step === 'wallet'"
        class="step__container"
      >
        <deposit-wallet-address :address-type-default="options.addressType" />
      </div>
      <div
        v-if="step === 'bank'"
        class="step__container"
      >
        <bank-card />
      </div>
    </div>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';
import DepositWalletAddress from '~/components/CtmModal/CtmModalDeposit/DepositWalletAddress';
import bankCard from '~/components/CtmModal/CtmModalDeposit/BankCard';

export default {
  name: 'ModalDeposit',
  components: { bankCard, DepositWalletAddress },
  data() {
    return {
      step: 'wallet',
    };
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
    }),
  },
};
</script>

<style lang="scss" scoped>

.icon {
  &-copy:before {
    content: "\e996";
    color: $blue;
    font-size: 20px;
  }
}

.code {
  &__container {
    display: flex;
    border: 1px solid $black0;
    border-radius: 6px;
    justify-content: space-between;
    padding: 12px;
    margin: 33px 0 0 0;
  }
  &__text {
    font-weight: 400;
    font-size: 16px;
    color: $black800;
  }
}

.step {
  &-three {
    &__text {
      @include text-simple;
      font-weight: 400;
      font-size: 16px;
      color: $black500;
      &_blue {
        @extend .step-three__text;
        color: $blue;
      }
    }
  }
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
    @include text-simple;
    font-weight: 400;
    font-size: 16px;
    color: $black500;
    margin: 0 10px 0 0;
    cursor: pointer;
    &_active {
      color: $black800;
      border-bottom: 1px solid $blue;
      padding: 0 0 12px 0;
    }
  }
}

.ctm-modal {
  @include modalKit;
}
.btn {
  &__container {
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
    margin: 15px 0 0 0;
  }
  &__wrapper {
  }
}

.walletDeposit {
  max-width: 380px !important;
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
.icon-share_outline {
  color: $black100;
  font-size: 24px;
}
</style>

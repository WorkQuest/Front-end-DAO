<template>
  <ctm-modal-box
    class="delegate"
    :title="$t('modals.delegate')"
  >
    <div class="delegate__content content">
      <validation-observer v-slot="{handleSubmit, valid}">
        <div class="content__address address">
          <label class="address__label">
            {{ $t('modals.investorAddress') }}
          </label>
          <div class="delegate__input">
            <base-field
              disabled
              :value="investorAddress"
              class="address__body"
            >
              {{ investorAddress }}
            </base-field>
          </div>
        </div>
        <div class="content__tokens tokens">
          <div class="tokens__title">
            {{ $t('modals.tokensNumber') }}
          </div>
          <label class="tokens__title_grey">
            {{ $t('modals.tokensDelegated') }}
          </label>
          <div class="tokens__footer footer">
            <base-field
              v-model="tokensAmount"
              class="footer__body"
              placeholder="10000"
              :name="$t('modals.tokensNumber')"
              :rules="`required${min}`"
            />
            <base-btn
              class="footer__maximum"
              mode="lightBlue"
              @click="maxDelegate"
            >
              {{ $t('modals.max') }}
            </base-btn>
          </div>
        </div>
        <base-btn
          class="delegate__done"
          :disabled="!valid"
          @click="handleSubmit(delegate)"
        >
          {{ $t('modals.delegate') }}
        </base-btn>
      </validation-observer>
    </div>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';
import { Chains } from '~/utils/enums';
import modals from '~/store/modals/modals';

export default {
  name: 'Delegate',
  data() {
    return {
      tokensAmount: '',
      balance: 0,
      investorAddress: '',
    };
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
      isWalletConnected: 'wallet/getIsWalletConnected',
      balanceData: 'wallet/getBalanceData',
    }),
    min() {
      return this.options?.min ? `|min_value:${this.options.min}` : '';
    },
  },
  beforeMount() {
    if (!this.isWalletConnected) {
      this.$store.dispatch('wallet/checkWalletConnected');
      this.CloseModal();
    }
    this.investorAddress = this.options.investorAddress;
  },
  async mounted() {
    // TODO: update balance
    await this.$store.dispatch('wallet/getBalance');
    // const res = await this.$store.dispatch('web3/getBalance');
    // this.accountAddress = await this.$store.dispatch('web3/getAccount');
    // if (res.ok) {
    //   this.balance = res.result;
    // }
  },
  methods: {
    maxDelegate() {
      this.tokensAmount = this.balance;
    },
    async delegate() {
      const { callback } = this.options;
      this.SetLoader(true);
      const res = await this.$store.dispatch('web3/delegate', { address: this.investorAddress, amount: this.tokensAmount });
      this.SetLoader(false);
      if (res.ok) {
        await this.$store.dispatch('main/showToast', {
          title: 'Delegate',
          text: `Delegated ${this.tokensAmount} WQT`,
        });
        this.CloseModal();
        if (callback) await callback();
      } else if (res.msg.includes('Not enough balance to delegate')) {
        await this.$store.dispatch('modals/show', {
          key: modals.status,
          title: this.$t('errors.delegate.title'),
          subtitle: this.$t('errors.delegate.notEnoughBalance'),
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.delegate {
  max-width: 500px !important;
  &__content {
    padding: 20px 28px 30px 28px!important;
  }
  &__body{
    @include text-usual;
    color: $black800;
    margin: 25px 0;
    background-color: $white!important;
  }
  &__done{
    margin-top: 25px;
  }
  &__input {
    height: 46px;
    margin-bottom: 15px;
  }
}
.footer {
  display: flex;
  justify-content: space-between;
  grid-gap: 10px;
  &__body{
    width: 100%;
    height: 46px!important;
  }
  &__maximum{
    width: 100px!important;
    height: 46px!important;
  }
}
.address{
  &__label{
    @include text-usual;
    color: $black800;
    margin: 0!important;
  }
  &__body{
    margin-top: 5px;
  }
}
.tokens{
  &__title{
    @include text-usual;
    color: $black800;
    margin-bottom: 5px;
    &_grey{
      color: $black400;
      margin-bottom: 10px!important;
    }
  }
}
</style>

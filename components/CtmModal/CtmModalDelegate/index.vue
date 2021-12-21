<template>
  <ctm-modal-box
    class="delegate"
    :title="$t('modals.delegate')"
  >
    <div class="delegate__content content">
      <validation-observer v-slot="{handleSubmit, valid}">
        <div class="content__address address">
          <label
            for="investorAddress"
            class="address__label"
          >{{ $t('modals.investorAddress') }}</label>
          <base-field
            id="invsetorAddress"
            disabled
            :value="accountAddress.address"
            class="address__body"
          >
            {{ accountAddress.address }}
          </base-field>
        </div>
        <div class="content__tokens tokens">
          <div class="tokens__title">
            {{ $t('modals.tokensNumber') }}
          </div>
          <label
            for="tokensNumber"
            class="tokens__title_grey"
          >{{ $t('modals.tokensDelegated') }}</label>
          <div class="tokens__footer footer">
            <base-field
              id="tokensNumber"
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
      accountAddress: '',
    };
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
      isConnected: 'web3/getWalletIsConnected',
    }),
    min() {
      return this.options?.min ? `|min_value:${this.options.min}` : '';
    },
  },
  watch: {
    isConnected() {
      this.close();
    },
  },
  async mounted() {
    const res = await this.$store.dispatch('web3/getBalance');
    this.accountAddress = await this.$store.dispatch('web3/getAccount');
    if (res.ok) {
      this.balance = res.result;
    }
  },
  methods: {
    close() {
      this.CloseModal();
    },
    maxDelegate() {
      this.tokensAmount = this.balance;
    },
    async delegate() {
      const connectionRes = await this.$store.dispatch('web3/checkMetamaskStatus', Chains.ETHEREUM);
      if (!connectionRes.ok) return;

      const { callback } = this.options;
      this.SetLoader(true);
      const res = await this.$store.dispatch('web3/delegate', { address: this.accountAddress.address, amount: this.tokensAmount });
      this.SetLoader(false);
      if (res.ok) {
        await this.$store.dispatch('main/showToast', {
          title: 'Delegate',
          text: `Delegated ${this.tokensAmount} WQT`,
        });
        await this.close();
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
  max-width: 480px !important;
  &__content {
    padding: 20px 28px 30px 28px!important;
  }
  &__body{
    @include text-usual;
    color: #1D2127;
    margin: 25px 0;
    background-color: #FFFFFF!important;
  }
  &__done{
    margin-top: 25px;
  }
}
.footer {
  display: flex;
  justify-content: space-between;
  &__body{
    width: 284px!important;
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
    color: #1D2127;
    margin: 0!important;
  }
  &__body{
    margin-top: 5px;
  }
}
.tokens{
  &__title{
    @include text-usual;
    color: #1D2127;
    margin-bottom: 5px;
    &_grey{
      color: #7C838D;
      margin-bottom: 10px!important;
    }
  }
}
</style>

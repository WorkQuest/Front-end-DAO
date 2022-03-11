<template>
  <ctm-modal-box
    class="undelegate"
    :is-header="false"
  >
    <div class="undelegate__content">
      <div class="undeleagte__header header">
        <div class="header__title">
          {{ $t('modals.undelegate') }}
        </div>
        <div class="header__close">
          <span
            class="icon-close_big header__close"
            @click="hide"
          />
        </div>
      </div>
      <div class="undelegate__body">
        {{ $tc('modals.shure', options.name) }}
      </div>
      <div class="undelegate__tokens tokens">
        <div class="tokens__footer footer">
          <base-field
            id="tokensNumber"
            v-model="accountAddress.address"
            :disabled="true"
            class="footer__body"
            :placeholder="$t('modals.placeholder')"
          />
        </div>
      </div>
      <div class="undelegate__bottom bottom">
        <base-btn
          class="bottom__cancel"
          mode="lightBlue"
          @click="hide()"
        >
          {{ $t('modals.cancel') }}
        </base-btn>
        <base-btn
          mode="delete"
          class="bottom__done"
          @click="undelegate()"
        >
          {{ $t('modals.undelegate') }}
        </base-btn>
      </div>
    </div>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';
import { Chains } from '~/utils/enums';
import modals from '~/store/modals/modals';

export default {
  name: 'Undelegate',
  data() {
    return {
      tokensAmount: '',
      accountAddress: '',
    };
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
      isConnected: 'web3/getWalletIsConnected',
    }),
  },
  async mounted() {
    this.accountAddress = await this.$store.dispatch('web3/getAccount');
  },
  methods: {
    hide() {
      this.CloseModal();
    },
    async undelegate() {
      await this.$store.dispatch('web3/checkMetamaskStatus', Chains.ETHEREUM);
      if (!this.isConnected) return;
      const { callback } = this.options;
      this.SetLoader(true);
      const res = await this.$store.dispatch('web3/undelegate');
      this.SetLoader(false);
      if (res.ok) {
        await this.hide();
        await this.$store.dispatch('main/showToast', {
          title: 'Undelegate',
          text: `Undelegate ${this.tokensAmount} WQT`,
        });
        if (callback) await callback();
      } else if (res.msg.includes('Not enough balance to undelegate')) {
        await this.$store.dispatch('modals/show', {
          key: modals.status,
          title: 'Undelegate error', // TODO: to localization
          subtitle: 'Not enough balance to undelegate',
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.ctm-modal {
  @include modalKit;
  padding: 30px 36px 30px 28px!important;
}

.undelegate {
  max-width: 500px !important;
  &__content {
    padding: 30px 28px 30px 28px!important;
  }
  &__body{
    @include text-usual;
    color: $black800;
    margin: 20px 0 25px 0;
  }
  &__bottom{
    margin-top: 25px;
  }
}
.header{
  display: flex;
  justify-content: space-between;
  &__title{
    font-weight: 500;
    font-size: 23px;
    line-height: 130%;
  }
  &__close{
    color: $black800;
    font-size: 25px;
    cursor: pointer;
  }
}
.bottom{
  display: flex;
  justify-content: space-between;
  &__cancel{
    width: 112px!important;
  }
  &__done{
    width: 257px!important;
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
.footer {
  display: flex;
  justify-content: space-between;
  &__body{
    width: 100%;
    height: 46px!important;
  }
  &__maximum{
    width: 100px!important;
    height: 46px!important;
  }
}
</style>

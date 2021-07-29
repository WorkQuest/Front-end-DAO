<template>
  <ctm-modal-box
    class="delegate"
    :title="$t('modals.delegate')"
  >
    <div class="delegate__content content">
      <div class="content__adress adress">
        <label
          for="invsetorAdress"
          class="adress__label"
        >{{ $t('modals.investorAddress') }}</label>
        <base-field
          id="invsetorAdress"
          disabled
          :value="options.investorAddress"
          class="adress__body"
        >
          {{ options.investorAddress }}
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
            :placeholder="$t('modals.placeholder')"
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
      >
        {{ $t('modals.delegate') }}
      </base-btn>
    </div>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';
import modals from '~/store/modals/modals';

export default {
  name: 'Delegate',
  data() {
    return {
      tokensAmount: '',
    };
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
    }),
  },
  methods: {
    hide() {
      this.CloseModal();
    },
    maxDelegate() {
      this.tokensAmount = this.options.stake;
    },
  },
};
</script>

<style lang="scss" scoped>
.delegate {
  max-width: 450px !important;
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
.adress{
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

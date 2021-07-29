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
        {{ $t('modals.shure') }} {{ options.name + '?' }}
      </div>
      <div class="undelegate__tokens tokens">
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
            class="footer__body"
            :placeholder="$t('modals.placeholder')"
          />
          <base-btn
            class="footer__maximum"
            mode="lightBlue"
          >
            {{ $t('modals.max') }}
          </base-btn>
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
        >
          {{ $t('modals.undelegate') }}
        </base-btn>
      </div>
    </div>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Undelegate',
  data() {
    return {};
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
  },
};
</script>

<style lang="scss" scoped>
.ctm-modal {
  @include modalKit;
  padding: 30px 36px 30px 28px!important;
}

.undelegate {
  max-width: 450px !important;
  &__content {
    padding: 30px 28px 30px 28px!important;
  }
  &__body{
    @include text-usual;
    color: #1D2127;
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
    color: black;
    font-size: 25px;
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
    color: #1D2127;
    margin-bottom: 5px;
    &_grey{
      color: #7C838D;
      margin-bottom: 10px!important;
    }
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
</style>

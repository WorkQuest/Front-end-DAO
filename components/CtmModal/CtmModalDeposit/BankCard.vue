<template>
  <div class="cardBank">
    <img
      class="card"
      :src="$options.images.CREDIT_CARD"
      alt="credit card"
    >
    <p class="cardBank__text">
      {{ $t('modals.depositModal.uHaveToAddCard') }}
    </p>
    <div class="btn-container">
      <base-btn
        mode="outline"
        data-selector="CANCEL"
        class="message__action"
        @click="CloseModal"
      >
        {{ $t('modals.close') }}
      </base-btn>
      <base-btn
        disabled
        data-selector="CONFIRM"
        @click="handleConfirm"
      >
        {{ $t('modals.addNow') }}
      </base-btn>
    </div>
  </div>
</template>

<script>
import { images } from '~/utils/images';
import { IS_PROD } from '~/utils/addresses';

export default {
  name: 'BankCard',
  images,
  props: {
    cardList: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    handleConfirm() {
      // TODO plug for release
      if (IS_PROD) {
        this.ShowToast('Coming soon', 'Still under construction');
        return;
      }
      this.ShowModal({ key: 'addCard', branchText: 'adding' });
    },
  },
};
</script>

<style lang="scss" scoped>
.cardBank{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  &__text{
    align-self: flex-start;
    color: $black200;
   }
}

.card{
  width: 125px;
  height: 110px;
  object-fit: cover;
  margin: 30px 0;
}

.btn-container{
  width: 100%;
  margin-top: 25px;
  justify-self: flex-start;
  display: flex;
  gap:10px;
}
</style>

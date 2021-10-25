<template>
  <ctm-modal-box
    class="messageSend"
    :title="$t('modals.addCard')"
  >
    <validation-observer v-slot="{handleSubmit}">
      <div class="ctm-modal__content">
        <div class="ctm-modal__content-field">
          <label for="cardNumber_input">{{ $t('modals.numberOfCard') }}</label>
          <base-field
            id="cardNumber_input"
            v-model="cardNumber_input"
            :name="$t('modals.numberOfCard')"
            type="tel"
            rules="max:19|required"
            inputmode="numeric"
            :placeholder="'1234 1234 1234 1234'"
          />
        </div>
        <div class="ctm-modal__content-field">
          <label for="name_input">{{ $t('modals.cardholderName') }}</label>
          <base-field
            id="name_input"
            v-model="name_input"
            :name="$t('modals.cardholderName')"
            placeholder="John Doe"
            type="text"
            rules="max:30|required"
          />
        </div>
        <div class="grid__2col">
          <div class="ctm-modal__content-field">
            <label for="date_input">{{ $t('modals.date') }}</label>
            <base-field
              id="date_input"
              v-model="date_input"
              :name="$t('modals.date')"
              :placeholder="'02/24'"
              rules="max:5|required"
            />
          </div>
          <div class="ctm-modal__content-field">
            <label for="cvv_input">{{ $t('modals.cvv') }}</label>
            <base-field
              id="cvv_input"
              v-model="cvv_input"
              :name="$t('modals.cvv')"
              placeholder="242"
              rules="max:4|required"
            />
          </div>
        </div>
        <div class="btn__container">
          <div class="btn__wrapper">
            <base-btn
              class="message__action"
              @click="handleSubmit(showCardHasBeenAddedModal)"
            >
              {{ $t('meta.submit') }}
            </base-btn>
          </div>
          <div class="btn__wrapper">
            <base-btn
              mode="outline"
              class="message__action"
              @click="hide()"
            >
              {{ $t('meta.cancel') }}
            </base-btn>
          </div>
        </div>
      </div>
    </validation-observer>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';
import modals from '~/store/modals/modals';

export default {
  name: 'ModalAddCard',
  data() {
    return {
      cardNumber_input: '',
      name_input: '',
      date_input: '',
      cvv_input: '',
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
    showCardHasBeenAddedModal() {
      this.ShowModal({
        key: modals.cardHasBeenAdded,
      });
    },
  },
};
</script>

<style lang="scss" scoped>

.ctm-modal {
  @include modalKit;
}

.grid {
  &__2col {
    display: grid;
    grid-template-columns: 49% 49%;
    justify-content: space-between;
    align-items: flex-end;
  }
}
.btn {
  &__container {
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
    margin: 15px 0 0 0;
  }
  &__wrapper {
    width: 45%;
  }
}

.messageSend {
  max-width: 495px !important;
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
</style>

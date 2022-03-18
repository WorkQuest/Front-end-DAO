<template>
  <transition name="fade">
    <div
      v-if="isShow"
      class="ctm-modal"
      @mousedown.self="backgroundClick"
    >
      <component :is="currentModalKey" />
    </div>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex';
import modals from '@/store/modals/modals';
import CtmModalShowFile from './CtmModalShowFile';
import CtmModalConfirmEmail from './CtmModalConfirmEmail';
import CtmModalChangePassword from './CtmModalChangePassword';
import CtmModalRestore from './CtmModalRestore';
import CtmModalPrivacy from './CtmModalPrivacy';
import CtmModalDeposit from './CtmModalDeposit';
import CtmModalAddCard from './CtmModalAddCard';
import CtmModalStatus from './CtmModalStatus';
import CtmModalConfirmDetails from './CtmModalConfirmDetails';
import CtmModalWithdrawAbout from './CtmModalWithdrawAbout';
import CtmModalAddCase from './CtmModalAddCase';
import CtmModalOpenADispute from './CtmModalOpenADispute';
import CtmModalTransfer from './CtmModalTransfer';
import CtmModalChangePassInSettings from './CtmModalChangePassInSettings';
import CtmModalTwoFAAuth from './CtmModalTwoFAAuth';
import CtmModalAddProposal from './CtmModalAddProposal';
import CtmModalAddDiscussion from './CtmModalAddDiscussion';
import CtmModalUndelegate from './CtmModalUndelegate';
import CtmModalDelegate from './CtmModalDelegate';
import CtmModalWarning from './CtmModalWarning';
import CtmModalSignWorkQuest from './CtmModalSignWorkQuest';
import CtmModalDefault from '~/components/CtmModal/CtmModalDefault';
import CtmModalTransactionReceipt from '~/components/CtmModal/CtmModalTransactionReceipt';
import CtmModalGiveTransfer from '~/components/CtmModal/CtmModalGiveTransfer';
import CtmModalGiveDeposit from '~/components/CtmModal/CtmModalGiveDeposit';
import CtmModalAddingCard from '~/components/CtmModal/CtmModalAddingCard';
import CtmModalTakeWithdraw from '~/components/CtmModal/CtmModalTakeWithdraw';
import CtmModalSharing from '~/components/CtmModal/CtmModalSharing';

export default {
  name: 'ModalBox',
  components: {
    [modals.sharing]: CtmModalSharing,
    [modals.takeWithdraw]: CtmModalTakeWithdraw,
    [modals.addingCard]: CtmModalAddingCard,
    [modals.giveDeposit]: CtmModalGiveDeposit,
    [modals.giveTransfer]: CtmModalGiveTransfer,
    [modals.transactionReceipt]: CtmModalTransactionReceipt,
    [modals.addCard]: CtmModalAddCard,
    [modals.addCase]: CtmModalAddCase,
    [modals.addDiscussion]: CtmModalAddDiscussion,
    [modals.addProposal]: CtmModalAddProposal,
    [modals.changePassInSettings]: CtmModalChangePassInSettings,
    [modals.changePassword]: CtmModalChangePassword,
    [modals.confirmDetails]: CtmModalConfirmDetails,
    [modals.emailConfirm]: CtmModalConfirmEmail,
    [modals.default]: CtmModalDefault,
    [modals.delegate]: CtmModalDelegate,
    [modals.deposit]: CtmModalDeposit,
    [modals.openADispute]: CtmModalOpenADispute,
    [modals.privacy]: CtmModalPrivacy,
    [modals.restore]: CtmModalRestore,
    [modals.showFile]: CtmModalShowFile,
    [modals.signWorkQuest]: CtmModalSignWorkQuest,
    [modals.status]: CtmModalStatus,
    [modals.transfer]: CtmModalTransfer,
    [modals.twoFAAuth]: CtmModalTwoFAAuth,
    [modals.undelegate]: CtmModalUndelegate,
    [modals.warning]: CtmModalWarning,
    [modals.withdraw]: CtmModalWithdrawAbout,
  },
  modals,
  computed: {
    ...mapGetters({
      isShow: 'modals/getIsShow',
      currentModalKey: 'modals/getCurrentModalKey',
      options: 'modals/getOptions',
    }),
  },
  methods: {
    backgroundClick() {
      if (!this.options.isUnclosable) {
        this.close();
      }
    },
    close() {
      this.$store.dispatch('modals/hide');
    },
  },
};
</script>
<style lang="scss" scoped>
.ctm-modal {
  @include modalKit;
}
</style>

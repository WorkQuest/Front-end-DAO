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
import CtmModalRequestSend from './CtmModalRequestSend';
import CtmModalThanksSend from './CtmModalThanksSend';
import CtmModalReviewEmployer from './CtmModalReviewEmployer';
import CtmModalTransactionSend from './CtmModalTransactionSend';
import CtmModalCardHasBeenAdded from './CtmModalCardHasBeenAdded';
import CtmModalDeposit from './CtmModalDeposit';
import CtmModalAddCard from './CtmModalAddCard';
import CtmModalInviteSend from './CtmModalInviteSend';
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

export default {
  name: 'ModalBox',
  components: {
    [modals.default]: CtmModalDefault,
    [modals.addCase]: CtmModalAddCase,
    [modals.cardHasBeenAdded]: CtmModalCardHasBeenAdded,
    [modals.requestSend]: CtmModalRequestSend,
    [modals.status]: CtmModalStatus,
    [modals.changePassword]: CtmModalChangePassword,
    [modals.confirmDetails]: CtmModalConfirmDetails,
    [modals.transactionSend]: CtmModalTransactionSend,
    [modals.inviteSend]: CtmModalInviteSend,
    [modals.emailConfirm]: CtmModalConfirmEmail,
    [modals.thanks]: CtmModalThanksSend,
    [modals.addCard]: CtmModalAddCard,
    [modals.review]: CtmModalReviewEmployer,
    [modals.delegate]: CtmModalDelegate,
    [modals.undelegate]: CtmModalUndelegate,
    [modals.showFile]: CtmModalShowFile,
    [modals.openADispute]: CtmModalOpenADispute,
    [modals.changePassInSettings]: CtmModalChangePassInSettings,
    [modals.twoFAAuth]: CtmModalTwoFAAuth,
    [modals.privacy]: CtmModalPrivacy,
    [modals.signWorkQuest]: CtmModalSignWorkQuest,
    [modals.restore]: CtmModalRestore,
    [modals.transfer]: CtmModalTransfer,
    [modals.deposit]: CtmModalDeposit,
    [modals.withdraw]: CtmModalWithdrawAbout,
    [modals.addProposal]: CtmModalAddProposal,
    [modals.addDiscussion]: CtmModalAddDiscussion,
    [modals.warning]: CtmModalWarning,
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

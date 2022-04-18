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
import CtmModalGiveTransfer from './CtmModalGiveTransfer';
import CtmModalShowFile from './CtmModalShowFile';
import CtmModalGallery from './CtmModalGallery';
import CtmModalConfirmEmail from './CtmModalConfirmEmail';
import CtmModalChangePassword from './CtmModalChangePassword';
import CtmModalRestore from './CtmModalRestore';
import CtmModalPrivacy from './CtmModalPrivacy';
import CtmModalSkills from './CtmModalSkills';
import CtmModalMessageSend from './CtmModalMessageSend';
import CtmModalSendARequest from './CtmModalSendARequest';
import CtmModalRequestSend from './CtmModalRequestSend';
import CtmModalThanksSend from './CtmModalThanksSend';
import CtmModalQuestAgreed from './CtmModalQuestAgreed';
import CtmModalAreYouSure from './CtmModalAreYouSure';
import CtmModalReviewEmployer from './CtmModalReviewEmployer';
import CtmModalTransactionSend from './CtmModalTransactionSend';
import CtmModalCardHasBeenAdded from './CtmModalCardHasBeenAdded';
import CtmModalDeposit from './CtmModalDeposit';
import CtmModalAddCard from './CtmModalAddCard';
import CtmModalWithdraw from './CtmModalWithdraw';
import CtmModalInvitation from './CtmModalInvitation';
import CtmModalInviteSend from './CtmModalInviteSend';
import CtmModalQuestCreated from './CtmModalQuestCreated';
import CtmModalRaiseViews from './CtmModalRaiseViews';
import CtmModalApplyForAPension from './CtmModalApplyForAPension';
import CtmModalMakeDeposit from './CtmModalMakeDeposit';
import CtmModalChangePercent from './CtmModalChangePercent';
import CtmModalOpenADeposit from './CtmModalOpenADeposit';
import CtmModalStatus from './CtmModalStatus';
import CtmModalAddLiquidity from './CtmModalAddLiquidity';
import CtmModalRemoveLiquidity from './CtmModalRemoveLiquidity';
import CtmModalCreditingDeposit from './CtmModalCreditingDeposit';
import CtmModalConfirmDetails from './CtmModalConfirmDetails';
import CtmModalInsureCase from './CtmModalInsureCase';
import CtmModalWithdrawAbout from './CtmModalWithdrawAbout';
import CtmModalAddCase from './CtmModalAddCase';
import CtmModalWelcome from './CtmModalWelcome';
import CtmModalOpenADispute from './CtmModalOpenADispute';
import CtmModalNotice from './CtmModalNotice';
import CtmModalTransfer from './CtmModalTransfer';
import CtmModalChangePassInSettings from './CtmModalChangePassInSettings';
import CtmModalTwoFAAuth from './CtmModalTwoFAAuth';
import CtmModalDisableTwoFA from './CtmModalDisableTwoFA';
import CtmModalAddProposal from './CtmModalAddProposal';
import CtmModalAddDiscussion from './CtmModalAddDiscussion';
import CtmModalUndelegate from './CtmModalUndelegate';
import CtmModalDelegate from './CtmModalDelegate';
import CtmModalWarning from './CtmModalWarning';
import CtmModalSignWorkQuest from './CtmModalSignWorkQuest';
import CtmModalTransactionReceipt from './CtmModalTransactionReceipt';
import CtmModalSecurityCheck from './CtmModalSecurityCheck';

export default {
  name: 'ModalBox',
  components: {
    [modals.giveTransfer]: CtmModalGiveTransfer,
    [modals.showFile]: CtmModalShowFile,
    [modals.gallery]: CtmModalGallery,
    [modals.emailConfirm]: CtmModalConfirmEmail,
    [modals.restore]: CtmModalRestore,
    [modals.changePassword]: CtmModalChangePassword,
    [modals.privacy]: CtmModalPrivacy,
    [modals.skills]: CtmModalSkills,
    [modals.messageSend]: CtmModalMessageSend,
    [modals.sendARequest]: CtmModalSendARequest,
    [modals.requestSend]: CtmModalRequestSend,
    [modals.questAgreed]: CtmModalQuestAgreed,
    [modals.areYouSure]: CtmModalAreYouSure,
    [modals.transactionSend]: CtmModalTransactionSend,
    [modals.cardHasBeenAdded]: CtmModalCardHasBeenAdded,
    [modals.deposit]: CtmModalDeposit,
    [modals.addCard]: CtmModalAddCard,
    [modals.withdraw]: CtmModalWithdraw,
    [modals.review]: CtmModalReviewEmployer,
    [modals.thanks]: CtmModalThanksSend,
    [modals.invitation]: CtmModalInvitation,
    [modals.inviteSend]: CtmModalInviteSend,
    [modals.questCreated]: CtmModalQuestCreated,
    [modals.raiseViews]: CtmModalRaiseViews,
    [modals.applyForAPension]: CtmModalApplyForAPension,
    [modals.makeDeposit]: CtmModalMakeDeposit,
    [modals.changePercent]: CtmModalChangePercent,
    [modals.openADeposit]: CtmModalOpenADeposit,
    [modals.status]: CtmModalStatus,
    [modals.addLiquidity]: CtmModalAddLiquidity,
    [modals.removeLiquidity]: CtmModalRemoveLiquidity,
    [modals.creditingDeposit]: CtmModalCreditingDeposit,
    [modals.confirmDetails]: CtmModalConfirmDetails,
    [modals.insureCase]: CtmModalInsureCase,
    [modals.withdrawAbout]: CtmModalWithdrawAbout,
    [modals.addCase]: CtmModalAddCase,
    [modals.welcome]: CtmModalWelcome,
    [modals.openADispute]: CtmModalOpenADispute,
    [modals.notice]: CtmModalNotice,
    [modals.transfer]: CtmModalTransfer,
    [modals.changePassInSettings]: CtmModalChangePassInSettings,
    [modals.twoFAAuth]: CtmModalTwoFAAuth,
    [modals.disableTwoFAAuth]: CtmModalDisableTwoFA,
    [modals.addDiscussion]: CtmModalAddDiscussion,
    [modals.addProposal]: CtmModalAddProposal,
    [modals.delegate]: CtmModalDelegate,
    [modals.undelegate]: CtmModalUndelegate,
    [modals.warning]: CtmModalWarning,
    [modals.signWorkQuest]: CtmModalSignWorkQuest,
    [modals.transactionReceipt]: CtmModalTransactionReceipt,
    [modals.securityCheck]: CtmModalSecurityCheck,
  },
  data: () => ({
    modals,
  }),
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

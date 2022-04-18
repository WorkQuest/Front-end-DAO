<template>
  <transition name="fade">
    <div
      v-if="isShow"
      class="ctm-modal"
      @mousedown.self="backgroundClick"
    >
      <!--      <ctm-modal-box-->
      <!--        v-if="modals.default === currentModalKey"-->
      <!--      >-->
      <!--        <div class="ctm-modal__content ctm-modal__text">-->
      <!--          {{ options.text }}-->
      <!--        </div>-->
      <!--      </ctm-modal-box>-->
      <!--      <CtmModalConfirmEmail v-if="modals.emailConfirm === currentModalKey" />-->
      <!--      <CtmModalRestore v-if="modals.restore === currentModalKey" />-->
      <!--      <CtmModalChangePassword v-if="modals.changePassword === currentModalKey" />-->
      <!--      <CtmModalPrivacy v-if="modals.privacy === currentModalKey" />-->
      <!--      <CtmModalSkills v-if="modals.skills === currentModalKey" />-->
      <!--      <CtmModalMessageSend v-if="modals.messageSend === currentModalKey" />-->
      <!--      <CtmModalSendARequest v-if="modals.sendARequest === currentModalKey" />-->
      <!--      <CtmModalRequestSend v-if="modals.requestSend === currentModalKey" />-->
      <!--      <CtmModalThanksSend v-if="modals.thanks === currentModalKey" />-->
      <!--      <CtmModalQuestAgreed v-if="modals.questAgreed === currentModalKey" />-->
      <!--      <CtmModalAreYouSure v-if="modals.areYouSure === currentModalKey" />-->
      <!--      <CtmModalTransactionSend v-if="modals.transactionSend === currentModalKey" />-->
      <!--      <CtmModalCardHasBeenAdded v-if="modals.cardHasBeenAdded === currentModalKey" />-->
      <!--      <CtmModalDeposit v-if="modals.deposit === currentModalKey" />-->
      <!--      <CtmModalAddCard v-if="modals.addCard === currentModalKey" />-->
      <!--      <CtmModalWithdraw v-if="modals.withdraw === currentModalKey" />-->
      <!--      <CtmModalReviewEmployer v-if="modals.review === currentModalKey" />-->
      <!--      <CtmModalInviteSend v-if="modals.inviteSend === currentModalKey" />-->
      <!--      <CtmModalQuestCreated v-if="modals.questCreated === currentModalKey" />-->
      <!--      <CtmModalRaiseViews v-if="modals.raiseViews === currentModalKey" />-->
      <!--      <CtmModalInvitation v-if="modals.invitation === currentModalKey" />-->
      <!--      <CtmModalApplyForAPension v-if="modals.applyForAPension === currentModalKey" />-->
      <!--      <CtmModalMakeDeposit v-if="modals.makeDeposit === currentModalKey" />-->
      <!--      <CtmModalChangePercent v-if="modals.changePercent === currentModalKey" />-->
      <!--      <CtmModalOpenADeposit v-if="modals.openADeposit === currentModalKey" />-->
      <!--      <CtmModalStatus v-if="modals.status === currentModalKey" />-->
      <!--      <CtmModalAddLiquidity v-if="modals.addLiquidity === currentModalKey" />-->
      <!--      <CtmModalRemoveLiquidity v-if="modals.removeLiquidity === currentModalKey" />-->
      <!--      <CtmModalCreditingDeposit v-if="modals.creditingDeposit === currentModalKey" />-->
      <!--      <CtmModalConfirmDetails v-if="modals.confirmDetails === currentModalKey" />-->
      <!--      <CtmModalInsureCase v-if="modals.insureCase === currentModalKey" />-->
      <!--      <CtmModalWithdrawAbout v-if="modals.withdrawAbout === currentModalKey" />-->
      <!--      <CtmModalAddCase v-if="modals.addCase === currentModalKey" />-->
      <!--      <CtmModalWelcome v-if="modals.welcome === currentModalKey" />-->
      <!--      <CtmModalOpenADispute v-if="modals.openADispute === currentModalKey" />-->
      <!--      <CtmModalNotice v-if="modals.notice === currentModalKey" />-->
      <!--      <CtmModalTransfer v-if="modals.transfer === currentModalKey" />-->
      <!--      <CtmModalChangePassInSettings v-if="modals.changePassInSettings === currentModalKey" />-->
      <!--      <CtmModalTwoFAAuth v-if="modals.twoFAAuth === currentModalKey" />-->
      <!--      <CtmModalDisableTwoFA v-if="modals.disableTwoFAAuth === currentModalKey" />-->
      <!--      <CtmModalAddDiscussion v-if="modals.addDiscussion === currentModalKey" />-->
      <!--      <CtmModalAddProposal v-if="modals.addProposal === currentModalKey" />-->
      <!--      <CtmModalDelegate v-if="modals.delegate === currentModalKey" />-->
      <!--      <CtmModalUndelegate v-if="modals.undelegate === currentModalKey" />-->
      <!--      <CtmModalWarning v-if="modals.warning === currentModalKey" />-->
      <!--      <CtmModalSignWorkQuest v-if="modals.signWorkQuest === currentModalKey" />-->
      <!--      <CtmModalGallery v-if="modals.gallery === currentModalKey" />-->
      <!--      <CtmModalShowFile v-if="modals.showFile === currentModalKey" />-->
      <!--      <CtmModalTransactionReceipt v-if="modals.transactionReceipt === currentModalKey" />-->
      <!--      <CtmModalGiveTransfer v-if="modals.giveTransfer === currentModalKey" />-->
      <!--      <CtmModalSecurityCheck v-if="modals.securityCheck === currentModalKey" />-->
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
    // TODO: Доделать
    CtmModalWithdraw,
    CtmModalReviewEmployer,
    CtmModalThanksSend,
    CtmModalInvitation,
    CtmModalInviteSend,
    CtmModalQuestCreated,
    CtmModalRaiseViews,
    CtmModalApplyForAPension,
    CtmModalMakeDeposit,
    CtmModalChangePercent,
    CtmModalOpenADeposit,
    CtmModalStatus,
    CtmModalAddLiquidity,
    CtmModalRemoveLiquidity,
    CtmModalCreditingDeposit,
    CtmModalConfirmDetails,
    CtmModalInsureCase,
    CtmModalWithdrawAbout,
    CtmModalAddCase,
    CtmModalWelcome,
    CtmModalOpenADispute,
    CtmModalNotice,
    CtmModalTransfer,
    CtmModalChangePassInSettings,
    CtmModalTwoFAAuth,
    CtmModalDisableTwoFA,
    CtmModalAddDiscussion,
    CtmModalAddProposal,
    CtmModalDelegate,
    CtmModalUndelegate,
    CtmModalWarning,
    CtmModalSignWorkQuest,
    CtmModalTransactionReceipt,
    CtmModalSecurityCheck,
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

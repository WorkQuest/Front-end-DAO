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
import CtmModalThanksSend from './CtmModalThanksSend';
import CtmModalReviewEmployer from './CtmModalReviewEmployer';
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

export default {
  name: 'ModalBox',
  components: {
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
    [modals.review]: CtmModalReviewEmployer,
    [modals.showFile]: CtmModalShowFile,
    [modals.signWorkQuest]: CtmModalSignWorkQuest,
    [modals.status]: CtmModalStatus,
    [modals.thanks]: CtmModalThanksSend,
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

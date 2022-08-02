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
import CtmModalWalletWithdraw from './CtmModalWalletWithdraw';
import CtmModalShowFile from './CtmModalShowFile';
import CtmModalChangePassword from './CtmModalChangePassword';
import CtmModalRestore from './CtmModalRestore';
import CtmModalPrivacy from './CtmModalPrivacy';
import CtmModalDeposit from './CtmModalDeposit';
import CtmModalAddCard from './CtmModalAddCard';
import CtmModalWithdraw from './CtmModalWithdraw';
import CtmModalStatus from './CtmModalStatus';
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
import CtmModalReport from '~/components/CtmModal/CtmModalReport';
import CtmModalBuyWQT from '~/components/CtmModal/CtmModalBuyWQT';
import CtmModalPendingHashStatus from '~/components/CtmModal/CtmModalPendingHashStatus';
import CtmModalTransactionSend from '~/components/CtmModal/CtmModalTransactionSend';

export default {
  name: 'ModalBox',
  components: {
    [modals.walletWithdraw]: CtmModalWalletWithdraw,
    [modals.showFile]: CtmModalShowFile,
    [modals.restore]: CtmModalRestore,
    [modals.changePassword]: CtmModalChangePassword,
    [modals.privacy]: CtmModalPrivacy,
    [modals.deposit]: CtmModalDeposit,
    [modals.addCard]: CtmModalAddCard,
    [modals.withdraw]: CtmModalWithdraw,
    [modals.status]: CtmModalStatus,
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
    [modals.reports]: CtmModalReport,
    [modals.buyWQT]: CtmModalBuyWQT,
    [modals.pendingHash]: CtmModalPendingHashStatus,
    [modals.transactionSend]: CtmModalTransactionSend,
  },
  data: () => ({ modals }),
  computed: {
    ...mapGetters({
      isShow: 'modals/getIsShow',
      currentModalKey: 'modals/getCurrentModalKey',
      options: 'modals/getOptions',
    }),
  },
  methods: {
    async backgroundClick() {
      if (!this.options.isUnclosable) {
        const { cancelMethod } = this.options;
        this.close();
        if (cancelMethod) await cancelMethod();
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

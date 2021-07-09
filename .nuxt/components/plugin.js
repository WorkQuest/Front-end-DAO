import Vue from 'vue'
import { wrapFunctional } from './utils'

const components = {
  CtmModal: () => import('../..\\components\\CtmModal\\index.vue' /* webpackChunkName: "components/ctm-modal" */).then(c => wrapFunctional(c.default || c)),
  ScreenQuests: () => import('../..\\components\\screen\\quests.vue' /* webpackChunkName: "components/screen-quests" */).then(c => wrapFunctional(c.default || c)),
  AppCardsQuestCard: () => import('../..\\components\\app\\Cards\\QuestCard.vue' /* webpackChunkName: "components/app-cards-quest-card" */).then(c => wrapFunctional(c.default || c)),
  AppHeader: () => import('../..\\components\\app\\Header\\index.vue' /* webpackChunkName: "components/app-header" */).then(c => wrapFunctional(c.default || c)),
  AppInfo: () => import('../..\\components\\app\\Info\\index.vue' /* webpackChunkName: "components/app-info" */).then(c => wrapFunctional(c.default || c)),
  AppPanelsContact: () => import('../..\\components\\app\\Panels\\Contact.vue' /* webpackChunkName: "components/app-panels-contact" */).then(c => wrapFunctional(c.default || c)),
  AppPanelsContactOther: () => import('../..\\components\\app\\Panels\\ContactOther.vue' /* webpackChunkName: "components/app-panels-contact-other" */).then(c => wrapFunctional(c.default || c)),
  AppPanelsQuestPanel: () => import('../..\\components\\app\\Panels\\QuestPanel.vue' /* webpackChunkName: "components/app-panels-quest-panel" */).then(c => wrapFunctional(c.default || c)),
  AppPanelsSocial: () => import('../..\\components\\app\\Panels\\Social.vue' /* webpackChunkName: "components/app-panels-social" */).then(c => wrapFunctional(c.default || c)),
  AppPanelsUserStatistic: () => import('../..\\components\\app\\Panels\\UserStatistic.vue' /* webpackChunkName: "components/app-panels-user-statistic" */).then(c => wrapFunctional(c.default || c)),
  CtmModalCtmModalAddCard: () => import('../..\\components\\CtmModal\\CtmModalAddCard\\index.vue' /* webpackChunkName: "components/ctm-modal-ctm-modal-add-card" */).then(c => wrapFunctional(c.default || c)),
  CtmModalCtmModalAddLiquidity: () => import('../..\\components\\CtmModal\\CtmModalAddLiquidity\\index.vue' /* webpackChunkName: "components/ctm-modal-ctm-modal-add-liquidity" */).then(c => wrapFunctional(c.default || c)),
  CtmModalCtmModalAddCase: () => import('../..\\components\\CtmModal\\CtmModalAddCase\\index.vue' /* webpackChunkName: "components/ctm-modal-ctm-modal-add-case" */).then(c => wrapFunctional(c.default || c)),
  CtmModalCtmModalApplyForAPension: () => import('../..\\components\\CtmModal\\CtmModalApplyForAPension\\index.vue' /* webpackChunkName: "components/ctm-modal-ctm-modal-apply-for-a-pension" */).then(c => wrapFunctional(c.default || c)),
  CtmModalCtmModalAreYouSure: () => import('../..\\components\\CtmModal\\CtmModalAreYouSure\\index.vue' /* webpackChunkName: "components/ctm-modal-ctm-modal-are-you-sure" */).then(c => wrapFunctional(c.default || c)),
  CtmModalCtmModalCardHasBeenAdded: () => import('../..\\components\\CtmModal\\CtmModalCardHasBeenAdded\\index.vue' /* webpackChunkName: "components/ctm-modal-ctm-modal-card-has-been-added" */).then(c => wrapFunctional(c.default || c)),
  CtmModalCtmModalBox: () => import('../..\\components\\CtmModal\\CtmModalBox\\index.vue' /* webpackChunkName: "components/ctm-modal-ctm-modal-box" */).then(c => wrapFunctional(c.default || c)),
  CtmModalCtmModalChangePassInSettings: () => import('../..\\components\\CtmModal\\CtmModalChangePassInSettings\\index.vue' /* webpackChunkName: "components/ctm-modal-ctm-modal-change-pass-in-settings" */).then(c => wrapFunctional(c.default || c)),
  CtmModalCtmModalChangePassword: () => import('../..\\components\\CtmModal\\CtmModalChangePassword\\index.vue' /* webpackChunkName: "components/ctm-modal-ctm-modal-change-password" */).then(c => wrapFunctional(c.default || c)),
  CtmModalCtmModalChangePercent: () => import('../..\\components\\CtmModal\\CtmModalChangePercent\\index.vue' /* webpackChunkName: "components/ctm-modal-ctm-modal-change-percent" */).then(c => wrapFunctional(c.default || c)),
  CtmModalCtmModalConfirmDetails: () => import('../..\\components\\CtmModal\\CtmModalConfirmDetails\\index.vue' /* webpackChunkName: "components/ctm-modal-ctm-modal-confirm-details" */).then(c => wrapFunctional(c.default || c)),
  CtmModalCtmModalConfirmEmail: () => import('../..\\components\\CtmModal\\CtmModalConfirmEmail\\index.vue' /* webpackChunkName: "components/ctm-modal-ctm-modal-confirm-email" */).then(c => wrapFunctional(c.default || c)),
  CtmModalCtmModalCreditingDeposit: () => import('../..\\components\\CtmModal\\CtmModalCreditingDeposit\\index.vue' /* webpackChunkName: "components/ctm-modal-ctm-modal-crediting-deposit" */).then(c => wrapFunctional(c.default || c)),
  CtmModalCtmModalDeposit: () => import('../..\\components\\CtmModal\\CtmModalDeposit\\index.vue' /* webpackChunkName: "components/ctm-modal-ctm-modal-deposit" */).then(c => wrapFunctional(c.default || c)),
  CtmModalCtmModalInsureCase: () => import('../..\\components\\CtmModal\\CtmModalInsureCase\\index.vue' /* webpackChunkName: "components/ctm-modal-ctm-modal-insure-case" */).then(c => wrapFunctional(c.default || c)),
  CtmModalCtmModalInvitation: () => import('../..\\components\\CtmModal\\CtmModalInvitation\\index.vue' /* webpackChunkName: "components/ctm-modal-ctm-modal-invitation" */).then(c => wrapFunctional(c.default || c)),
  CtmModalCtmModalInviteSend: () => import('../..\\components\\CtmModal\\CtmModalInviteSend\\index.vue' /* webpackChunkName: "components/ctm-modal-ctm-modal-invite-send" */).then(c => wrapFunctional(c.default || c)),
  CtmModalCtmModalMakeDeposit: () => import('../..\\components\\CtmModal\\CtmModalMakeDeposit\\index.vue' /* webpackChunkName: "components/ctm-modal-ctm-modal-make-deposit" */).then(c => wrapFunctional(c.default || c)),
  CtmModalCtmModalMessageSend: () => import('../..\\components\\CtmModal\\CtmModalMessageSend\\index.vue' /* webpackChunkName: "components/ctm-modal-ctm-modal-message-send" */).then(c => wrapFunctional(c.default || c)),
  CtmModalCtmModalNotice: () => import('../..\\components\\CtmModal\\CtmModalNotice\\index.vue' /* webpackChunkName: "components/ctm-modal-ctm-modal-notice" */).then(c => wrapFunctional(c.default || c)),
  CtmModalCtmModalOpenADeposit: () => import('../..\\components\\CtmModal\\CtmModalOpenADeposit\\index.vue' /* webpackChunkName: "components/ctm-modal-ctm-modal-open-a-deposit" */).then(c => wrapFunctional(c.default || c)),
  CtmModalCtmModalOpenADispute: () => import('../..\\components\\CtmModal\\CtmModalOpenADispute\\index.vue' /* webpackChunkName: "components/ctm-modal-ctm-modal-open-a-dispute" */).then(c => wrapFunctional(c.default || c)),
  CtmModalCtmModalPrivacy: () => import('../..\\components\\CtmModal\\CtmModalPrivacy\\index.vue' /* webpackChunkName: "components/ctm-modal-ctm-modal-privacy" */).then(c => wrapFunctional(c.default || c)),
  CtmModalCtmModalQuestAgreed: () => import('../..\\components\\CtmModal\\CtmModalQuestAgreed\\index.vue' /* webpackChunkName: "components/ctm-modal-ctm-modal-quest-agreed" */).then(c => wrapFunctional(c.default || c)),
  CtmModalCtmModalQuestCreated: () => import('../..\\components\\CtmModal\\CtmModalQuestCreated\\index.vue' /* webpackChunkName: "components/ctm-modal-ctm-modal-quest-created" */).then(c => wrapFunctional(c.default || c)),
  CtmModalCtmModalRaiseViews: () => import('../..\\components\\CtmModal\\CtmModalRaiseViews\\index.vue' /* webpackChunkName: "components/ctm-modal-ctm-modal-raise-views" */).then(c => wrapFunctional(c.default || c)),
  CtmModalCtmModalRemoveLiquidity: () => import('../..\\components\\CtmModal\\CtmModalRemoveLiquidity\\index.vue' /* webpackChunkName: "components/ctm-modal-ctm-modal-remove-liquidity" */).then(c => wrapFunctional(c.default || c)),
  CtmModalCtmModalRequestSend: () => import('../..\\components\\CtmModal\\CtmModalRequestSend\\index.vue' /* webpackChunkName: "components/ctm-modal-ctm-modal-request-send" */).then(c => wrapFunctional(c.default || c)),
  CtmModalCtmModalRestore: () => import('../..\\components\\CtmModal\\CtmModalRestore\\index.vue' /* webpackChunkName: "components/ctm-modal-ctm-modal-restore" */).then(c => wrapFunctional(c.default || c)),
  CtmModalCtmModalReviewEmployer: () => import('../..\\components\\CtmModal\\CtmModalReviewEmployer\\index.vue' /* webpackChunkName: "components/ctm-modal-ctm-modal-review-employer" */).then(c => wrapFunctional(c.default || c)),
  CtmModalCtmModalSendARequest: () => import('../..\\components\\CtmModal\\CtmModalSendARequest\\index.vue' /* webpackChunkName: "components/ctm-modal-ctm-modal-send-a-request" */).then(c => wrapFunctional(c.default || c)),
  CtmModalCtmModalSkills: () => import('../..\\components\\CtmModal\\CtmModalSkills\\index.vue' /* webpackChunkName: "components/ctm-modal-ctm-modal-skills" */).then(c => wrapFunctional(c.default || c)),
  CtmModalCtmModalStatus: () => import('../..\\components\\CtmModal\\CtmModalStatus\\index.vue' /* webpackChunkName: "components/ctm-modal-ctm-modal-status" */).then(c => wrapFunctional(c.default || c)),
  CtmModalCtmModalThanksSend: () => import('../..\\components\\CtmModal\\CtmModalThanksSend\\index.vue' /* webpackChunkName: "components/ctm-modal-ctm-modal-thanks-send" */).then(c => wrapFunctional(c.default || c)),
  CtmModalCtmModalTransactionSend: () => import('../..\\components\\CtmModal\\CtmModalTransactionSend\\index.vue' /* webpackChunkName: "components/ctm-modal-ctm-modal-transaction-send" */).then(c => wrapFunctional(c.default || c)),
  CtmModalCtmModalTransfer: () => import('../..\\components\\CtmModal\\CtmModalTransfer\\index.vue' /* webpackChunkName: "components/ctm-modal-ctm-modal-transfer" */).then(c => wrapFunctional(c.default || c)),
  CtmModalCtmModalTwoFAAuth: () => import('../..\\components\\CtmModal\\CtmModalTwoFAAuth\\index.vue' /* webpackChunkName: "components/ctm-modal-ctm-modal-two-f-a-auth" */).then(c => wrapFunctional(c.default || c)),
  CtmModalCtmModalWelcome: () => import('../..\\components\\CtmModal\\CtmModalWelcome\\index.vue' /* webpackChunkName: "components/ctm-modal-ctm-modal-welcome" */).then(c => wrapFunctional(c.default || c)),
  CtmModalCtmModalWithdrawAbout: () => import('../..\\components\\CtmModal\\CtmModalWithdrawAbout\\index.vue' /* webpackChunkName: "components/ctm-modal-ctm-modal-withdraw-about" */).then(c => wrapFunctional(c.default || c)),
  CtmModalCtmModalWithdraw: () => import('../..\\components\\CtmModal\\CtmModalWithdraw\\index.vue' /* webpackChunkName: "components/ctm-modal-ctm-modal-withdraw" */).then(c => wrapFunctional(c.default || c)),
  UiBaseButton: () => import('../..\\components\\ui\\BaseButton\\index.vue' /* webpackChunkName: "components/ui-base-button" */).then(c => wrapFunctional(c.default || c)),
  UiBaseCheckbox: () => import('../..\\components\\ui\\BaseCheckbox\\index.vue' /* webpackChunkName: "components/ui-base-checkbox" */).then(c => wrapFunctional(c.default || c)),
  UiBaseDD: () => import('../..\\components\\ui\\BaseDD\\index.vue' /* webpackChunkName: "components/ui-base-d-d" */).then(c => wrapFunctional(c.default || c)),
  UiBaseInput: () => import('../..\\components\\ui\\BaseInput\\index.vue' /* webpackChunkName: "components/ui-base-input" */).then(c => wrapFunctional(c.default || c)),
  UiBaseTable: () => import('../..\\components\\ui\\BaseTable\\index.vue' /* webpackChunkName: "components/ui-base-table" */).then(c => wrapFunctional(c.default || c)),
  UiChatMenu: () => import('../..\\components\\ui\\ChatMenu\\index.vue' /* webpackChunkName: "components/ui-chat-menu" */).then(c => wrapFunctional(c.default || c)),
  UiDiscussionCard: () => import('../..\\components\\ui\\DiscussionCard\\index.vue' /* webpackChunkName: "components/ui-discussion-card" */).then(c => wrapFunctional(c.default || c)),
  UiLoader: () => import('../..\\components\\ui\\Loader\\index.vue' /* webpackChunkName: "components/ui-loader" */).then(c => wrapFunctional(c.default || c)),
  UiUploader: () => import('../..\\components\\ui\\Uploader\\index.vue' /* webpackChunkName: "components/ui-uploader" */).then(c => wrapFunctional(c.default || c)),
  AppPagesCommonMessages: () => import('../..\\components\\app\\Pages\\Common\\Messages.vue' /* webpackChunkName: "components/app-pages-common-messages" */).then(c => wrapFunctional(c.default || c)),
  AppPagesCommonQuests: () => import('../..\\components\\app\\Pages\\Common\\Quests.vue' /* webpackChunkName: "components/app-pages-common-quests" */).then(c => wrapFunctional(c.default || c)),
  AppPagesCommonUserInfo: () => import('../..\\components\\app\\Pages\\Common\\UserInfo.vue' /* webpackChunkName: "components/app-pages-common-user-info" */).then(c => wrapFunctional(c.default || c)),
  AppPagesCommonUserInfoOther: () => import('../..\\components\\app\\Pages\\Common\\UserInfoOther.vue' /* webpackChunkName: "components/app-pages-common-user-info-other" */).then(c => wrapFunctional(c.default || c)),
  AppPagesProfileTabsPortfolio: () => import('../..\\components\\app\\Pages\\Profile\\Tabs\\Portfolio.vue' /* webpackChunkName: "components/app-pages-profile-tabs-portfolio" */).then(c => wrapFunctional(c.default || c)),
  AppPagesProfileTabsReviews: () => import('../..\\components\\app\\Pages\\Profile\\Tabs\\Reviews.vue' /* webpackChunkName: "components/app-pages-profile-tabs-reviews" */).then(c => wrapFunctional(c.default || c))
}

for (const name in components) {
  Vue.component(name, components[name])
  Vue.component('Lazy' + name, components[name])
}

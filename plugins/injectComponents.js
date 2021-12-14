import Vue from 'vue';

import VuePhoneNumberInput from 'vue-phone-number-input';
import CtmModal from '~/components/CtmModal';
import CtmModalBox from '~/components/CtmModal/CtmModalBox';
import Loader from '~/components/ui/Loader';
import Header from '~/components/app/Header';
import BaseButton from '~/components/ui/BaseButton';
import BaseInput from '~/components/ui/BaseInput';
import BaseDD from '~/components/ui/BaseDD';
import BaseCheckbox from '~/components/ui/BaseCheckbox';
import BaseTable from '~/components/ui/BaseTable';
import DisscussionCard from '~/components/ui/DiscussionCard';
import BaseUploader from '~/components/ui/BaseUploader';
import BaseImages from '~/components/ui/BaseImages';
import BasePager from '~/components/ui/BasePager';
import BaseFiles from '~/components/ui/BaseFiles';
import SubCommentField from '~/components/app/Pages/Discussions/SubCommentField.vue';

Vue.component('sub-comment-field', SubCommentField);
Vue.component('ctm-modal', CtmModal);
Vue.component('ctm-modal-box', CtmModalBox);
Vue.component('Header', Header);
Vue.component('base-btn', BaseButton);
Vue.component('base-field', BaseInput);
Vue.component('base-dd', BaseDD);
Vue.component('base-checkbox', BaseCheckbox);
Vue.component('loader', Loader);
Vue.component('base-table', BaseTable);
Vue.component('discussion-card', DisscussionCard);
Vue.component('base-uploader', BaseUploader);
Vue.component('base-images', BaseImages);
Vue.component('base-files', BaseFiles);
Vue.component('base-pager', BasePager);
Vue.component('vue-phone-number-input', VuePhoneNumberInput);

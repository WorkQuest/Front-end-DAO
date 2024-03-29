import Vue from 'vue';
import moment from 'moment';
import VueTippy, { TippyComponent } from 'vue-tippy';
import converter from 'bech32-converting';
import heic2any from 'heic2any';
import BigNumber from 'bignumber.js';
import modals from '~/store/modals/modals';
import ENV, { IS_PROD } from '~/utils/addresses/index';

Vue.use(VueTippy);
Vue.component('tippy', TippyComponent);

Vue.mixin({
  data() {
    return {
      ENV,
    };
  },
  methods: {
    UserName(firstName, lastName) {
      if (firstName || lastName) return `${firstName || ''} ${lastName || ''}`;
      return this.$t('user.nameless');
    },
    async HEICConvertTo(file, toType) {
      try {
        return await heic2any({
          blob: file,
          toType,
        });
      } catch (e) {
        console.log(e);
        return null;
      }
    },
    IsProd: () => IS_PROD,
    ConvertToBech32(prefix, address) {
      try {
        return converter(prefix).toBech32(address);
      } catch (e) {
        return address;
      }
    },
    ConvertToHex(prefix, address) {
      try {
        if (address.startsWith(prefix)) return converter(prefix).toHex(address);
        return address;
      } catch (e) {
        return address;
      }
    },
    async UploadFiles(files) {
      if (!files.length) return [];
      const fetchData = [];
      const fetchUrlsData = [];
      const medias = [];
      // eslint-disable-next-line no-restricted-syntax
      for (const item of files) {
        if (item.mediaId) medias.push(item.mediaId);
        fetchData.push(this.$store.dispatch('user/getUploadFileLink', { contentType: item.file.type }));
      }
      if (!fetchData.length) return medias;
      const urls = await Promise.all(fetchData);
      for (let i = 0; i < files.length; i += 1) {
        const { file } = files[i];
        medias.push(urls[i].mediaId);
        fetchUrlsData.push(this.$store.dispatch('user/uploadFile', {
          url: urls[i].url,
          data: file,
          contentType: file.type,
        }));
      }
      await Promise.all(fetchUrlsData);
      return medias;
    },
    ShowModal(payload) {
      this.$store.dispatch('modals/show', {
        key: modals.default,
        ...payload,
      });
    },
    SetLoader(value) {
      this.$store.dispatch('main/setLoading', value);
    },
    CloseModal() {
      this.$store.dispatch('modals/hide');
    },
    ClipboardSuccessHandler(value) {
      this.ShowToast(value, this.$t('modals.textCopy'));
    },
    ClipboardErrorHandler(value) {
      this.ShowToast(value, this.$t('modals.textCopyError'));
    },
    ShowError(label) {
      this.$bvToast.toast(label, {
        title: this.$t('modals.error'),
        variant: 'warning',
        solid: true,
        toaster: 'b-toaster-bottom-right',
        appendToast: true,
      });
    },
    Floor: (value, precision = 4) => new BigNumber(value).decimalPlaces(precision).toString(),
    Ceil: (value, precision = 4) => {
      const form = 10 ** precision;
      return Math.ceil(value * form) / form || 0;
    },
    GetFormTimestamp(timestamp, format = 'DD.MM.YY H:mm') {
      if (timestamp !== 0 && timestamp !== '-' && timestamp !== '' && timestamp !== undefined) {
        // timestamp = +timestamp * 1000;
        timestamp = +timestamp;
        return moment(new Date(timestamp)).format(format);
      }
      return '-';
    },
    Require(img) {
      // eslint-disable-next-line global-require
      // return require(`assets/img/${img}`);
    },
    NumberFormat(value, fixed) {
      return (+value && new Intl.NumberFormat('ru', { maximumFractionDigits: fixed || 8 }).format(value || 0)) || 0;
    },
    GetLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(this.FormatPosition);
      }
    },
    FormatPosition(position) {
      const payload = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
      this.$store.dispatch('user/setCurrentPosition', payload);
    },
    CutTxn(txn, first = 10, second = 10) {
      if (!txn) return '';
      return `${txn.slice(0, first)}...${txn.slice(-second)}`;
    },
    DeclOfNum(n) {
      n = Math.abs(n) % 100;
      const n1 = n % 10;
      if (n > 10 && n < 20) {
        return 2;
      }
      if (n1 > 1 && n1 < 5) {
        return 1;
      }
      if (n1 === 1 && this.$i18n.locale === 'ru') {
        return 0;
      }
      return 2;
    },
    ShowToast(text, title = null) {
      this.$bvToast.toast(text, {
        title: title || this.$t('modals.error'),
        variant: 'warning',
        solid: true,
        toaster: 'b-toaster-bottom-right',
        appendToast: true,
        toastClass: 'custom-toast-width',
        bodyClass: 'custom-toast-width',
      });
    },
  },
});

import Vue from 'vue';

import {
  ValidationProvider,
  ValidationObserver,
  extend,
  configure,
  setInteractionMode,
} from 'vee-validate';

import * as rules from 'vee-validate/dist/rules';
import { validateMnemonic } from 'bip39';
import BigNumber from 'bignumber.js';
import { utils } from 'ethers';

Vue.component('ValidationProvider', ValidationProvider);
Vue.component('ValidationObserver', ValidationObserver);
setInteractionMode('eager');

Object.keys(rules).forEach((rule) => {
  extend(rule, {
    ...rules[rule],
  });
});

extend('numberOfCard', {
  validate(value) {
    const americanExpress = /(?:3[47][0-9]{13})/;
    const dinersClub = /(?:3(?:0[0-5]|[68][0-9])[0-9]{11})/;
    const discover = /(?:6(?:011|5[0-9]{2})(?:[0-9]{12}))/;
    const jcb = /(?:(?:2131|1800|35\\d{3})\\d{11})/;
    const maestro = /(?:(?:5[0678]\\d\\d|6304|6390|67\\d\\d)\\d{8,15})/;
    const mastercard = /(?:(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12})/;
    const visa = /(?:4[0-9]{12})(?:[0-9]{3})?/;
    const cardNumber = value.replaceAll(/[^0-9]/g, '');
    const maxNumberLength = 19;
    const checkCardNumber = (number) => (americanExpress.test(number)
                || dinersClub.test(number) || discover.test(number) || jcb.test(number)
                || maestro.test(number) || mastercard.test(number) || visa.test(number))
            && number.length <= maxNumberLength;
    return {
      required: true,
      valid: checkCardNumber(cardNumber),
    };
  },
  message: 'Please enter correct {_field_}',
});

extend('cvv', {
  validate(value) {
    const regex = /^([0-9]{3,4})$/;
    return {
      required: true,
      valid: regex.test(value),
    };
  },
  message: 'Please enter correct {_field_}',
});
extend('date', {
  validate(value) {
    const regex = /(?:0[1-9]|1[0-2])\/[0-9]{2}/;
    return {
      required: true,
      valid: regex.test(value),
    };
  },
  message: 'Please enter correct {_field_}',
});

extend('decimal', {
  validate(value) {
    const regex = /^[0-9]*[.,]?[0-9]+$/;
    return {
      required: true,
      valid: regex.test(value),
    };
  },
  message: 'Please enter correct {_field_}',
});

extend('percent', {
  validate(value) {
    const regex = /^100%?$|^\s*(\d{0,2})((\.|,)(\d*))?\s*%?\s*$/;
    return {
      required: true,
      valid: regex.test(value),
    };
  },
  message: 'Please enter correct {_field_}',
});
extend('fullDate', {
  validate(value) {
    const regex = /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]|(?:Jan|Mar|May|Jul|Aug|Oct|Dec)))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2]|(?:Jan|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec))\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)(?:0?2|(?:Feb))\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9]|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep))|(?:1[0-2]|(?:Oct|Nov|Dec)))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/;
    return {
      required: true,
      valid: regex.test(value),
    };
  },
  message: 'Please enter correct {_field_}',
});
extend('telephone', {
  validate(value) {
    const regex = /^(\+)?((\d{2,3}) ?\d|\d)(([ -]?\d)|( ?(\d{2,3}) ?)){5,12}\d$/;
    return {
      required: true,
      valid: regex.test(value),
    };
  },
  message: 'Please enter correct {_field_}',
});
extend('twitter', {
  validate(value) {
    const regex = /@([A-Za-z0-9_]{1,15})/;
    return {
      required: true,
      valid: regex.test(value),
    };
  },
  message: 'Please enter correct {_field_}',
});
extend('facebook', {
  validate(value) {
    // eslint-disable-next-line
        const regex = /(?:(?:http|https):\/\/)?(?:www.)?facebook.com\/(?:(?:\w)*#!\/)?(?:pages\/)?([\w\-]*)?/;
    return {
      required: true,
      valid: regex.test(value),
    };
  },
  message: 'Please enter correct {_field_}',
});
extend('linkedIn', {
  validate(value) {
    // eslint-disable-next-line
        const regex = /((https?:\/\/)?((www|\w\w)\.)?linkedin\.com\/)((([\w]{2,3})?)|([^\/]+\/(([\w|\d-&#?=])+\/?){1,}))$/;
    return {
      required: true,
      valid: regex.test(value),
    };
  },
  message: 'Please enter correct {_field_}',
});

extend('decimalPlaces', {
  validate(value, { places }) {
    const regex = new RegExp(`^\\d+\\.\\d{0,${places}}$`);
    return {
      required: true,
      valid: !value.toString().includes('.') || regex.test(value),
    };
  },
  params: ['places'],
  message: 'Max decimal places: {places}',
});

extend('mnemonic', {
  validate(value) {
    return {
      required: true,
      valid: validateMnemonic(value),
    };
  },
  message: 'Incorrect secret phrase',
});

extend('address', {
  validate(value) {
    return {
      required: true,
      valid: utils.isAddress(value),
    };
  },
  message: 'Type correct address',
});

extend('addressBech32', {
  validate(value) {
    const regex = /wq1[a-z-0-9]{3,41}$/;
    return {
      required: true,
      valid: regex.test(value),
    };
  },
  message: 'Please enter correct {_field_}',
});

extend('alpha_spaces_dash', {
  validate(value) {
    const regex = /^[\p{L}\-_\s]+$/u;
    return {
      valid: regex.test(value),
    };
  },
});

extend('needToDelete', {
  validate(value, { needToDelete }) {
    return {
      valid: needToDelete <= 0,
    };
  },
  params: ['needToDelete'],
});

extend('min_tokens_amount', {
  validate(value, { balance, min, symbol }) {
    return {
      valid: new BigNumber(balance).isGreaterThan(0),
    };
  },
  params: ['balance', 'min', 'symbol'],
});

extend('max_buy_wqt', {
  validate(value, { max }) {
    return {
      required: true,
      valid: new BigNumber(value).isLessThanOrEqualTo(max),
    };
  },
  params: ['max', 'symbol'],
});

extend('min_buy_wqt', {
  validate(value, { min }) {
    return {
      required: true,
      valid: new BigNumber(value).isGreaterThanOrEqualTo(min),
    };
  },
  params: ['min', 'symbol'],
});

extend('have_funds', {
  validate(value, { balance, amount }) {
    return {
      valid: new BigNumber(balance).isGreaterThanOrEqualTo(amount),
    };
  },
  params: ['balance', 'amount', 'symbol'],
});

extend('max_value', {
  validate(value, { max }) {
    return {
      required: true,
      valid: new BigNumber(value).isLessThanOrEqualTo(max),
    };
  },
  params: ['max'],
});

extend('min_value', {
  validate(value, { min }) {
    return {
      required: true,
      valid: new BigNumber(value).isGreaterThanOrEqualTo(min),
    };
  },
  params: ['min'],
});

export default ({ app }) => {
  configure({
    defaultMessage: (_field_, values) => app.i18n.t(`messages.${values._rule_}`, values),
  });
};

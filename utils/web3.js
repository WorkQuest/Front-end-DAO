import Web3 from 'web3';
import BigNumber from 'bignumber.js';
import abi from '~/abi/index';
import { success, error } from '~/utils/success-error';
import { errorCodes } from '~/utils/enums';

const account = {
  address: null,
  chainId: null,
  reset() {
    this.address = null;
    this.chainId = null;
  },
};
export const getAccount = () => account;

let isHandlingStatus = false;
export const getIsHandlingStatus = () => isHandlingStatus;

let web3Wallet = null;
let store;
let axios;
if (process.browser) {
  window.onNuxtReady(({ $store, $axios }) => {
    store = $store;
    axios = $axios;
  });
}

const isProd = () => process.env.PROD === 'true';

export function showToast(title, text, variant) {
  store.dispatch('main/showToast', {
    title,
    text,
    variant,
  }, { root: true });
}

export const fetchContractData = async (_method, _abi, _address, _params, _provider = web3Wallet) => {
  try {
    if (!_provider) {
      console.error('_provider is undefined');
      return {};
    }
    const Contract = new _provider.eth.Contract(_abi, _address);
    const res = await Contract.methods[_method].apply(this, _params).call();
    return success(res);
  } catch (e) {
    console.log(e.message);
    return error(errorCodes.FetchContractData, '', e);
  }
};

export const connectToMetamask = async () => {
  try {
    const { ethereum } = window;
    if (!ethereum) {
      console.log('Please install metamask');
      return error(errorCodes.MetamaskIsNotInstalled);
    }
    web3Wallet = new Web3(ethereum);
    await ethereum.enable();
    const [userAddress, chainId] = await Promise.all([
      web3Wallet.eth.getCoinbase(),
      web3Wallet.eth.net.getId(),
    ]);
    if (isProd() && ![1, 56].includes(+chainId)) {
      return error(errorCodes.WrongChainId, 'Wrong blockchain in metamask', 'Current site work on mainnet. Please change network.');
    }
    if (!isProd() && ![4, 97].includes(+chainId)) {
      return error(errorCodes.WrongChainId, 'Wrong blockchain in metamask', 'Current site work on testnet. Please change network.');
    }
    account.address = userAddress;
    account.chainId = chainId;
    return success(account);
  } catch (e) {
    return error(errorCodes.ConnectToMetamaskError, '', e);
  }
};

export const handleMetamaskStatus = (callback) => {
  isHandlingStatus = true;
  const { ethereum } = window;
  ethereum.on('chainChanged', callback);
  ethereum.on('accountsChanged', callback);
};

export const disconnect = () => {
  web3Wallet = null;
  account.reset();
};

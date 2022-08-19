import { ethers } from 'ethers';
import { AES, enc } from 'crypto-js';
import sha256 from 'crypto-js/sha256';
import BigNumber from 'bignumber.js';
import Web3 from 'web3';
import message from '@cosmostation/cosmosjs/src/messages/proto';
import { keccak_256 } from '@noble/hashes/sha3';
import converter from 'bech32-converting';
import secp256k1 from 'secp256k1';
import { sha256 as ethersSha256 } from 'ethers/lib.esm/utils';
import { error, success } from '~/utils/success-error';
import { errorCodes } from '~/utils/enums';
import { ERC20 } from '~/abi/index';
import ENV from '~/utils/addresses/index';
import { GateGasPrice, OverLimitForTx, ValidatorsGasLimit } from '~/utils/constants/validators';

const bip39 = require('bip39');

let bip32Lib;
const BIP32Factory = require('bip32').default;

import('tiny-secp256k1').then((ecc) => BIP32Factory(ecc)).then((bip32) => { bip32Lib = bip32; });

BigNumber.set({ ROUNDING_MODE: BigNumber.ROUND_DOWN });
BigNumber.config({ EXPONENTIAL_AT: 60 });

const path = Object.freeze("m/44'/60'/0'/0/0");
// eslint-disable-next-line import/prefer-default-export
export const generateMnemonic = () => bip39.generateMnemonic();
export const createWallet = (mnemonic) => {
  try {
    return ethers.utils.HDNode.fromMnemonic(mnemonic).derivePath(path);
  } catch (e) {
    // incorrect mnemonic
    return false;
  }
};
export const encryptStringWithKey = (toEncrypt, key) => {
  try {
    return AES.encrypt(toEncrypt, sha256(key).toString()).toString();
  } catch (e) {
    console.log('encr', e);
    return '';
  }
};
export const decryptStringWithKey = (toDecrypt, key) => {
  try {
    return AES.decrypt(toDecrypt, sha256(key).toString()).toString(enc.Utf8);
  } catch (e) {
    console.log('decr', e);
    return '';
  }
};

let isEthNetwork = false;
export const ethBoost = 1.1;
// eslint-disable-next-line no-return-assign
export const setIsEthNetWork = (isEthNetworkSelected) => isEthNetwork = isEthNetworkSelected;

let cipherKey = null;
export const getCipherKey = () => cipherKey;
// eslint-disable-next-line no-return-assign
export const setCipherKey = (key) => cipherKey = key;

let web3 = new Web3(ENV.WQ_PROVIDER);
export const GetWalletProvider = () => web3;
const wallet = {
  address: null,
  privateKey: null,
  mnemonic: null,
  init(address, privateKey, mnemonic) {
    if (!web3) web3 = new Web3(ENV.WQ_PROVIDER);
    this.address = address.toLowerCase();
    this.privateKey = privateKey;
    this.mnemonic = mnemonic;
    if (privateKey) {
      const account = web3.eth.accounts.privateKeyToAccount(wallet.privateKey);
      web3.eth.accounts.wallet.add(account);
      web3.eth.defaultAccount = account.address;
    }

    // For reconnect on refresh
    sessionStorage.removeItem(address);
    window.addEventListener('beforeunload', () => {
      sessionStorage.setItem(address, encryptStringWithKey(mnemonic, window.clientInformation.userAgent));
    });
  },
  reset() {
    this.address = null;
    this.privateKey = null;
  },
};
export const getIsWalletConnected = () => !!wallet.address && !!wallet.privateKey;
export const getWalletAddress = () => wallet.address;
// Метод нужен для вызова метода wallet не затрагивая другие данные
export const initWallet = (wal) => {
  if (!wal) return;
  wallet.init(wal.address.toLowerCase(), wal.privateKey, wal.mnemonic.phrase);
};

export const connectWalletToProvider = (providerType) => {
  if (!getIsWalletConnected()) {
    console.error('Wallet is not connected');
    return error(-1, 'Wallet is not connected');
  }

  const provider = ENV[providerType];
  if (!providerType || !provider) {
    console.error(`Wrong provider type: ${providerType}`);
    return error(-2, `Wrong provider type: ${providerType}`);
  }

  web3 = new Web3(provider);
  if (wallet.privateKey) {
    const account = web3.eth.accounts.privateKeyToAccount(wallet.privateKey);
    web3.eth.accounts.wallet.add(account);
    web3.eth.defaultAccount = account.address;
  }
  return success();
};

const contractInstances = {};
export const getContractInstance = (abiName, _abi, _address) => {
  if (contractInstances[abiName + _address]) {
    return contractInstances[abiName + _address];
  }
  try {
    if (!web3) {
      console.error('web3Wallet is null!');
      return error(errorCodes.ProviderIsNull, 'web3 is null');
    }
    const inst = new web3.eth.Contract(_abi, _address);
    contractInstances[abiName + _address] = inst;
    return inst;
  } catch (e) {
    console.error('getContractInstance:', e.message);
    return null;
  }
};

/**
 * * Check wallet for current address
 * @param userAddress
 * @param userPassword
 * @returns {{msg: string, code: number, data: null, ok: boolean}|{result: *, ok: boolean}}
 */
export const connectWallet = (userAddress, userPassword) => {
  if (!userPassword || !userAddress) return error();
  if (wallet.address && wallet.privateKey) return success();
  const storageData = JSON.parse(localStorage.getItem('wal'));
  if (!storageData) {
    return error();
  }

  const storageMnemonic = storageData ? storageData[userAddress] : null;
  if (!storageMnemonic) {
    return error();
  }

  // Check in storage
  if (storageMnemonic) {
    const mnemonic = decryptStringWithKey(storageMnemonic, userPassword);
    const _walletTemp = createWallet(mnemonic);
    if (_walletTemp?.address?.toLowerCase() === userAddress) {
      initWallet(_walletTemp);
      return success();
    }
  }

  // Wrong mnemonic for current account!
  return error();
};

/**
  * Connect to wallet with mnemonic from session
  * @param phrase
  * @param userAddress
*/
export const connectWithMnemonic = (phrase, userAddress) => {
  if (!phrase || !userAddress) return false;
  const _walletTemp = createWallet(phrase);
  if (_walletTemp?.address?.toLowerCase() === userAddress) {
    initWallet(_walletTemp);
    return true;
  }
  return false;
};

export const disconnect = () => {
  wallet.reset();
};

export const getWalletTransactionCount = () => web3.eth.getTransactionCount(wallet.address);

const min = Object.freeze(new BigNumber(0.0001));
/**
 * @param amount
 * @param full - returns with all decimals
 * @param decimals
 * @returns {string|BigNumber}
 */
export const getStyledAmount = (amount, full = false, decimals = 18) => {
  const value = new BigNumber(amount).shiftedBy(-decimals);
  if (value.isEqualTo(0)) return '0';
  if (full) return value.toString();
  if (value.isLessThan(min)) return `<${min.toString()}`;
  return value.decimalPlaces(4).toString();
};

// WUSD
export const getBalance = async () => {
  try {
    const balance = await web3.eth.getBalance(wallet.address);
    return success({
      balance: getStyledAmount(balance),
      fullBalance: getStyledAmount(balance, true),
    });
  } catch (e) {
    console.error('get balance error', e);
    return error();
  }
};
// Send WUSD
export const transfer = async (recipient, value) => {
  try {
    value = new BigNumber(value).shiftedBy(18).toString();
    const [gasPrice, gasEstimate] = await Promise.all([
      web3.eth.getGasPrice(),
      web3.eth.estimateGas({
        from: wallet.address,
        to: recipient,
        value,
      }),
    ]);
    const txRes = await web3.eth.sendTransaction({
      from: wallet.address,
      to: recipient,
      value,
      gas: gasEstimate,
      gasPrice,
    });
    return success(txRes);
  } catch (e) {
    console.error('transfer error', e);
    return error();
  }
};
export const getTransferFeeData = async (recipient, value) => {
  try {
    value = new BigNumber(value).shiftedBy(18).toString();
    const [gasPrice, gasEstimate] = await Promise.all([
      web3.eth.getGasPrice(),
      web3.eth.estimateGas({
        from: wallet.address,
        to: recipient,
        value,
      }),
    ]);
    return success({
      gasPrice,
      gasEstimate,
      fee: new BigNumber(gasPrice * gasEstimate).shiftedBy(-18).toString(),
    });
  } catch (e) {
    console.error('txFee error', e);
    return error();
  }
};

/** CONTRACTS */
export const sendWalletTransaction = async (_method, {
  abi, address, data, value,
}) => {
  if (!web3) {
    console.error('web3 is undefined');
    return false;
  }
  try {
    const inst = new web3.eth.Contract(abi, address);
    const gasPrice = await web3.eth.getGasPrice();
    const accountAddress = getWalletAddress();
    const txData = inst.methods[_method].apply(null, data).encodeABI();

    if (value) {
      const gas = await inst.methods[_method].apply(null, data).estimateGas({
        from: accountAddress,
        value,
      });
      return await inst.methods[_method](...data).send({
        from: accountAddress,
        to: address,
        data: txData,
        gasPrice,
        gas,
        value,
      });
    }
    const gas = await inst.methods[_method].apply(null, data).estimateGas({
      from: accountAddress,
    });
    const transactionData = {
      from: accountAddress,
      to: address,
      data: txData,
      gasPrice,
      gas,
    };
    // noinspection ES6RedundantAwait
    return await web3.eth.sendTransaction(transactionData);
  } catch (e) {
    console.error('wallet: sendWalletTransaction', e);
    throw error(-1, e.msg, e);
  }
};

export const fetchWalletContractData = async (_method, _abi, _address, _params) => {
  try {
    if (!web3) {
      console.error('Provider is undefined');
      return {};
    }
    const inst = new web3.eth.Contract(_abi, _address);
    return await inst.methods[_method].apply(this, _params).call();
  } catch (e) {
    console.error(`Fetch contract data [${_method}]: ${e.message}`);
    return false;
  }
};

export const transferToken = async (recipient, value) => {
  try {
    value = new BigNumber(value).shiftedBy(18).toString();
    const inst = new web3.eth.Contract(ERC20, ENV.WORKNET_WUSD_TOKEN);
    const [gasPrice, gasEstimate] = await Promise.all([
      web3.eth.getGasPrice(),
      inst.methods.transfer.apply(null, [recipient, value]).estimateGas({ from: wallet.address }),
    ]);
    const res = await inst.methods.transfer(recipient, value).send({
      from: wallet.address,
      gas: gasEstimate,
      gasPrice,
    });
    return success(res);
  } catch (e) {
    console.error(e.message);
    return error();
  }
};
/**
 * Get fee from contract
 * @param method
 * @param abi
 * @param contractAddress
 * @param data - array
 * @param recipient
 * @param amount - NativeToken
 * @returns {Promise<{msg: string, code: number, data: null, ok: boolean}|{result: *, ok: boolean}>}
 */
export const getContractFeeData = async (method, abi, contractAddress, data, recipient = null, amount = 0) => {
  try {
    const inst = new web3.eth.Contract(abi, contractAddress);
    const tx = {
      from: wallet.address,
    };
    if (recipient) tx.to = recipient;
    if (amount) {
      amount = new BigNumber(amount).shiftedBy(18).toString();
      tx.value = amount;
    }
    const [gasPrice, gasEstimate] = await Promise.all([
      web3.eth.getGasPrice(),
      inst.methods[method].apply(null, data).estimateGas(tx),
    ]);
    return success({
      gasPrice,
      gasEstimate,
      fee: new BigNumber(gasPrice * gasEstimate).shiftedBy(-18).toString(),
    });
  } catch (e) {
    console.error(`Get contract fee data error: ${method}.`, e.message);
    return error(1000, e.message);
  }
};

/** VALIDATORS */
const chainId = ENV.WQ_CHAIN_ID;

const fetchCosmosAccount = async (address) => fetch(`${ENV.WQ_PROVIDER}/api/cosmos/auth/v1beta1/accounts/${address}`)
  .then((response) => response.json());

const getPrivAndPublic = async (mnemonic) => {
  const seed = await bip39.mnemonicToSeed(mnemonic);
  const node = bip32Lib.fromSeed(seed);
  const child = node.derivePath(path);

  const ECPariPriv = child.privateKey;

  const tempPub = child.publicKey;
  // eslint-disable-next-line new-cap
  const buf1 = new Buffer.from([10]);
  // eslint-disable-next-line new-cap
  const buf2 = new Buffer.from([tempPub.length]);
  // eslint-disable-next-line new-cap
  const buf3 = new Buffer.from(tempPub);
  const pubKey = Buffer.concat([buf1, buf2, buf3]);
  const pubKeyAny = new message.google.protobuf.Any({
    type_url: '/ethermint.crypto.v1.ethsecp256k1.PubKey',
    value: pubKey,
  });
  return { pubKeyAny, privKey: ECPariPriv };
};

function toRealUint8Array(data) {
  if (data instanceof Uint8Array) return data;
  return Uint8Array.from(data);
}

const sign = (txBody, authInfo, accountNumber, privKey) => {
  const { v1beta1 } = message.cosmos.tx;
  const bodyBytes = v1beta1.TxBody.encode(txBody).finish();
  const authInfoBytes = v1beta1.AuthInfo.encode(authInfo).finish();
  const signDoc = new v1beta1.SignDoc({
    body_bytes: bodyBytes,
    auth_info_bytes: authInfoBytes,
    chain_id: chainId,
    account_number: Number(accountNumber),
  });

  const signMessage = v1beta1.SignDoc.encode(signDoc).finish();
  const hash = keccak_256.create().update(toRealUint8Array(signMessage)).digest();
  const sig = secp256k1.sign(Buffer.from(hash), Buffer.from(privKey));

  const txRaw = new v1beta1.TxRaw({
    body_bytes: bodyBytes,
    auth_info_bytes: authInfoBytes,
    signatures: [sig.signature],
  });
  const txBytes = v1beta1.TxRaw.encode(txRaw).finish();
  return Buffer.from(txBytes, 'binary').toString('base64'); // txBytesBase64
};

export const CreateSignedTxForValidator = async (method, validatorAddress, amount, gasLimit = ValidatorsGasLimit) => {
  try {
    const address = converter('wq').toBech32(wallet.address);
    const data = await fetchCosmosAccount(address);
    if (!data?.account?.base_account) {
      // Account w/o any tx
      return error(10404, 'Empty cosmos account');
    }
    const { v1beta1 } = message.cosmos.tx;
    const { privKey, pubKeyAny } = await getPrivAndPublic(wallet.mnemonic);
    // txBody
    const msgSend = new message.cosmos.bank.v1beta1.MsgSend({
      from_address: address,
      to_address: validatorAddress,
      amount: [{ denom: 'awqt', amount }],
    });
    const msgSendAny = new message.google.protobuf.Any({
      type_url: method,
      value: message.cosmos.bank.v1beta1.MsgSend.encode(msgSend).finish(),
    });
    const txBody = new v1beta1.TxBody({ messages: [msgSendAny], memo: '' });
    // authInfo
    const signerInfo = new v1beta1.SignerInfo({
      public_key: pubKeyAny,
      mode_info: { single: { mode: message.cosmos.tx.signing.v1beta1.SignMode.SIGN_MODE_DIRECT } },
      sequence: +data.account.base_account.sequence,
    });

    // Sometimes gas_limit is less than gas_used, here we incr limit amount:
    const limit = new BigNumber(gasLimit).multipliedBy(OverLimitForTx).toFixed(0).toString();

    const feeValue = new v1beta1.Fee({
      amount: [{ denom: 'awqt', amount: new BigNumber(GateGasPrice).multipliedBy(limit).toString() }], // gas price
      gas_limit: limit,
    });
    const authInfo = new v1beta1.AuthInfo({ signer_infos: [signerInfo], fee: feeValue });

    // sign
    return success(sign(txBody, authInfo, data.account.base_account.account_number, privKey)); // signedTxBytes base64
  } catch (e) {
    console.error('CreateSignedTxForValidator', e);
    return error();
  }
};

export const getAddressFromConsensusPub = (pub) => {
  const foo = Buffer.from(pub, 'base64');
  return ethersSha256(foo).substr(2, 40);
};

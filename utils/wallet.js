/* eslint-disable no-tabs */
import { ethers } from 'ethers';
import { AES, enc } from 'crypto-js';
import BigNumber from 'bignumber.js';
import Web3 from 'web3';
import message, { cosmos } from '@cosmostation/cosmosjs/src/messages/proto';
import converter from 'bech32-converting';
import secp256k1 from 'secp256k1';
// import * as bip32 from 'bip32';
import crypto from 'crypto';
import { error, success } from '~/utils/success-error';
import abi from '~/abi/index';
import { errorCodes } from '~/utils/enums';

const bip39 = require('bip39');

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

export const encryptStringWithKey = (toEncrypt, key) => AES.encrypt(toEncrypt, key).toString();
export const decryptStringWitheKey = (toDecrypt, key) => AES.decrypt(toDecrypt, key).toString(enc.Utf8);

let cipherKey = null;
export const getCipherKey = () => cipherKey;
// eslint-disable-next-line no-return-assign
export const setCipherKey = (key) => cipherKey = key;

let web3 = new Web3(process.env.WQ_PROVIDER);
export const GetWalletProvider = () => web3;
const wallet = {
  address: null,
  privateKey: null,
  mnemonic: null,
  init(address, privateKey) {
    if (!web3) web3 = new Web3(process.env.WQ_PROVIDER);
    this.address = address.toLowerCase();
    this.privateKey = privateKey;
    if (privateKey) {
      const account = web3.eth.accounts.privateKeyToAccount(wallet.privateKey);
      web3.eth.accounts.wallet.add(account);
      web3.eth.defaultAccount = account.address;
    }
  },
  reset() {
    this.address = null;
    this.privateKey = null;
  },
};
export const getIsWalletConnected = () => !!wallet.address && !!wallet.privateKey;
export const getWalletAddress = () => wallet.address;
// Метод нужен для вызова метода wallet не затрагивая другие данные
export const initWallet = (address, key) => {
  wallet.init(address, key);
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
  let _walletTemp;
  const storageData = JSON.parse(localStorage.getItem('mnemonic'));
  if (!storageData) {
    return error();
  }

  const storageMnemonic = storageData ? storageData[userAddress] : null;
  if (!storageMnemonic) {
    return error();
  }

  // Check in storage
  if (storageMnemonic) {
    const mnemonic = decryptStringWitheKey(storageMnemonic, userPassword);
    _walletTemp = createWallet(mnemonic);
    if (_walletTemp && _walletTemp.address.toLowerCase() === userAddress) {
      wallet.init(_walletTemp.address.toLowerCase(), _walletTemp.privateKey);
      sessionStorage.setItem('mnemonic', JSON.stringify({
        ...JSON.parse(sessionStorage.getItem('mnemonic')),
        [userAddress]: mnemonic,
      }));
      wallet.mnemonic = mnemonic;
      return success();
    }
  }

  // Wrong mnemonic for current account!
  return error();
};

/**
 * Connect to wallet with mnemonic from session
 * @param userAddress
 */
export const connectWithMnemonic = (userAddress) => {
  const sessionData = JSON.parse(sessionStorage.getItem('mnemonic'));
  if (!sessionData) return false;
  const mnemonic = sessionData[userAddress];
  if (!mnemonic) return false;
  const _walletTemp = createWallet(mnemonic);
  if (_walletTemp && _walletTemp.address.toLowerCase() === userAddress) {
    wallet.init(_walletTemp.address.toLowerCase(), _walletTemp.privateKey);
    wallet.mnemonic = mnemonic;
    return true;
  }
  return false;
};

export const disconnect = () => {
  wallet.reset();
};

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
export const sendWalletTransaction = async (_method, payload) => {
  if (!web3) {
    console.error('web3 is undefined');
    return false;
  }
  const inst = new web3.eth.Contract(payload.abi, payload.address);
  const gasPrice = await web3.eth.getGasPrice();
  const accountAddress = getWalletAddress();
  const data = inst.methods[_method].apply(null, payload.data).encodeABI();
  const gasEstimate = await inst.methods[_method].apply(null, payload.data).estimateGas({ from: accountAddress });
  const transactionData = {
    to: payload.address,
    from: accountAddress,
    data,
    gasPrice,
    gas: gasEstimate,
  };
    // noinspection ES6RedundantAwait
  return await web3.eth.sendTransaction(transactionData);
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
    const inst = new web3.eth.Contract(abi.ERC20, process.env.WORKNET_WQT_TOKEN);
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
 * @param _method
 * @param _abi
 * @param _contractAddress
 * @param data - array
 * @param recipient
 * @param amount - WUSD
 * @returns {Promise<{msg: string, code: number, data: null, ok: boolean}|{result: *, ok: boolean}>}
 */
export const getContractFeeData = async (_method, _abi, _contractAddress, data, recipient = null, amount = 0) => {
  try {
    if (!web3) {
      console.error('fetchWalletData: web3 is undefined!');
      return error(errorCodes.ProviderIsNull, 'provider is null');
    }
    const inst = new web3.eth.Contract(_abi, _contractAddress);
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
      inst.methods[_method].apply(null, data).estimateGas(tx),
    ]);
    return success({
      gasPrice,
      gasEstimate,
      fee: new BigNumber(gasPrice * gasEstimate).shiftedBy(-18).toString(),
    });
  } catch (e) {
    console.error(`Get contract fee data error: ${_method}.`, e.message);
    return error(1000, e.message);
  }
};

/* Investors */
export const getDelegates = async () => {
  try {
    const res = await fetchWalletContractData(
      'delegates',
      abi.WQToken,
      process.env.WORKNET_WQT_TOKEN,
      [wallet.address],
    );
    return success(res);
  } catch (e) {
    console.error('getDelegates; ', e);
    return error(errorCodes.Undelegate, e.message, e);
  }
};
export const delegate = async (toAddress, amount) => {
  try {
    amount = new BigNumber(amount).shiftedBy(+18).toString();
    const res = await sendWalletTransaction('delegate', {
      abi: abi.WQToken,
      address: process.env.WORKNET_WQT_TOKEN,
      data: [toAddress, amount],
    });
    return success(res);
  } catch (e) {
    console.error('delegate:', e);
    return error(errorCodes.Delegate, e.message, e);
  }
};
export const undelegate = async () => {
  try {
    const res = await sendWalletTransaction('undelegate', {
      abi: abi.WQToken,
      address: process.env.WORKNET_WQT_TOKEN,
    });
    return success(res);
  } catch (e) {
    console.error('undelegate: ', e);
    return error(errorCodes.Undelegate, e.message, e);
  }
};

/* Proposals */
export const addProposal = async (description, nonce) => {
  try {
    const res = await sendWalletTransaction('addProposal', {
      abi: abi.WORKNET_VOTING,
      address: process.env.WORKNET_VOTING,
      data: [nonce, description.toString()],
    });
    return success(res);
  } catch (e) {
    return error(errorCodes.AddProposal, e.message, e);
  }
};
export const getProposalInfoById = async (id) => {
  try {
    const res = await fetchWalletContractData('proposals', abi.WORKNET_VOTING, process.env.WORKNET_VOTING, [id]);
    return success(res);
  } catch (e) {
    return error(errorCodes.GetProposal, e.message, e);
  }
};
export const doVote = async (id, value) => {
  try {
    const res = await sendWalletTransaction('doVote', {
      abi: abi.WORKNET_VOTING,
      address: process.env.WORKNET_VOTING,
      data: [id, value],
    });
    return success(res);
  } catch (e) {
    return error(errorCodes.VoteProposal, e.message, e);
  }
};
export const getProposalThreshold = async () => {
  try {
    const result = await fetchWalletContractData('proposalThreshold', abi.WORKNET_VOTING, process.env.WORKNET_VOTING);
    return success(new BigNumber(result.toString()).shiftedBy(-18).toString());
  } catch (e) {
    return error(errorCodes.GetProposalThreshold, e.message, e);
  }
};
export const getVoteThreshold = async () => {
  try {
    const result = await fetchWalletContractData('voteThreshold', abi.WORKNET_VOTING, process.env.WORKNET_VOTING);
    return success(new BigNumber(result.toString()).shiftedBy(-18).toString());
  } catch (e) {
    return error(errorCodes.GetVoteThreshold, e.message, e);
  }
};
export const getReceipt = async (id, accountAddress) => {
  try {
    const result = await fetchWalletContractData('getReceipt', abi.WORKNET_VOTING, process.env.WORKNET_VOTING, [+id, accountAddress]);
    return success(result);
  } catch (e) {
    return error(errorCodes.GetReceipt, e.message, e);
  }
};
export const voteResults = async (id) => {
  try {
    return await fetchWalletContractData('voteResults', abi.WORKNET_VOTING, process.env.WORKNET_VOTING, [id]);
  } catch (e) {
    return error(errorCodes.VoteResults, e.message, e);
  }
};

// Chairperson TODO: remove and move to admin panel
export const getChairpersonHash = async () => {
  try {
    const result = await fetchWalletContractData('CHAIRPERSON_ROLE', abi.WORKNET_VOTING, process.env.WORKNET_VOTING);
    return success(result);
  } catch (e) {
    return error(errorCodes.GetChairpersonHash, e.message, e);
  }
};
export const hasRole = async (roleHash) => {
  try {
    const result = await fetchWalletContractData('hasRole', abi.WORKNET_VOTING, process.env.WORKNET_VOTING, [roleHash, wallet.address]);
    return success(result);
  } catch (e) {
    return error(errorCodes.HasRole, e.message, e);
  }
};
export const executeVoting = async (id) => {
  try {
    const res = await sendWalletTransaction('executeVoting', {
      abi: abi.WORKNET_VOTING,
      address: process.env.WORKNET_VOTING,
      data: [id],
    });
    return success(res);
  } catch (e) {
    return error(errorCodes.ExecuteVoting, e.message, e);
  }
};

/** VALIDATORS */

const chainId = '20220112'; // '20211224'; - old
cosmos.url = process.env.WQ_PROVIDER;
cosmos.path = path;
cosmos.chainId = chainId;

const hexToBytes = (hex) => {
  const bytes = [];
  for (let c = 0; c < hex.length; c += 2) {
    bytes.push(parseInt(hex.substr(c, 2), 16));
  }
  return bytes;
};
const bytesToHex = (bytes) => {
  const hex = [];
  for (let i = 0; i < bytes.length; i += 1) {
    const current = bytes[i] < 0 ? bytes[i] + 256 : bytes[i];
    // eslint-disable-next-line no-bitwise
    hex.push((current >>> 4).toString(16));
    // eslint-disable-next-line no-bitwise
    hex.push((current & 0xF).toString(16));
  }
  return hex.join('');
};

const getCosmosAccounts = async (address) => {
  const accountsApi = '/api/cosmos/auth/v1beta1/accounts/';
  return fetch(process.env.WQ_PROVIDER + accountsApi + address).then((response) => response.json());
};

// import('tiny-secp256k1').then(ecc => BIP32Factory(ecc)).then(bip32 => {
//
//   const m = 'range inquiry notice praise heart barely dinosaur license fame family infant midnight flock symptom aerobic dinosaur whisper major hair kitchen never way combine affair';
//   bip39.mnemonicToSeed(m).then(seed => {
//     const node = bip32.fromSeed(seed);
//     const child = node.derivePath("m/44'/60'/0'/0/0");
//     console.log(bytesToHex(child.privateKey));
//   });
// });

const BIP32Factory = require('bip32').default;

let ECPariPriv;
let pubKeyAny;
import('tiny-secp256k1').then((ecc) => BIP32Factory(ecc)).then((bip32) => {
  const m = 'range inquiry notice praise heart barely dinosaur license fame family infant midnight flock symptom aerobic dinosaur whisper major hair kitchen never way combine affair';
  bip39.mnemonicToSeed(m).then((seed) => {
    const node = bip32.fromSeed(seed);
    const child = node.derivePath("m/44'/60'/0'/0/0");
    ECPariPriv = child.privateKey;

    const tempPub = child.publicKey;
    // eslint-disable-next-line new-cap
    const buf1 = new Buffer.from([10]);
    // eslint-disable-next-line new-cap
    const buf2 = new Buffer.from([tempPub.length]);
    // eslint-disable-next-line new-cap
    const buf3 = new Buffer.from(tempPub);
    const pubKey = Buffer.concat([buf1, buf2, buf3]);

    pubKeyAny = new message.google.protobuf.Any({
      type_url: '/ethermint.crypto.v1.ethsecp256k1.PubKey',
      value: pubKey,
    });
  });
});
// const getECPairPriv = async (mnemonic) => {
//   // const seed = await bip39.mnemonicToSeed(mnemonic);
//   // const node = bip32.fromSeed(seed);
//   // console.log('NODE', node);
//   // const child = node.derivePath("m/44'/60'/0'/0/0");
//   // return child.privateKey;
// };

const getPubKeyAny = (privKey) => {
  const pubKeyByte = secp256k1.publicKeyCreate(privKey);
  // eslint-disable-next-line new-cap
  const buf1 = new Buffer.from([10]);
  // eslint-disable-next-line new-cap
  const buf2 = new Buffer.from([pubKeyByte.length]);
  // eslint-disable-next-line new-cap
  const buf3 = new Buffer.from(pubKeyByte);
  const pubKey = Buffer.concat([buf1, buf2, buf3]);
  return new message.google.protobuf.Any({ // pubKeyAny
    // type_url: '/cosmos.crypto.secp256k1.PubKey',
    type_url: '/ethermint.crypto.v1.ethsecp256k1.PubKey',
    value: pubKey,
  });
  // type_url: '/cosmos.crypto.ed25519.PubKey', // задан в валидаторах (жалуется: panic message redacted to hide potentially sensitive system info: panic)
  // type_url: '/ethermint.crypto.v1.ethsecp256k1.PubKey',
};

const sign = (txBody, authInfo, accountNumber, privKey) => {
  const bodyBytes = message.cosmos.tx.v1beta1.TxBody.encode(txBody).finish();
  const authInfoBytes = message.cosmos.tx.v1beta1.AuthInfo.encode(authInfo).finish();
  const signDoc = new message.cosmos.tx.v1beta1.SignDoc({
    body_bytes: bodyBytes,
    auth_info_bytes: authInfoBytes,
    chain_id: chainId,
    account_number: Number(accountNumber),
  });
  const signMessage = message.cosmos.tx.v1beta1.SignDoc.encode(signDoc).finish();
  const hash = crypto.createHash('sha256').update(signMessage).digest();
  const sig = secp256k1.sign(hash, Buffer.from(privKey));
  const txRaw = new message.cosmos.tx.v1beta1.TxRaw({
    body_bytes: bodyBytes,
    auth_info_bytes: authInfoBytes,
    signatures: [sig.signature],
  });
  const txBytes = message.cosmos.tx.v1beta1.TxRaw.encode(txRaw).finish();
  return Buffer.from(txBytes, 'binary').toString('base64'); // txBytesBase64
};

export const test = async () => {
  try {
    const m = 'range inquiry notice praise heart barely dinosaur license fame family infant midnight flock symptom aerobic dinosaur whisper major hair kitchen never way combine affair';

    const w = createWallet(m);
    console.log(w);

    const address = converter('ethm').toBech32(w.address);

    // TODO privKey должен будет идентичен w.privateKey
    // TODO pubKey должен будет идентичен w.publicKey

    // tendermint/sig трайнуть

    const data = await getCosmosAccounts(address);
    console.log('cosmos ac', data);
    const privKey = ECPariPriv; // await getECPairPriv(wallet.mnemonic);
    console.log('PIV >>>', bytesToHex(privKey), '>', w.privateKey);
    // const pubKeyAny = getPubKeyAny(privKey);
    // console.log('PUB >>> ', pubKeyAny, bytesToHex(pubKeyAny.value), '>', w.publicKey);

    // signDoc = (1)txBody + (2)authInfo
    // ---------------------------------- (1)txBody ----------------------------------
    const msgSend = new message.cosmos.bank.v1beta1.MsgSend({
      from_address: address,
      to_address: address, // 'ethmvaloper1r9n7xttnufe02qyh02yjjvgzez9c0zcdyzk02h', // 'ethm1x43lhtppf0k828cm063uy2ul9xjtm79jjp5jwx',
      amount: [{ denom: 'aphoton', amount: String('100000') }],
    });
    const msgSendAny = new message.google.protobuf.Any({
      type_url: '/cosmos.bank.v1beta1.MsgSend', // '/cosmos.staking.v1beta1.MsgDelegate',
      value: message.cosmos.bank.v1beta1.MsgSend.encode(msgSend).finish(),
    });
    const txBody = new message.cosmos.tx.v1beta1.TxBody({ messages: [msgSendAny], memo: '' });
    console.log('TX BODY >>> ', txBody);
    // --------------------------------- (2)authInfo ---------------------------------
    const signerInfo = new message.cosmos.tx.v1beta1.SignerInfo({
      public_key: pubKeyAny,
      mode_info: { single: { mode: message.cosmos.tx.signing.v1beta1.SignMode.SIGN_MODE_DIRECT } },
      sequence: data.account.base_account.sequence,
    });
    console.log('SIGNER INFO', signerInfo);
    const feeValue = new message.cosmos.tx.v1beta1.Fee({
      amount: [{ denom: 'aphoton', amount: String('5000') }],
      gas_limit: 200000,
    });
    const authInfo = new message.cosmos.tx.v1beta1.AuthInfo({ signer_infos: [signerInfo], fee: feeValue });
    console.log('AUTH INFO >>', authInfo);
    // -------------------------------- sign --------------------------------
    return success(sign(txBody, authInfo, data.account.base_account.account_number, privKey)); // signedTxBytes
  } catch (e) {
    console.error('test', e);
    return error();
  }
};

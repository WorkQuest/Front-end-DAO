import Web3 from 'web3';
import BigNumber from 'bignumber.js';
import abi, { abiNames } from '~/abi/index';
import { success, error } from '~/utils/success-error';
import { Chains, ChainsId, errorCodes } from '~/utils/enums';

BigNumber.set({ ROUNDING_MODE: BigNumber.ROUND_DOWN });
BigNumber.config({ EXPONENTIAL_AT: 60 });

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

export const getChainIdByChain = (chain) => {
  switch (chain) {
    case Chains.ETHEREUM:
      return isProd() ? ChainsId.ETH_MAIN : ChainsId.ETH_TEST;
    default:
      throw error(-1, `wrong chain name: ${chain}`);
  }
};

export const goToChain = async (chain) => {
  const methodName = 'wallet_switchEthereumChain';
  const chainIdParam = [{ chainId: getChainIdByChain(chain) }];
  try {
    await window.ethereum.request({
      method: methodName,
      params: chainIdParam,
    });
    return { ok: true };
  } catch (e) {
    if (typeof window.ethereum !== 'undefined') {
      showToast('Switch chain error:', `${e.message}`, 'danger');
    }
    return error(500, 'switch chain error', e);
  }
};

const contractInstances = {
  [+ChainsId.ETH_MAIN]: {},
  [+ChainsId.ETH_TEST]: {},
};
export const getContractInstance = (abiName, _abi, _address) => {
  if (contractInstances[account.chainId][abiName + _address]) return contractInstances[account.chainId][abiName + _address];
  try {
    if (!web3Wallet) {
      console.error('web3Wallet is null!');
      return error(errorCodes.ProviderIsNull, 'web3Wallet is null');
    }
    const inst = new web3Wallet.eth.Contract(_abi, _address);
    contractInstances[account.chainId][abiName + _address] = inst;
    return inst;
  } catch (e) {
    console.error('getContractInstance:', e.message);
    return null;
  }
};

const sendTransaction = async (_method, abiName, _abi, _address, params) => {
  const inst = getContractInstance(abiName, _abi, _address);
  const accountAddress = account.address;
  const data = inst.methods[_method].apply(this, params).encodeABI();

  const gasPrice = await web3Wallet.eth.getGasPrice();
  const gasEstimate = await inst.methods[_method].apply(null, params).estimateGas({ from: accountAddress });

  return web3Wallet.eth.sendTransaction({
    to: _address,
    data,
    from: accountAddress,
    gasPrice,
    gas: gasEstimate,
  });
};

// TODO: проверить работоспособность методы выше. если везде все окей - вырезать
// export const sendTransaction = async (_method, _abi, _address, payload) => {
//   if (!web3Wallet) {
//     console.error('Provider is null!');
//     return error(errorCodes.ProviderIsNull, 'Provider is null');
//   }
//   const accountAddress = account.address;
//   const inst = new web3Wallet.eth.Contract(_abi, _address);
//   const gasPrice = await web3Wallet.eth.getGasPrice();
//   const functionResult = inst.methods[_method].apply(null, payload);
//   const data = functionResult.encodeABI();
//   const gasEstimate = await functionResult.estimateGas({ from: accountAddress }); // execution reverted
//   const transactionData = {
//     to: _address,
//     from: accountAddress,
//     data,
//     gasPrice,
//     gas: gasEstimate,
//   };
//   console.log(transactionData);
//   return await web3Wallet.eth.sendTransaction(transactionData);
// };

export const fetchContractData = async (_method, abiName, _abi, _address, _params) => {
  try {
    const inst = getContractInstance(abiName, _abi, _address);
    const res = await inst.methods[_method].apply(this, _params).call();
    return success(res);
  } catch (e) {
    console.error('fetch data: ', e.message);
    return error(errorCodes.FetchContractData, '', e);
  }
};

const token = {
  address: process.env.WQ_TOKEN,
  _decimals: null,
  async getDecimals() {
    if (this._decimals) return this._decimals;
    if (web3Wallet) {
      const { result } = await fetchContractData('decimals', abiNames.WQToken, abi.WQToken, this.address);
      this._decimals = result;
      return result;
    }
    return 18;
  },
};

export const connectToMetamask = async () => {
  try {
    const { ethereum } = window;
    if (!ethereum) {
      console.error('Please install metamask');
      return error(errorCodes.MetamaskIsNotInstalled);
    }
    web3Wallet = new Web3(ethereum);
    const chainId = await web3Wallet.eth.net.getId();
    await ethereum.request({ method: 'eth_requestAccounts' });
    if (isProd() && ![1, 56].includes(+chainId)) {
      return error(errorCodes.WrongChainId, 'Wrong blockchain in metamask', 'Current site work on mainnet. Please change network.');
    }
    if (!isProd() && ![4, 97].includes(+chainId)) {
      return error(errorCodes.WrongChainId, 'Wrong blockchain in metamask', 'Current site work on testnet. Please change network.');
    }
    account.address = await web3Wallet.eth.getCoinbase();
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

/* WQToken */
export const getBalance = async () => {
  try {
    const decimals = await token.getDecimals();
    const { result } = await fetchContractData('balanceOf', abiNames.WQToken, abi.WQToken, token.address, [account.address]);
    return success(new BigNumber(result).shiftedBy(-decimals).toString());
  } catch (e) {
    return error(errorCodes.GetBalance, e.message, e);
  }
};
export const delegate = async (address, amount) => {
  try {
    const decimals = await token.getDecimals();
    const value = new BigNumber(amount).shiftedBy(+decimals).toString();
    const res = await sendTransaction('delegate', abiNames.WQToken, abi.WQToken, token.address, [address, value]);
    return success(res);
  } catch (e) {
    return error(errorCodes.Delegate, e.message, e);
  }
};
export const undelegate = async () => {
  try {
    const res = await sendTransaction('undelegate', abiNames.WQToken, abi.WQToken, token.address);
    return success(res);
  } catch (e) {
    return error(errorCodes.Undelegate, e.message, e);
  }
};
export const getVotes = async (address) => {
  try {
    const decimals = await token.getDecimals();
    const { result } = await fetchContractData('getVotes', abiNames.WQToken, abi.WQToken, token.address, [address]);
    return success(new BigNumber(result).shiftedBy(-decimals).toString());
  } catch (e) {
    return error(errorCodes.GetVotes, e.message, e);
  }
};

/* Proposals */
export const addProposal = async (description) => {
  try {
    const res = await sendTransaction('addProposal', abiNames.WQDAOVoting, abi.WQDAOVoting, process.env.WQ_DAO_VOTING, [description.toString()]);
    return success(res);
  } catch (e) {
    return error(errorCodes.AddProposal, e.message, e);
  }
};
export const getProposals = async (offset, limit) => { // TODO: delete later (как добавится бэк - дергать с него)
  try {
    const { result } = await fetchContractData('getProposals', abiNames.WQDAOVoting, abi.WQDAOVoting, process.env.WQ_DAO_VOTING, [offset, limit]);
    return success(result);
  } catch (e) {
    return error(errorCodes.GetAllProposals, e.message, e);
  }
};
export const getProposalInfoById = async (id) => {
  try {
    const res = await fetchContractData('proposals', abiNames.WQDAOVoting, abi.WQDAOVoting, process.env.WQ_DAO_VOTING, [id]);
    return success(res);
  } catch (e) {
    return error(errorCodes.GetProposal, e.message, e);
  }
};
export const doVote = async (id, value) => {
  try {
    const res = await sendTransaction('doVote', abiNames.WQDAOVoting, abi.WQDAOVoting, process.env.WQ_DAO_VOTING, [id, value]);
    return success(res);
  } catch (e) {
    return error(errorCodes.VoteProposal, e.message, e);
  }
};
export const getProposalThreshold = async () => {
  try {
    const decimals = await token.getDecimals();
    const { result } = await fetchContractData('proposalThreshold', abiNames.WQDAOVoting, abi.WQDAOVoting, process.env.WQ_DAO_VOTING);
    return success(new BigNumber(result).shiftedBy(-decimals).toString());
  } catch (e) {
    return error(errorCodes.GetProposalThreshold, e.message, e);
  }
};
export const getVoteThreshold = async () => {
  try {
    const decimals = await token.getDecimals();
    const { result } = await fetchContractData('voteThreshold', abiNames.WQDAOVoting, abi.WQDAOVoting, process.env.WQ_DAO_VOTING);
    return success(new BigNumber(result).shiftedBy(-decimals).toString());
  } catch (e) {
    return error(errorCodes.GetVoteThreshold, e.message, e);
  }
};
export const getReceipt = async (id, accountAddress) => {
  try {
    const { result } = await fetchContractData('getReceipt', abiNames.WQDAOVoting, abi.WQDAOVoting, process.env.WQ_DAO_VOTING, [+id, accountAddress]);
    return success(result);
  } catch (e) {
    return error(errorCodes.GetReceipt, e.message, e);
  }
};
export const executeVoting = async (id) => {
  try {
    const res = await sendTransaction('executeVoting', abiNames.WQDAOVoting, abi.WQDAOVoting, process.env.WQ_DAO_VOTING, [id]);
    return success(res);
  } catch (e) {
    return error(errorCodes.ExecuteVoting, e.message, e);
  }
};

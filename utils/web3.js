import Web3 from 'web3';
import BigNumber from 'bignumber.js';
import abi from '~/abi/index';
import { success, error } from '~/utils/success-error';
import { Chains, ChainsId, errorCodes } from '~/utils/enums';

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
    case Chains.BINANCE:
      return isProd() ? ChainsId.BSC_MAIN : ChainsId.BSC_TEST;
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

const sendTransaction = async (_method, _abi, _address, params) => {
  if (!web3Wallet) {
    console.error('Provider is null!');
    return error(errorCodes.ProviderIsNull, 'Provider is null');
  }
  const accountAddress = account.address;
  const inst = new web3Wallet.eth.Contract(_abi, _address);
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

export const fetchContractData = async (_method, _abi, _address, _params, _provider = web3Wallet) => {
  try {
    if (!_provider) {
      console.error('Provider is null!');
      return error(errorCodes.ProviderIsNull, 'Provider is null');
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
      console.error('Please install metamask');
      return error(errorCodes.MetamaskIsNotInstalled);
    }
    web3Wallet = new Web3(ethereum);
    const chainId = await web3Wallet.eth.net.getId();
    await ethereum.enable();
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
    const { result } = await fetchContractData('balanceOf', abi.WQToken, process.env.WQ_TOKEN, [account.address]);
    return success(new BigNumber(result).shiftedBy(-18).toString());
  } catch (e) {
    return error(errorCodes.GetBalance.e.message, e);
  }
};
export const delegate = async (address, amount) => {
  try {
    const value = new BigNumber(amount).shiftedBy(18).toString();
    const res = await sendTransaction('delegate', abi.WQToken, process.env.WQ_TOKEN, [address, value]);
    return success(res);
  } catch (e) {
    return error(errorCodes.Delegate, e.message, e);
  }
};
export const getVotes = async (address) => {
  try {
    const { result } = await fetchContractData('getVotes', abi.WQToken, process.env.WQ_TOKEN, [address]);
    return success(new BigNumber(result).shiftedBy(-18).toString());
  } catch (e) {
    return error(errorCodes.GetVotes, e.message, e);
  }
};

/* Proposals */
export const addProposal = async (description) => {
  try {
    const res = await sendTransaction('addProposal', abi.WQDAOVoting, process.env.WQ_DAO_VOTING, [description.toString()]);
    return success(res);
  } catch (e) {
    return error(errorCodes.AddProposal, e.message, e);
  }
};
export const getProposals = async (offset, limit) => { // TODO: delete later (как добавится бэк - дергать с него)
  try {
    const { result } = await fetchContractData('getProposals', abi.WQDAOVoting, process.env.WQ_DAO_VOTING, [offset, limit]);
    return success(result);
  } catch (e) {
    return error(errorCodes.GetAllProposals, e.message, e);
  }
};
export const getProposalInfoById = async (id) => {
  try {
    const res = await fetchContractData('proposals', abi.WQDAOVoting, process.env.WQ_DAO_VOTING, [id]);
    return success(res);
  } catch (e) {
    return error(errorCodes.GetProposal, e.message, e);
  }
};
export const doVote = async (id, value) => {
  try {
    const res = await sendTransaction('doVote', abi.WQDAOVoting, process.env.WQ_DAO_VOTING, [id, value]);
    return success(res);
  } catch (e) {
    return error(errorCodes.VoteProposal, e.message, e);
  }
};
export const getVoteThreshold = async () => {
  try {
    const { result } = await fetchContractData('voteThreshold', abi.WQDAOVoting, process.env.WQ_DAO_VOTING);
    return success(new BigNumber(result).shiftedBy(-18).toString());
  } catch (e) {
    return error(errorCodes.GetVoteThreshold, e.message, e);
  }
};

import ENV from '~/utils/addresses';

export const errorCodes = Object.freeze({
  ProviderIsNull: -1,
  WrongChainId: 0,
  MetamaskIsNotInstalled: 1,
  ConnectToMetamaskError: 2,
  FetchContractData: 3,

  // Proposals
  AddProposal: 100, // Добавить пропосал
  CreateProposal: 101,
  GetProposal: 102, //  Получить инфу о пропосоле
  VoteProposal: 103, // Голосовать за пропосал
  GetVoteThreshold: 104, // Минимальная делигированная сумма для голоса
  GetProposalThreshold: 105, // Минимальная делигированная сумма для создания пропосола
  GetReceipt: 106, // Получить информацию по своему голосу
  ExecuteVoting: 107,
  GetChairpersonHash: 108,
  HasRole: 109,
  VoteResults: 110,
  GetVotingPeriod: 111,

  GetBalance: 200, // Баланс WQT на адресе
  Delegate: 201, // Делегирование
  GetVotes: 202, // Делегировано адресу
  Undelegate: 202,

  axiosFetchError: 5000,
});

export const SumSubStatuses = { NOT_VERIFIED: 0, VERIFIED: 1 };

export const Path = Object.freeze({
  ROOT: '/',
  SIGN_IN: '/sign-in',
  SIGN_UP: '/sign-up',
  ROLE: '/role',
  PROPOSALS: '/proposals',
  INVESTORS: '/investors',
  VALIDATORS: '/validators',
  DISCUSSIONS: '/discussions',
  WALLET: '/wallet',
  PROFILE: '/profile',
});

export const RouterNames = Object.freeze({
  SIGN_IN: 'sign-in',
  SIGN_UP: 'sign-up',
  ROLE: 'role',
  ROOT: 'index',
});

export const UserRole = Object.freeze({
  WORKER: 'worker',
  EMPLOYER: 'employer',
});

export const ChainsId = Object.freeze({
  ETH_MAIN: '0x1',
  ETH_TEST: '0x4',
});

export const Chains = Object.freeze({
  ETHEREUM: 'ETH',
});

export const NativeTokenSymbolByChainId = Object.freeze({
  [+ChainsId.ETH_MAIN]: 'ETH',
  [+ChainsId.ETH_TEST]: 'ETH',
});

export const proposalStatuses = Object.freeze({
  PENDING: 0,
  ACTIVE: 1,
  REJECTED: 2,
  ACCEPTED: 3,
  CANCELLED: 4,
});

export const keyCodes = {
  Escape: 27,
  ArrowLeft: 37,
  ArrowRight: 39,
};

export const TokenSymbols = Object.freeze({
  WQT: 'WQT',
  WUSD: 'WUSD',
  WBNB: 'WBNB',
  WETH: 'WETH',
  USDT: 'USDT',
});

export const TokenSymbolByContract = Object.freeze({
  [ENV.WORKNET_WUSD_TOKEN.toLowerCase()]: TokenSymbols.WUSD,
  [ENV.WORKNET_USDT_TOKEN.toLowerCase()]: TokenSymbols.USDT,
  [ENV.WORKNET_WBNB_TOKEN.toLowerCase()]: TokenSymbols.WBNB,
  [ENV.WORKNET_WETH_TOKEN.toLowerCase()]: TokenSymbols.WETH,
});

export const TokenMap = {
  [TokenSymbols.WUSD]: ENV.WORKNET_WUSD_TOKEN,
  [TokenSymbols.USDT]: ENV.WORKNET_USDT_TOKEN,
  [TokenSymbols.WBNB]: ENV.WORKNET_WBNB_TOKEN,
  [TokenSymbols.WETH]: ENV.WORKNET_WETH_TOKEN,
};

export const WorknetTokenAddresses = [ENV.WORKNET_WUSD_TOKEN];

export const WalletTables = Object.freeze({
  TXS: 'TXS',
  COLLATERAL: 'COLLATERAL',
});

export const WalletState = Object.freeze({
  Default: 1,
  SaveMnemonic: 2,
  ConfirmMnemonic: 3,
  ImportOrCreate: 4,
  ImportMnemonic: 5,
});

export const UserStatuses = Object.freeze({
  Unconfirmed: 0,
  Confirmed: 1,
  NeedSetRole: 2,
});

export const ExplorerUrl = {
  master: 'https://explorer.workquest.co',
  testnet: 'https://testnet-explorer.workquest.co',
  stage: 'https://stage-explorer.workquest.co',
  develop: 'https://dev-explorer.workquest.co',
}[process.env.BRANCH];

export const ValidatorsMethods = Object.freeze({
  DELEGATE: '/cosmos.staking.v1beta1.MsgDelegate',
  UNDELEGATE: '/cosmos.staking.v1beta1.MsgUndelegate',
});

export const DelegateMode = Object.freeze({
  VALIDATORS: 0,
  INVESTORS: 1,
});

// min gas price by gate
export const GateGasPrice = {
  develop: '10000000',
  testnet: '1000000000000000000',
  stage: '85714285000000',
  master: '85714285000000',
}[process.env.BRANCH];

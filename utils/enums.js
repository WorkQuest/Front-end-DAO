// eslint-disable-next-line import/prefer-default-export
export const errorCodes = Object.freeze({
  ProviderIsNull: -1,
  WrongChainId: 0,
  MetamaskIsNotInstalled: 1,
  ConnectToMetamaskError: 2,
  FetchContractData: 3,

  // Proposals
  AddProposal: 100, // Добавить пропосал
  CreateProposal: 101,
  GetAllProposals: 102, // Получение всех пропосолов
  GetProposal: 103, //  Получить инфу о пропосоле
  VoteProposal: 104, // Голосовать за пропосал
  GetVoteThreshold: 105, // Минимальная делигированная сумма для голоса
  GetProposalThreshold: 106, // Минимальная делигированная сумма для создания пропосола
  GetReceipt: 107, // Получить квитанцию
  ExecuteVoting: 108,
  GetChairpersonHash: 109,
  HasRole: 110,
  VoteResults: 111,

  GetBalance: 200, // Баланс WQT на адресе
  Delegate: 201, // Делегирование
  GetVotes: 202, // Делегировано адресу
  Undelegate: 202,

  axiosFetchError: 5000,
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

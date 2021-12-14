// eslint-disable-next-line import/prefer-default-export
export const errorCodes = Object.freeze({
  ProviderIsNull: -1,
  WrongChainId: 0,
  MetamaskIsNotInstalled: 1,
  ConnectToMetamaskError: 2,
  FetchContractData: 3,

  // Proposals
  AddProposal: 100, // Добавить пропосал
  GetAllProposals: 101, // Получение всех пропосолов
  GetProposal: 102, //  Получить инфу о пропосоле
  VoteProposal: 103, // Голосовать за пропосал
  GetVoteThreshold: 104, // Минимальная делигированная сумма для голоса
  GetProposalThreshold: 105, // Минимальная делигированная сумма для создания пропосола
  GetReceipt: 106, // Получить квитанцию
  ExecuteVoting: 107,
  GetChairpersonHash: 110,
  HasRole: 111,

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
  REJECTED: 1,
  ACCEPTED: 2,
  CANCELLED: 3,
});

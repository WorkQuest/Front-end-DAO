// min gas price by gate
export const GateGasPrice = {
  develop: '10000000',
  testnet: '85714285000000',
  stage: '85714285000000',
  master: '85714285000000',
}[process.env.BRANCH];

export const ValidatorsMethods = Object.freeze({
  DELEGATE: '/cosmos.staking.v1beta1.MsgDelegate',
  UNDELEGATE: '/cosmos.staking.v1beta1.MsgUndelegate',
});

export const ValidatorsGasLimit = '200000';

export const ValidatorStatuses = {
  BONDED: 'BOND_STATUS_BONDED', // актвный, генерирует блоки и награды
  UNBONDED: 'BOND_STATUS_UNBONDED', // не актвный, не генерирует блоки и не получает награды. после достижения кол-ва голосов становится bonded
  UNBONDING: 'BOND_STATUS_UNBONDING', // не активный (в процессе отключения по желанию или сокращению), не генерирует блоки и не получает награды. по истечению unbondingTime токены будут возвращены юзерам
};

export const ValidatorStatusByStatuses = {
  [ValidatorStatuses.BONDED]: 'BONDED',
  [ValidatorStatuses.UNBONDED]: 'UNBONDED',
  [ValidatorStatuses.UNBONDING]: 'UNBONDING',
};

// % to gas_limit
export const OverLimitForTx = {
  develop: 1.01,
  testnet: 1.01,
  stage: 1.01,
  master: 1.01,
}[process.env.BRANCH];

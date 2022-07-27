// min gas price by gate
export const GateGasPrice = {
  develop: '10000000',
  testnet: '1000000000000000000',
  stage: '85714285000000',
  master: '85714285000000',
}[process.env.BRANCH];

export const ValidatorsMethods = Object.freeze({
  DELEGATE: '/cosmos.staking.v1beta1.MsgDelegate',
  UNDELEGATE: '/cosmos.staking.v1beta1.MsgUndelegate',
});

export const ValidatorsGasLimit = '200000';

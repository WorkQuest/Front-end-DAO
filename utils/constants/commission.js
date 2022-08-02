// eslint-disable-next-line import/prefer-default-export
export const WQTBuyCommission = { // wallet page buy wqt
  master: 0,
  testnet: 0,
  develop: 0.01,
}[process.env.BRANCH]; // will calc final value us: 1 - WQTBuyCommission

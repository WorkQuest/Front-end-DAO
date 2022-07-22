import * as develop from './develop';
import * as testnet from './testnet';
import * as stage from './stage';
import * as master from './master';

const keysByBranch = {
  master: master.default,
  testnet: testnet.default,
  stage: stage.default,
  develop: develop.default,
}[process.env.BRANCH];

export const IS_PROD = ['master', 'stage', 'testnet'].includes(process.env.BRANCH);

/**
 * @property BRANCH - ENV
 * @property BASE_URL
 * @property GMAPKEY - use process.env on project,
 * @property SECRET_SUMSUB - use process.env on project

 * @property WQ_CHAIN_ID - ChainID for current network
 * @property WQ_PROVIDER
 * @property WQ_EXPLORER

 * @property WORKNET_WBNB_TOKEN
 * @property WORKNET_WETH_TOKEN
 * @property WORKNET_WUSD_TOKEN
 * @property WORKNET_USDT_TOKEN
 * @property WORKNET_VOTING
 */
export default keysByBranch;

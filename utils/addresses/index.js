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

 * @property WQ_ORACLE_URL
 * @property WQ_EXPLORER
 * @property WQ_WS_PROVIDER
 * @property WS_NOTIFS_URL

 * @property WQ_PROVIDER
 * @property ETH_PROVIDER
 * @property BSC_PROVIDER
 * @property POLYGON_PROVIDER

 * @property WORKNET_WBNB_TOKEN
 * @property WORKNET_WETH_TOKEN
 * @property WORKNET_WUSD_TOKEN
 * @property WORKNET_USDT_TOKEN
 * @property WORKNET_VOTING
 *
 * @property BSC_USDT_TOKEN
 * @property BSC_STABLE_BRIDGE

 * @property POLYGON_USDT_TOKEN
 * @property POLYGON_STABLE_BRIDGE

 * @property ETHEREUM_USDT_TOKEN
 * @property ETHEREUM_STABLE_BRIDGE
 */
export default keysByBranch;

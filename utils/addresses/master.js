export default {
  BRANCH: process.env.BRANCH,
  BASE_URL: 'https://app.workquest.co/api/',
  // GMAPKEY: process.env.GMAPKEY,
  // SECRET_SUMSUB: process.env.SECRET_SUMSUB,

  WQ_ORACLE_URL: 'https://mainnet-oracle.workquest.co/api/v1',
  WQ_EXPLORER: 'https://mainnet-explorer-api.workquest.co/api/v1',
  WQ_WS_PROVIDER: 'wss://mainnet-gate.workquest.co/tendermint-rpc/websocket',
  WS_NOTIFS_URL: 'wss://mainnet-notification.workquest.co/api/v1/notifications',

  WQ_PROVIDER: 'https://mainnet-gate.workquest.co',
  ETH_PROVIDER: 'https://speedy-nodes-nyc.moralis.io/a4b1a749a870bbd413acd4f0/eth/mainnet',
  BSC_PROVIDER: 'https://speedy-nodes-nyc.moralis.io/a4b1a749a870bbd413acd4f0/bsc/mainnet',
  POLYGON_PROVIDER: 'https://speedy-nodes-nyc.moralis.io/a4b1a749a870bbd413acd4f0/polygon/mainnet',

  WORKNET_WBNB_TOKEN: '0xD7ca5F803807b03D49606D4f8e66551170b1d689',
  WORKNET_WETH_TOKEN: '0x8E52341384F5286f4c76cE1072Aba887Be8E4EB9',
  WORKNET_WUSD_TOKEN: '0x4d9F307F1fa63abC943b5db2CBa1c71D02d86AAa',
  WORKNET_USDT_TOKEN: '0xD93d2cF0e0179112469188F61ceb948F2Dbe4824',
  WORKNET_VOTING: '0xA903836A89FAf0c7A64DCabf2bCd7b05480b28e9',

  BSC_USDT_TOKEN: '0x55d398326f99059ff775485246999027b3197955', // decimals 18
  BSC_STABLE_BRIDGE: '0x527aC80974c66939cBf686648064846708234256',

  POLYGON_USDT_TOKEN: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', // decimals 6
  POLYGON_STABLE_BRIDGE: '0xe89508D74579A06A65B907c91F697CF4F8D9Fac7',

  ETHEREUM_USDT_TOKEN: '0xdAC17F958D2ee523a2206206994597C13D831ec7', // decimals 6
  ETHEREUM_STABLE_BRIDGE: '0xb29b67Bf5b7675f1ccaCdf49436b38dE337b502B',
};

import { Chains, TokenSymbols } from '~/utils/enums';
import { images } from '~/utils/images';
import ENV from '~/utils/addresses/index';

export const WorknetBlockchainIndex = 1;

// eslint-disable-next-line import/prefer-default-export
export const BuyWQTTokensData = new Map([
  [
    Chains.WORKNET,
    {
      title: Chains.WORKNET,
      chain: Chains.WORKNET,
      icon: images.WQT,
      tokens: [],
    },
  ],
  [
    Chains.ETHEREUM,
    {
      title: Chains.ETHEREUM,
      chain: Chains.ETHEREUM,
      icon: images.ETH_BLACK,
      bridgeAddress: ENV.ETHEREUM_STABLE_BRIDGE,
      tokens: [
        {
          title: TokenSymbols.USDT,
          tokenAddress: ENV.ETHEREUM_USDT_TOKEN,
          icon: images.USDT,
        },
      ],
    },
  ],
  [
    Chains.BINANCE,
    {
      title: Chains.BINANCE,
      chain: Chains.BINANCE,
      icon: images.BNB,
      bridgeAddress: ENV.BSC_STABLE_BRIDGE,
      tokens: [
        {
          title: TokenSymbols.USDT,
          tokenAddress: ENV.BSC_USDT_TOKEN,
          icon: images.USDT,
        },
      ],
    },
  ],
  [
    Chains.POLYGON,
    {
      title: Chains.POLYGON,
      chain: Chains.POLYGON,
      icon: images.POLYGON,
      bridgeAddress: ENV.POLYGON_STABLE_BRIDGE,
      tokens: [
        {
          title: TokenSymbols.USDT,
          tokenAddress: ENV.POLYGON_USDT_TOKEN,
          icon: images.USDT,
        },
      ],
    },
  ],
]);

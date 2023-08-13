import usdc from './src/assets/usdc-token-icon.png';
import usdt from './src/assets/usdt-token.png';
import dai from './src/assets/dai-logo.png';
import beth from './src/assets/base.png';
import eth from './src/assets/eth.png';
import avax from './src/assets/avax.png';
import ethOp from './src/assets/op.png';
import matic from './src/assets/matic.png';
import ethArb from './src/assets/arb.png';
import ftm from './src/assets/ftm.png';
import bnb from './src/assets/bnb.png';
import metis from './src/assets/metis.png';
import frax from './src/assets/frax.png';
import busd from './src/assets/busd.png';
import usdd from './src/assets/usdd.png';
import susd from './src/assets/susd.png';
import lusd from './src/assets/lusd.png';

//App Name
export const NODE_ENV_NETWORK_APPNAME = 'BasePoint';
//Network
const networkNames = [
  'Base',
  'Ethereum',
  'Avalanche',
  'BSC',
  'Polygon',
  'Arbitrum One',
  'Optimism',
  'Fantom',
  'Metis',
];
//RPC

const networksRPCs = [
  'https://mainnet.base.org', //Base
  'https://mainnet.infura.io/v3/', //Ethereum
  'https://api.avax.network/ext/bc/C/rpc', //Avalanche
  'https://bsc-dataseed.binance.org', //BSC
  'https://polygon.llamarpc.com', //Polygon
  'https://arb1.arbitrum.io/rpc', //Arbitrum
  'https://mainnet.optimism.io', //Optimism
  'https://rpc.ftm.tools/', //Fantom
  'https://andromeda.metis.io/?owner=1088', //Metis
];

const chainIDS = [
  8453, //Base
  1, //Ethereum
  43114, //Avalanche
  56, //BSC
  137, //Polygon
  42161, //Arbitrum
  10, //Optimism
  250, //Fantom
  1088, //Metis
];

const stargatesIDS = [
  184, //Base
  101, //Ethereum
  106, //Avalanche
  102, //BSC
  109, //Polygon
  110, //Arbitrum
  111, //Optimism
  112, //Fantom
  151, //Metis
];

const stargateContracts = [
  '0x45f1a95a4d3f3836523f5c83673c797f4d4d263b', //Base
  '0x8731d54E9D02c286767d56ac03e8037C07e01e98', //Ethereum
  '0x45A01E4e04F14f7A4a6702c74187c5F6222033cd', //Avalanche
  '0x4a364f8c717cAAD9A442737Eb7b8A55cc6cf18D8', //BSC
  '0x45A01E4e04F14f7A4a6702c74187c5F6222033cd', //Polygon
  '0x53Bf833A5d6c4ddA888F69c22C88C9f356a41614', //Arbitrum
  '0xB0D502E938ed5f4df2E681fE6E419ff29631d62b', //Optimism
  '0xAf5191B0De278C7286d6C7CC6ab6BB8A73bA2Cd6', //Fantom
  '0x2F6F07CDcf3588944Bf4C42aC74ff24bF56e7590', //Metis
];

//Explorer
const explorers = [
  'https://basescan.org/', //Base
  'https://etherscan.io/', //Ethereum
  'https://snowtrace.io/', //Avalanche
  'https://bscscan.com/', //BSC
  'https://polygonscan.com/', //Polygon
  'https://arbiscan.io/', //Arbitrum
  'https://optimistic.etherscan.io/', //Optimism
  'https://ftmscan.com/', //Fantom
  'https://andromeda-explorer.metis.io/', //Metis
];

const explorerAPIs = [
  'https://api.basescan.org/api', //Base
  'https://api.etherscan.io/api', //Ethereum
  'https://api.snowtrace.io/api', //Avalanche
  'https://api.bscscan.com/api', //BSC
  'https://api.polygonscan.com/api', //Polygon
  'https://api.arbiscan.io/api', //Arbitrum
  'https://api-optimistic.etherscan.io/api', //Optimism
  'https://api.ftmscan.com/api', //Fantom
  'https://andromeda-explorer.metis.io/api', //Metis
];

const explorerAPIkeys = [
  'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', //Base
  'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', //Ethereum
  'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', //Avalanche
  'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', //BSC
  'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', //Polygon
  'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', //Arbitrum
  'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', //Optimism
  'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', //Fantom
  '', //Metis
];

//Native Token
const natives = [
  'ETH', //Base
  'ETH', //Ethereum
  'AVAX', //Avalanche
  'BNB', //BSC
  'MATIC', //Polygon
  'ETH', //Arbitrum
  'ETH', //Optimism
  'FTM', //Fantom
  'METIS', //Metis
];

const nativeIcons = [
  beth, //Base
  eth, //Ethereum
  avax, //Avalanche
  bnb, //BSC
  matic, //Polygon
  ethArb, //Arbitrum
  ethOp, //Optimism
  ftm, //Fantom
  metis, //Metis
];

const stargatePools = [
  [1, 13], //Base
  [1, 2, 3, 7, 11, 13, 14, 15], //Ethereum
  [1, 2, 7], //Avalanche
  [2, 5, 11], //BSC
  [1, 2, 3], //Polygon
  [1, 2, 7, 13, 15], //Arbitrum
  [1, 3, 7, 13, 14, 15], //Optimism
  [21], //Fantom
  [19], //Metis
];

const stargatePoolPairs = [
  [
    [ // USDC
      0, //Base
      1, //Ethereum
      1, //Avalanche
      5, //BSC
      1, //Polygon
      1, //Arbitrum
      1, //Optimism
      0, //Fantom
      0, //Metis
    ],
    [ // ETH
      0, //Base
      13, //Ethereum
      0, //Avalanche
      0, //BSC
      0, //Polygon
      13, //Arbitrum
      13, //Optimism
      0, //Fantom
      0, //Metis
    ],
  ], //Base
  [
    [
      // 1 USDC
      1, //Base
      0, //Ethereum
      1, //Avalanche
      2, //BSC
      1, //Polygon
      1, //Arbitrum
      1, //Optimism
      21, //Fantom
      0, //Metis
    ],
    [
      // 2 USDT
      1, //Base
      0, //Ethereum
      2, //Avalanche
      2, //BSC
      0, //Polygon
      0, //Arbitrum
      0, //Optimism
      0, //Fantom
      19, //Metis
    ],
    [
      // 3 DAI
      0, //Base
      0, //Ethereum
      0, //Avalanche
      0, //BSC
      3, //Polygon
      0, //Arbitrum
      3, //Optimism
      0, //Fantom
      0, //Metis
    ],
    [
      // 7 Frax
      0, //Base
      0, //Ethereum
      7, //Avalanche
      0, //BSC
      0, //Polygon
      7, //Arbitrum
      7, //Optimism
      0, //Fantom
      0, //Metis
    ],
    [
      // 11 USDD
      0, //Base
      0, //Ethereum
      0, //Avalanche
      11, //BSC
      0, //Polygon
      0, //Arbitrum
      0, //Optimism
      0, //Fantom
      0, //Metis
    ],
    [
      // 13 SGETH
      13, //Base
      0, //Ethereum
      0, //Avalanche
      0, //BSC
      0, //Polygon
      13, //Arbitrum
      13, //Optimism
      0, //Fantom
      0, //Metis
    ],
    [
      // 14 sUSD
      0, //Base
      0, //Ethereum
      0, //Avalanche
      0, //BSC
      0, //Polygon
      0, //Arbitrum
      14, //Optimism
      0, //Fantom
      0, //Metis
    ],
    [
      // 15 LUSD
      0, //Base
      0, //Ethereum
      0, //Avalanche
      0, //BSC
      0, //Polygon
      15, //Arbitrum
      15, //Optimism
      0, //Fantom
      0, //Metis
    ]
  ], //Ethereum
  [
    [
      // 1 USDC
      1, //Base
      1, //Ethereum
      0, //Avalanche
      2, //BSC
      1, //Polygon
      1, //Arbitrum
      1, //Optimism
      21, //Fantom
      0, //Metis
    ],
    [
      // 2 USDT
      1, //Base
      2, //Ethereum
      0, //Avalanche
      2, //BSC
      2, //Polygon
      2, //Arbitrum
      1, //Optimism
      21, //Fantom
      19, //Metis
    ],
    [
      // 7 Frax
      0, //Base
      7, //Ethereum
      0, //Avalanche
      0, //BSC
      0, //Polygon
      7, //Arbitrum
      7, //Optimism
      0, //Fantom
      0, //Metis
    ],
  ], //Avalanche
  [
    [
      // 2 USDT
      1, //Base
      2, //Ethereum
      2, //Avalanche
      0, //BSC
      2, //Polygon
      2, //Arbitrum
      1, //Optimism
      21, //Fantom
      19, //Metis
    ],
    [
      // 5 BUSD
      0, //Base
      1, //Ethereum
      1, //Avalanche
      0, //BSC
      1, //Polygon
      1, //Arbitrum
      1, //Optimism
      0, //Fantom
      0, //Metis
    ],
    [
      // 11 USDD
      0, //Base
      11, //Ethereum
      0, //Avalanche
      0, //BSC
      0, //Polygon
      0, //Arbitrum
      0, //Optimism
      0, //Fantom
      0, //Metis
    ]
  ], //BSC
  [
    [
      // 1 USDC
      1, //Base
      1, //Ethereum
      1, //Avalanche
      5, //BSC
      0, //Polygon
      1, //Arbitrum
      1, //Optimism
      21, //Fantom
      0, //Metis
    ],
    [
      // 2 USDT
      1, //Base
      2, //Ethereum
      2, //Avalanche
      2, //BSC
      0, //Polygon
      2, //Arbitrum
      1, //Optimism
      21, //Fantom
      0, //Metis
    ],
    [
      // 3 DAI
      0, //Base
      3, //Ethereum
      0, //Avalanche
      0, //BSC
      0, //Polygon
      0, //Arbitrum
      3, //Optimism
      0, //Fantom
      0, //Metis
    ]
  ], //Polygon
  [
    [
      // 1 USDC
      1, //Base
      1, //Ethereum
      1, //Avalanche
      5, //BSC
      1, //Polygon
      0, //Arbitrum
      1, //Optimism
      21, //Fantom
      0, //Metis
    ],
    [
      // 2 USDT
      1, //Base
      2, //Ethereum
      2, //Avalanche
      1, //BSC
      2, //Polygon
      0, //Arbitrum
      1, //Optimism
      21, //Fantom
      0, //Metis
    ],
    [
      // 7 Frax
      0, //Base
      7, //Ethereum
      7, //Avalanche
      0, //BSC
      0, //Polygon
      0, //Arbitrum
      7, //Optimism
      0, //Fantom
      0, //Metis
    ],
    [
      // 13 SGETH
      13, //Base
      13, //Ethereum
      0, //Avalanche
      0, //BSC
      0, //Polygon
      0, //Arbitrum
      13, //Optimism
      0, //Fantom
      0, //Metis
    ],
    [
      // 15 LUSD
      15, //Base
      0, //Ethereum
      0, //Avalanche
      0, //BSC
      0, //Polygon
      0, //Arbitrum
      15, //Optimism
      0, //Fantom
      0, //Metis
    ]
  ], //Arbitrum
  [
    [
      // 1 USDC
      1, //Base
      1, //Ethereum
      1, //Avalanche
      5, //BSC
      1, //Polygon
      1, //Arbitrum
      0, //Optimism
      21, //Fantom
      0, //Metis
    ],
    [
      // 3 DAI
      0, //Base
      3, //Ethereum
      0, //Avalanche
      0, //BSC
      3, //Polygon
      0, //Arbitrum
      0, //Optimism
      0, //Fantom
      0, //Metis
    ],
    [
      // 7 Frax
      0, //Base
      7, //Ethereum
      7, //Avalanche
      0, //BSC
      0, //Polygon
      7, //Arbitrum
      0, //Optimism
      0, //Fantom
      0, //Metis
    ],
    [
      // 13 SGETH
      13, //Base
      13, //Ethereum
      0, //Avalanche
      0, //BSC
      0, //Polygon
      13, //Arbitrum
      0, //Optimism
      0, //Fantom
      0, //Metis
    ],
    [
      // 14 sUSD
      0, //Base
      14, //Ethereum
      0, //Avalanche
      0, //BSC
      0, //Polygon
      0, //Arbitrum
      0, //Optimism
      0, //Fantom
      0, //Metis
    ],
    [
      // 15 LUSD
      0, //Base
      15, //Ethereum
      0, //Avalanche
      0, //BSC
      0, //Polygon
      15, //Arbitrum
      0, //Optimism
      0, //Fantom
      0, //Metis
    ]
  ], //Optimism
  [
    [
      // 21
      0, //Base
      1, //Ethereum
      1, //Avalanche
      2, //BSC
      1, //Polygon
      1, //Arbitrum
      1, //Optimism
      0, //Fantom
      0, //Metis
    ],
  ], //Fantom
  [
    [
      // 19
      0, //Base
      2, //Ethereum
      2, //Avalanche
      2, //BSC
      0, //Polygon
      0, //Arbitrum
      0, //Optimism
      0, //Fantom
      0, //Metis
    ],
  ], //Metis
];

const tokenNames = [
  ['USDC', 'SGETH'], //Base
  ['USDC', 'USDT', 'DAI', 'FRAX', 'USDD', 'SGETH', 'sUSD', 'LUSD'], //Ethereum
  ['USDC', 'USDT', 'FRAX'], //Avalanche
  ['USDT', 'BUSD', 'USDD'], //BSC
  ['USDC', 'USDT', 'DAI'], //Polygon
  ['USDC', 'USDT', 'FRAX', 'SGETH', 'LUSD'], //Arbitrum
  ['USDC', 'DAI', 'FRAX', 'SGETH', 'sUSD', 'LUSD'], //Optimism
  ['USDC'], //Fantom
  ['USDT'], //Metis
];

const tokenIcons = [
  [usdc, eth], //Base
  [usdc, usdt, dai, frax, usdd, eth, susd, lusd], //Ethereum
  [usdc, usdt, frax], //Avalanche
  [usdt, busd, usdd], //BSC
  [usdc, usdt, dai], //Polygon
  [usdc, usdt, frax, eth, lusd], //Arbitrum
  [usdc, dai, frax, eth, susd, lusd], //Optimism
  [usdc], //Fantom
  [usdt], //Metis
];

const tokenColors = [
  ['#47B3F0', '#c1ccf7'], //Base
  [
    '#47B3F0',
    '#1f7159',
    '#f0b90b',
    '#777',
    '#436D59',
    '#c1ccf7',
    '#1e1a31',
    '#745ddf',
  ], //Ethereum
  ['#47B3F0', '#1f7159', '#777'], //Avalanche
  ['#1f7159', '#f0b90b', '#436D59'], //BSC
  ['#47B3F0', '#1f7159', '#f0b90b'], //Polygon
  ['#47B3F0', '#1f7159', '#777', '#c1ccf7', '#745ddf'], //Arbitrum
  ['#47B3F0', '#f0b90b', '#777', '#c1ccf7', '#1e1a31', '#745ddf'], //Optimism
  ['#47B3F0'], //Fantom
  ['#1f7159'], //Metis
];

const tokensContracts = [
  [
    '0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA', // USDC
    '0x224D8Fd7aB6AD4c6eb4611Ce56EF35Dec2277F03', // SGETH
  ],
  //Base
  [
    '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
    '0xdAC17F958D2ee523a2206206994597C13D831ec7', // USDT
    '0x6B175474E89094C44Da98b954EedeAC495271d0F', // DAI
    '0x853d955aCEf822Db058eb8505911ED77F175b99e', // FRAX
    '0x0C10bF8FcB7Bf5412187A595ab97a3609160b5c6', // USDD
    '0x72E2F4830b9E45d52F80aC08CB2bEC0FeF72eD9c', // SGETH
    '0x57Ab1ec28D129707052df4dF418D58a2D46d5f51', // sUSD
    '0x5f98805A4E8be255a32880FDeC7F6728C6568bA0', // LUSD
  ],
  //Ethereum
  [
    '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E', // USDC
    '0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7', // USDT
    '0xD24C2Ad096400B6FBcd2ad8B24E7acBc21A1da64', // FRAX
  ],
  //Avalanche
  [
    '0x55d398326f99059fF775485246999027B3197955', // USDT
    '0xe9e7cea3dedca5984780bafc599bd69add087d56', // BUSD
    '0xd17479997F34dd9156Deef8F95A52D81D265be9c', // USDD
  ],
  //BSC
  [
    '0x2791bca1f2de4661ed88a30c99a7a9449aa84174', // USDC
    '0xc2132d05d31c914a87c6611c10748aeb04b58e8f', // USDT
    '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063', // DAI
  ],
  //Polygon
  [
    '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8', // USDC
    '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9', // USDT
    '0x17FC002b466eEc40DaE837Fc4bE5c67993ddBd6F', // FRAX
    '0x82CbeCF39bEe528B5476FE6d1550af59a9dB6Fc0', // SGETH
    '0x600E576F9d853c95d58029093A16EE49646F3ca5', // LUSD
  ],
  //Arbitrum
  [
    '0x7f5c764cbc14f9669b88837ca1490cca17c31607', // USDC
    '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1', // DAI
    '0x2E3D870790dC77A83DD1d18184Acc7439A53f475', // FRAX
    '0xb69c8CBCD90A39D8D3d3ccf0a3E968511C3856A0', // SGETH
    '0x8c6f28f2F1A3C87F0f938b96d27520d9751ec8d9', // sUSD
    '0xc40F949F8a4e094D1b49a23ea9241D289B7b2819', // LUSD
  ],
  //Optimism
  ['0x04068da6c83afcfa0e13ba15a6696662335d5b75'], // USDC
  //Fantom
  [
    '0xbB06DCA3AE6887fAbF931640f67cab3e3a16F4dC', // USDT
  ],
  //Metis
];

//Gecko

const geckoNatives = [
  'ethereum',
  'ethereum',
  'avalanche-2',
  'binancecoin',
  'matic-network',
  'ethereum',
  'ethereum',
  'fantom',
  'metis-token',
];

const geckoTokens = [
  ['usd-coin', 'ethereum'], //Base
  [
    'usd-coin',
    'tether',
    'dai',
    'frax',
    'usdd',
    'ethereum',
    'nusd',
    'liquity-usd',
  ], //Ethereum
  ['usd-coin', 'tether', 'frax'], //Avalanche
  ['tether', 'binance-usd', 'usdd'], //BSC
  ['usd-coin', 'tether', 'dai'], //Polygon
  ['usd-coin', 'tether', 'frax', 'ethereum', 'liquity-usd'], //Arbitrum
  ['usd-coin', 'dai', 'frax', 'ethereum', 'nusd', 'liquity-usd'], //Optimism
  ['usd-coin'], //Fantom
  ['tether'], //Metis
];

//Colors

const colors = [
  '#1352ef', //Base
  '#c1ccf7', //Ethereum
  '#E84142', //Avalanche
  '#F0B90B', //BSC
  '#8345e6', //Polygon
  '#213147', //Arbitrum
  '#FF0420', //Optimism
  '#001F68', //Fantom
  '#00d5c7', //Metis
];

// Covalent

const covalentIDs = [
  'base-mainnet', //Base
  'eth-mainnet', //Ethereum
  'avalanche-mainnet', //Avalanche
  'bsc-mainnet', //BSC
  'matic-mainnet', //Polygon
  'arbitrum-mainnet', //Arbitrum
  'optimism-mainnet', //Optimism
  'fantom-mainnet', //Fantom
  'metis-mainnet', //Metis
];

export const covalentKey = "cqt_XXXXXXXXXXXXXXXXXXXXXXXXXXXX"

// Blockchains

export const NODE_ENV_NETWORKS = networkNames.map((item, index) => {
  return {
    name: item,
    covalentID:covalentIDs[index],
    rpc: networksRPCs[index],
    chainId: chainIDS[index],
    stargateID: stargatesIDS[index],
    stargatePool: stargatePools[index],
    stargatePoolPairs:stargatePoolPairs[index],
    stargateContract: stargateContracts[index],
    explorer: explorers[index],
    api: explorerAPIs[index],
    apiKey: explorerAPIkeys[index],
    native: natives[index],
    nativeIcon: nativeIcons[index],
    color: colors[index],
    geckoNative: geckoNatives[index],
    tokenNames: tokenNames[index],
    tokenIcons: tokenIcons[index],
    tokenColors: tokenColors[index],
    tokensContracts: tokensContracts[index],
    geckoTokens: geckoTokens[index],
  };
});

//Data Feeds
export const NODE_ENV_DATA_FEEDS_RCP =
  'https://polygon.llamarpc.com';
export const NODE_ENV_CHAINLINK_FEED_CONTRACT =
  '0xFE006128fD276f29CDadd330f60be53B53285e8f';

// Wallet Connect Id
export const WalletConnectProjectID = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
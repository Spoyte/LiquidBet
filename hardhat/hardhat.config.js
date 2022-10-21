require('@nomiclabs/hardhat-waffle');
require('dotenv').config({ path: '.env' });
require("@nomiclabs/hardhat-etherscan");

const NODE_PROVIDER_API_KEY_URL = process.env.NODE_PROVIDER_API_KEY_URL;
const WALLET_PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

module.exports = {
  solidity: '0.8.4',
  networks: {
    mumbai: {
      url: NODE_PROVIDER_API_KEY_URL,
      accounts: [WALLET_PRIVATE_KEY],
      // gasPrice: 1000000,
    }
  },
  etherscan: {
    apiKey: {
      polygonMumbai: ETHERSCAN_API_KEY
    }
  }
};
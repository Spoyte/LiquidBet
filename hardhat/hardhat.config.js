require('@nomiclabs/hardhat-waffle');
require('dotenv').config({ path: '.env' });
require("@nomiclabs/hardhat-etherscan");

// const NODE_PROVIDER_API_KEY_URL = process.env.NODE_PROVIDER_API_KEY_URL;
const WALLET_PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

module.exports = {
  solidity: '0.8.4',
  networks: {
    // mumbai: {
    //   url: NODE_PROVIDER_API_KEY_URL,
    //   accounts: [WALLET_PRIVATE_KEY],
    //   gas: 21000000,
    //   gasPrice: 80000000000
    // }, 
    testnet: {
      url: "http://127.0.0.1:8545/",
      //You need to run "npx hardhat node" before launch deploy.js and don't interupt it
      //HardHat Private Key With 10.000 TEST ETH
      accounts: ["0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a"],
      allowUnlimitedContractSize: true,
      gas: 210000000,
      gasPrice: 800000000000
    }
  },
  etherscan: {
    apiKey: {
      polygonMumbai: ETHERSCAN_API_KEY
    }
  }
};
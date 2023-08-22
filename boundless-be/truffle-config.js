const keys = require("./keys.json");
const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {

  networks: {
    development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 8545,            // Standard Ethereum port (default: none)
      network_id: "*",       // Any network (default: none)
    },

    alfajores: {
      provider: () => new HDWalletProvider(keys.PRIVATE_KEY, `https://celo-alfajores.infura.io/v3/${keys.INFURA_PROJECT_ID}`),
      network_id: 44787,
      gas: 20000000,
      timeoutBlocks: 200,
      networkCheckTimeout: 1000000,
    }
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.13",      // Fetch exact version from solc-bin
    }
  }
};

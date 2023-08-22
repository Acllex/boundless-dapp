const keys = require("./keys.json");
module.exports = {

  networks: {
    development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 8545,            // Standard Ethereum port (default: none)
      network_id: "*",       // Any network (default: none)
    },

    celo: {
      provider: () => new HDWalletProvider(keys.PRIVATE_KEY, `https://celo-alfajores.infura.io/v3/${keys.INFURA_PROJECT_ID}`),
      network_id: 44787,       // celo's id
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

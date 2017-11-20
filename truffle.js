require('babel-register')

var HDWalletProvider = require("truffle-hdwallet-provider");

var mnemonic = "";

module.exports = {
  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      network_id: '*',
      gas: 6700000
    },
    test: {
      host: '172.17.172.120',
      port: 8545,
      network_id: '*',
      gas: 4700000
    },
    ropsteninfura: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "https://ropsten.infura.io/jjkDnSWkGc5dQq37kDgt")
      },
      network_id: 3,
      gas: 4700000
    }
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 400
    }
  }
}
require('babel-register')

module.exports = {
  networks: {
    development: {
      host: '172.17.172.120',
      port: 8545,
      network_id: '*',
      gas: 4700000
    }
  }
}
require('babel-register')

module.exports = {
  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      network_id: '*',
      gas: 6700000,
      from: '0xd8ec2a42633ea7c8452a3b0ac85fe9855188b59b'
    },
    test: {
      host: '172.17.172.120',
      port: 8545,
      network_id: '*',
      gas: 4700000,
      from: '0x0ad5dbcf86382a2aa7a223a8fe28ad492182371a'
    }
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 400
    }
  }
}
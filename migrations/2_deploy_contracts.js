var SetherCrowdsale = artifacts.require("./SetherCrowdsale.sol");
//Testnet parameters
var startTime = web3.eth.getBlock(web3.eth.blockNumber).timestamp;
var endTime = startTime + 4 * 60 * 60;
var presaleLimit = startTime + 1 * 60 * 60;
var crowd1Limit = startTime + 1.45 * 60 * 60;
var crowd2Limit = startTime + 2.30 * 60 * 60;
var crowd3Limit = startTime + 3.15 * 60 * 60;
var disc1 = web3.toWei('1', 'ether');
var disc2 = web3.toWei('2', 'ether');
var rate = 300 / Math.pow(10, 18);
var wallet = '0x6c90d35cbb10c8f419c0c0f52dfd868a52edd169';
module.exports = function(deployer) {
  deployer.deploy(SetherCrowdsale, startTime, endTime, rate, wallet, presaleLimit, crowd1Limit, crowd2Limit, crowd3Limit);
};

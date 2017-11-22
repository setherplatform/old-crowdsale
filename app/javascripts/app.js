import 'bootstrap';
import "../stylesheets/app.css";
import 'bootstrap/dist/css/bootstrap.min.css';

import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

import sether_artifacts from '../../build/contracts/SetherCrowdsale.json'
import sether_token_artifacts from '../../build/contracts/SetherToken.json'
var dateFormat = require('dateformat');

var SetherCrowdsale = contract(sether_artifacts);
var SetherToken = contract(sether_token_artifacts);

var centralWallet;
var ownerWallet;
var defaultBuyer = '0xcc9385f23923b2206248ab24cba5ddf94bff4d4c';

window.App = {
  start: function() {
    console.log("Starting application");
    var self = this;

    // Bootstrap the crowdsale abstraction for Use.
    SetherCrowdsale.setProvider(web3.currentProvider);

    $('#loading').hide();
    $('#alert-error-div').hide();
    $('#alert-success-div').hide();
    $('#deploy-panel').hide();
    $('#buying-span').hide();
    $('#defaultBuyer').html(defaultBuyer);
    
    self.setStatus();
  },

  reloadPage: function() {
    window.location.reload();
  },

  closeError: function() {
    $('#alert-error-div').hide();
  },

  closeSuccess: function() {
    $('#alert-success-div').hide();
  },

  deploy: function() {
    $('#deploy-msg').removeClass('hidden');
  },

  buy: function() {
    console.log('Buying');
    var self = this;

    var contract;
    SetherCrowdsale.deployed().then(function(instance) {
      contract = instance;

      $('#buying-span').show();
      $('#btn-buy').hide();
      
      $('#alert-error-div').hide();
      $('#alert-success-div').hide();

      var _value = $('#amount').val() * Math.pow(10,18);
      var account = $('#account').val();
      var beneficiary = $('#beneficiary').val();
      if (!account || account == '') {
        account = defaultBuyer;
      }
      if (!beneficiary || beneficiary == '') {
        beneficiary = account;
      }
      console.log('Buying from account: '+account+' with value: '+_value+' for beneficiary: '+beneficiary);
      return contract.buyTokens(beneficiary, {from: account, value: _value});
    }).then(function(result) {
      console.log(result.receipt.status);
      $('#buying-span').hide();

      if (result.receipt.status == '0x0') {
        $('#alert-error').html("Buying failed.");
        $('#alert-error-div').show();
        $('#btn-buy').show();
      } else {
        $('#alert-success').html("Buying success.");
        $('#alert-success-div').show();
        $('#btn-buy').show();
      }
    }).catch(function(e) {
      console.log(e.message);
      $('#buying-span').hide();
      $('#btn-buy').show();

      $('#alert-error').html(e.message);
      $('#alert-error-div').show();
    });
  },

  verifyEth: function() {
    console.log('Verify ETH');
    var self = this;

    var contract;
    SetherCrowdsale.deployed().then(function(instance) {
      contract = instance;

      $('#alert-error-div').hide();
      $('#alert-success-div').hide();

      var account = $('#account-ve').val();
      web3.eth.getBalance(account, function(error, result) {
        $('#res-ve').html(web3.fromWei(result.toLocaleString())+' ETH');
      });

    }).catch(function(e) {
      console.log(e.message);
      $('#alert-error').html(e.message);
      $('#alert-error-div').show();
    });
  },

  verifySeth: function() {
    console.log('Verify SETH');
    var self = this;

    var contract;
    SetherCrowdsale.deployed().then(function(instance) {
      contract = instance;

      $('#alert-error-div').hide();
      $('#alert-success-div').hide();

      var tokenContract = web3.eth.contract(SetherToken.abi).at($('#taddress').html());
      var account = $('#account-vs').val();
      tokenContract.balanceOf(account, function(error, result) {
        $('#res-vs').html(web3.fromWei(result.toLocaleString())+' SETH');
      });

    }).catch(function(e) {
      console.log(e.message);
      $('#alert-error').html(e.message);
      $('#alert-error-div').show();
    });
  },

  unlock: function() {
    console.log('Unlocking');
    var self = this;

    $('#alert-error-div').hide();
    $('#alert-success-div').hide();

    SetherCrowdsale.deployed().then(function(instance) {
      console.log('Unlocking account: '+account);

      var pass = $('#upass').val();
      var account = $('#uaccount').val();

      return web3.personal.unlockAccount(account, pass, 15000)
    }).then(function(res) {
      if (res == true) {
        $('#alert-success').html("Account unlocked successfully.");
        $('#alert-success-div').show();
      } else {
        $('#alert-error').html("Account unlock error");
        $('#alert-error-div').show();
      }
    }).catch(function(e) {
      console.log(e.message);
      $('#alert-error').html(e.message);
      $('#alert-error-div').show();
    });
  },

  startCrowdsale: function() {
    console.log('Starting crowdsale');
    var self = this;

    var contract;
    SetherCrowdsale.deployed().then(function(instance) {
      contract = instance;

      $('#loading').show();
      $('#btn-start').hide();
      
      $('#alert-error-div').hide();
      $('#alert-success-div').hide();

      return contract.start({from: web3.eth.accounts[0]});
    }).then(function(result) {
      console.log(result.receipt.status);
      $('#loading').hide();

      if (result.receipt.status == '0x0') {
        $('#alert-error').html("Starting the crowdsale failed. You may not be the owner or you may have the account locked.");
        $('#alert-error-div').show();
        $('#btn-start').show();
      } else {
        $('#alert-success').html("Crowdsale started successfully.");
        $('#alert-success-div').show();
        $('#btn-start').hide();
      }
    }).catch(function(e) {
      console.log(e.message);
      $('#loading').hide();
      $('#btn-start').show();

      $('#alert-error').html(e.message);
      $('#alert-error-div').show();
    });
  },

  finalizeCrowdsale: function() {
    console.log('Finalizing crowdsale');
    var self = this;

    var contract;
    SetherCrowdsale.deployed().then(function(instance) {
      contract = instance;

      $('#loading').show();
      $('#btn-end').hide();
      
      $('#alert-error-div').hide();
      $('#alert-success-div').hide();

      return contract.finalize({from: web3.eth.accounts[0]});
    }).then(function(result) {
      console.log(result.receipt.status);
      $('#loading').hide();

      if (result.receipt.status == '0x0') {
        $('#alert-error').html("Finalizing the crowdsale failed. You may not be the owner or you may have the account locked.");
        $('#alert-error-div').show();
        $('#btn-end').show();
      } else {
        $('#alert-success').html("Crowdsale finalized successfully.");
        $('#alert-success-div').show();
        $('#btn-end').hide();
      }
    }).catch(function(e) {
      console.log(e.message);
      $('#loading').hide();
      $('#btn-end').show();

      $('#alert-error').html(e.message);
      $('#alert-error-div').show();
    });
  },

  getTransactionsByAccount: function(myaccount, startBlockNumber) {
    web3.eth.getBlockNumber(function(error, result){
      var endBlockNumber = result;
      if (startBlockNumber == null) {
        startBlockNumber = endBlockNumber - 1000;
        console.log("Using startBlockNumber: " + startBlockNumber);
      }
      console.log("Searching for transactions to account \"" + myaccount + "\" within blocks "  + startBlockNumber + " and " + endBlockNumber);
      
      var idx=0;
      var tokenContract = web3.eth.contract(SetherToken.abi).at($('#taddress').html());
      var share = {};
      for (var i = startBlockNumber; i <= endBlockNumber; i++) {
        web3.eth.getBlock(i, true, function(e, block) {
          if (block != null && block.transactions != null) {
            block.transactions.forEach( function(e) {
              if (myaccount == "*" || myaccount == e.to) {
                  idx++;
                  var _html = $('#tr-table').html();
                  _html = '<tr><th scope="row">'+idx+'</th><td>'+e.from+'</td><td>'+web3.fromWei(e.value)+' ETH</td></tr>' + _html;
                  $('#tr-table').html(_html);

                  tokenContract.balanceOf(e.from, function(error, result) {
                    var _html = $('#sh-table').html();
                    if (_html.indexOf(e.from) < 0) {
                      _html = '<tr><td>'+e.from+'</td><td>'+web3.fromWei(result.toLocaleString())+' SETH</td></tr>' + _html;
                    }
                    $('#sh-table').html(_html);
                  });
              }
            })
          }
        });
      }
    });
  },

  setStatus: function() {
    var self = this;

    $("#stat-not-started").hide();
    $("#stat-in-progress").hide();
    $("#stat-not-finalized").hide();
    $("#stat-finalized").hide();
    $("#btn-start").hide();
    $("#btn-end").hide();

    var contract;
    var tokenContract;
    var started = false;
    var finalized = false;
    var tokenAddress;
    console.log("Loading contract status");
    SetherCrowdsale.deployed().then(function(instance) {
      contract = instance;

      

      var events = contract.SethTokenPurchase();
      events.watch(function(error, event) {
        if (!error) {
          console.log(event.args.beneficiary+' '+event.args.value);
          var _html = $('#events-holder').html();
          _html = ' <div class="alert alert-warning alert-dismissible" role="alert">'+
                  '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>'+
                  '<strong>SethTokenPurchase&nbsp;</strong>'+event.args.beneficiary+' : '+web3.fromWei(event.args.value.toLocaleString())+' ETH</div>' 
                  + _html;
          $('#events-holder').html(_html);
        }
      });

      return contract.isStarted.call();
    }).then(function(isStarted) {
      started = isStarted;
      return contract.isFinalized.call();
    }).then(function(isFinalized) {
      finalized = isFinalized;
      return contract.hasEnded();
    }).then(function(isEnded) {
      if (!started) {
        $("#stat-not-started").show();
        $("#btn-start").show();
      } else if (started && !isEnded) {
        $("#stat-in-progress").show();
      } else if (isEnded && !finalized) {
        $("#stat-not-finalized").show();
        $("#btn-end").show();
      } else if (isEnded && finalized) {
        $("#stat-finalized").show();
      }

      return contract.startTime.call();
    }).then(function(startTime) {
      if (startTime.c[0] == 0) {
        $("#time-start").html("N/A");
      } else {
        var _date = new Date(startTime.c[0] * 1000);
        $("#time-start").html(dateFormat(_date, "dd/mm/yyyy HH:MM"));
      }
      return contract.endTime.call();
    }).then(function(endTime) {
      if (endTime.c[0] == 0) {
        $("#time-end").html("N/A");
      } else {
        var _date = new Date(endTime.c[0] * 1000);
        $("#time-end").html(dateFormat(_date, "dd/mm/yyyy HH:MM"));
      }
      return contract.limitDatePresale.call();
    }).then(function(limitDatePresale) {
      if (limitDatePresale.c[0] == 0) {
        $("#time-presale").html("N/A");
      } else {
        var _date = new Date(limitDatePresale.c[0] * 1000);
        $("#time-presale").html(dateFormat(_date, "dd/mm/yyyy HH:MM"));
      }
      return contract.limitDateCrowdWeek1.call();
    }).then(function(limitDateCrowdWeek1) {
      if (limitDateCrowdWeek1.c[0] == 0) {
        $("#time-cs1").html("N/A");
      } else {
        var _date = new Date(limitDateCrowdWeek1.c[0] * 1000);
        $("#time-cs1").html(dateFormat(_date, "dd/mm/yyyy HH:MM"));
      }
      return contract.limitDateCrowdWeek2.call();
    }).then(function(limitDateCrowdWeek2) {
      if (limitDateCrowdWeek2.c[0] == 0) {
        $("#time-cs2").html("N/A");
      } else {
        var _date = new Date(limitDateCrowdWeek2.c[0] * 1000);
        $("#time-cs2").html(dateFormat(_date, "dd/mm/yyyy HH:MM"));
      }
      return contract.limitDateCrowdWeek3.call();
    }).then(function(limitDateCrowdWeek3) {
      if (limitDateCrowdWeek3.c[0] == 0) {
        $("#time-cs3").html("N/A");
      } else {
        var _date = new Date(limitDateCrowdWeek3.c[0] * 1000);
        $("#time-cs3").html(dateFormat(_date, "dd/mm/yyyy HH:MM"));
      }

      $('#caddress').html(contract.address);
      return contract.token.call();
    }).then(function(tadd) {
      $('#taddress').html(tadd);
      tokenAddress = tadd;
      return contract.wallet.call();
    }).then(function(wall) {
      $('#cwallet').html(wall);
      centralWallet = wall;
      return contract.rate.call();
    }).then(function(rate) {
      $('#rate').html(rate.toLocaleString());
      return contract.owner.call();
    }).then(function(oadd) {
      $('#oaddress').html(oadd);
      ownerWallet = oadd;
      return contract.weiRaised.call();
    }).then(function(wei) {
      $('#ethraised').html(web3.fromWei(wei.toLocaleString())+' ETH');
      tokenContract = web3.eth.contract(SetherToken.abi).at(tokenAddress);
      tokenContract.totalSupply.call(function(error, result) {
        $('#minted').html(web3.fromWei(result.toLocaleString())+' SETH');
      });
      web3.eth.getBalance(centralWallet, function(error, result) {
        $('#ethcentral').html(web3.fromWei(result.toLocaleString())+' ETH');
      });
      web3.eth.getBalance(ownerWallet, function(error, result) {
        $('#ethowner').html(web3.fromWei(result.toLocaleString())+' ETH');
      });
      tokenContract.balanceOf(centralWallet, function(error, result) {
        $('#sethcentral').html(web3.fromWei(result.toLocaleString())+' SETH');
      });
      web3.eth.getBalance(defaultBuyer, function(error, result) {
        $('#ethdefault').html(web3.fromWei(result.toLocaleString())+' ETH');
      });
      tokenContract.balanceOf(defaultBuyer, function(error, result) {
        $('#sethdefault').html(web3.fromWei(result.toLocaleString())+' SETH');
      });
      self.getTransactionsByAccount(contract.address);
    }).catch(function(e) {
      console.log(e);
      $('#alert-error').html(e.message);
      $('#alert-error-div').show();

      if (e.message == 'Contract has not been deployed to detected network (network/artifact mismatch)') {
        console.log('Need to deploy');
        $('#main-panel').hide();
        $('#deploy-panel').show();
      }
    });
  }
};

window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source.")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to own infura.");
    window.web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/jjkDnSWkGc5dQq37kDgt"));
  }

  App.start();
});

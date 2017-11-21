import 'bootstrap';
import "../stylesheets/app.css";
import 'bootstrap/dist/css/bootstrap.min.css';

import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

import sether_artifacts from '../../build/contracts/SetherCrowdsale.json'
var dateFormat = require('dateformat');

var SetherCrowdsale = contract(sether_artifacts);

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
      if (!account || account == '') {
        account = '0xcc9385f23923b2206248ab24cba5ddf94bff4d4c';
      }
      console.log('Buying from account: '+account+' with value: '+_value);
      return contract.buyTokens(account, {from: account, value: _value});
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

  setStatus: function() {
    var self = this;

    $("#stat-not-started").hide();
    $("#stat-in-progress").hide();
    $("#stat-not-finalized").hide();
    $("#stat-finalized").hide();
    $("#btn-start").hide();
    $("#btn-end").hide();

    var contract;
    var started = false;
    var finalized = false;
    console.log("Loading contract status");
    SetherCrowdsale.deployed().then(function(instance) {
      contract = instance;
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
      return contract.wallet.call();
    }).then(function(wall) {
      $('#cwallet').html(wall);
      return contract.rate.call();
    }).then(function(rate) {
      $('#rate').html(rate.toLocaleString());
      return contract.owner.call();
    }).then(function(oadd) {
      $('#oaddress').html(oadd);
      return contract.weiRaised.call();
    }).then(function(wei) {
      $('#ethraised').html(web3.fromWei(wei.toLocaleString()));
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

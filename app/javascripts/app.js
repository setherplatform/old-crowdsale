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
    var self = this;

    // Bootstrap the crowdsale abstraction for Use.
    SetherCrowdsale.setProvider(web3.currentProvider);

    self.setStatus();
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
      var _date = new Date(startTime.c[0] * 1000);
      $("#time-start").html(dateFormat(_date, "dd/mm/yyyy HH:MM"));
      return contract.endTime.call();
    }).then(function(endTime) {
      var _date = new Date(endTime.c[0] * 1000);
      $("#time-end").html(dateFormat(_date, "dd/mm/yyyy HH:MM"));
      return contract.limitDatePresale.call();
    }).then(function(limitDatePresale) {
      var _date = new Date(limitDatePresale.c[0] * 1000);
      $("#time-presale").html(dateFormat(_date, "dd/mm/yyyy HH:MM"));
      return contract.limitDateCrowdWeek1.call();
    }).then(function(limitDateCrowdWeek1) {
      var _date = new Date(limitDateCrowdWeek1.c[0] * 1000);
      $("#time-cs1").html(dateFormat(_date, "dd/mm/yyyy HH:MM"));
      return contract.limitDateCrowdWeek2.call();
    }).then(function(limitDateCrowdWeek2) {
      var _date = new Date(limitDateCrowdWeek2.c[0] * 1000);
      $("#time-cs2").html(dateFormat(_date, "dd/mm/yyyy HH:MM"));
      return contract.limitDateCrowdWeek3.call();
    }).then(function(limitDateCrowdWeek3) {
      var _date = new Date(limitDateCrowdWeek3.c[0] * 1000);
      $("#time-cs3").html(dateFormat(_date, "dd/mm/yyyy HH:MM"));
    }).catch(function(e) {
      console.log(e);
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

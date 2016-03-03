;(function (global, factory) {
  var isModule = typeof exports === 'object' && typeof module !== 'undefined';
  var isAMD    = typeof define === 'function' && define.amd;
  var isGlobal = !isModule && !isAMD;

  if (isAMD) define(factory);
  if (isModule) module.exports = factory();
  if (isGlobal) global.trackingAnalytics = factory();
}(this, function () {
  'use strict';

  var xhttp;

  if (window.XMLHttpRequest) {
    xhttp = new XMLHttpRequest();
  } else {
    xhttp = new ActiveXObject("Microsoft.XMLHTTP");
  }

  var trackingAnalytics = {
    sendActivity: function(name, reference) {
      console.log(document.cookie);
      xhttp.open("POST", "//tracking-server.herokuapp.com/activities", true);
      xhttp.setRequestHeader("Content-type", "application/json");
      xhttp.send(JSON.stringify({ name: name, reference: reference, cid: 'sdladklasd', hid: 'kajskdjasd' }));
      console.log('SUCESSO::', name, reference);
    },

    sendContact: function(name, reference) {
      console.log('SUCESSO::', name, reference);
    }
  };

  return trackingAnalytics;
}));

;(function (global, factory) {
  var isModule = typeof exports === 'object' && typeof module !== 'undefined';
  var isAMD    = typeof define === 'function' && define.amd;
  var isGlobal = !isModule && !isAMD;

  if (isAMD) define(factory);
  if (isModule) module.exports = factory();
  if (isGlobal) global.trackingAnalytics = factory();
}(this, function () {
  'use strict';

  var trackingAnalytics = {
    sendActivity: function(name, reference) {
      console.log('SUCESSO::', name, reference);
    },

    sendContact: function(name, reference) {
      console.log('SUCESSO::', name, reference);
    }
  };

  return trackingAnalytics;
}));

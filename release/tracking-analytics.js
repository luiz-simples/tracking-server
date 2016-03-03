/*globals window:false, document:false */
;(function(window, document) {
  // Strict Mode
  'use strict';

  var trackingAnalytics = {
    sendActivity: function(name, reference) {
      console.log('SUCESSO::', name, reference);
    }
  };

  // Tracking Analytics
  window['ta'] = trackingAnalytics;
  window['trackingAnalytics'] = trackingAnalytics;
})(window, document);

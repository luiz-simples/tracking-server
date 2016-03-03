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

  function guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }

  // Create cookie
  function createCookie(name, value, days) {
      var expires;
      if (days) {
          var date = new Date();
          date.setTime(date.getTime()+(days*24*60*60*1000));
          expires = "; expires="+date.toGMTString();
      }
      else {
          expires = "";
      }
      document.cookie = name+"="+value+expires+"; path=/";
  }

  // Read cookie
  function readCookie(name) {
      var nameEQ = name + "=";
      var ca = document.cookie.split(';');
      for(var i=0;i < ca.length;i++) {
          var c = ca[i];
          while (c.charAt(0) === ' ') {
              c = c.substring(1,c.length);
          }
          if (c.indexOf(nameEQ) === 0) {
              return c.substring(nameEQ.length,c.length);
          }
      }
      return null;
  }

  // Erase cookie
  function eraseCookie(name) {
      createCookie(name,"",-1);
  }

  var cookieName = 'tracking-server-cid';
  var cookieId   = readCookie(cookieName);
  if (!cookieId) {
    cookieId = guid();
    createCookie(cookieName, cookieId);
  }

  var trackingAnalytics = {
    sendActivity: function(name, reference) {
      console.log(cookieId);
      xhttp.open("POST", "//tracking-server.herokuapp.com/activities", true);
      xhttp.setRequestHeader("Content-type", "application/json");
      xhttp.send(JSON.stringify({ name: name, reference: reference, cid: cookieId, hid: 'kajskdjasd' }));
      console.log('SUCESSO::', name, reference);
    },

    sendContact: function(name, reference) {
      console.log('SUCESSO::', name, reference);
    }
  };

  return trackingAnalytics;
}));

/**
 ----------- GEOLOCATION FALLBACK FOR CHROME / ANDROID BROWSERS ------------
 Version: 1.0.0
  Author: Isaac Ng
 Website: https://github.com/izuro
    Docs: https://github.com/izuro/geolocfallback
    Repo: https://github.com/izuro/geolocfallback
  Issues: https://github.com/izuro/geolocfallback/issues

##Description
Google Chrome / Android platforms are slowly transitioning to require HTTPS for Geolocation functions. If you are receiving this warning:
`getCurrentPosition() and watchPosition() are deprecated on insecure origins. To use this feature, you should consider switching your application to a secure origin, such as HTTPS. See https://goo.gl/rStTGz for more details.`
then this quick plugin should help without needing to use HTTPS

##References
http://stackoverflow.com/questions/32106849/getcurrentposition-and-watchposition-are-deprecated-on-insecure-origins
http://jsfiddle.net/gogs/jwt9f1o3/

Credits go to @gogson on stackoverflow

##Usage:
1. Get Google Maps API Key - https://developers.google.com/maps/documentation/geolocation/intro
2. include 
  `<script type="text/javascript" src="//code.jquery.com/jquery-1.11.0.min.js"></script>
  <script type="text/javascript" src="//code.jquery.com/jquery-migrate-1.2.1.min.js"></script>
  <script type="text/javascript" src="jquery.geoloc-fallback.js" />`
3. Init object:
  
  `var geolocfb = $('body').geolocfb({
    apikey: YOUR_API_KEY
    // , success: function(position){}      // optional
    // , error: function(error, errorMsg){}   // optional
  });`

4. Use geolocfb, overwrite callback functions if needed

  `geolocfb.geoloc(
    function(position){},         //optional
    function(error, errorMsg){}   //optional
  );`
 
 */

/* Inject with jQuery */
/* global window, document, define, jQuery, setInterval, clearInterval */
(function(factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports !== 'undefined') {
        module.exports = factory(require('jquery'));
    } else {
        factory(jQuery);
    }
}(function($) {
  'use strict';
  // Define variable
  var Gelocfallback = window.Gelocfallback || {};
  
  // Init
  Gelocfallback = (function() {
      var instanceUid = 0;
      function Gelocfallback(element, settings) {
        var _ = this;

        _.defaults = {
          google_maps_api_url: 'https://www.googleapis.com/geolocation/v1/geolocate',
          apikey: '',
          success: function(position){},
          error: function(error, errorMsg){}
        };
        _.options = $.extend({}, _.defaults, settings);
      }
      return Gelocfallback;
  }());

  /* ----------- Inheritable prototype functions ------------ */
  Gelocfallback.prototype.apiGeolocationSuccess = function(position) {
    var _ = this;

    _.options.success(position);
  	console.info("API geolocation success!\n\nlat = " + position.coords.latitude + "\nlng = " + position.coords.longitude);
  };

  Gelocfallback.prototype.tryAPIGeolocation = function() {
    var _ = this;

    if(_.options.apikey == undefined || _.options.apikey == ''){
      console.warn('No Google Maps API key found! Please initialise with the API Key');
      return false;
    }

    var url = _.options.google_maps_api_url + '?key=' + _.options.apikey;
  	$.post( url, function(success) {
      // Build a consistent position object as browser
      var position = {coords: {latitude: success.location.lat, longitude: success.location.lng}};
  		_.apiGeolocationSuccess(position);
    })
    .fail(function(err) {
      _.options.error(err);
      console.warn("API Geolocation error! \n\n"+err, err.responseText);
    });
  };

  Gelocfallback.prototype.browserGeolocationSuccess = function(position) {
    var _ = this;
    _.options.success(position);
  	console.info("Browser geolocation success!\n\nlat = " + position.coords.latitude + "\nlng = " + position.coords.longitude);
  };

  Gelocfallback.prototype.browserGeolocationFail = function(error) {
    var _ = this;

    var errMsg = '';
    switch (error.code) {
      case error.TIMEOUT:
        errMsg = "Browser geolocation error !\n\nTimeout.";
        console.warn(errMsg);
        _.options.error(error, errMsg);
        break;
      case error.PERMISSION_DENIED:
        if(error.message.indexOf("Only secure origins are allowed") == 0) {
          _.tryAPIGeolocation();
        }
        break;
      case error.POSITION_UNAVAILABLE:
        errMsg = "Browser geolocation error !\n\nPosition unavailable."
        console.warn(errMsg);
        _.options.error(error, errMsg);
        break;
    }
  };

  $.fn.geolocfb = function() {
      var _ = this,
          opt = arguments[0],
          args = Array.prototype.slice.call(arguments, 1),
          l = _.length,
          i,
          ret;
      for (i = 0; i < l; i++) {
          if (typeof opt == 'object' || typeof opt == 'undefined')
              _[i].geolocfb = new Gelocfallback(_[i], opt);
          else
              ret = _[i].geolocfb[opt].apply(_[i].geolocfb, args);
          if (typeof ret != 'undefined') return ret;
      }
      if(l==1){
        return _[0].geolocfb;
      }
      return _;   
  };
  
  Gelocfallback.prototype.getGeoLocation = function(successCallback, errorCallback) {
    var _ = this;

    if (navigator.geolocation) {
      _.options.success = successCallback ? successCallback : _.options.success;
      _.options.error = errorCallback ? errorCallback : _.options.error;

      navigator.geolocation.getCurrentPosition(
        function(position){  // we use an anonymous function so _ is correct
          _.browserGeolocationSuccess(position)
        },
        function(error){  // we use an anonymous function so _ is correct
          _.browserGeolocationFail(error)
        },
        {maximumAge: 50000, timeout: 20000, enableHighAccuracy: true});
    } else {
      console.warn("Your browser does not support Geolocation");
      return false;
    }
    
    return true;
  };

}));
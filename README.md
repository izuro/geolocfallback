# jQuery Geolocation Fallback
jQuery Geolocation Fallback for Chrome / Android Browsers

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
  ```
  <script type="text/javascript" src="//code.jquery.com/jquery-1.11.0.min.js"></script>
  <script type="text/javascript" src="//code.jquery.com/jquery-migrate-1.2.1.min.js"></script>
  <script type="text/javascript" src="jquery.geoloc-fallback.js" />
  ```
  
3. Init object:
  ```javascript
  var geolocfb = $('body').geolocfb({  
    apikey: YOUR_API_KEY  
    // , success: function(position){}      // optional  
    // , error: function(error, errorMsg){}   // optional  
  });
  ```

4. Use geolocfb, overwrite callback functions if needed
  ```javascript
  geolocfb.geoloc(  
    function(position){},         //optional  
    function(error, errorMsg){}   //optional  
  );
  ```

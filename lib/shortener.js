var db = require('redis').createClient();
var crypto = require('crypto');

/* Redis key prefix for this shortener (for namespacing purposes). */
var REDIS_SHORTENER_PREFIX = 'shortener:';

/* Number of random bytes to generate for a code. */
var NUM_RANDOM_BYTES_IN_CODE = 3;

/* Redis key that corresponds to a map of shortener code -> URL. */
var SHORTENED_URLS_MAP_KEY = REDIS_SHORTENER_PREFIX + 'map';

/* Shortens the given URL. Calls the callback with a random code that is
 * mapped to the URL. 
 *
 * Arguments:
 * url -- the URL to shorten
 */
exports.shortenURL = function(url, callback) {
  // generate short code
  crypto.randomBytes(NUM_RANDOM_BYTES_IN_CODE, function(error, bytes) {
    if (error) {
      throw error;
    }

    // associate code with URL
    var code = bytes.toString('hex');
    db.set(REDIS_SHORTENER_PREFIX + code, url, function(error) {
      console.log('set ' + code + ' to ' + url);
      if (error) {
        throw error;
      }

      trackNewShortenedURL(code, url, function() {
        callback(code);
      });
    });
  });
};

/* Expands the given random code. Calls the callback with the associated URL.
 *
 * Arguments:
 * code -- the code to expand
 */
exports.expandCode = function(code, callback) {
  db.get(REDIS_SHORTENER_PREFIX + code, function(error, url) {
    if (error) {
      throw error;
    }

    callback(url);
  });
};


/* Returns an object of URL -> shortened code pairs. Each pair is represented by
 * an object with `code` and `url` properties.
 *
 * Arguments:
 * callback -- the function to call with the array of shortened URLs
 */
exports.getShortenedURLs = function(callback) {
  db.get(SHORTENED_URLS_MAP_KEY, function(error, urlMap) {
    if (urlMap === null) {
      callback({});
    } else {
      callback(JSON.parse(urlMap));
    }
  });
};

/* Keep track of this code to URL mapping in Redis. Call the given callback
 * when finished.
 *
 * Arguments:
 * code/url -- the code/URL mapping to record
 * callback -- the callback to call once finished
 */
function trackNewShortenedURL(code, url, callback) {
  db.get(SHORTENED_URLS_MAP_KEY, function(error, urlMap) {
    if (error) {
      throw error;
    }

    // decode map
    if (urlMap === null) {
      urlMap = {};
    } else {
      urlMap = JSON.parse(urlMap);
    }

    // add code -> URL mapping and save
    urlMap[url] = code;
    db.set(SHORTENED_URLS_MAP_KEY, JSON.stringify(urlMap), function(error) {
      if (error) {
        throw error;
      }

      callback();
    });
  });
}

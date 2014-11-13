var crypto = require('crypto');

// set up database connection
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/url-shortener');

// ShortCode model to interact with MongoDB
var shortCodeSchema = mongoose.Schema({
  url: String,
  code: String
});
var ShortCode = mongoose.model('ShortCode', shortCodeSchema);

// number of random bytes to generate for a code
var NUM_RANDOM_BYTES_IN_CODE = 3;

/**
 * Shortens the given URL.
 * @param url -- the URL to shorten
 *
 * Calls callback(error, code):
 * @param error -- an error if one occurred, or null otherwise
 * @param code -- if error is null, the code that maps to the given URL
 */
exports.shortenURL = function(url, callback) {
  // generate short code
  crypto.randomBytes(NUM_RANDOM_BYTES_IN_CODE, function(error, bytes) {
    if (error) {
      callback(error);
      return;
    }

    // associate code with URL
    var code = bytes.toString('hex');
    var shortCode = new ShortCode({
      url: url,
      code: code
    });

    shortCode.save(function(error) {
      if (error) {
        callback(error);
      } else {
        callback(null, code);
      }
    });
  });
};

/**
 * Expands the given random code.
 * @param code -- the code to expand
 *
 * Calls callback(error, url):
 * @param error -- an error if one occurred, or null otherwise
 * @param url -- if error is null, the URL that maps to the code
 */
exports.expandCode = function(code, callback) {
  ShortCode.findOne({ code: code }, function(error, code) {
    if (error) {
      callback(error);
    } else {
      callback(null, code.url);
    }
  });
};

/**
 * Returns a list of ShortCode models. 
 *
 * Calls callback(error, shortCodes):
 * @param error -- an error if one occurred, or null otherwise
 * @param shortCodes -- if error is null, an array of ShortCode models
 */
exports.getShortCodes = function(callback) {
  ShortCode.find(function(error, codes) {
    if (error) {
      callback(error);
    } else {
      callback(null, codes);
    }
  });
};

var shortener = require('../lib/shortener');

/**
 * Creates the routes for the given express application.
 *
 * @param app - the express application
 * @param nconf - the configuration settings
 */
module.exports = function(app, nconf) {
  app.get('/', function(request, response) {
    shortener.getShortenedURLs(function(urlMap) {
      response.render('index', { urlMap: urlMap });
    });
  });

  app.get('/:code', function(request, response) {
    var code = request.params.code;

    shortener.expandCode(code, function(url) {
      if (url) {
        response.redirect(url);
      } else {
        response.redirect('/');
      }
    });
  });

  app.post('/shorten', function(request, response) {
    var url = request.body.url;

    if (url) {
      shortener.shortenURL(url, function(code) {
        response.redirect('/');
      });
    } else {
      response.redirect('/');
    }
  });
};

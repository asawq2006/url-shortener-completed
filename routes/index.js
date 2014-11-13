var shortener = require('../lib/shortener');

/**
 * Creates the routes for the given express application.
 *
 * @param app - the express application
 */
module.exports = function(app) {
  app.get('/', function(request, response) {
    if (request.query.code) {
      shortener.expandCode(request.query.code, function(error, url) {
        if (error || !url) {
          response.redirect('/');
        } else {
          response.redirect(url);
        }
      });
    } else {
      response.render('index.html'); 
    }
  });

  app.get('/short-codes', function(request, response) {
    sendShortCodes(response);
  });

  app.post('/short-codes', function(request, response) {
    var url = request.body.url;
    if (!url) {
      response.send(422, 'Must provide url parameter.');
      return;
    }

    shortener.shortenURL(url, function(error, code) {
      if (error) {
        throw error;
      }

      sendShortCodes(response);
    });
  });

  /* Fetches the short codes from MongoDB and sends them to the client. */
  function sendShortCodes(response) {
    shortener.getShortCodes(function(error, shortCodes) {
      if (error) {
        throw error;
      }

      response.json(200, shortCodes);
    });
  }
};

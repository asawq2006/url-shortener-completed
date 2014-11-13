var utils = require('./lib/utils');
var ejs = require('ejs');

/**
 * Sets up the given express application.
 *
 * @param app - the express application
 * @param express - the express library
 */
module.exports = function(app, express) {
  app.configure(function(){
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.set('view options', { layout: false });
    app.engine('html', ejs.renderFile);

    app.use(express.bodyParser());
    app.use(express.methodOverride());

    app.use(express.static(__dirname + '/public'));
    app.use(app.router);

    // last handler; assume 404 at this point 
    app.use(utils.render404);
  });

  app.configure('development', function() {
    app.use(express.errorHandler({
      dumpExceptions: true,
      showStack: true
    }));
  });

  app.configure('production', function() {
    app.use(express.errorHandler());
  });
};

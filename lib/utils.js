/**
 * Render a 404 response page.
 *
 * @param request - the web request object
 * @param response - the web response object
 */
exports.render404 = function(request, response) {
  response.status(404);
  response.render('not-found.html');
};

// no operation placeholder for empty callbacks
exports.noOperation = function() {};

"use strict";
var express = require('express');
var app = express();

require('./settings')(app, express);
require('./routes')(app);

var port = process.env.PORT || 3155;
console.log('Listening at 127.0.0.1:' + port);
app.listen(port);

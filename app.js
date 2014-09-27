"use strict";
var express = require('express');
var app = express();

var nconf = require('nconf');
nconf.argv().env().file({ file: 'local.json' });

require('./settings')(app, express, nconf);
require('./routes')(app, nconf);

var port = process.env.PORT || nconf.get('port');
console.log('Listening at 127.0.0.1:' + port);
app.listen(port);

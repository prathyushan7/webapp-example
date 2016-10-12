'use strict';

var express = require('express');
var os = require('os');
var redis = require('redis');
var app = express();
var PORT = process.env.PORT || 8081;

var client = redis.createClient('6379', 'redis');

console.log('Connected to redis sevice at redis:6379');

app.get('/', function (req, res) {
  client.incr('counter', function(err, counter) {
    if (err) {
      console.err(err.toString());
      return next(err);
    }

    res.send('This page has been viewed ' + counter + ' times. Currently viewing on ' + os.hostname() + '\n');
  });
});

app.listen(PORT);

console.log('Running on http://' + os.hostname() + ':' + PORT);

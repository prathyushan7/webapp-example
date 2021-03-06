'use strict';

var express = require('express');
var os = require('os');
var redis = require('redis');
var app = express();
var PORT = process.env.PORT || 8081;

var options = {
  retry_strategy: function(options) {
    if (options.error.code === 'ECONNREFUSED') {
      return new Error('The server refused the connection');
    }

    if (options.total_retry_time > 1000 * 60 * 60) {
      return new Error('Retry time exhausted');
    }

    if (options.times_connected > 10) {
      return undefined;
    }

    return Math.max(options.attempt * 100, 3000);
  }
}

app.get('/', function (req, res, next) {

  var client = redis.createClient('6379', 'redis', options);
  
  client.on('connect', function(err) {
    console.log('Connected to redis service at redis:6379');
  });
  
  client.on('error', function(err) {
    console.error('RedisClientError: ' + err);
  });
  
  client.on('end', function(err) {
    console.log('Redis connection has been closed');
  });

  client.incr('counter', function(err, counter) {
    if (err) {
      console.error('IncrementationError');
      client.quit();
      return next(err);
    }

    var response = 'This page has been viewed ' + counter + ' times.<br>\n' +
                   'Currently viewing on ' + os.hostname() + '<br><br>\n\n' +
                   '<a href="http://ec2-54-186-148-69.us-west-2.compute.amazonaws.com:8082/">Visualizer 1</a><br>\n' +
                   '<a href="http://ec2-54-244-143-90.us-west-2.compute.amazonaws.com:8082/">Visualizer 2</a><br>\n';

    res.send(response);

    client.quit();
  });
});

app.listen(PORT);

console.log('Running on http://' + os.hostname() + ':' + PORT);

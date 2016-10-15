'use strict';

var express = require('express');
var os = require('os');
var redis = require('redis');
var http = require('http');
var async = require('async');
var app = express();
var PORT = process.env.PORT || 8081;

var client = redis.createClient('6379', 'redis');

client.on('end', function(err) {
  process.exit(4);
});

console.log('Connected to redis sevice at redis:6379');

app.get('/', function (req, res) {
  client.incr('counter', function(err, counter) {
    if (err) {
      console.err(err.toString());
      return next(err);
    }

    var response = 'This page has been viewed ' + counter + ' times.<br>\n' +
                   'Currently viewing on ' + os.hostname() + '<br><br>\n\n' +
                   '<a href="http://ec2-54-244-136-163.us-west-2.compute.amazonaws.com:8082/">Visualizer 1</a><br>\n' +
                   '<a href="http://ec2-54-244-26-18.us-west-2.compute.amazonaws.com:8082/">Visualizer 2</a><br>\n';

    res.send(response);
  });
});

app.get('/health-check', function(req, res) {
  client.incr('counter', function(err, counter) {
    if (err) {
      console.err(err.toString());
      process.exit(3);
      return next(err);
    }
  }

  res.send('healthy');
});

var options = {
  host: 'broboticsforever.com',
  port: 80,
  path: '/health-check',
  method: 'GET'
}

function healthCheck() {
  var returnString = '';

  http.request(options, function(res) {
    console.log('STATUS: ' + res.statusCode);
    console.log('HEADERS: ' + JSON.stringify(res.headers));

    res.setEncoding('utf8');

    res.on('data', function (chunk) {
      returnString += chunk;
      console.log('BODY: ' + chunk);
    });

    return returnString;
  });
}

function getHealth() {
  var promise = new Promise(function(resolve, reject) {
    window.setTimeout(healthCheck, 3000);
  });

  return promise;
}

app.listen(PORT);

console.log('Running on http://' + os.hostname() + ':' + PORT);

var exitStatus = 0;

async.whilst(function() {
  return exitStatus == 0;
}, function(next) {
  getHealth().then(function(h) {
    if (h != 'healthy') {
      exitStatus = 1;
    }
    next();
  });
}, function(err) {
  if (err) {
    console.log(err.toString());
    process.exit(2);
  }

  process.exit(1);
});

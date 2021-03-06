require('dotenv').config();
var loopback = require('loopback');
var boot = require('loopback-boot');
var Promise = require('bluebird');
var session = require('express-session');
global.Promise = Promise;

var app = (module.exports = loopback());

app.use(function(req, res, next) {
  res.header('Access-Control-Expose-Headers', 'x-total-count');
  next();
});

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) console.error(err);

  // start the server if `$ node server.js`
  if (require.main === module) {
    app.io = require('socket.io')(app.start());

    app.io.on('error', err => {
      console.error('SOCKET IO', err);
    });
  }
});

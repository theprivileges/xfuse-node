(function() {
  var XFuse, exports, https, qs;

  https = require('https');

  qs = require('querystring');

  XFuse = function(key) {
    var doRequest, get;
    if (key === null) {
      throw new Error('XFuse needs a valid API Key');
    } else {
      this._key;
    }
    doRequest = function(path, method, args, callback) {
      var options, request;
      if (path == null) path = '/';
      if (method == null) method = 'GET';
      if (path.charAt(0 !== '/')) path = '/' + path;
      path = path + '?' + qs.stringify(args);
      options = {
        host: 'mycompany.labs.memberfuse.com',
        method: method,
        auth: this._key + ':',
        path: path,
        headers: {
          'Accept': 'application/json'
        }
      };
      request = https.request(options, function(res) {
        var body;
        res.setEncoding('utf8');
        body = [];
        res.on('data', function(chunk) {
          return body.push(chunk);
        });
        res.on('end', function() {
          var data, error;
          try {
            return JSON.parse(body.join(''));
          } catch (e) {
            data = null;
            return error = e;
          }
        });
        if (data && data.error) {
          return callback(data.error, null);
        } else if (data) {
          return callback(null, data);
        } else {
          return callback(error, null);
        }
      });
      request.on('error', function(error) {
        console.error(error);
        callback(error, null);
      });
    };
    get = function(path, callback) {
      doRequest(path, 'GET', null, callback);
    };
  };

  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = XFuse;
    }
    exports.XFuse = XFuse;
  } else {
    this.XFuse = XFuse;
  }

}).call(this);

/*
copyright (c) 2012 Avectra, Inc.
*/
var XFuse, apiToken, apiUrl, https, qs, siteUrl;

https = require('https');

qs = require('querystring');

exports.version = '0.0.8';

apiToken = null;

siteUrl = null;

apiUrl = '/api/rest/1.0';

XFuse = (function() {

  function XFuse(method, url, postData, callback) {
    if (postData == null) postData = {};
    if (callback == null) callback = function() {};
    if (typeof postData === 'function') {
      callback = postData;
      postData = {};
    }
    url = apiUrl + this.cleanUrl(url);
    this.callback = callback;
    this.postData = JSON.stringify(postData);
    this.options = this.options || {};
    this.options.host = siteUrl;
    this.options.auth = apiToken + ':';
    this.options.method = method;
    this.options.path = url;
    this[method.toLowerCase()]();
    return this;
  }

  XFuse.prototype.cleanUrl = function(url) {
    if (url.charAt(0) !== '/') url = '/' + url;
    return url;
  };

  XFuse.prototype.end = function(body) {
    var err, json;
    if (body && typeof body === 'string') {
      try {
        json = JSON.parse(body);
      } catch (e) {
        err = {
          message: 'Error parsing json',
          exception: e
        };
      }
    }
    if (!err && (json && json.error)) err = json.error;
    this.callback(err, json);
  };

  XFuse.prototype.get = function() {
    var _this = this;
    https.get(this.options, function(res) {
      var body;
      if (res.statusCode !== 200) {
        _this.callback({
          message: 'Request could not be interpreted by the server',
          exception: Error
        }, null);
        return;
      }
      body = '';
      res.setEncoding('utf8');
      res.on('data', function(chunk) {
        body += chunk;
      });
      res.on('end', function() {
        _this.end(body);
      });
    }).on('error', function(e) {
      _this.callback(e, null);
    });
  };

  XFuse.prototype.post = function() {
    var req,
      _this = this;
    req = https.request(this.options, function(res) {
      var body;
      body = '';
      res.setEncoding('utf8');
      res.on('data', function(chunk) {
        body += chunk;
      });
      res.on('end', function() {
        _this.end(body);
      });
    });
    req.on('error', function(e) {
      _this.callback(e, null);
    });
    req.setHeader('Content-Type', 'application/json');
    req.setHeader('Content-Length', this.postData.length);
    req.end(this.postData, 'utf8');
  };

  XFuse.prototype.put = function() {
    var req,
      _this = this;
    req = https.request(this.options, function(res) {
      var body;
      body = '';
      res.setEncoding('utf8');
      res.on('data', function(chunk) {
        body += chunk;
      });
      res.on('end', function() {
        _this.end(body);
      });
    });
    req.on('error', function(e) {
      _this.callback(e, null);
    });
    req.setHeader('Content-Type', 'application/json');
    req.setHeader('Content-Length', this.postData.length);
    req.end(this.postData, 'utf8');
  };

  return XFuse;

})();

exports.get = function(url, params, callback) {
  if (typeof params === 'function') {
    callback = params;
    params = null;
  }
  if (typeof url !== 'string') {
    return callback({
      message: 'Url must be a string'
    }, null);
  }
  if (apiToken === null) {
    return callback({
      message: 'XFuse needs an API Token'
    }, null);
  }
  if (siteUrl === null) {
    return callback({
      message: 'XFuse needs to know to know the address to the memberfuse site'
    }, null);
  }
  if (params) url += '?' + qs.stringify(params);
  return new XFuse('GET', url, callback);
};

exports.post = function(url, postData, callback) {
  if (typeof url !== 'string') {
    return callback({
      message: 'Url must be a string'
    }, null);
  }
  if (typeof postData !== 'object') {
    return callback({
      message: 'POST data must be in the form of an object'
    }, null);
  }
  return new XFuse('POST', url, postData, callback);
};

exports.put = function(url, putData, callback) {
  if (typeof url !== 'string') {
    return callback({
      message: 'Url must be a string'
    }, null);
  }
  if (typeof putData !== 'object') {
    return callback({
      message: 'PUT data must be in the form of an object'
    }, null);
  }
  return new XFuse('PUT', url, putData, callback);
};

exports.setOptions = function(options) {
  if (typeof options === 'object') this.options = options;
  return this;
};

exports.getOptions = function() {
  return this.options || {};
};

exports.setApiToken = function(token) {
  apiToken = token;
  return this;
};

exports.getApiToken = function() {
  return apiToken;
};

exports.setSiteUrl = function(url) {
  siteUrl = url;
  return this;
};

exports.getSiteUrl = function() {
  return siteUrl;
};

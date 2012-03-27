(function() {
  var assert, events, siteUrl, token, vows, xfuse;

  xfuse = require('../index.js');

  vows = require('vows');

  events = require('events');

  assert = require('assert');

  token = '46bb0a820d08bc7b1feeabce44e01beecb440253';

  siteUrl = 'mycompany.labs.memberfuse.com';

  vows.describe("xfuse.test").addBatch({
    "Before we run anything": {
      topic: function() {
        return xfuse.setApiToken(null);
      },
      "API Token should be null": function(xfuse) {
        return assert.isNull(xfuse.getApiToken());
      }
    }
  }).addBatch({
    "When accessing xfuse": {
      "with no api token": {
        "and looking for data": {
          topic: function() {
            return xfuse.get("/", this.callback);
          },
          "should get an error": function(err, res) {
            return assert.include(res, "error");
          }
        }
      },
      "with an api token": {
        topic: function() {
          var promise;
          promise = new events.EventEmitter();
          xfuse.setApiToken(token);
          xfuse.setSiteUrl(siteUrl);
          xfuse.get("/", function(err, res) {
            if (!res || res.error) {
              promise.emit("error", err);
              return console.error(err);
            } else {
              return promise.emit("success", res);
            }
          });
          return promise;
        },
        /* Now we start doing some work
        */
        "response should have right resources": function(res, err) {
          assert.isNull(err);
          assert.include(res, "resources");
        },
        "and getting data from an user": {
          topic: function() {
            return xfuse.get("/user/20", this.callback);
          },
          "response should be valid": function(err, res) {
            assert.isNull(err);
            return assert.equal("20", res.user.id, "response id should be valid");
          }
        }
      }
    }
  })["export"](module);

}).call(this);

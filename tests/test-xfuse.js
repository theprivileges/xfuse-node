
/*
Need to add test to delete test user
*/

(function() {
  var assert, events, mfzSite, postData, putData, vows, xfuse, xfuseToken;

  xfuse = require('../index.js');

  vows = require('vows');

  events = require('events');

  assert = require('assert');

  xfuseToken = '46bb0a820d08bc7b1feeabce44e01beecb440253';

  mfzSite = 'mycompany.labs.memberfuse.com';

  putData = {
    firstname: 'Amy',
    lastname: 'Smith',
    external_id: Math.floor(Math.random() * (100 - 19) + 19)
  };

  postData = {
    firstname: 'XFuse',
    lastname: 'User',
    username: 'xfuse01@memberfuse.com',
    organization: '164',
    password: 'password1',
    roles: {
      role: '51'
    }
  };

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
      topic: function() {
        xfuse.setApiToken(null);
        return xfuse.setsiteUrl(null);
      },
      "with no api token": {
        "and looking for data": {
          topic: function() {
            xfuse.get("/", this.callback);
          },
          "should get an error": function(err, res) {
            assert.isNotNull(err);
            return assert.include(err, "message");
          }
        }
      }
    }
  }).addBatch({
    "with an api token": {
      topic: function() {
        var promise;
        promise = new events.EventEmitter();
        xfuse.setApiToken(xfuseToken);
        xfuse.setSiteUrl(mfzSite);
        xfuse.get("/", function(err, res) {
          if (!res || res.error) {
            return promise.emit("error", err);
          } else {
            return promise.emit("success", res);
          }
        });
        return promise;
      },
      /* Now we start doing some work
      */
      "response should have right resources": function(err, res) {
        assert.isNull(err);
        assert.include(res, "resources");
      },
      "and getting data from an user": {
        topic: function() {
          xfuse.get("/user/20", this.callback);
        },
        "response should be valid": function(err, res) {
          assert.isNull(err);
          assert.include(res, "user");
          assert.include(res.user, "id");
          return assert.equal('20', res.user.id, "user id should be valid");
        }
      },
      "updating an existing user": {
        topic: function() {
          xfuse.put("/user/20", putData, this.callback);
        },
        "response should be valid": function(err, res) {
          assert.isNull(err);
          assert.include(res, "user");
          assert.equal(putData.firstname, res.user.firtname);
          return essert.equal(putData.lastname, res.user.lastname);
        }
      },
      "inserting a new user": {
        topic: function() {
          xfuse.post("/user", postData, this.callback);
        },
        "should get the new user as a response": function(err, res) {
          assert.isNull(err);
          assert.include(res, "user");
          assert.include(res.user, "id");
          assert.equal(postData.firstname, res.user.firstname);
          assert.equal(postData.lastname, res.user.lastname);
          return assert.equal(postData.username, res.user.username);
        }
      }
    }
  })["export"](module);

}).call(this);

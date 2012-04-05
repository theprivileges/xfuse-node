
/*
copyright (c) 2012 Avectra, Inc.
*/

(function() {
  var assert, events, mfzSite, postData, putData, randUID, testUser, vows, xfuse, xfuseToken;

  xfuse = require('../index.js');

  vows = require('vows');

  events = require('events');

  assert = require('assert');

  xfuseToken = '46bb0a820d08bc7b1feeabce44e01beecb440253';

  mfzSite = 'mycompany.labs.memberfuse.com';

  testUser = '';

  /*
  Because DELETE is a soft-delete some tests may fail when the randUID has been used before
  */

  randUID = Math.floor(Math.random() * 501);

  /*
  two ams ids can't be the same for a site
  */

  putData = {
    external_id: Math.floor(Math.random() * 101)
  };

  postData = {
    firstname: 'XFuse',
    lastname: 'User',
    username: 'xfuse' + randUID + '@memberfuse.com',
    organization: '164',
    external_id: randUID,
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
        assert.isNull(xfuse.getApiToken());
      }
    }
  }).addBatch({
    "When accessing xfuse": {
      topic: function() {
        xfuse.setApiToken(null);
        xfuse.setsiteUrl(null);
      },
      "with no api token": {
        "and looking for data": {
          topic: function() {
            xfuse.get("/", this.callback);
          },
          "should get an error": function(err, res) {
            assert.isNotNull(err);
            assert.include(err, "message");
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
          assert.equal('20', res.user.id, "user id should be valid");
        }
      },
      "updating an existing user": {
        topic: function() {
          xfuse.put("/user/20", putData, this.callback);
        },
        "response should be valid": function(err, res) {
          assert.isNull(err);
          assert.include(res, "user");
          assert.equal(putData.external_id, res.user.external_id, "new external id should match");
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
          assert.equal(postData.username, res.user.username);
          /*
                              Saving the id of the test user, so we can delete it on the next test
          */
          testUser = res.user.id;
        },
        "deleting test user": {
          topic: function() {
            xfuse.del("/user/" + testUser, this.callback);
          },
          "should not get any errors": function(err, res) {
            assert.isNull(err);
            assert.include(res, "user");
            assert.equal(res.user.message, "Deleted the user successfully.");
          },
          "and the user should no longer exist": {
            topic: function() {
              xfuse.get("/user/" + testUser, this.callback);
            },
            "should get user doesn't exist": function(err, res) {
              assert.isNull(res);
              assert.isNotNull(err);
              assert.include(err, "message");
            }
          }
        }
      }
    }
  })["export"](module);

}).call(this);

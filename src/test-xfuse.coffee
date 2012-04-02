xfuse = require '../index.js'
vows = require 'vows'
events = require 'events'
assert = require 'assert'

xfuseToken = '46bb0a820d08bc7b1feeabce44e01beecb440253'
mfzSite = 'mycompany.labs.memberfuse.com'

putData =
    firstname : 'Amy'
    lastname : 'Smith'

postData = 
    firstname : 'XFuse'
    lastname : 'User'
    email : 'xfuse@memberfuse.com'

vows.describe("xfuse.test")
.addBatch
    "Before we run anything" : 
        topic : () ->
            xfuse.setApiToken null
        "API Token should be null" : (xfuse) ->
            assert.isNull xfuse.getApiToken()
.addBatch
    "When accessing xfuse" :
        topic : () ->
            xfuse.setApiToken null
            xfuse.setsiteUrl null
        "with no api token" :
            "and looking for data" :
                topic : () ->
                    xfuse.get "/", @callback
                    return
                "should get an error" : (err, res) ->
                    assert.isNotNull err
                    assert.include err, "message"
.addBatch
    "with an api token" :
            topic : () ->
                promise = new events.EventEmitter()
                xfuse.setApiToken xfuseToken
                xfuse.setSiteUrl mfzSite

                xfuse.get "/", (err, res) ->
                    if !res || res.error
                        promise.emit "error", err
                    else
                        promise.emit "success", res
                return promise
            ### Now we start doing some work ###
            "response should have right resources" : (err, res) ->
                assert.isNull err
                assert.include res, "resources"
                return
            "and getting data from an user" :
                topic : () ->
                    xfuse.get "/user/20", @callback
                    return
                "response should be valid" : (err, res) ->
                    assert.isNull err
                    assert.include res, "user"
                    assert.include res.user, "id"
                    assert.equal '20', res.user.id, "user id should be valid"
            "updating an existing user" :
                topic : () ->
                    xfuse.put "/user/20", putData, @callback
                    return
                "response should be valid" : (err, res) ->
                    assert.isNull err
                    assert.include res, "user"
                    assert.include res.user, "firstname"
                    assert.include res.user, "lastname"
                    assert.equal putData.firstname, res.user.firtname
                    essert.equal putData.lastname, res.user.lastname
            "inserting a new user" :
                topic : () ->
                    xfuse.post "/user", postData, @callback
                    return
                "should get the new user as a response" : (err, res) ->
                    assert.isNull err
                    assert.include res, "user"
                    assert.include res.user, "id"
                    assert.equal postData.firstname, res.user.firstname
                    assert.equal postData.lastname, res.user.lastname
                    assert.equal postData.email, res.use.email
.export(module)

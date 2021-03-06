###
copyright (c) 2012 Avectra, Inc.
###
xfuse = require '../index.js'
vows = require 'vows'
events = require 'events'
assert = require 'assert'

xfuseToken = '46bb0a820d08bc7b1feeabce44e01beecb440253'
mfzSite = 'mycompany.labs.memberfuse.com'

testUser = ''

###
Because DELETE is a soft-delete some tests may fail when the randUID has been used before
###
randUID = Math.floor Math.random() * 501

###
two ams ids can't be the same for a site
###
putData =
    external_id : Math.floor Math.random() * 101

postData = 
    firstname : 'XFuse'
    lastname : 'User'
    username : 'xfuse' + randUID + '@memberfuse.com'
    organization : '164'
    external_id : randUID
    password : 'password1'
    roles   : 
        role : '51'

vows.describe("xfuse.test")
.addBatch
    "Before we run anything" : 
        topic : () ->
            xfuse.setApiToken null
        "API Token should be null" : (xfuse) ->
            assert.isNull xfuse.getApiToken()
            return
.addBatch
    "When accessing xfuse" :
        topic : () ->
            xfuse.setApiToken null
            xfuse.setsiteUrl null
            return
        "with no api token" :
            "and looking for data" :
                topic : () ->
                    xfuse.get "/", @callback
                    return
                "should get an error" : (err, res) ->
                    assert.isNotNull err
                    assert.include err, "message"
                    return
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
                    return
            "updating an existing user" :
                topic : () ->
                    xfuse.put "/user/20", putData, @callback
                    return
                "response should be valid" : (err, res) ->
                    assert.isNull err
                    assert.include res, "user"
                    assert.equal putData.external_id, res.user.external_id, "new external id should match"
                    return
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
                    assert.equal postData.username, res.user.username
                    ###
                    Saving the id of the test user, so we can delete it on the next test
                    ###
                    testUser = res.user.id
                    return
                "deleting test user" :
                    topic : () ->
                        xfuse.del "/user/" + testUser, @callback
                        return
                    "should not get any errors" : (err, res) ->
                        assert.isNull err
                        assert.include res, "user"
                        assert.equal res.user.message, "Deleted the user successfully."
                        return
                    "and the user should no longer exist" :
                        topic : () ->
                            xfuse.get "/user/" + testUser, @callback
                            return
                        "should get user doesn't exist" : (err, res) ->
                            assert.isNull res
                            assert.isNotNull err
                            assert.include err, "message"
                            return
.export(module)

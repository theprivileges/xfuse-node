xfuse = require '../index.js'
vows = require 'vows'
events = require 'events'
assert = require 'assert'

token = '46bb0a820d08bc7b1feeabce44e01beecb440253'
siteUrl = 'mycompany.labs.memberfuse.com'

vows.describe("xfuse.test").addBatch
    "Before we run anything" : 
        topic : () ->
            xfuse.setApiToken(null)
        "API Token should be null" : (xfuse) ->
            assert.isNull xfuse.getApiToken()
.addBatch
    "When accessing xfuse" :
        "with no api token" :
            "and looking for data" :
                topic : () ->
                    xfuse.get "/", @callback
                "should get an error" : (err, res) ->
                    assert.include res, "error"
        "with an api token" :
            topic : () ->
                promise = new events.EventEmitter()
                xfuse.setApiToken token
                xfuse.setSiteUrl siteUrl

                xfuse.get "/", (err, res) ->
                    if !res || res.error
                        promise.emit "error", err
                        console.error err
                    else
                        promise.emit "success", res
                return promise
            ### Now we start doing some work ###
            "response should have right resources" : (res, err) ->
                assert.isNull err
                assert.include res, "resources"
                return
            "and getting data from an user" :
                topic : () ->
                    xfuse.get "/user/20", @callback
                "response should be valid" : (err, res) ->
                    assert.isNull err
                    assert.equal "20", res.user.id, "response id should be valid"
.export(module)

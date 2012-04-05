###
copyright (c) 2012 Avectra, Inc.
###
https = require 'https'
qs = require 'querystring'

exports.version = '0.0.8'

apiToken = null
siteUrl = null
apiUrl = '/api/rest/1.0'

class XFuse
    constructor : (method, url, postData = {}, callback = () -> return) ->
        if typeof postData == 'function'
            callback = postData
            postData = {}
        ###
        Check if everything is set up
        ###
        @isSetUp(method, url, postData, callback)

        url = apiUrl + @.cleanUrl url
        @callback = callback
        @postData = JSON.stringify postData 

        @options = @options || {}

        @options.host = siteUrl
        @options.auth = apiToken  + ':'
        @options.method = method
        @options.path    = url
        ###
        Have to do this because delete is a reserved operator
        ###
        if method.toLowerCase() == 'delete'
            @del()
        else
            @[method.toLowerCase()]()

        return @

    isSetUp : (method, url, postData, callback) ->
        if apiToken == null 
            return callback { message : "xfuse needs an API Token" }, null
        if siteUrl == null
            return callback { message : "xfuse needs the address to memberfuse community" }, null
        if typeof url != 'string'
            return callback { message : "xfuse requires url to be a string" }, null
        if typeof postData != 'object'
            return callback { message : "Data must be in Object form" }, null
        return
    cleanUrl : (url) ->
        if url.charAt(0) != '/'
            url = '/' + url
        return url
    end : (body) ->
        if (body && typeof body == 'string') 
            try
                json = JSON.parse body
            catch e
                err = 
                    message : 'Error parsing json'
                    exception : e
        
        if (!err && (json && json.error))
            err = json.error
        
        @callback err, json
        return

    get : () ->
        https.get @options, (res) =>
            if res.statusCode != 200
                this.callback 
                    message : 'Request could not be interpreted by the server'
                    exception : Error
                , null
                return
            body = ''
            res.setEncoding 'utf8'
            res.on 'data', (chunk) ->
                body += chunk
                return
            res.on 'end', () =>
                @end body
                return
            return
        .on 'error', (e) =>
            @callback e, null
            return
        return

    post : () ->
        
        req = https.request @options, (res) =>
            body = ''
            res.setEncoding 'utf8'
            res.on 'data', (chunk) ->
                body += chunk
                return
            res.on 'end', () =>
                @end body
                return
            return
        req.on 'error', (e) =>
            @callback e, null
            return
        req.setHeader 'Content-Type', 'application/json'
        req.setHeader 'Content-Length', @postData.length
        req.end @postData, 'utf8'
        return

    put : () ->

        req = https.request @options, (res) =>
            body = ''
            res.setEncoding 'utf8'
            res.on 'data', (chunk) ->
                body += chunk
                return
            res.on 'end', () =>
                @end body
                return
            return
        req.on 'error', (e) =>
            @callback e, null
            return
        req.setHeader 'Content-Type', 'application/json'
        req.setHeader 'Content-Length', @postData.length
        req.end @postData, 'utf8'
        return
    del : () ->

        req = https.request @options, (res) =>
            body = ''
            res.setEncoding 'utf8'
            res.on 'data', (chunk) ->
                body += chunk
                return
            res.on 'end', () =>
                @end body
                return
        req.on 'error', (e) =>
            @callback e, null
            return
        return
exports.get = (url, params, callback) ->
    if typeof params == 'function'
        callback = params
        params = null
    
    if params
        url += '?' + qs.stringify params
    
    new XFuse 'GET', url, callback

exports.post = (url, postData, callback) ->

    new XFuse 'POST', url, postData, callback

exports.put = (url, putData, callback) ->

    new XFuse 'PUT', url, putData, callback

exports.delete = (url, callback) ->
    
    new XFuse 'DELETE', url, callback

exports.setOptions = (options) ->
    if typeof options == 'object' 
        @options = options
    @

exports.getOptions = () ->
    @options || {}

exports.setApiToken = (token) ->
    apiToken = token
    @

exports.getApiToken = () ->
    return apiToken

exports.setSiteUrl = (url) ->
    siteUrl = url
    @

exports.getSiteUrl = () ->
    siteUrl

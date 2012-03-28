https = require 'https'
qs = require 'querystring'

exports.version = '0.0.1'

apiToken = null
siteUrl = null
apiUrl = '/api/rest/1.0'

class XFuse
    constructor : (method, url, postData, callback) ->
        if typeof callback == 'undefined'
            callback = postData
            postData = {}
        url = apiUrl + @.cleanUrl url
        @callback = callback || () -> return
        @postData = postData

        @options = @options || {}

        @options.host = siteUrl
        @options.auth = apiToken  + ':'
        @options.method = method
        @options.path    = url
        
        @[method.toLowerCase()]()

        return @

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
        return

exports.get = (url, params, callback) ->
    if typeof params == 'function'
        callback = params
        params = null

    if typeof url != 'string'
        return callback { message : 'Url must be a string' }, null

    if apiToken == null
        return callback { message : 'XFuse needs an API Token' }, null

    if siteUrl == null
        return callback { message : 'XFuse needs to know to know the address to the memberfuse site'}, null
    
    if params
        url += '?' + qs.stringify params
    
    new XFuse 'GET', url, callback

exports.post = (url, postData, callback) ->
    if typeof url != 'string' 
        return callback { message : 'Url must be a string' }, null

    if typeof postData == 'function'
        callback = postData
        postData = {}

    new XFuse 'POST', url, postData, callback

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

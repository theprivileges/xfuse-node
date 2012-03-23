https = require 'https'
qs = require 'querystring'

XFuse = (key) ->
    if key == null
        throw new Error 'XFuse needs a valid API Key'
    else
        this._key

    doRequest = (path = '/', method = 'GET', args, callback) ->
        
        if path.charAt 0 != '/'
            path = '/' + path
        
        path = path + '?' +  qs.stringify args
        
        options = 
            host : 'mycompany.labs.memberfuse.com'
            method : method
            auth : this._key + ':'
            path : path
            headers : 
                'Accept' : 'application/json'

        request = https.request options, (res) ->
            res.setEncoding 'utf8'
            body = []
            res.on 'data', (chunk) ->
                body.push chunk
            res.on 'end', () ->
                try
                    JSON.parse body.join ''
                catch e
                    data = null
                    error = e
            if data and data.error
                callback data.error, null
            else if data
                callback null, data
            else
                callback error, null
        request.on 'error', (error) ->
            console.error error
            callback error, null
            return
        return

    get = (path, callback) ->
        doRequest path, 'GET', null, callback
        return
    return

if typeof exports != 'undefined' 
    if typeof module != 'undefined' && module.exports
        exports = module.exports = XFuse
    exports.XFuse = XFuse
else
    this.XFuse = XFuse

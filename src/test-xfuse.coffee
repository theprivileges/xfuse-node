xfuse = require('../lib/xfuse.js').XFuse

client = new xfuse '46bb0a820d08bc7b1feeabce44e01beecb440253'

exports['client is an Object']  = (test) ->
    test.expect 2
    test.ok client instanceof Object, "client is not an instance of Object"
    test.equal typeof client, 'object', "client is not an Object"
    test.done()
    return


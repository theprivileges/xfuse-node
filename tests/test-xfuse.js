(function() {
  var XFuse, client, postArgs;

  XFuse = require('../lib/xfuse.js').XFuse;

  postArgs = {
    email: 'updated@email.com'
  };

  client = new XFuse('46bb0a820d08bc7b1feeabce44e01beecb440253');

  exports['client is an Object'] = function(test) {
    test.expect(2);
    test.ok(client instanceof Object, "client is not an instance of Object");
    test.equal(typeof client, 'object', "client is not an Object");
    test.done();
  };

  exports['test get'] = function(test) {
    test.expect(1);
    test.ok(client.get('/'));
    test.done();
  };

  exports['test post'] = function(test) {
    test.expect(1);
    test.ok(client.post('/users/20', postArgs));
    test.done();
  };

  exports['test put'] = function(test) {
    test.expect(1);
    test.ok(client.put('/users', putArgs));
    test.done();
  };

}).call(this);

# frame-rpc

rpc between iframes and windows using postMessage with no serialization

[![build status](https://secure.travis-ci.org/substack/frame-rpc.png)](http://travis-ci.org/substack/frame-rpc)

# example

expose a method from a page that will be loaded as an iframe:

``` js
var RPC = require('frame-rpc');
var origin = document.referrer;

var rpc = RPC(window, window.parent, origin, {
    beep: function (n, cb) {
        document.querySelector('#n').textContent = n;
        cb(n * 111);
    }
});
```

then from the parent page containing the iframe:

``` js
var RPC = require('frame-rpc');
var frame = document.querySelector('iframe');
var usrc = new URL(frame.getAttribute('src'));
var origin = usrc.protocol + '//' + usrc.host;

frame.addEventListener('load', function (ev) {
    var rpc = RPC(window, frame.contentWindow, origin);
    rpc.call('beep', 5, function (result) {
        document.querySelector('#result').textContent = result;
    });
});
```

# methods

``` js
var RPC = require('frame-rpc')
```

## var rpc = RPC(src, dst, origin, methods)

Create a new `rpc` instance that listens for `'message'` events on `src`
and writes data to `dst.postMessage()`.

`origin` must be the URL of `dst`. Any messages from `src` that do not match
`origin` are ignored. If `origin` is `'*'`, the location of incoming messages is
not checked and the output messages are sent to anyone listening. Use carefully.

Any `methods` defined will be exposed to the other endpoint.

`methods` can be an object with names that map to methods or a function
`methods(rpc)` that returns an object to map names to methods.

The last argument of each function exposed in `methods` can be a callback to
send a response.

The protocol is symmetric so each side can expose methods to the other side.

## rpc.call(method, args...)

Call a `method` on the remote endpoint with some arguments `args..`.

The last argument can be a callback for receiving a reply.

## rpc.apply(method, args)

Call a `method` on the remote endpoint with an array of arguments `args`.

The last argument can be a callback for receiving a reply.

## rpc.destroy()

Remove the event listeners and don't respond to any more messages.

# protocol

The protocol is designed to only listen to frame-rpc messages because often
there is a lot of noise over the postMessage event bus from other subsystems
(polyfills for setImmediate send messages, for example).

Each message is either a method request with parameters in `arguments`:

``` js
{
  protocol: 'frame-rpc',
  version: '1.0.0',
  sequence: 123,
  method: 'beep',
  arguments: [ 5 ]
}
```

or a callback response that contains the method result(s) in `arguments`:

``` js
{
  protocol: 'frame-rpc',
  version: '1.0.0',
  response: 123,
  arguments: [ 555 ]
}
```

All other messages that don't match these formats are ignored.

# install

With [npm](https://npmjs.org) do:

```
npm install frame-rpc
```

or fetch a pre-built version from [browserify-cdn](http://wzrd.in):

[http://wzrd.in/standalone/frame-rpc@latest](http://wzrd.in/standalone/frame-rpc@latest)

# license

MIT

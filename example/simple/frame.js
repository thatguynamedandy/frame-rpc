var RPC = require('../');
var origin = document.referrer;

var rpc = RPC(window, window.parent, origin, {
    beep: function (n, cb) {
        document.querySelector('#n').textContent = n;
        cb(n * 111);
    }
});

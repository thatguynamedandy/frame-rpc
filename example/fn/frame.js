var RPC = require('../../');
var origin = document.referrer;

RPC(window, window.parent, origin, function (rpc) {
    return {
        beep: function (n, cb) {
            document.querySelector('#n').textContent = n;
            cb(n * 111);
        }
    };
});

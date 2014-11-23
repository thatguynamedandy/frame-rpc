var RPC = require('../');
var frame = document.querySelector('iframe');
var usrc = new URL(frame.getAttribute('src'));
var origin = usrc.protocol + '//' + usrc.host;

frame.addEventListener('load', function (ev) {
    var rpc = RPC(window, frame.contentWindow, origin);
    rpc.call('beep', 5, function (result) {
        document.querySelector('#result').textContent = result;
    });
});

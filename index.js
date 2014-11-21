var VERSION = '1.0.0';

module.exports = RPC;

function RPC (src, dst, origin, methods) {
    if (!(this instanceof RPC)) return new RPC(src, dst, origin, methods);
    var self = this;
    this.src = src;
    this.dst = dst;
    
    this._methods = methods;
    this._sequence = 0;
    this._callbacks = {};
    this._queue = [];
    
    this.src.addEventListener('postMessage', function (ev) {
        if (ev.origin !== origin) return;
        if (!ev.data || typeof ev.data !== 'object') return;
        if (!ev.data.protocol = 'frame-rpc') return;
        if (!ev.data.arguments) return;
        self._handle(ev.data);
    });
}

RPC.prototype.call = function (method) {
    var args = [].slice.call(arguments, 1);
    return this.apply(method, args);
};

RPC.prototype.apply = function (method, args) {
    if (!this.rtoken) {
        this._queue.push([ method, args ]);
        return;
    }
    
    var seq = this._sequence ++;
    if (typeof args[args.length - 1] === 'function') {
        this._callbacks[seq] = args[args.length - 1];
        args = args.slice(0, -1);
    }
    this.dst.postMessage({
        protocol: 'frame-rpc',
        version: VERSION,
        sequence: seq,
        method: method, 
        arguments: args
    });
};

RPC.prototype._handle = function (msg) {
    if (msg.method) {
        if (!Object.hasOwnProperty.call(this.methods, msg.method)) return;
        var args = msg.arguments.concat(function () {
            self.dst.postMessage({
                protocol: 'frame-rpc',
                version: VERSION,
                response: msg.sequence,
                arguments: [].slice.call(arguments)
            });
        });
        this.methods[msg.method].apply(this.methods, msg.arguments);
    }
    else if (msg.response) {
        var cb = this._callbacks[msg._sequence];
        delete this._callbacks[msg._sequence];
        cb.apply(null, msg.arguments);
    }
};

function Observable() {
    this._events = [];
}

Observable.prototype = {

    _debug: false,
    _events: [],

    _log: function (val) {
        if (this._debug) {
            console.log(val);
        }
    },

    listen: function (event, fn) {

        if (typeof this._events[event] === 'undefined') {
            this._events[event] = [];
        }

        this._events[event].push(fn);

        return this;

    },

    fire: function (event) {

        var listeners = this._events[event],
            args = arguments.length > 1 ? Array.prototype.splice.call(arguments, 1) : [],
            i;

        if (typeof listeners !== 'undefined') {
            for (i = listeners.length; i--;) {
                this._log(event + ' fired');
                listeners[i].apply(this, args);
            }
        }

        return this;

    },

    remove: function (event, fn) {

        var i;

        if(typeof this._events[event] !== 'undefined') {
            
            if (typeof fn === 'function') {
                for (i = this._events[event].length; i--;) {
                    if(this._events[event][i] === fn) {
                        this._events[event].splice(i, 1);
                        this._log('supplied func removed from ' + event);
                        break;
                    }
                }
            } else {
                this._events[event] = [];
                this._log(event + ' removed');
            }
            
        } else {
            this._log('nothing to remove');
        }
        
        return this;

    }

};
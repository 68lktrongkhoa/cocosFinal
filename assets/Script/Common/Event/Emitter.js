const EventEmitter = require('events');

class Emitter {
    constructor() {
        this._emiter = new EventEmitter();
        this._emiter.setMaxListeners(100);
        this._listenerMap = new Map();
    }

    emit(...args) {
        this._emiter.emit(...args);
    }

    registerEvent(event, callback, context) {
        if (!event || typeof callback !== 'function' || !context) {
            cc.warn('[Emitter] Invalid event registration:', { event, callback, context });
            return;
        }

        const boundCallback = callback.bind(context);
        this._emiter.on(event, boundCallback);

        if (!this._listenerMap.has(context)) {
            this._listenerMap.set(context, []);
        }
        this._listenerMap.get(context).push({ event, callback: boundCallback });
    }

    registerOnce(event, callback, context) {
        const boundCallback = callback.bind(context);
        this._emiter.once(event, boundCallback);

        if (!this._listenerMap.has(context)) {
            this._listenerMap.set(context, []);
        }
        this._listenerMap.get(context).push({ event, callback: boundCallback });
    }

    removeEvent(event, callback) {
        this._emiter.removeListener(event, callback);
    }

    removeEventsByTarget(context) {
        const listeners = this._listenerMap.get(context);
        if (listeners) {
            for (const { event, callback } of listeners) {
                this._emiter.removeListener(event, callback);
            }
            this._listenerMap.delete(context);
        }
    }

    destroy() {
        this._emiter.removeAllListeners();
        this._listenerMap.clear();
    }
}

module.exports = new Emitter();
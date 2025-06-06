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
        cc.log(`Removing event: ${event}`);
        this._emiter.removeListener(event, callback);
    }

    removeEventsByTarget(context) {
        cc.log(`Removing events for context:`, context);
        const listeners = this._listenerMap.get(context);
        if (listeners) {
            for (const { event, callback } of listeners) {
                this._emiter.removeListener(event, callback);
            }
            this._listenerMap.delete(context);
        }
    }

    destroy() {
        cc.log('Emitter destroyed');
        this._emiter.removeAllListeners();
        this._listenerMap.clear();
    }
}

module.exports = new Emitter();
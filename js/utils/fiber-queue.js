import Fiber from 'fibers';


export class FiberQueue {
    constructor(executor) {
        this._queue = [];
        this._waiting = false;
        this._fiber = new Fiber(() => this._get());
        this._cb = executor;

        this._fiber.run();
    }

    _get() {
        while (true) {
            const item = this._queue.shift();
            if (!item) {
                this._waiting = true;
                Fiber.yield();
                continue;
            }

            let result;
            try {
                result = this._cb(item.msg);
            } catch (e) {
                result = e;
            }

            if (item.fiber)
                item.fiber.run(result);
        }
    }

    push(msg, block = false) {
        // XXX add to queue start
        // const block = !!(typeof opts === 'object' ? opts.block : opts);

        if (block) {
            this._queue.push({ fiber: Fiber.current, msg });
        } else {
            this._queue.push({ msg });
        }
        if (this._waiting) {
            this._waiting = false;
            this._fiber.run();
        }

        if (block) {
            const result = Fiber.yield();
            if (result instanceof Error)
                throw result;
            return result;
        }
    }
}

export function fiberInterval(callback, delay) {
    let func = () => new Fiber(() => {
        callback();
        Meteor.setTimeout(func, delay);
    }).run();
    return func;
}

Fiber.wait = function (delay) {
    const cur = Fiber.current;
    Meteor.setTimeout(function () {
        cur.run();
    }, delay);
    Fiber.yield();
};

export function inFiber(cb) {
    return new Fiber(cb).run();
}

export class FiberMutex {
    constructor() {
        this.locked = false;
        this._locks = [];
    }

    lock() {
        if (this.locked && !~this._locks.indexOf(Fiber.current)) {
            this._locks.push(Fiber.current);
            Fiber.yield();
        }
        this.locked = true;
    }

    unlock() {
        this.locked = false;
        const lock = this._locks.shift();
        if (lock)
            lock.run();
    }

    wrap(cb) {
        return () => this.call(cb);
    }

    call(cb) {
        this.lock();
        try {
            return cb();
        } finally {
            this.unlock();
        }
    }
}

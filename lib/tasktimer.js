(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("tasktimer", [], factory);
	else if(typeof exports === 'object')
		exports["tasktimer"] = factory();
	else
		root["tasktimer"] = factory();
})(this, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/eventemitter3/index.js"
/*!*********************************************!*\
  !*** ./node_modules/eventemitter3/index.js ***!
  \*********************************************/
(module) {



var has = Object.prototype.hasOwnProperty
  , prefix = '~';

/**
 * Constructor to create a storage for our `EE` objects.
 * An `Events` instance is a plain object whose properties are event names.
 *
 * @constructor
 * @private
 */
function Events() {}

//
// We try to not inherit from `Object.prototype`. In some engines creating an
// instance in this way is faster than calling `Object.create(null)` directly.
// If `Object.create(null)` is not supported we prefix the event names with a
// character to make sure that the built-in object properties are not
// overridden or used as an attack vector.
//
if (Object.create) {
  Events.prototype = Object.create(null);

  //
  // This hack is needed because the `__proto__` property is still inherited in
  // some old browsers like Android 4, iPhone 5.1, Opera 11 and Safari 5.
  //
  if (!new Events().__proto__) prefix = false;
}

/**
 * Representation of a single event listener.
 *
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} [once=false] Specify if the listener is a one-time listener.
 * @constructor
 * @private
 */
function EE(fn, context, once) {
  this.fn = fn;
  this.context = context;
  this.once = once || false;
}

/**
 * Add a listener for a given event.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} once Specify if the listener is a one-time listener.
 * @returns {EventEmitter}
 * @private
 */
function addListener(emitter, event, fn, context, once) {
  if (typeof fn !== 'function') {
    throw new TypeError('The listener must be a function');
  }

  var listener = new EE(fn, context || emitter, once)
    , evt = prefix ? prefix + event : event;

  if (!emitter._events[evt]) emitter._events[evt] = listener, emitter._eventsCount++;
  else if (!emitter._events[evt].fn) emitter._events[evt].push(listener);
  else emitter._events[evt] = [emitter._events[evt], listener];

  return emitter;
}

/**
 * Clear event by name.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} evt The Event name.
 * @private
 */
function clearEvent(emitter, evt) {
  if (--emitter._eventsCount === 0) emitter._events = new Events();
  else delete emitter._events[evt];
}

/**
 * Minimal `EventEmitter` interface that is molded against the Node.js
 * `EventEmitter` interface.
 *
 * @constructor
 * @public
 */
function EventEmitter() {
  this._events = new Events();
  this._eventsCount = 0;
}

/**
 * Return an array listing the events for which the emitter has registered
 * listeners.
 *
 * @returns {Array}
 * @public
 */
EventEmitter.prototype.eventNames = function eventNames() {
  var names = []
    , events
    , name;

  if (this._eventsCount === 0) return names;

  for (name in (events = this._events)) {
    if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
  }

  if (Object.getOwnPropertySymbols) {
    return names.concat(Object.getOwnPropertySymbols(events));
  }

  return names;
};

/**
 * Return the listeners registered for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Array} The registered listeners.
 * @public
 */
EventEmitter.prototype.listeners = function listeners(event) {
  var evt = prefix ? prefix + event : event
    , handlers = this._events[evt];

  if (!handlers) return [];
  if (handlers.fn) return [handlers.fn];

  for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) {
    ee[i] = handlers[i].fn;
  }

  return ee;
};

/**
 * Return the number of listeners listening to a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Number} The number of listeners.
 * @public
 */
EventEmitter.prototype.listenerCount = function listenerCount(event) {
  var evt = prefix ? prefix + event : event
    , listeners = this._events[evt];

  if (!listeners) return 0;
  if (listeners.fn) return 1;
  return listeners.length;
};

/**
 * Calls each of the listeners registered for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Boolean} `true` if the event had listeners, else `false`.
 * @public
 */
EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
  var evt = prefix ? prefix + event : event;

  if (!this._events[evt]) return false;

  var listeners = this._events[evt]
    , len = arguments.length
    , args
    , i;

  if (listeners.fn) {
    if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);

    switch (len) {
      case 1: return listeners.fn.call(listeners.context), true;
      case 2: return listeners.fn.call(listeners.context, a1), true;
      case 3: return listeners.fn.call(listeners.context, a1, a2), true;
      case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
      case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
      case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
    }

    for (i = 1, args = new Array(len -1); i < len; i++) {
      args[i - 1] = arguments[i];
    }

    listeners.fn.apply(listeners.context, args);
  } else {
    var length = listeners.length
      , j;

    for (i = 0; i < length; i++) {
      if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);

      switch (len) {
        case 1: listeners[i].fn.call(listeners[i].context); break;
        case 2: listeners[i].fn.call(listeners[i].context, a1); break;
        case 3: listeners[i].fn.call(listeners[i].context, a1, a2); break;
        case 4: listeners[i].fn.call(listeners[i].context, a1, a2, a3); break;
        default:
          if (!args) for (j = 1, args = new Array(len -1); j < len; j++) {
            args[j - 1] = arguments[j];
          }

          listeners[i].fn.apply(listeners[i].context, args);
      }
    }
  }

  return true;
};

/**
 * Add a listener for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.on = function on(event, fn, context) {
  return addListener(this, event, fn, context, false);
};

/**
 * Add a one-time listener for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.once = function once(event, fn, context) {
  return addListener(this, event, fn, context, true);
};

/**
 * Remove the listeners of a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn Only remove the listeners that match this function.
 * @param {*} context Only remove the listeners that have this context.
 * @param {Boolean} once Only remove one-time listeners.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
  var evt = prefix ? prefix + event : event;

  if (!this._events[evt]) return this;
  if (!fn) {
    clearEvent(this, evt);
    return this;
  }

  var listeners = this._events[evt];

  if (listeners.fn) {
    if (
      listeners.fn === fn &&
      (!once || listeners.once) &&
      (!context || listeners.context === context)
    ) {
      clearEvent(this, evt);
    }
  } else {
    for (var i = 0, events = [], length = listeners.length; i < length; i++) {
      if (
        listeners[i].fn !== fn ||
        (once && !listeners[i].once) ||
        (context && listeners[i].context !== context)
      ) {
        events.push(listeners[i]);
      }
    }

    //
    // Reset the array, or remove it completely if we have no more listeners.
    //
    if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
    else clearEvent(this, evt);
  }

  return this;
};

/**
 * Remove all listeners, or those of the specified event.
 *
 * @param {(String|Symbol)} [event] The event name.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
  var evt;

  if (event) {
    evt = prefix ? prefix + event : event;
    if (this._events[evt]) clearEvent(this, evt);
  } else {
    this._events = new Events();
    this._eventsCount = 0;
  }

  return this;
};

//
// Alias methods names because people roll like that.
//
EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
EventEmitter.prototype.addListener = EventEmitter.prototype.on;

//
// Expose the prefix.
//
EventEmitter.prefixed = prefix;

//
// Allow `EventEmitter` to be imported as module namespace.
//
EventEmitter.EventEmitter = EventEmitter;

//
// Expose the module.
//
if (true) {
  module.exports = EventEmitter;
}


/***/ },

/***/ "./src/ITaskOptions.ts"
/*!*****************************!*\
  !*** ./src/ITaskOptions.ts ***!
  \*****************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ },

/***/ "./src/ITaskTimerEvent.ts"
/*!********************************!*\
  !*** ./src/ITaskTimerEvent.ts ***!
  \********************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ },

/***/ "./src/ITaskTimerOptions.ts"
/*!**********************************!*\
  !*** ./src/ITaskTimerOptions.ts ***!
  \**********************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ },

/***/ "./src/ITimeInfo.ts"
/*!**************************!*\
  !*** ./src/ITimeInfo.ts ***!
  \**************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ },

/***/ "./src/Task.ts"
/*!*********************!*\
  !*** ./src/Task.ts ***!
  \*********************/
(__unused_webpack_module, exports, __webpack_require__) {


/* tslint:disable:no-empty */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Task = void 0;
var _1 = __webpack_require__(/*! . */ "./src/index.ts");
var utils_1 = __webpack_require__(/*! ./utils */ "./src/utils.ts");
/**
 *  @private
 */
var DEFAULT_TASK_OPTIONS = Object.freeze({
    enabled: true,
    tickDelay: 0,
    tickInterval: 1,
    totalRuns: null,
    startDate: null,
    stopDate: null,
    immediate: false,
    removeOnCompleted: false,
    callback: null
});
/**
 *  Represents the class that holds the configurations and the callback function
 *  required to run a task.
 *  @class
 */
var Task = /** @class */ (function () {
    /**
     *  Initializes a new instance of `Task` class.
     *  @constructor
     *  @param {ITaskOptions} options Task options.
     */
    function Task(options) {
        this._init(options);
    }
    Object.defineProperty(Task.prototype, "id", {
        // ---------------------------
        // PUBLIC (INSTANCE) MEMBERS
        // ---------------------------
        /**
         *  Gets the unique ID of the task.
         *  @name Task#id
         *  @type {string}
         *  @readonly
         */
        get: function () {
            return this._.id;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Task.prototype, "enabled", {
        /**
         *  Specifies whether this task is currently enabled. This essentially gives
         *  you a manual control over execution. The task will always bypass the
         *  callback while this is set to `false`.
         *  @name Task#enabled
         *  @type {boolean}
         */
        get: function () {
            return this._.enabled;
        },
        set: function (value) {
            this._.enabled = utils_1.utils.getBool(value, true);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Task.prototype, "tickDelay", {
        /**
         *  Gets or sets the number of ticks to allow before running the task for
         *  the first time.
         *  @name Task#tickDelay
         *  @type {number}
         */
        get: function () {
            return this._.tickDelay;
        },
        set: function (value) {
            this._.tickDelay = utils_1.utils.getNumber(value, 0, DEFAULT_TASK_OPTIONS.tickDelay);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Task.prototype, "tickInterval", {
        /**
         *  Gets or sets the tick interval that the task should be run on. The unit
         *  is "ticks" (not milliseconds). For instance, if the timer interval is
         *  `1000` milliseconds, and we add a task with `5` tick intervals. The task
         *  will run on every `5` <b>seconds</b>.
         *  @name Task#tickInterval
         *  @type {number}
         */
        get: function () {
            return this._.tickInterval;
        },
        set: function (value) {
            this._.tickInterval = utils_1.utils.getNumber(value, 1, DEFAULT_TASK_OPTIONS.tickInterval);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Task.prototype, "totalRuns", {
        /**
         *  Gets or sets the total number of times the task should be run. `0` or
         *  `null` means unlimited (until the timer has stopped).
         *  @name Task#totalRuns
         *  @type {number}
         */
        get: function () {
            return this._.totalRuns;
        },
        set: function (value) {
            this._.totalRuns = utils_1.utils.getNumber(value, 0, DEFAULT_TASK_OPTIONS.totalRuns);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Task.prototype, "immediate", {
        /**
         *  Specifies whether to wrap callback in a `setImmediate()` call before
         *  executing. This can be useful if the task is not doing any I/O or using
         *  any JS timers but synchronously blocking the event loop.
         *  @name Task#immediate
         *  @type {boolean}
         */
        get: function () {
            return this._.immediate;
        },
        set: function (value) {
            this._.immediate = utils_1.utils.getBool(value, false);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Task.prototype, "currentRuns", {
        /**
         *  Gets the number of times, this task has been run.
         *  @name Task#currentRuns
         *  @type {number}
         *  @readonly
         */
        get: function () {
            return this._.currentRuns;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Task.prototype, "time", {
        /**
         *  Gets time information for the lifetime of a task.
         *  `#time.started` indicates the first execution time of a task.
         *  `#time.stopped` indicates the last execution time of a task. (`0` if still running.)
         *  `#time.elapsed` indicates the total lifetime of a task.
         *  @name Task#time
         *  @type {ITimeInfo}
         *  @readonly
         */
        get: function () {
            var started = this._.timeOnFirstRun || 0;
            var stopped = this._.timeOnLastRun || 0;
            return Object.freeze({
                started: started,
                stopped: stopped,
                elapsed: stopped - started
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Task.prototype, "callback", {
        /**
         *  Gets the callback function to be executed on each run.
         *  @name Task#callback
         *  @type {TaskCallback}
         *  @readonly
         */
        get: function () {
            return this._.callback;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Task.prototype, "removeOnCompleted", {
        /**
         *  Gets or sets whether to remove the task (to free up memory) when task
         *  has completed its executions (runs). For this to take affect, the task
         *  should have `totalRuns` and/or `stopDate` configured.
         *  @name Task#removeOnCompleted
         *  @type {boolean}
         */
        get: function () {
            return this._.removeOnCompleted;
        },
        set: function (value) {
            this._.removeOnCompleted = utils_1.utils.getBool(value, false);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Task.prototype, "completed", {
        /**
         *  Specifies whether the task has completed all runs (executions) or
         *  `stopDate` is reached. Note that if both `totalRuns` and `stopDate` are
         *  omitted, this will never return `true`; since the task has no execution
         *  limit set.
         *  @name Task#completed
         *  @type {boolean}
         *  @readonly
         */
        get: function () {
            // return faster if already completed
            if (this._markedCompleted)
                return true;
            return Boolean((this.totalRuns && this.currentRuns >= this.totalRuns)
                || (this._.stopDate && Date.now() >= Number(this._.stopDate)));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Task.prototype, "canRunOnTick", {
        /**
         *  Specifies whether the task can run on the current tick of the timer.
         *  @private
         *  @name Task#canRunOnTick
         *  @type {boolean}
         *  @readonly
         */
        get: function () {
            if (this._markedCompleted)
                return false;
            var tickCount = this._.startDate
                ? Math.ceil((Date.now() - Number(this._.startDate)) / this._timer.interval)
                : this._timer.tickCount;
            var timeToRun = !this._.startDate || Date.now() >= Number(this._.startDate);
            var onInterval = tickCount > this.tickDelay && (tickCount - this.tickDelay) % this.tickInterval === 0;
            return Boolean(timeToRun && onInterval);
        },
        enumerable: false,
        configurable: true
    });
    /**
     *  Resets the current number of runs. This will keep the task running for
     *  the same amount of `tickIntervals` initially configured.
     *  @memberof Task
     *  @chainable
     *
     *  @param {ITaskBaseOptions} [options] If set, this will also re-configure the task.
     *
     *  @returns {Task}
     */
    Task.prototype.reset = function (options) {
        this._.currentRuns = 0;
        if (options) {
            var id = options.id;
            if (id && id !== this.id)
                throw new Error('Cannot change ID of a task.');
            options.id = this.id;
            this._init(options);
        }
        return this;
    };
    /**
     *  Serialization to JSON.
     *
     *  Never return string from `toJSON()`. It should return an object.
     *  @private
     */
    Task.prototype.toJSON = function () {
        var obj = __assign({}, this._);
        delete obj.callback;
        return obj;
    };
    // ---------------------------
    // PRIVATE (INSTANCE) MEMBERS
    // ---------------------------
    /**
     *  Set reference to timer itself.
     *  Only called by `TaskTimer`.
     *  @private
     */
    // @ts-ignore: TS6133: declared but never read.
    Task.prototype._setTimer = function (timer) {
        this._timer = timer;
    };
    /**
     *  @private
     */
    Task.prototype._emit = function (name, object) {
        var event = {
            name: name,
            source: this
        };
        /* istanbul ignore else */
        if (object instanceof Error) {
            event.error = object;
        }
        else {
            event.data = object;
        }
        this._timer.emit(name, event);
    };
    /**
     *  `TaskTimer` should be informed if this task is completed. But execution
     *  should be finished. So we do this within the `done()` function.
     *  @private
     */
    Task.prototype._done = function () {
        if (this.completed) {
            this._markedCompleted = true;
            this._.timeOnLastRun = Date.now();
            this._timer._taskCompleted(this);
        }
    };
    /**
     *  @private
     */
    Task.prototype._execCallback = function () {
        var _this = this;
        try {
            var o = this.callback.apply(this, [this, function () { return _this._done(); }]);
            if (this.callback.length >= 2) {
                // handled by done() (called within the task callback by the user)
            }
            else if (utils_1.utils.isPromise(o)) {
                o.then(function () {
                    _this._done();
                })
                    .catch(function (err) {
                    _this._emit(_1.TaskTimer.Event.TASK_ERROR, err);
                });
            }
            else {
                this._done();
            }
        }
        catch (err) {
            this._emit(_1.TaskTimer.Event.TASK_ERROR, err);
        }
    };
    /**
     *  Only used by `TaskTimer`.
     *  @private
     */
    // @ts-ignore: TS6133: declared but never read.
    Task.prototype._run = function (onRun) {
        var _this = this;
        if (!this.enabled || this._markedCompleted)
            return;
        if (this.currentRuns === 0)
            this._.timeOnFirstRun = Date.now();
        // current runs should be set before execution or it might flow if some
        // async runs finishes faster and some other slower.
        this._.currentRuns++;
        onRun();
        if (this.immediate) {
            utils_1.utils.setImmediate(function () { return _this._execCallback(); });
        }
        else {
            this._execCallback();
        }
    };
    /**
     *  @private
     */
    Task.prototype._init = function (options) {
        if (!options || !options.id) {
            throw new Error('A unique task ID is required.');
        }
        if (typeof options.callback !== 'function') {
            throw new Error('A callback function is required for a task to run.');
        }
        var startDate = options.startDate, stopDate = options.stopDate;
        if (startDate && stopDate && startDate >= stopDate) {
            throw new Error('Task start date cannot be the same or after stop date.');
        }
        this._markedCompleted = false;
        this._ = __assign({ currentRuns: 0 }, DEFAULT_TASK_OPTIONS);
        this._.id = String(options.id);
        this._.callback = options.callback;
        this._.startDate = options.startDate || null;
        this._.stopDate = options.stopDate || null;
        // using setters for validation & default values
        this.enabled = options.enabled;
        this.tickDelay = options.tickDelay;
        this.tickInterval = options.tickInterval;
        this.totalRuns = options.totalRuns;
        this.immediate = options.immediate;
        this.removeOnCompleted = options.removeOnCompleted;
    };
    return Task;
}());
exports.Task = Task;


/***/ },

/***/ "./src/TaskCallback.ts"
/*!*****************************!*\
  !*** ./src/TaskCallback.ts ***!
  \*****************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ },

/***/ "./src/TaskTimer.ts"
/*!**************************!*\
  !*** ./src/TaskTimer.ts ***!
  \**************************/
(__unused_webpack_module, exports, __webpack_require__) {


/* tslint:disable:max-file-line-count */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TaskTimer = void 0;
// dep modules
var eventemitter3_1 = __webpack_require__(/*! eventemitter3 */ "./node_modules/eventemitter3/index.js");
// own modules
var _1 = __webpack_require__(/*! . */ "./src/index.ts");
var utils_1 = __webpack_require__(/*! ./utils */ "./src/utils.ts");
/**
 *  @private
 */
var DEFAULT_TIMER_OPTIONS = Object.freeze({
    interval: 1000,
    precision: true,
    stopOnCompleted: false
});
/**
 *  TaskTimer • https://github.com/onury/tasktimer
 *  @license MIT
 *  @copyright 2019, Onur Yıldırım <onur@cutepilot.com>
 */
// ---------------------------
// EventEmitter Docs
// ---------------------------
/**
 *  Calls each of the listeners registered for a given event name.
 *  @name TaskTimer#emit
 *  @function
 *
 *  @param {TaskTimer.Event} eventName - The name of the event to be emitted.
 *  @param {any} [data] - Data to be passed to event listeners.
 *
 *  @returns {Boolean} - `true` if the event had listeners, else `false`.
 */
/**
 *  Return an array listing the events for which the emitter has registered
 *  listeners.
 *  @name TaskTimer#eventNames
 *  @function
 *
 *  @returns {Array} - List of event names.
 */
/**
 *  Adds the listener function to the end of the listeners array for the event
 *  named `eventName`. No checks are made to see if the listener has already
 *  been added. Multiple calls passing the same combination of `eventName` and
 *  `listener` will result in the listener being added, and called, multiple
 *  times.
 *  @name TaskTimer#on
 *  @function
 *  @alias TaskTimer#addListener
 *  @chainable
 *
 *  @param {TaskTimer.Event} eventName - The name of the event to be added.
 *  @param {Function} listener - The callback function to be invoked per event.
 *  @param {*} [context=this] - The context to invoke the listener with.
 *
 *  @returns {TaskTimer} - `{@link #TaskTimer|TaskTimer}` instance.
 *
 *  @example
 *  const timer = new TaskTimer(1000);
 *  // add a listener to be invoked when timer has stopped.
 *  timer.on(TaskTimer.Event.STOPPED, () => {
 *      console.log('Timer has stopped!');
 *  });
 *  timer.start();
 */
/**
 *  Adds a one time listener function for the event named `eventName`. The next
 *  time `eventName` is triggered, this `listener` is removed and then invoked.
 *  @name TaskTimer#once
 *  @function
 *  @chainable
 *
 *  @param {TaskTimer.Event} eventName - The name of the event to be added.
 *  @param {Function} listener - The callback function to be invoked per event.
 *  @param {*} [context=this] - The context to invoke the listener with.
 *
 *  @returns {TaskTimer} - `{@link #TaskTimer|TaskTimer}` instance.
 */
/**
 *  Removes the specified `listener` from the listener array for the event
 *  named `eventName`.
 *  @name TaskTimer#off
 *  @function
 *  @alias TaskTimer#removeListener
 *  @chainable
 *
 *  @param {TaskTimer.Event} eventName - The name of the event to be removed.
 *  @param {Function} listener - The callback function to be invoked per event.
 *  @param {*} [context=this] - Only remove the listeners that have this context.
 *  @param {Boolean} [once=false] - Only remove one-time listeners.
 *
 *  @returns {TaskTimer} - `{@link #TaskTimer|TaskTimer}` instance.
 */
/**
 *  Gets the number of listeners listening to a given event.
 *  @name TaskTimer#listenerCount
 *  @function
 *
 *  @param {TaskTimer.Event} eventName - The name of the event.
 *
 *  @returns {Number} - The number of listeners.
 */
/**
 *  Gets the listeners registered for a given event.
 *  @name TaskTimer#listeners
 *  @function
 *
 *  @param {TaskTimer.Event} eventName - The name of the event.
 *
 *  @returns {Array} - The registered listeners.
 */
/**
 *  Removes all listeners, or those of the specified `eventName`.
 *  @name TaskTimer#removeAllListeners
 *  @function
 *  @chainable
 *
 *  @param {TaskTimer.Event} [eventName] - The name of the event to be removed.
 *
 *  @returns {TaskTimer} - `{@link #TaskTimer|TaskTimer}` instance.
 */
/**
 *  A timer utility for running periodic tasks on the given interval ticks. This
 *  is useful when you want to run or schedule multiple tasks on a single timer
 *  instance.
 *
 *  This class extends `EventEmitter3` which is an `EventEmitter` implementation
 *  for both Node and browser. For detailed information, refer to Node.js
 *  documentation.
 *  @class
 *  @global
 *
 *  @extends EventEmitter
 *
 *  @see
 *  {@link https://nodejs.org/api/events.html#events_class_eventemitter|EventEmitter}
 */
var TaskTimer = /** @class */ (function (_super) {
    __extends(TaskTimer, _super);
    // ---------------------------
    // CONSTRUCTOR
    // ---------------------------
    /**
     *  Constructs a new `TaskTimer` instance with the given time interval (in
     *  milliseconds).
     *  @constructor
     *
     *  @param {ITaskTimerOptions|number} [options] - Either TaskTimer options
     *  or a base interval (in milliseconds). Since the tasks run on ticks
     *  instead of millisecond intervals; this value operates as the base
     *  resolution for all tasks. If you are running heavy tasks, lower interval
     *  requires higher CPU power. This value can be updated any time by setting
     *  the `interval` property on the instance.
     *
     *  @example
     *  const timer = new TaskTimer(1000); // milliseconds
     *  // Execute some code on each tick...
     *  timer.on('tick', () => {
     *      console.log('tick count: ' + timer.tickCount);
     *      console.log('elapsed time: ' + timer.time.elapsed + ' ms.');
     *  });
     *  // add a task named 'heartbeat' that runs every 5 ticks and a total of 10 times.
     *  const task1 = {
     *      id: 'heartbeat',
     *      tickDelay: 20,   // ticks (to wait before first run)
     *      tickInterval: 5, // ticks (interval)
     *      totalRuns: 10,   // times to run
     *      callback(task) { // can also be an async function, returning a promise
     *          console.log(task.id + ' task has run ' + task.currentRuns + ' times.');
     *      }
     *  };
     *  timer.add(task1).start();
     */
    function TaskTimer(options) {
        var _this = _super.call(this) || this;
        _this._timeoutRef = null;
        _this._immediateRef = null;
        _this._runCount = 0;
        _this._reset();
        _this._.opts = {};
        var opts = typeof options === 'number'
            ? { interval: options }
            : options || {};
        _this.interval = opts.interval;
        _this.precision = opts.precision;
        _this.stopOnCompleted = opts.stopOnCompleted;
        return _this;
    }
    Object.defineProperty(TaskTimer.prototype, "interval", {
        // ---------------------------
        // PUBLIC (INSTANCE) PROPERTIES
        // ---------------------------
        /**
         *  Gets or sets the base timer interval in milliseconds.
         *
         *  Since the tasks run on ticks instead of millisecond intervals; this
         *  value operates as the base resolution for all tasks. If you are running
         *  heavy tasks, lower interval requires higher CPU power. This value can be
         *  updated any time.
         *
         *  @name TaskTimer#interval
         *  @type {number}
         */
        get: function () {
            return this._.opts.interval;
        },
        set: function (value) {
            this._.opts.interval = utils_1.utils.getNumber(value, 20, DEFAULT_TIMER_OPTIONS.interval);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TaskTimer.prototype, "precision", {
        /**
         *  Gets or sets whether timer precision enabled.
         *
         *  Because of the single-threaded, asynchronous nature of JavaScript, each
         *  execution takes a piece of CPU time, and the time they have to wait will
         *  vary, depending on the load. This creates a latency and cumulative
         *  difference in asynchronous timers; that gradually increase the
         *  inacuraccy. `TaskTimer` overcomes this problem as much as possible:
         *
         *  <li>The delay between each tick is auto-adjusted when it's off
         *  due to task/CPU loads or clock drifts.</li>
         *  <li>In Node.js, `TaskTimer` also makes use of `process.hrtime()`
         *  high-resolution real-time. The time is relative to an arbitrary
         *  time in the past (not related to the time of day) and therefore not
         *  subject to clock drifts.</li>
         *  <li>The timer may hit a synchronous / blocking task; or detect significant
         *  time drift (longer than the base interval) due to JS event queue, which
         *  cannot be recovered by simply adjusting the next delay. In this case, right
         *  from the next tick onward; it will auto-recover as much as possible by
         *  running "immediate" tasks until it reaches the proper time vs tick/run
         *  balance.</li>
         *
         *  <blockquote><i>Note that precision will be as high as possible but it still
         *  can be off by a few milliseconds; depending on the CPU or the load.</i>
         *  </blockquote>
         *  @name TaskTimer#precision
         *  @type {boolean}
         */
        get: function () {
            return this._.opts.precision;
        },
        set: function (value) {
            this._.opts.precision = utils_1.utils.getBool(value, DEFAULT_TIMER_OPTIONS.precision);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TaskTimer.prototype, "stopOnCompleted", {
        /**
         *  Gets or sets whether the timer should automatically stop when all tasks
         *  are completed. For this to take affect, all added tasks should have
         *  `totalRuns` and/or `stopDate` configured. This option can be set/changed
         *  at any time.
         *  @name TaskTimer#stopOnCompleted
         *  @type {boolean}
         */
        get: function () {
            return this._.opts.stopOnCompleted;
        },
        set: function (value) {
            this._.opts.stopOnCompleted = utils_1.utils.getBool(value, DEFAULT_TIMER_OPTIONS.stopOnCompleted);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TaskTimer.prototype, "state", {
        /**
         *  Gets the current state of the timer.
         *  For possible values, see `TaskTimer.State` enumeration.
         *  @name TaskTimer#state
         *  @type {TaskTimer.State}
         *  @readonly
         */
        get: function () {
            return this._.state;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TaskTimer.prototype, "time", {
        /**
         *  Gets time information for the latest run of the timer.
         *  `#time.started` indicates the start time of the timer.
         *  `#time.stopped` indicates the stop time of the timer. (`0` if still running.)
         *  `#time.elapsed` indicates the elapsed time of the timer.
         *  @name TaskTimer#time
         *  @type {ITimeInfo}
         *  @readonly
         */
        get: function () {
            var _a = this._, startTime = _a.startTime, stopTime = _a.stopTime;
            var t = {
                started: startTime,
                stopped: stopTime,
                elapsed: 0
            };
            if (startTime) {
                var current = this.state !== TaskTimer.State.STOPPED ? Date.now() : stopTime;
                t.elapsed = current - startTime;
            }
            return Object.freeze(t);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TaskTimer.prototype, "tickCount", {
        /**
         *  Gets the current tick count for the latest run of the timer.
         *  This value will be reset to `0` when the timer is stopped or reset.
         *  @name TaskTimer#tickCount
         *  @type {Number}
         *  @readonly
         */
        get: function () {
            return this._.tickCount;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TaskTimer.prototype, "taskCount", {
        /**
         *  Gets the current task count. Tasks remain even after the timer is
         *  stopped. But they will be removed if the timer is reset.
         *  @name TaskTimer#taskCount
         *  @type {Number}
         *  @readonly
         */
        get: function () {
            return Object.keys(this._.tasks).length;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TaskTimer.prototype, "taskRunCount", {
        /**
         *  Gets the total number of all task executions (runs).
         *  @name TaskTimer#taskRunCount
         *  @type {Number}
         *  @readonly
         */
        get: function () {
            return this._.taskRunCount;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TaskTimer.prototype, "runCount", {
        /**
         *  Gets the total number of timer runs, including resumed runs.
         *  @name TaskTimer#runCount
         *  @type {Number}
         *  @readonly
         */
        get: function () {
            return this._runCount;
        },
        enumerable: false,
        configurable: true
    });
    // ---------------------------
    // PUBLIC (INSTANCE) METHODS
    // ---------------------------
    /**
     *  Gets the task with the given ID.
     *  @memberof TaskTimer
     *
     *  @param {String} id - ID of the task.
     *
     *  @returns {Task}
     */
    TaskTimer.prototype.get = function (id) {
        return this._.tasks[id] || null;
    };
    /**
     *  Adds a collection of new tasks for the timer.
     *  @memberof TaskTimer
     *  @chainable
     *
     *  @param {Task|ITaskOptions|TaskCallback|Array} task - Either a
     *  single task, task options object or the callback function; or a mixture
     *  of these as an array.
     *
     *  @returns {TaskTimer}
     *
     *  @throws {Error} - If a task callback is not set or a task with the given
     *  name already exists.
     */
    TaskTimer.prototype.add = function (task) {
        var _this = this;
        if (!utils_1.utils.isset(task)) {
            throw new Error('Either a task, task options or a callback is required.');
        }
        utils_1.utils.ensureArray(task).forEach(function (item) { return _this._add(item); });
        return this;
    };
    /**
     *  Removes the task by the given name.
     *  @memberof TaskTimer
     *  @chainable
     *
     *  @param {string|Task} task - Task to be removed. Either pass the
     *  name or the task itself.
     *
     *  @returns {TaskTimer}
     *
     *  @throws {Error} - If a task with the given name does not exist.
     */
    TaskTimer.prototype.remove = function (task) {
        var id = typeof task === 'string' ? task : task.id;
        task = this.get(id);
        if (!id || !task) {
            throw new Error("No tasks exist with ID: '".concat(id, "'."));
        }
        // first decrement completed tasks count if this is a completed task.
        if (task.completed && this._.completedTaskCount > 0)
            this._.completedTaskCount--;
        this._.tasks[id] = null;
        delete this._.tasks[id];
        this._emit(TaskTimer.Event.TASK_REMOVED, task);
        return this;
    };
    /**
     *  Starts the timer and puts the timer in `RUNNING` state. If it's already
     *  running, this will reset the start/stop time and tick count, but will not
     *  reset (or remove) existing tasks.
     *  @memberof TaskTimer
     *  @chainable
     *
     *  @returns {TaskTimer}
     */
    TaskTimer.prototype.start = function () {
        this._stop();
        this._.state = TaskTimer.State.RUNNING;
        this._runCount++;
        this._.tickCount = 0;
        this._.taskRunCount = 0;
        this._.stopTime = 0;
        this._markTime();
        this._.startTime = Date.now();
        this._emit(TaskTimer.Event.STARTED);
        this._run();
        return this;
    };
    /**
     *  Pauses the timer, puts the timer in `PAUSED` state and all tasks on hold.
     *  @memberof TaskTimer
     *  @chainable
     *
     *  @returns {TaskTimer}
     */
    TaskTimer.prototype.pause = function () {
        if (this.state !== TaskTimer.State.RUNNING)
            return this;
        this._stop();
        this._.state = TaskTimer.State.PAUSED;
        this._emit(TaskTimer.Event.PAUSED);
        return this;
    };
    /**
     *  Resumes the timer and puts the timer in `RUNNING` state; if previuosly
     *  paused. In this state, all existing tasks are resumed.
     *  @memberof TaskTimer
     *  @chainable
     *
     *  @returns {TaskTimer}
     */
    TaskTimer.prototype.resume = function () {
        if (this.state === TaskTimer.State.IDLE) {
            this.start();
            return this;
        }
        if (this.state !== TaskTimer.State.PAUSED)
            return this;
        this._runCount++;
        this._markTime();
        this._.state = TaskTimer.State.RUNNING;
        this._emit(TaskTimer.Event.RESUMED);
        this._run();
        return this;
    };
    /**
     *  Stops the timer and puts the timer in `STOPPED` state. In this state, all
     *  existing tasks are stopped and no values or tasks are reset until
     *  re-started or explicitly calling reset.
     *  @memberof TaskTimer
     *  @chainable
     *
     *  @returns {TaskTimer}
     */
    TaskTimer.prototype.stop = function () {
        if (this.state !== TaskTimer.State.RUNNING)
            return this;
        this._stop();
        this._.stopTime = Date.now();
        this._.state = TaskTimer.State.STOPPED;
        this._emit(TaskTimer.Event.STOPPED);
        return this;
    };
    /**
     *  Stops the timer and puts the timer in `IDLE` state.
     *  This will reset the ticks and removes all tasks silently; meaning no
     *  other events will be emitted such as `"taskRemoved"`.
     *  @memberof TaskTimer
     *  @chainable
     *
     *  @returns {TaskTimer}
     */
    TaskTimer.prototype.reset = function () {
        this._reset();
        this._emit(TaskTimer.Event.RESET);
        return this;
    };
    // ---------------------------
    // PRIVATE (INSTANCE) METHODS
    // ---------------------------
    /**
     *  @private
     */
    TaskTimer.prototype._emit = function (type, data) {
        var event = {
            name: type,
            source: this,
            data: data
        };
        return this.emit(type, event);
    };
    /**
     *  Adds a new task for the timer.
     *  @private
     *
     *  @param {Task|ITaskOptions|TaskCallback} options - Either a task instance,
     *  task options object or the callback function to be executed on tick
     *  intervals.
     *
     *  @returns {TaskTimer}
     *
     *  @throws {Error} - If the task callback is not set or a task with the
     *  given name already exists.
     */
    TaskTimer.prototype._add = function (options) {
        if (typeof options === 'function') {
            options = {
                callback: options
            };
        }
        if (utils_1.utils.type(options) === 'object' && !options.id) {
            options.id = this._getUniqueTaskID();
        }
        if (this.get(options.id)) {
            throw new Error("A task with id '".concat(options.id, "' already exists."));
        }
        var task = options instanceof _1.Task ? options : new _1.Task(options);
        task._setTimer(this);
        this._.tasks[task.id] = task;
        this._emit(TaskTimer.Event.TASK_ADDED, task);
        return this;
    };
    /**
     *  Stops the timer.
     *  @private
     */
    TaskTimer.prototype._stop = function () {
        this._.tickCountAfterResume = 0;
        if (this._timeoutRef) {
            clearTimeout(this._timeoutRef);
            this._timeoutRef = null;
        }
        if (this._immediateRef) {
            utils_1.utils.clearImmediate(this._immediateRef);
            this._immediateRef = null;
        }
    };
    /**
     *  Resets the timer.
     *  @private
     */
    TaskTimer.prototype._reset = function () {
        this._ = {
            opts: (this._ || {}).opts,
            state: TaskTimer.State.IDLE,
            tasks: {},
            tickCount: 0,
            taskRunCount: 0,
            startTime: 0,
            stopTime: 0,
            completedTaskCount: 0,
            resumeTime: 0,
            hrResumeTime: null,
            tickCountAfterResume: 0
        };
        this._stop();
    };
    /**
     *  Called (by Task instance) when it has completed all of its runs.
     *  @private
     */
    // @ts-ignore: TS6133: declared but never read.
    TaskTimer.prototype._taskCompleted = function (task) {
        this._.completedTaskCount++;
        this._emit(TaskTimer.Event.TASK_COMPLETED, task);
        if (this._.completedTaskCount === this.taskCount) {
            this._emit(TaskTimer.Event.COMPLETED);
            if (this.stopOnCompleted)
                this.stop();
        }
        if (task.removeOnCompleted)
            this.remove(task);
    };
    /**
     *  Handler to be executed on each tick.
     *  @private
     */
    TaskTimer.prototype._tick = function () {
        var _this = this;
        this._.state = TaskTimer.State.RUNNING;
        var id;
        var task;
        var tasks = this._.tasks;
        this._.tickCount++;
        this._.tickCountAfterResume++;
        this._emit(TaskTimer.Event.TICK);
        // tslint:disable:forin
        for (id in tasks) {
            task = tasks[id];
            if (!task || !task.canRunOnTick)
                continue;
            // below will not execute if task is disabled or already
            // completed.
            task._run(function () {
                _this._.taskRunCount++;
                _this._emit(TaskTimer.Event.TASK, task);
            });
        }
        this._run();
    };
    /**
     *  Marks the resume (or start) time in milliseconds or high-resolution time
     *  if available.
     *  @private
     */
    TaskTimer.prototype._markTime = function () {
        /* istanbul ignore if */
        if (utils_1.utils.BROWSER) { // tested separately
            this._.resumeTime = Date.now();
        }
        else {
            this._.hrResumeTime = process.hrtime();
        }
    };
    /**
     *  Gets the time difference in milliseconds sinct the last resume or start
     *  time.
     *  @private
     */
    TaskTimer.prototype._getTimeDiff = function () {
        // Date.now() is ~2x faster than Date#getTime()
        /* istanbul ignore if */
        if (utils_1.utils.BROWSER)
            return Date.now() - this._.resumeTime; // tested separately
        var hrDiff = process.hrtime(this._.hrResumeTime);
        return Math.ceil((hrDiff[0] * 1000) + (hrDiff[1] / 1e6));
    };
    /**
     *  Runs the timer.
     *  @private
     */
    TaskTimer.prototype._run = function () {
        var _this = this;
        if (this.state !== TaskTimer.State.RUNNING)
            return;
        var interval = this.interval;
        // we'll get a precise interval by checking if our clock is already
        // drifted.
        if (this.precision) {
            var diff = this._getTimeDiff();
            // did we reach this expected tick count for the given time period?
            // calculated count should not be greater than tickCountAfterResume
            if (Math.floor(diff / interval) > this._.tickCountAfterResume) {
                // if we're really late, run immediately!
                this._immediateRef = utils_1.utils.setImmediate(function () { return _this._tick(); });
                return;
            }
            // if we still have time but a bit off, update next interval.
            interval = interval - (diff % interval);
        }
        this._timeoutRef = setTimeout(function () { return _this._tick(); }, interval);
    };
    /**
     *  Gets a unique task ID.
     *  @private
     */
    TaskTimer.prototype._getUniqueTaskID = function () {
        var num = this.taskCount;
        var id;
        while (!id || this.get(id)) {
            num++;
            id = 'task' + num;
        }
        return id;
    };
    return TaskTimer;
}(eventemitter3_1.EventEmitter));
exports.TaskTimer = TaskTimer;
// ---------------------------
// NAMESPACE
// ---------------------------
// tslint:disable:no-namespace
/* istanbul ignore next */
/** @private */
(function (TaskTimer) {
    /**
     *  Represents the class that holds the configurations and the callback function
     *  required to run a task. See {@link api/#Task|class information}.
     *  @name TaskTimer.Task
     *  @class
     */
    TaskTimer.Task = _1.Task;
    /**
     *  Enumerates `TaskTimer` states.
     *  @memberof TaskTimer
     *  @enum {String}
     *  @readonly
     */
    var State;
    (function (State) {
        /**
         *  Indicates that the timer is in `idle` state.
         *  This is the initial state when the `TaskTimer` instance is first created.
         *  Also when an existing timer is reset, it will be `idle`.
         *  @type {String}
         */
        State["IDLE"] = "idle";
        /**
         *  Indicates that the timer is in `running` state; such as when the timer is
         *  started or resumed.
         *  @type {String}
         */
        State["RUNNING"] = "running";
        /**
         *  Indicates that the timer is in `paused` state.
         *  @type {String}
         */
        State["PAUSED"] = "paused";
        /**
         *  Indicates that the timer is in `stopped` state.
         *  @type {String}
         */
        State["STOPPED"] = "stopped";
    })(State = TaskTimer.State || (TaskTimer.State = {}));
    /**
     *  Enumerates the `TaskTimer` event types.
     *  @memberof TaskTimer
     *  @enum {String}
     *  @readonly
     */
    var Event;
    (function (Event) {
        /**
         *  Emitted on each tick (interval) of `TaskTimer`.
         *  @type {String}
         */
        Event["TICK"] = "tick";
        /**
         *  Emitted when the timer is put in `RUNNING` state; such as when the timer is
         *  started.
         *  @type {String}
         */
        Event["STARTED"] = "started";
        /**
         *  Emitted when the timer is put in `RUNNING` state; such as when the timer is
         *  resumed.
         *  @type {String}
         */
        Event["RESUMED"] = "resumed";
        /**
         *  Emitted when the timer is put in `PAUSED` state.
         *  @type {String}
         */
        Event["PAUSED"] = "paused";
        /**
         *  Emitted when the timer is put in `STOPPED` state.
         *  @type {String}
         */
        Event["STOPPED"] = "stopped";
        /**
         *  Emitted when the timer is reset.
         *  @type {String}
         */
        Event["RESET"] = "reset";
        /**
         *  Emitted when a task is executed.
         *  @type {String}
         */
        Event["TASK"] = "task";
        /**
         *  Emitted when a task is added to `TaskTimer` instance.
         *  @type {String}
         */
        Event["TASK_ADDED"] = "taskAdded";
        /**
         *  Emitted when a task is removed from `TaskTimer` instance.
         *  Note that this will not be emitted when `.reset()` is called; which
         *  removes all tasks silently.
         *  @type {String}
         */
        Event["TASK_REMOVED"] = "taskRemoved";
        /**
         *  Emitted when a task has completed all of its executions (runs)
         *  or reached its stopping date/time (if set). Note that this event
         *  will only be fired if the tasks has a `totalRuns` limit or a
         *  `stopDate` value set.
         *  @type {String}
         */
        Event["TASK_COMPLETED"] = "taskCompleted";
        /**
         *  Emitted when a task produces an error on its execution.
         *  @type {String}
         */
        Event["TASK_ERROR"] = "taskError";
        /**
         *  Emitted when all tasks have completed all of their executions (runs)
         *  or reached their stopping date/time (if set). Note that this event
         *  will only be fired if all tasks have a `totalRuns` limit or a
         *  `stopDate` value set.
         *  @type {String}
         */
        Event["COMPLETED"] = "completed";
    })(Event = TaskTimer.Event || (TaskTimer.Event = {}));
})(TaskTimer || (exports.TaskTimer = TaskTimer = {}));


/***/ },

/***/ "./src/index.ts"
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(/*! ./ITaskOptions */ "./src/ITaskOptions.ts"), exports);
__exportStar(__webpack_require__(/*! ./ITaskTimerOptions */ "./src/ITaskTimerOptions.ts"), exports);
__exportStar(__webpack_require__(/*! ./ITaskTimerEvent */ "./src/ITaskTimerEvent.ts"), exports);
__exportStar(__webpack_require__(/*! ./ITimeInfo */ "./src/ITimeInfo.ts"), exports);
__exportStar(__webpack_require__(/*! ./Task */ "./src/Task.ts"), exports);
__exportStar(__webpack_require__(/*! ./TaskCallback */ "./src/TaskCallback.ts"), exports);
__exportStar(__webpack_require__(/*! ./TaskTimer */ "./src/TaskTimer.ts"), exports);


/***/ },

/***/ "./src/utils.ts"
/*!**********************!*\
  !*** ./src/utils.ts ***!
  \**********************/
(__unused_webpack_module, exports) {


var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.utils = void 0;
var proto = Object.prototype;
var NODE = typeof setImmediate === 'function'
    && typeof process === 'object'
    && typeof process.hrtime === 'function';
var BROWSER = !NODE;
/** @private */
var utils = {
    NODE: NODE,
    BROWSER: BROWSER,
    type: function (o) {
        return proto.toString.call(o).match(/\s(\w+)/i)[1].toLowerCase();
    },
    isset: function (o) {
        return o !== null && o !== undefined;
    },
    ensureArray: function (o) {
        return utils.isset(o)
            ? !Array.isArray(o) ? [o] : o
            : [];
    },
    getNumber: function (value, minimum, defaultValue) {
        return typeof value === 'number'
            ? (value < minimum ? minimum : value)
            : defaultValue;
    },
    getBool: function (value, defaultValue) {
        return typeof value !== 'boolean'
            ? defaultValue
            : value;
    },
    setImmediate: function (cb) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        /* istanbul ignore if */
        if (utils.BROWSER) { // tested separately
            return setTimeout(cb.apply(null, args), 0);
        }
        return setImmediate.apply(void 0, __spreadArray([cb], args, false));
    },
    clearImmediate: function (id) {
        /* istanbul ignore next */
        if (!id)
            return;
        /* istanbul ignore if */
        if (utils.BROWSER)
            return clearTimeout(id); // tested separately
        clearImmediate(id);
    },
    /**
     *  Checks whether the given value is a promise.
     *  @private
     *  @param {any} value - Value to be checked.
     *  @return {boolean}
     */
    isPromise: function (value) {
        return value
            && utils.type(value) === 'promise'
            && typeof value.then === 'function';
    }
};
exports.utils = utils;


/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		if (!(moduleId in __webpack_modules__)) {
/******/ 			delete __webpack_module_cache__[moduleId];
/******/ 			var e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.ts");
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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S0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQjtBQUNuQjtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUI7QUFDbkI7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQjtBQUNuQjtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUI7QUFDbkI7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUI7QUFDbkI7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQjtBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CO0FBQ25CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYixTQUFTO0FBQ1Q7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQjtBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQjtBQUNuQjtBQUNBO0FBQ0E7QUFD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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLHlCQUF5Qix1QkFBdUI7QUFDaEQ7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCO0FBQzdCO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQ0FBcUM7QUFDckM7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLEtBQUs7QUFDckIsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTs7Ozs7OztVQzFFYjtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7O1VFNUJBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdGFza3RpbWVyL3dlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIndlYnBhY2s6Ly90YXNrdGltZXIvLi9ub2RlX21vZHVsZXMvZXZlbnRlbWl0dGVyMy9pbmRleC5qcyIsIndlYnBhY2s6Ly90YXNrdGltZXIvLi9zcmMvSVRhc2tPcHRpb25zLnRzIiwid2VicGFjazovL3Rhc2t0aW1lci8uL3NyYy9JVGFza1RpbWVyRXZlbnQudHMiLCJ3ZWJwYWNrOi8vdGFza3RpbWVyLy4vc3JjL0lUYXNrVGltZXJPcHRpb25zLnRzIiwid2VicGFjazovL3Rhc2t0aW1lci8uL3NyYy9JVGltZUluZm8udHMiLCJ3ZWJwYWNrOi8vdGFza3RpbWVyLy4vc3JjL1Rhc2sudHMiLCJ3ZWJwYWNrOi8vdGFza3RpbWVyLy4vc3JjL1Rhc2tDYWxsYmFjay50cyIsIndlYnBhY2s6Ly90YXNrdGltZXIvLi9zcmMvVGFza1RpbWVyLnRzIiwid2VicGFjazovL3Rhc2t0aW1lci8uL3NyYy9pbmRleC50cyIsIndlYnBhY2s6Ly90YXNrdGltZXIvLi9zcmMvdXRpbHMudHMiLCJ3ZWJwYWNrOi8vdGFza3RpbWVyL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3Rhc2t0aW1lci93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL3Rhc2t0aW1lci93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vdGFza3RpbWVyL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShcInRhc2t0aW1lclwiLCBbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJ0YXNrdGltZXJcIl0gPSBmYWN0b3J5KCk7XG5cdGVsc2Vcblx0XHRyb290W1widGFza3RpbWVyXCJdID0gZmFjdG9yeSgpO1xufSkodGhpcywgKCkgPT4ge1xucmV0dXJuICIsIid1c2Ugc3RyaWN0JztcblxudmFyIGhhcyA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHlcbiAgLCBwcmVmaXggPSAnfic7XG5cbi8qKlxuICogQ29uc3RydWN0b3IgdG8gY3JlYXRlIGEgc3RvcmFnZSBmb3Igb3VyIGBFRWAgb2JqZWN0cy5cbiAqIEFuIGBFdmVudHNgIGluc3RhbmNlIGlzIGEgcGxhaW4gb2JqZWN0IHdob3NlIHByb3BlcnRpZXMgYXJlIGV2ZW50IG5hbWVzLlxuICpcbiAqIEBjb25zdHJ1Y3RvclxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gRXZlbnRzKCkge31cblxuLy9cbi8vIFdlIHRyeSB0byBub3QgaW5oZXJpdCBmcm9tIGBPYmplY3QucHJvdG90eXBlYC4gSW4gc29tZSBlbmdpbmVzIGNyZWF0aW5nIGFuXG4vLyBpbnN0YW5jZSBpbiB0aGlzIHdheSBpcyBmYXN0ZXIgdGhhbiBjYWxsaW5nIGBPYmplY3QuY3JlYXRlKG51bGwpYCBkaXJlY3RseS5cbi8vIElmIGBPYmplY3QuY3JlYXRlKG51bGwpYCBpcyBub3Qgc3VwcG9ydGVkIHdlIHByZWZpeCB0aGUgZXZlbnQgbmFtZXMgd2l0aCBhXG4vLyBjaGFyYWN0ZXIgdG8gbWFrZSBzdXJlIHRoYXQgdGhlIGJ1aWx0LWluIG9iamVjdCBwcm9wZXJ0aWVzIGFyZSBub3Rcbi8vIG92ZXJyaWRkZW4gb3IgdXNlZCBhcyBhbiBhdHRhY2sgdmVjdG9yLlxuLy9cbmlmIChPYmplY3QuY3JlYXRlKSB7XG4gIEV2ZW50cy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuXG4gIC8vXG4gIC8vIFRoaXMgaGFjayBpcyBuZWVkZWQgYmVjYXVzZSB0aGUgYF9fcHJvdG9fX2AgcHJvcGVydHkgaXMgc3RpbGwgaW5oZXJpdGVkIGluXG4gIC8vIHNvbWUgb2xkIGJyb3dzZXJzIGxpa2UgQW5kcm9pZCA0LCBpUGhvbmUgNS4xLCBPcGVyYSAxMSBhbmQgU2FmYXJpIDUuXG4gIC8vXG4gIGlmICghbmV3IEV2ZW50cygpLl9fcHJvdG9fXykgcHJlZml4ID0gZmFsc2U7XG59XG5cbi8qKlxuICogUmVwcmVzZW50YXRpb24gb2YgYSBzaW5nbGUgZXZlbnQgbGlzdGVuZXIuXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGxpc3RlbmVyIGZ1bmN0aW9uLlxuICogQHBhcmFtIHsqfSBjb250ZXh0IFRoZSBjb250ZXh0IHRvIGludm9rZSB0aGUgbGlzdGVuZXIgd2l0aC5cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW29uY2U9ZmFsc2VdIFNwZWNpZnkgaWYgdGhlIGxpc3RlbmVyIGlzIGEgb25lLXRpbWUgbGlzdGVuZXIuXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIEVFKGZuLCBjb250ZXh0LCBvbmNlKSB7XG4gIHRoaXMuZm4gPSBmbjtcbiAgdGhpcy5jb250ZXh0ID0gY29udGV4dDtcbiAgdGhpcy5vbmNlID0gb25jZSB8fCBmYWxzZTtcbn1cblxuLyoqXG4gKiBBZGQgYSBsaXN0ZW5lciBmb3IgYSBnaXZlbiBldmVudC5cbiAqXG4gKiBAcGFyYW0ge0V2ZW50RW1pdHRlcn0gZW1pdHRlciBSZWZlcmVuY2UgdG8gdGhlIGBFdmVudEVtaXR0ZXJgIGluc3RhbmNlLlxuICogQHBhcmFtIHsoU3RyaW5nfFN5bWJvbCl9IGV2ZW50IFRoZSBldmVudCBuYW1lLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGxpc3RlbmVyIGZ1bmN0aW9uLlxuICogQHBhcmFtIHsqfSBjb250ZXh0IFRoZSBjb250ZXh0IHRvIGludm9rZSB0aGUgbGlzdGVuZXIgd2l0aC5cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gb25jZSBTcGVjaWZ5IGlmIHRoZSBsaXN0ZW5lciBpcyBhIG9uZS10aW1lIGxpc3RlbmVyLlxuICogQHJldHVybnMge0V2ZW50RW1pdHRlcn1cbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIGFkZExpc3RlbmVyKGVtaXR0ZXIsIGV2ZW50LCBmbiwgY29udGV4dCwgb25jZSkge1xuICBpZiAodHlwZW9mIGZuICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIGxpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuICB9XG5cbiAgdmFyIGxpc3RlbmVyID0gbmV3IEVFKGZuLCBjb250ZXh0IHx8IGVtaXR0ZXIsIG9uY2UpXG4gICAgLCBldnQgPSBwcmVmaXggPyBwcmVmaXggKyBldmVudCA6IGV2ZW50O1xuXG4gIGlmICghZW1pdHRlci5fZXZlbnRzW2V2dF0pIGVtaXR0ZXIuX2V2ZW50c1tldnRdID0gbGlzdGVuZXIsIGVtaXR0ZXIuX2V2ZW50c0NvdW50Kys7XG4gIGVsc2UgaWYgKCFlbWl0dGVyLl9ldmVudHNbZXZ0XS5mbikgZW1pdHRlci5fZXZlbnRzW2V2dF0ucHVzaChsaXN0ZW5lcik7XG4gIGVsc2UgZW1pdHRlci5fZXZlbnRzW2V2dF0gPSBbZW1pdHRlci5fZXZlbnRzW2V2dF0sIGxpc3RlbmVyXTtcblxuICByZXR1cm4gZW1pdHRlcjtcbn1cblxuLyoqXG4gKiBDbGVhciBldmVudCBieSBuYW1lLlxuICpcbiAqIEBwYXJhbSB7RXZlbnRFbWl0dGVyfSBlbWl0dGVyIFJlZmVyZW5jZSB0byB0aGUgYEV2ZW50RW1pdHRlcmAgaW5zdGFuY2UuXG4gKiBAcGFyYW0geyhTdHJpbmd8U3ltYm9sKX0gZXZ0IFRoZSBFdmVudCBuYW1lLlxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gY2xlYXJFdmVudChlbWl0dGVyLCBldnQpIHtcbiAgaWYgKC0tZW1pdHRlci5fZXZlbnRzQ291bnQgPT09IDApIGVtaXR0ZXIuX2V2ZW50cyA9IG5ldyBFdmVudHMoKTtcbiAgZWxzZSBkZWxldGUgZW1pdHRlci5fZXZlbnRzW2V2dF07XG59XG5cbi8qKlxuICogTWluaW1hbCBgRXZlbnRFbWl0dGVyYCBpbnRlcmZhY2UgdGhhdCBpcyBtb2xkZWQgYWdhaW5zdCB0aGUgTm9kZS5qc1xuICogYEV2ZW50RW1pdHRlcmAgaW50ZXJmYWNlLlxuICpcbiAqIEBjb25zdHJ1Y3RvclxuICogQHB1YmxpY1xuICovXG5mdW5jdGlvbiBFdmVudEVtaXR0ZXIoKSB7XG4gIHRoaXMuX2V2ZW50cyA9IG5ldyBFdmVudHMoKTtcbiAgdGhpcy5fZXZlbnRzQ291bnQgPSAwO1xufVxuXG4vKipcbiAqIFJldHVybiBhbiBhcnJheSBsaXN0aW5nIHRoZSBldmVudHMgZm9yIHdoaWNoIHRoZSBlbWl0dGVyIGhhcyByZWdpc3RlcmVkXG4gKiBsaXN0ZW5lcnMuXG4gKlxuICogQHJldHVybnMge0FycmF5fVxuICogQHB1YmxpY1xuICovXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmV2ZW50TmFtZXMgPSBmdW5jdGlvbiBldmVudE5hbWVzKCkge1xuICB2YXIgbmFtZXMgPSBbXVxuICAgICwgZXZlbnRzXG4gICAgLCBuYW1lO1xuXG4gIGlmICh0aGlzLl9ldmVudHNDb3VudCA9PT0gMCkgcmV0dXJuIG5hbWVzO1xuXG4gIGZvciAobmFtZSBpbiAoZXZlbnRzID0gdGhpcy5fZXZlbnRzKSkge1xuICAgIGlmIChoYXMuY2FsbChldmVudHMsIG5hbWUpKSBuYW1lcy5wdXNoKHByZWZpeCA/IG5hbWUuc2xpY2UoMSkgOiBuYW1lKTtcbiAgfVxuXG4gIGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKSB7XG4gICAgcmV0dXJuIG5hbWVzLmNvbmNhdChPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKGV2ZW50cykpO1xuICB9XG5cbiAgcmV0dXJuIG5hbWVzO1xufTtcblxuLyoqXG4gKiBSZXR1cm4gdGhlIGxpc3RlbmVycyByZWdpc3RlcmVkIGZvciBhIGdpdmVuIGV2ZW50LlxuICpcbiAqIEBwYXJhbSB7KFN0cmluZ3xTeW1ib2wpfSBldmVudCBUaGUgZXZlbnQgbmFtZS5cbiAqIEByZXR1cm5zIHtBcnJheX0gVGhlIHJlZ2lzdGVyZWQgbGlzdGVuZXJzLlxuICogQHB1YmxpY1xuICovXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVycyA9IGZ1bmN0aW9uIGxpc3RlbmVycyhldmVudCkge1xuICB2YXIgZXZ0ID0gcHJlZml4ID8gcHJlZml4ICsgZXZlbnQgOiBldmVudFxuICAgICwgaGFuZGxlcnMgPSB0aGlzLl9ldmVudHNbZXZ0XTtcblxuICBpZiAoIWhhbmRsZXJzKSByZXR1cm4gW107XG4gIGlmIChoYW5kbGVycy5mbikgcmV0dXJuIFtoYW5kbGVycy5mbl07XG5cbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBoYW5kbGVycy5sZW5ndGgsIGVlID0gbmV3IEFycmF5KGwpOyBpIDwgbDsgaSsrKSB7XG4gICAgZWVbaV0gPSBoYW5kbGVyc1tpXS5mbjtcbiAgfVxuXG4gIHJldHVybiBlZTtcbn07XG5cbi8qKlxuICogUmV0dXJuIHRoZSBudW1iZXIgb2YgbGlzdGVuZXJzIGxpc3RlbmluZyB0byBhIGdpdmVuIGV2ZW50LlxuICpcbiAqIEBwYXJhbSB7KFN0cmluZ3xTeW1ib2wpfSBldmVudCBUaGUgZXZlbnQgbmFtZS5cbiAqIEByZXR1cm5zIHtOdW1iZXJ9IFRoZSBudW1iZXIgb2YgbGlzdGVuZXJzLlxuICogQHB1YmxpY1xuICovXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVyQ291bnQgPSBmdW5jdGlvbiBsaXN0ZW5lckNvdW50KGV2ZW50KSB7XG4gIHZhciBldnQgPSBwcmVmaXggPyBwcmVmaXggKyBldmVudCA6IGV2ZW50XG4gICAgLCBsaXN0ZW5lcnMgPSB0aGlzLl9ldmVudHNbZXZ0XTtcblxuICBpZiAoIWxpc3RlbmVycykgcmV0dXJuIDA7XG4gIGlmIChsaXN0ZW5lcnMuZm4pIHJldHVybiAxO1xuICByZXR1cm4gbGlzdGVuZXJzLmxlbmd0aDtcbn07XG5cbi8qKlxuICogQ2FsbHMgZWFjaCBvZiB0aGUgbGlzdGVuZXJzIHJlZ2lzdGVyZWQgZm9yIGEgZ2l2ZW4gZXZlbnQuXG4gKlxuICogQHBhcmFtIHsoU3RyaW5nfFN5bWJvbCl9IGV2ZW50IFRoZSBldmVudCBuYW1lLlxuICogQHJldHVybnMge0Jvb2xlYW59IGB0cnVlYCBpZiB0aGUgZXZlbnQgaGFkIGxpc3RlbmVycywgZWxzZSBgZmFsc2VgLlxuICogQHB1YmxpY1xuICovXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbiBlbWl0KGV2ZW50LCBhMSwgYTIsIGEzLCBhNCwgYTUpIHtcbiAgdmFyIGV2dCA9IHByZWZpeCA/IHByZWZpeCArIGV2ZW50IDogZXZlbnQ7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHNbZXZ0XSkgcmV0dXJuIGZhbHNlO1xuXG4gIHZhciBsaXN0ZW5lcnMgPSB0aGlzLl9ldmVudHNbZXZ0XVxuICAgICwgbGVuID0gYXJndW1lbnRzLmxlbmd0aFxuICAgICwgYXJnc1xuICAgICwgaTtcblxuICBpZiAobGlzdGVuZXJzLmZuKSB7XG4gICAgaWYgKGxpc3RlbmVycy5vbmNlKSB0aGlzLnJlbW92ZUxpc3RlbmVyKGV2ZW50LCBsaXN0ZW5lcnMuZm4sIHVuZGVmaW5lZCwgdHJ1ZSk7XG5cbiAgICBzd2l0Y2ggKGxlbikge1xuICAgICAgY2FzZSAxOiByZXR1cm4gbGlzdGVuZXJzLmZuLmNhbGwobGlzdGVuZXJzLmNvbnRleHQpLCB0cnVlO1xuICAgICAgY2FzZSAyOiByZXR1cm4gbGlzdGVuZXJzLmZuLmNhbGwobGlzdGVuZXJzLmNvbnRleHQsIGExKSwgdHJ1ZTtcbiAgICAgIGNhc2UgMzogcmV0dXJuIGxpc3RlbmVycy5mbi5jYWxsKGxpc3RlbmVycy5jb250ZXh0LCBhMSwgYTIpLCB0cnVlO1xuICAgICAgY2FzZSA0OiByZXR1cm4gbGlzdGVuZXJzLmZuLmNhbGwobGlzdGVuZXJzLmNvbnRleHQsIGExLCBhMiwgYTMpLCB0cnVlO1xuICAgICAgY2FzZSA1OiByZXR1cm4gbGlzdGVuZXJzLmZuLmNhbGwobGlzdGVuZXJzLmNvbnRleHQsIGExLCBhMiwgYTMsIGE0KSwgdHJ1ZTtcbiAgICAgIGNhc2UgNjogcmV0dXJuIGxpc3RlbmVycy5mbi5jYWxsKGxpc3RlbmVycy5jb250ZXh0LCBhMSwgYTIsIGEzLCBhNCwgYTUpLCB0cnVlO1xuICAgIH1cblxuICAgIGZvciAoaSA9IDEsIGFyZ3MgPSBuZXcgQXJyYXkobGVuIC0xKTsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICB9XG5cbiAgICBsaXN0ZW5lcnMuZm4uYXBwbHkobGlzdGVuZXJzLmNvbnRleHQsIGFyZ3MpO1xuICB9IGVsc2Uge1xuICAgIHZhciBsZW5ndGggPSBsaXN0ZW5lcnMubGVuZ3RoXG4gICAgICAsIGo7XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChsaXN0ZW5lcnNbaV0ub25jZSkgdGhpcy5yZW1vdmVMaXN0ZW5lcihldmVudCwgbGlzdGVuZXJzW2ldLmZuLCB1bmRlZmluZWQsIHRydWUpO1xuXG4gICAgICBzd2l0Y2ggKGxlbikge1xuICAgICAgICBjYXNlIDE6IGxpc3RlbmVyc1tpXS5mbi5jYWxsKGxpc3RlbmVyc1tpXS5jb250ZXh0KTsgYnJlYWs7XG4gICAgICAgIGNhc2UgMjogbGlzdGVuZXJzW2ldLmZuLmNhbGwobGlzdGVuZXJzW2ldLmNvbnRleHQsIGExKTsgYnJlYWs7XG4gICAgICAgIGNhc2UgMzogbGlzdGVuZXJzW2ldLmZuLmNhbGwobGlzdGVuZXJzW2ldLmNvbnRleHQsIGExLCBhMik7IGJyZWFrO1xuICAgICAgICBjYXNlIDQ6IGxpc3RlbmVyc1tpXS5mbi5jYWxsKGxpc3RlbmVyc1tpXS5jb250ZXh0LCBhMSwgYTIsIGEzKTsgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgaWYgKCFhcmdzKSBmb3IgKGogPSAxLCBhcmdzID0gbmV3IEFycmF5KGxlbiAtMSk7IGogPCBsZW47IGorKykge1xuICAgICAgICAgICAgYXJnc1tqIC0gMV0gPSBhcmd1bWVudHNbal07XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbGlzdGVuZXJzW2ldLmZuLmFwcGx5KGxpc3RlbmVyc1tpXS5jb250ZXh0LCBhcmdzKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn07XG5cbi8qKlxuICogQWRkIGEgbGlzdGVuZXIgZm9yIGEgZ2l2ZW4gZXZlbnQuXG4gKlxuICogQHBhcmFtIHsoU3RyaW5nfFN5bWJvbCl9IGV2ZW50IFRoZSBldmVudCBuYW1lLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGxpc3RlbmVyIGZ1bmN0aW9uLlxuICogQHBhcmFtIHsqfSBbY29udGV4dD10aGlzXSBUaGUgY29udGV4dCB0byBpbnZva2UgdGhlIGxpc3RlbmVyIHdpdGguXG4gKiBAcmV0dXJucyB7RXZlbnRFbWl0dGVyfSBgdGhpc2AuXG4gKiBAcHVibGljXG4gKi9cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub24gPSBmdW5jdGlvbiBvbihldmVudCwgZm4sIGNvbnRleHQpIHtcbiAgcmV0dXJuIGFkZExpc3RlbmVyKHRoaXMsIGV2ZW50LCBmbiwgY29udGV4dCwgZmFsc2UpO1xufTtcblxuLyoqXG4gKiBBZGQgYSBvbmUtdGltZSBsaXN0ZW5lciBmb3IgYSBnaXZlbiBldmVudC5cbiAqXG4gKiBAcGFyYW0geyhTdHJpbmd8U3ltYm9sKX0gZXZlbnQgVGhlIGV2ZW50IG5hbWUuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgbGlzdGVuZXIgZnVuY3Rpb24uXG4gKiBAcGFyYW0geyp9IFtjb250ZXh0PXRoaXNdIFRoZSBjb250ZXh0IHRvIGludm9rZSB0aGUgbGlzdGVuZXIgd2l0aC5cbiAqIEByZXR1cm5zIHtFdmVudEVtaXR0ZXJ9IGB0aGlzYC5cbiAqIEBwdWJsaWNcbiAqL1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24gb25jZShldmVudCwgZm4sIGNvbnRleHQpIHtcbiAgcmV0dXJuIGFkZExpc3RlbmVyKHRoaXMsIGV2ZW50LCBmbiwgY29udGV4dCwgdHJ1ZSk7XG59O1xuXG4vKipcbiAqIFJlbW92ZSB0aGUgbGlzdGVuZXJzIG9mIGEgZ2l2ZW4gZXZlbnQuXG4gKlxuICogQHBhcmFtIHsoU3RyaW5nfFN5bWJvbCl9IGV2ZW50IFRoZSBldmVudCBuYW1lLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gT25seSByZW1vdmUgdGhlIGxpc3RlbmVycyB0aGF0IG1hdGNoIHRoaXMgZnVuY3Rpb24uXG4gKiBAcGFyYW0geyp9IGNvbnRleHQgT25seSByZW1vdmUgdGhlIGxpc3RlbmVycyB0aGF0IGhhdmUgdGhpcyBjb250ZXh0LlxuICogQHBhcmFtIHtCb29sZWFufSBvbmNlIE9ubHkgcmVtb3ZlIG9uZS10aW1lIGxpc3RlbmVycy5cbiAqIEByZXR1cm5zIHtFdmVudEVtaXR0ZXJ9IGB0aGlzYC5cbiAqIEBwdWJsaWNcbiAqL1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lciA9IGZ1bmN0aW9uIHJlbW92ZUxpc3RlbmVyKGV2ZW50LCBmbiwgY29udGV4dCwgb25jZSkge1xuICB2YXIgZXZ0ID0gcHJlZml4ID8gcHJlZml4ICsgZXZlbnQgOiBldmVudDtcblxuICBpZiAoIXRoaXMuX2V2ZW50c1tldnRdKSByZXR1cm4gdGhpcztcbiAgaWYgKCFmbikge1xuICAgIGNsZWFyRXZlbnQodGhpcywgZXZ0KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHZhciBsaXN0ZW5lcnMgPSB0aGlzLl9ldmVudHNbZXZ0XTtcblxuICBpZiAobGlzdGVuZXJzLmZuKSB7XG4gICAgaWYgKFxuICAgICAgbGlzdGVuZXJzLmZuID09PSBmbiAmJlxuICAgICAgKCFvbmNlIHx8IGxpc3RlbmVycy5vbmNlKSAmJlxuICAgICAgKCFjb250ZXh0IHx8IGxpc3RlbmVycy5jb250ZXh0ID09PSBjb250ZXh0KVxuICAgICkge1xuICAgICAgY2xlYXJFdmVudCh0aGlzLCBldnQpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBmb3IgKHZhciBpID0gMCwgZXZlbnRzID0gW10sIGxlbmd0aCA9IGxpc3RlbmVycy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgaWYgKFxuICAgICAgICBsaXN0ZW5lcnNbaV0uZm4gIT09IGZuIHx8XG4gICAgICAgIChvbmNlICYmICFsaXN0ZW5lcnNbaV0ub25jZSkgfHxcbiAgICAgICAgKGNvbnRleHQgJiYgbGlzdGVuZXJzW2ldLmNvbnRleHQgIT09IGNvbnRleHQpXG4gICAgICApIHtcbiAgICAgICAgZXZlbnRzLnB1c2gobGlzdGVuZXJzW2ldKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvL1xuICAgIC8vIFJlc2V0IHRoZSBhcnJheSwgb3IgcmVtb3ZlIGl0IGNvbXBsZXRlbHkgaWYgd2UgaGF2ZSBubyBtb3JlIGxpc3RlbmVycy5cbiAgICAvL1xuICAgIGlmIChldmVudHMubGVuZ3RoKSB0aGlzLl9ldmVudHNbZXZ0XSA9IGV2ZW50cy5sZW5ndGggPT09IDEgPyBldmVudHNbMF0gOiBldmVudHM7XG4gICAgZWxzZSBjbGVhckV2ZW50KHRoaXMsIGV2dCk7XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogUmVtb3ZlIGFsbCBsaXN0ZW5lcnMsIG9yIHRob3NlIG9mIHRoZSBzcGVjaWZpZWQgZXZlbnQuXG4gKlxuICogQHBhcmFtIHsoU3RyaW5nfFN5bWJvbCl9IFtldmVudF0gVGhlIGV2ZW50IG5hbWUuXG4gKiBAcmV0dXJucyB7RXZlbnRFbWl0dGVyfSBgdGhpc2AuXG4gKiBAcHVibGljXG4gKi9cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlQWxsTGlzdGVuZXJzID0gZnVuY3Rpb24gcmVtb3ZlQWxsTGlzdGVuZXJzKGV2ZW50KSB7XG4gIHZhciBldnQ7XG5cbiAgaWYgKGV2ZW50KSB7XG4gICAgZXZ0ID0gcHJlZml4ID8gcHJlZml4ICsgZXZlbnQgOiBldmVudDtcbiAgICBpZiAodGhpcy5fZXZlbnRzW2V2dF0pIGNsZWFyRXZlbnQodGhpcywgZXZ0KTtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLl9ldmVudHMgPSBuZXcgRXZlbnRzKCk7XG4gICAgdGhpcy5fZXZlbnRzQ291bnQgPSAwO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vL1xuLy8gQWxpYXMgbWV0aG9kcyBuYW1lcyBiZWNhdXNlIHBlb3BsZSByb2xsIGxpa2UgdGhhdC5cbi8vXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9mZiA9IEV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXI7XG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyID0gRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbjtcblxuLy9cbi8vIEV4cG9zZSB0aGUgcHJlZml4LlxuLy9cbkV2ZW50RW1pdHRlci5wcmVmaXhlZCA9IHByZWZpeDtcblxuLy9cbi8vIEFsbG93IGBFdmVudEVtaXR0ZXJgIHRvIGJlIGltcG9ydGVkIGFzIG1vZHVsZSBuYW1lc3BhY2UuXG4vL1xuRXZlbnRFbWl0dGVyLkV2ZW50RW1pdHRlciA9IEV2ZW50RW1pdHRlcjtcblxuLy9cbi8vIEV4cG9zZSB0aGUgbW9kdWxlLlxuLy9cbmlmICgndW5kZWZpbmVkJyAhPT0gdHlwZW9mIG1vZHVsZSkge1xuICBtb2R1bGUuZXhwb3J0cyA9IEV2ZW50RW1pdHRlcjtcbn1cbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG4vKiB0c2xpbnQ6ZGlzYWJsZTpuby1lbXB0eSAqL1xudmFyIF9fYXNzaWduID0gKHRoaXMgJiYgdGhpcy5fX2Fzc2lnbikgfHwgZnVuY3Rpb24gKCkge1xuICAgIF9fYXNzaWduID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbih0KSB7XG4gICAgICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xuICAgICAgICAgICAgcyA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSlcbiAgICAgICAgICAgICAgICB0W3BdID0gc1twXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdDtcbiAgICB9O1xuICAgIHJldHVybiBfX2Fzc2lnbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuVGFzayA9IHZvaWQgMDtcbnZhciBfMSA9IHJlcXVpcmUoXCIuXCIpO1xudmFyIHV0aWxzXzEgPSByZXF1aXJlKFwiLi91dGlsc1wiKTtcbi8qKlxuICogIEBwcml2YXRlXG4gKi9cbnZhciBERUZBVUxUX1RBU0tfT1BUSU9OUyA9IE9iamVjdC5mcmVlemUoe1xuICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgdGlja0RlbGF5OiAwLFxuICAgIHRpY2tJbnRlcnZhbDogMSxcbiAgICB0b3RhbFJ1bnM6IG51bGwsXG4gICAgc3RhcnREYXRlOiBudWxsLFxuICAgIHN0b3BEYXRlOiBudWxsLFxuICAgIGltbWVkaWF0ZTogZmFsc2UsXG4gICAgcmVtb3ZlT25Db21wbGV0ZWQ6IGZhbHNlLFxuICAgIGNhbGxiYWNrOiBudWxsXG59KTtcbi8qKlxuICogIFJlcHJlc2VudHMgdGhlIGNsYXNzIHRoYXQgaG9sZHMgdGhlIGNvbmZpZ3VyYXRpb25zIGFuZCB0aGUgY2FsbGJhY2sgZnVuY3Rpb25cbiAqICByZXF1aXJlZCB0byBydW4gYSB0YXNrLlxuICogIEBjbGFzc1xuICovXG52YXIgVGFzayA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcbiAgICAvKipcbiAgICAgKiAgSW5pdGlhbGl6ZXMgYSBuZXcgaW5zdGFuY2Ugb2YgYFRhc2tgIGNsYXNzLlxuICAgICAqICBAY29uc3RydWN0b3JcbiAgICAgKiAgQHBhcmFtIHtJVGFza09wdGlvbnN9IG9wdGlvbnMgVGFzayBvcHRpb25zLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIFRhc2sob3B0aW9ucykge1xuICAgICAgICB0aGlzLl9pbml0KG9wdGlvbnMpO1xuICAgIH1cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoVGFzay5wcm90b3R5cGUsIFwiaWRcIiwge1xuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gUFVCTElDIChJTlNUQU5DRSkgTUVNQkVSU1xuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLyoqXG4gICAgICAgICAqICBHZXRzIHRoZSB1bmlxdWUgSUQgb2YgdGhlIHRhc2suXG4gICAgICAgICAqICBAbmFtZSBUYXNrI2lkXG4gICAgICAgICAqICBAdHlwZSB7c3RyaW5nfVxuICAgICAgICAgKiAgQHJlYWRvbmx5XG4gICAgICAgICAqL1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl8uaWQ7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoVGFzay5wcm90b3R5cGUsIFwiZW5hYmxlZFwiLCB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiAgU3BlY2lmaWVzIHdoZXRoZXIgdGhpcyB0YXNrIGlzIGN1cnJlbnRseSBlbmFibGVkLiBUaGlzIGVzc2VudGlhbGx5IGdpdmVzXG4gICAgICAgICAqICB5b3UgYSBtYW51YWwgY29udHJvbCBvdmVyIGV4ZWN1dGlvbi4gVGhlIHRhc2sgd2lsbCBhbHdheXMgYnlwYXNzIHRoZVxuICAgICAgICAgKiAgY2FsbGJhY2sgd2hpbGUgdGhpcyBpcyBzZXQgdG8gYGZhbHNlYC5cbiAgICAgICAgICogIEBuYW1lIFRhc2sjZW5hYmxlZFxuICAgICAgICAgKiAgQHR5cGUge2Jvb2xlYW59XG4gICAgICAgICAqL1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl8uZW5hYmxlZDtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuXy5lbmFibGVkID0gdXRpbHNfMS51dGlscy5nZXRCb29sKHZhbHVlLCB0cnVlKTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShUYXNrLnByb3RvdHlwZSwgXCJ0aWNrRGVsYXlcIiwge1xuICAgICAgICAvKipcbiAgICAgICAgICogIEdldHMgb3Igc2V0cyB0aGUgbnVtYmVyIG9mIHRpY2tzIHRvIGFsbG93IGJlZm9yZSBydW5uaW5nIHRoZSB0YXNrIGZvclxuICAgICAgICAgKiAgdGhlIGZpcnN0IHRpbWUuXG4gICAgICAgICAqICBAbmFtZSBUYXNrI3RpY2tEZWxheVxuICAgICAgICAgKiAgQHR5cGUge251bWJlcn1cbiAgICAgICAgICovXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuXy50aWNrRGVsYXk7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLl8udGlja0RlbGF5ID0gdXRpbHNfMS51dGlscy5nZXROdW1iZXIodmFsdWUsIDAsIERFRkFVTFRfVEFTS19PUFRJT05TLnRpY2tEZWxheSk7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoVGFzay5wcm90b3R5cGUsIFwidGlja0ludGVydmFsXCIsIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqICBHZXRzIG9yIHNldHMgdGhlIHRpY2sgaW50ZXJ2YWwgdGhhdCB0aGUgdGFzayBzaG91bGQgYmUgcnVuIG9uLiBUaGUgdW5pdFxuICAgICAgICAgKiAgaXMgXCJ0aWNrc1wiIChub3QgbWlsbGlzZWNvbmRzKS4gRm9yIGluc3RhbmNlLCBpZiB0aGUgdGltZXIgaW50ZXJ2YWwgaXNcbiAgICAgICAgICogIGAxMDAwYCBtaWxsaXNlY29uZHMsIGFuZCB3ZSBhZGQgYSB0YXNrIHdpdGggYDVgIHRpY2sgaW50ZXJ2YWxzLiBUaGUgdGFza1xuICAgICAgICAgKiAgd2lsbCBydW4gb24gZXZlcnkgYDVgIDxiPnNlY29uZHM8L2I+LlxuICAgICAgICAgKiAgQG5hbWUgVGFzayN0aWNrSW50ZXJ2YWxcbiAgICAgICAgICogIEB0eXBlIHtudW1iZXJ9XG4gICAgICAgICAqL1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl8udGlja0ludGVydmFsO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5fLnRpY2tJbnRlcnZhbCA9IHV0aWxzXzEudXRpbHMuZ2V0TnVtYmVyKHZhbHVlLCAxLCBERUZBVUxUX1RBU0tfT1BUSU9OUy50aWNrSW50ZXJ2YWwpO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFRhc2sucHJvdG90eXBlLCBcInRvdGFsUnVuc1wiLCB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiAgR2V0cyBvciBzZXRzIHRoZSB0b3RhbCBudW1iZXIgb2YgdGltZXMgdGhlIHRhc2sgc2hvdWxkIGJlIHJ1bi4gYDBgIG9yXG4gICAgICAgICAqICBgbnVsbGAgbWVhbnMgdW5saW1pdGVkICh1bnRpbCB0aGUgdGltZXIgaGFzIHN0b3BwZWQpLlxuICAgICAgICAgKiAgQG5hbWUgVGFzayN0b3RhbFJ1bnNcbiAgICAgICAgICogIEB0eXBlIHtudW1iZXJ9XG4gICAgICAgICAqL1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl8udG90YWxSdW5zO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5fLnRvdGFsUnVucyA9IHV0aWxzXzEudXRpbHMuZ2V0TnVtYmVyKHZhbHVlLCAwLCBERUZBVUxUX1RBU0tfT1BUSU9OUy50b3RhbFJ1bnMpO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFRhc2sucHJvdG90eXBlLCBcImltbWVkaWF0ZVwiLCB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiAgU3BlY2lmaWVzIHdoZXRoZXIgdG8gd3JhcCBjYWxsYmFjayBpbiBhIGBzZXRJbW1lZGlhdGUoKWAgY2FsbCBiZWZvcmVcbiAgICAgICAgICogIGV4ZWN1dGluZy4gVGhpcyBjYW4gYmUgdXNlZnVsIGlmIHRoZSB0YXNrIGlzIG5vdCBkb2luZyBhbnkgSS9PIG9yIHVzaW5nXG4gICAgICAgICAqICBhbnkgSlMgdGltZXJzIGJ1dCBzeW5jaHJvbm91c2x5IGJsb2NraW5nIHRoZSBldmVudCBsb29wLlxuICAgICAgICAgKiAgQG5hbWUgVGFzayNpbW1lZGlhdGVcbiAgICAgICAgICogIEB0eXBlIHtib29sZWFufVxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fLmltbWVkaWF0ZTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuXy5pbW1lZGlhdGUgPSB1dGlsc18xLnV0aWxzLmdldEJvb2wodmFsdWUsIGZhbHNlKTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShUYXNrLnByb3RvdHlwZSwgXCJjdXJyZW50UnVuc1wiLCB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiAgR2V0cyB0aGUgbnVtYmVyIG9mIHRpbWVzLCB0aGlzIHRhc2sgaGFzIGJlZW4gcnVuLlxuICAgICAgICAgKiAgQG5hbWUgVGFzayNjdXJyZW50UnVuc1xuICAgICAgICAgKiAgQHR5cGUge251bWJlcn1cbiAgICAgICAgICogIEByZWFkb25seVxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fLmN1cnJlbnRSdW5zO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFRhc2sucHJvdG90eXBlLCBcInRpbWVcIiwge1xuICAgICAgICAvKipcbiAgICAgICAgICogIEdldHMgdGltZSBpbmZvcm1hdGlvbiBmb3IgdGhlIGxpZmV0aW1lIG9mIGEgdGFzay5cbiAgICAgICAgICogIGAjdGltZS5zdGFydGVkYCBpbmRpY2F0ZXMgdGhlIGZpcnN0IGV4ZWN1dGlvbiB0aW1lIG9mIGEgdGFzay5cbiAgICAgICAgICogIGAjdGltZS5zdG9wcGVkYCBpbmRpY2F0ZXMgdGhlIGxhc3QgZXhlY3V0aW9uIHRpbWUgb2YgYSB0YXNrLiAoYDBgIGlmIHN0aWxsIHJ1bm5pbmcuKVxuICAgICAgICAgKiAgYCN0aW1lLmVsYXBzZWRgIGluZGljYXRlcyB0aGUgdG90YWwgbGlmZXRpbWUgb2YgYSB0YXNrLlxuICAgICAgICAgKiAgQG5hbWUgVGFzayN0aW1lXG4gICAgICAgICAqICBAdHlwZSB7SVRpbWVJbmZvfVxuICAgICAgICAgKiAgQHJlYWRvbmx5XG4gICAgICAgICAqL1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBzdGFydGVkID0gdGhpcy5fLnRpbWVPbkZpcnN0UnVuIHx8IDA7XG4gICAgICAgICAgICB2YXIgc3RvcHBlZCA9IHRoaXMuXy50aW1lT25MYXN0UnVuIHx8IDA7XG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmZyZWV6ZSh7XG4gICAgICAgICAgICAgICAgc3RhcnRlZDogc3RhcnRlZCxcbiAgICAgICAgICAgICAgICBzdG9wcGVkOiBzdG9wcGVkLFxuICAgICAgICAgICAgICAgIGVsYXBzZWQ6IHN0b3BwZWQgLSBzdGFydGVkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShUYXNrLnByb3RvdHlwZSwgXCJjYWxsYmFja1wiLCB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiAgR2V0cyB0aGUgY2FsbGJhY2sgZnVuY3Rpb24gdG8gYmUgZXhlY3V0ZWQgb24gZWFjaCBydW4uXG4gICAgICAgICAqICBAbmFtZSBUYXNrI2NhbGxiYWNrXG4gICAgICAgICAqICBAdHlwZSB7VGFza0NhbGxiYWNrfVxuICAgICAgICAgKiAgQHJlYWRvbmx5XG4gICAgICAgICAqL1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl8uY2FsbGJhY2s7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoVGFzay5wcm90b3R5cGUsIFwicmVtb3ZlT25Db21wbGV0ZWRcIiwge1xuICAgICAgICAvKipcbiAgICAgICAgICogIEdldHMgb3Igc2V0cyB3aGV0aGVyIHRvIHJlbW92ZSB0aGUgdGFzayAodG8gZnJlZSB1cCBtZW1vcnkpIHdoZW4gdGFza1xuICAgICAgICAgKiAgaGFzIGNvbXBsZXRlZCBpdHMgZXhlY3V0aW9ucyAocnVucykuIEZvciB0aGlzIHRvIHRha2UgYWZmZWN0LCB0aGUgdGFza1xuICAgICAgICAgKiAgc2hvdWxkIGhhdmUgYHRvdGFsUnVuc2AgYW5kL29yIGBzdG9wRGF0ZWAgY29uZmlndXJlZC5cbiAgICAgICAgICogIEBuYW1lIFRhc2sjcmVtb3ZlT25Db21wbGV0ZWRcbiAgICAgICAgICogIEB0eXBlIHtib29sZWFufVxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fLnJlbW92ZU9uQ29tcGxldGVkO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5fLnJlbW92ZU9uQ29tcGxldGVkID0gdXRpbHNfMS51dGlscy5nZXRCb29sKHZhbHVlLCBmYWxzZSk7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoVGFzay5wcm90b3R5cGUsIFwiY29tcGxldGVkXCIsIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqICBTcGVjaWZpZXMgd2hldGhlciB0aGUgdGFzayBoYXMgY29tcGxldGVkIGFsbCBydW5zIChleGVjdXRpb25zKSBvclxuICAgICAgICAgKiAgYHN0b3BEYXRlYCBpcyByZWFjaGVkLiBOb3RlIHRoYXQgaWYgYm90aCBgdG90YWxSdW5zYCBhbmQgYHN0b3BEYXRlYCBhcmVcbiAgICAgICAgICogIG9taXR0ZWQsIHRoaXMgd2lsbCBuZXZlciByZXR1cm4gYHRydWVgOyBzaW5jZSB0aGUgdGFzayBoYXMgbm8gZXhlY3V0aW9uXG4gICAgICAgICAqICBsaW1pdCBzZXQuXG4gICAgICAgICAqICBAbmFtZSBUYXNrI2NvbXBsZXRlZFxuICAgICAgICAgKiAgQHR5cGUge2Jvb2xlYW59XG4gICAgICAgICAqICBAcmVhZG9ubHlcbiAgICAgICAgICovXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgLy8gcmV0dXJuIGZhc3RlciBpZiBhbHJlYWR5IGNvbXBsZXRlZFxuICAgICAgICAgICAgaWYgKHRoaXMuX21hcmtlZENvbXBsZXRlZClcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIHJldHVybiBCb29sZWFuKCh0aGlzLnRvdGFsUnVucyAmJiB0aGlzLmN1cnJlbnRSdW5zID49IHRoaXMudG90YWxSdW5zKVxuICAgICAgICAgICAgICAgIHx8ICh0aGlzLl8uc3RvcERhdGUgJiYgRGF0ZS5ub3coKSA+PSBOdW1iZXIodGhpcy5fLnN0b3BEYXRlKSkpO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFRhc2sucHJvdG90eXBlLCBcImNhblJ1bk9uVGlja1wiLCB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiAgU3BlY2lmaWVzIHdoZXRoZXIgdGhlIHRhc2sgY2FuIHJ1biBvbiB0aGUgY3VycmVudCB0aWNrIG9mIHRoZSB0aW1lci5cbiAgICAgICAgICogIEBwcml2YXRlXG4gICAgICAgICAqICBAbmFtZSBUYXNrI2NhblJ1bk9uVGlja1xuICAgICAgICAgKiAgQHR5cGUge2Jvb2xlYW59XG4gICAgICAgICAqICBAcmVhZG9ubHlcbiAgICAgICAgICovXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuX21hcmtlZENvbXBsZXRlZClcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB2YXIgdGlja0NvdW50ID0gdGhpcy5fLnN0YXJ0RGF0ZVxuICAgICAgICAgICAgICAgID8gTWF0aC5jZWlsKChEYXRlLm5vdygpIC0gTnVtYmVyKHRoaXMuXy5zdGFydERhdGUpKSAvIHRoaXMuX3RpbWVyLmludGVydmFsKVxuICAgICAgICAgICAgICAgIDogdGhpcy5fdGltZXIudGlja0NvdW50O1xuICAgICAgICAgICAgdmFyIHRpbWVUb1J1biA9ICF0aGlzLl8uc3RhcnREYXRlIHx8IERhdGUubm93KCkgPj0gTnVtYmVyKHRoaXMuXy5zdGFydERhdGUpO1xuICAgICAgICAgICAgdmFyIG9uSW50ZXJ2YWwgPSB0aWNrQ291bnQgPiB0aGlzLnRpY2tEZWxheSAmJiAodGlja0NvdW50IC0gdGhpcy50aWNrRGVsYXkpICUgdGhpcy50aWNrSW50ZXJ2YWwgPT09IDA7XG4gICAgICAgICAgICByZXR1cm4gQm9vbGVhbih0aW1lVG9SdW4gJiYgb25JbnRlcnZhbCk7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICAvKipcbiAgICAgKiAgUmVzZXRzIHRoZSBjdXJyZW50IG51bWJlciBvZiBydW5zLiBUaGlzIHdpbGwga2VlcCB0aGUgdGFzayBydW5uaW5nIGZvclxuICAgICAqICB0aGUgc2FtZSBhbW91bnQgb2YgYHRpY2tJbnRlcnZhbHNgIGluaXRpYWxseSBjb25maWd1cmVkLlxuICAgICAqICBAbWVtYmVyb2YgVGFza1xuICAgICAqICBAY2hhaW5hYmxlXG4gICAgICpcbiAgICAgKiAgQHBhcmFtIHtJVGFza0Jhc2VPcHRpb25zfSBbb3B0aW9uc10gSWYgc2V0LCB0aGlzIHdpbGwgYWxzbyByZS1jb25maWd1cmUgdGhlIHRhc2suXG4gICAgICpcbiAgICAgKiAgQHJldHVybnMge1Rhc2t9XG4gICAgICovXG4gICAgVGFzay5wcm90b3R5cGUucmVzZXQgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICB0aGlzLl8uY3VycmVudFJ1bnMgPSAwO1xuICAgICAgICBpZiAob3B0aW9ucykge1xuICAgICAgICAgICAgdmFyIGlkID0gb3B0aW9ucy5pZDtcbiAgICAgICAgICAgIGlmIChpZCAmJiBpZCAhPT0gdGhpcy5pZClcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBjaGFuZ2UgSUQgb2YgYSB0YXNrLicpO1xuICAgICAgICAgICAgb3B0aW9ucy5pZCA9IHRoaXMuaWQ7XG4gICAgICAgICAgICB0aGlzLl9pbml0KG9wdGlvbnMpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogIFNlcmlhbGl6YXRpb24gdG8gSlNPTi5cbiAgICAgKlxuICAgICAqICBOZXZlciByZXR1cm4gc3RyaW5nIGZyb20gYHRvSlNPTigpYC4gSXQgc2hvdWxkIHJldHVybiBhbiBvYmplY3QuXG4gICAgICogIEBwcml2YXRlXG4gICAgICovXG4gICAgVGFzay5wcm90b3R5cGUudG9KU09OID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgb2JqID0gX19hc3NpZ24oe30sIHRoaXMuXyk7XG4gICAgICAgIGRlbGV0ZSBvYmouY2FsbGJhY2s7XG4gICAgICAgIHJldHVybiBvYmo7XG4gICAgfTtcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBQUklWQVRFIChJTlNUQU5DRSkgTUVNQkVSU1xuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8qKlxuICAgICAqICBTZXQgcmVmZXJlbmNlIHRvIHRpbWVyIGl0c2VsZi5cbiAgICAgKiAgT25seSBjYWxsZWQgYnkgYFRhc2tUaW1lcmAuXG4gICAgICogIEBwcml2YXRlXG4gICAgICovXG4gICAgLy8gQHRzLWlnbm9yZTogVFM2MTMzOiBkZWNsYXJlZCBidXQgbmV2ZXIgcmVhZC5cbiAgICBUYXNrLnByb3RvdHlwZS5fc2V0VGltZXIgPSBmdW5jdGlvbiAodGltZXIpIHtcbiAgICAgICAgdGhpcy5fdGltZXIgPSB0aW1lcjtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqICBAcHJpdmF0ZVxuICAgICAqL1xuICAgIFRhc2sucHJvdG90eXBlLl9lbWl0ID0gZnVuY3Rpb24gKG5hbWUsIG9iamVjdCkge1xuICAgICAgICB2YXIgZXZlbnQgPSB7XG4gICAgICAgICAgICBuYW1lOiBuYW1lLFxuICAgICAgICAgICAgc291cmNlOiB0aGlzXG4gICAgICAgIH07XG4gICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gICAgICAgIGlmIChvYmplY3QgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICAgICAgZXZlbnQuZXJyb3IgPSBvYmplY3Q7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBldmVudC5kYXRhID0gb2JqZWN0O1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3RpbWVyLmVtaXQobmFtZSwgZXZlbnQpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogIGBUYXNrVGltZXJgIHNob3VsZCBiZSBpbmZvcm1lZCBpZiB0aGlzIHRhc2sgaXMgY29tcGxldGVkLiBCdXQgZXhlY3V0aW9uXG4gICAgICogIHNob3VsZCBiZSBmaW5pc2hlZC4gU28gd2UgZG8gdGhpcyB3aXRoaW4gdGhlIGBkb25lKClgIGZ1bmN0aW9uLlxuICAgICAqICBAcHJpdmF0ZVxuICAgICAqL1xuICAgIFRhc2sucHJvdG90eXBlLl9kb25lID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5jb21wbGV0ZWQpIHtcbiAgICAgICAgICAgIHRoaXMuX21hcmtlZENvbXBsZXRlZCA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLl8udGltZU9uTGFzdFJ1biA9IERhdGUubm93KCk7XG4gICAgICAgICAgICB0aGlzLl90aW1lci5fdGFza0NvbXBsZXRlZCh0aGlzKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgLyoqXG4gICAgICogIEBwcml2YXRlXG4gICAgICovXG4gICAgVGFzay5wcm90b3R5cGUuX2V4ZWNDYWxsYmFjayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHZhciBvID0gdGhpcy5jYWxsYmFjay5hcHBseSh0aGlzLCBbdGhpcywgZnVuY3Rpb24gKCkgeyByZXR1cm4gX3RoaXMuX2RvbmUoKTsgfV0pO1xuICAgICAgICAgICAgaWYgKHRoaXMuY2FsbGJhY2subGVuZ3RoID49IDIpIHtcbiAgICAgICAgICAgICAgICAvLyBoYW5kbGVkIGJ5IGRvbmUoKSAoY2FsbGVkIHdpdGhpbiB0aGUgdGFzayBjYWxsYmFjayBieSB0aGUgdXNlcilcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHV0aWxzXzEudXRpbHMuaXNQcm9taXNlKG8pKSB7XG4gICAgICAgICAgICAgICAgby50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuX2RvbmUoKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5fZW1pdChfMS5UYXNrVGltZXIuRXZlbnQuVEFTS19FUlJPUiwgZXJyKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuX2RvbmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICB0aGlzLl9lbWl0KF8xLlRhc2tUaW1lci5FdmVudC5UQVNLX0VSUk9SLCBlcnIpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiAgT25seSB1c2VkIGJ5IGBUYXNrVGltZXJgLlxuICAgICAqICBAcHJpdmF0ZVxuICAgICAqL1xuICAgIC8vIEB0cy1pZ25vcmU6IFRTNjEzMzogZGVjbGFyZWQgYnV0IG5ldmVyIHJlYWQuXG4gICAgVGFzay5wcm90b3R5cGUuX3J1biA9IGZ1bmN0aW9uIChvblJ1bikge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBpZiAoIXRoaXMuZW5hYmxlZCB8fCB0aGlzLl9tYXJrZWRDb21wbGV0ZWQpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRSdW5zID09PSAwKVxuICAgICAgICAgICAgdGhpcy5fLnRpbWVPbkZpcnN0UnVuID0gRGF0ZS5ub3coKTtcbiAgICAgICAgLy8gY3VycmVudCBydW5zIHNob3VsZCBiZSBzZXQgYmVmb3JlIGV4ZWN1dGlvbiBvciBpdCBtaWdodCBmbG93IGlmIHNvbWVcbiAgICAgICAgLy8gYXN5bmMgcnVucyBmaW5pc2hlcyBmYXN0ZXIgYW5kIHNvbWUgb3RoZXIgc2xvd2VyLlxuICAgICAgICB0aGlzLl8uY3VycmVudFJ1bnMrKztcbiAgICAgICAgb25SdW4oKTtcbiAgICAgICAgaWYgKHRoaXMuaW1tZWRpYXRlKSB7XG4gICAgICAgICAgICB1dGlsc18xLnV0aWxzLnNldEltbWVkaWF0ZShmdW5jdGlvbiAoKSB7IHJldHVybiBfdGhpcy5fZXhlY0NhbGxiYWNrKCk7IH0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fZXhlY0NhbGxiYWNrKCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIC8qKlxuICAgICAqICBAcHJpdmF0ZVxuICAgICAqL1xuICAgIFRhc2sucHJvdG90eXBlLl9pbml0ID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgaWYgKCFvcHRpb25zIHx8ICFvcHRpb25zLmlkKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0EgdW5pcXVlIHRhc2sgSUQgaXMgcmVxdWlyZWQuJyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zLmNhbGxiYWNrICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0EgY2FsbGJhY2sgZnVuY3Rpb24gaXMgcmVxdWlyZWQgZm9yIGEgdGFzayB0byBydW4uJyk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHN0YXJ0RGF0ZSA9IG9wdGlvbnMuc3RhcnREYXRlLCBzdG9wRGF0ZSA9IG9wdGlvbnMuc3RvcERhdGU7XG4gICAgICAgIGlmIChzdGFydERhdGUgJiYgc3RvcERhdGUgJiYgc3RhcnREYXRlID49IHN0b3BEYXRlKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Rhc2sgc3RhcnQgZGF0ZSBjYW5ub3QgYmUgdGhlIHNhbWUgb3IgYWZ0ZXIgc3RvcCBkYXRlLicpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX21hcmtlZENvbXBsZXRlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLl8gPSBfX2Fzc2lnbih7IGN1cnJlbnRSdW5zOiAwIH0sIERFRkFVTFRfVEFTS19PUFRJT05TKTtcbiAgICAgICAgdGhpcy5fLmlkID0gU3RyaW5nKG9wdGlvbnMuaWQpO1xuICAgICAgICB0aGlzLl8uY2FsbGJhY2sgPSBvcHRpb25zLmNhbGxiYWNrO1xuICAgICAgICB0aGlzLl8uc3RhcnREYXRlID0gb3B0aW9ucy5zdGFydERhdGUgfHwgbnVsbDtcbiAgICAgICAgdGhpcy5fLnN0b3BEYXRlID0gb3B0aW9ucy5zdG9wRGF0ZSB8fCBudWxsO1xuICAgICAgICAvLyB1c2luZyBzZXR0ZXJzIGZvciB2YWxpZGF0aW9uICYgZGVmYXVsdCB2YWx1ZXNcbiAgICAgICAgdGhpcy5lbmFibGVkID0gb3B0aW9ucy5lbmFibGVkO1xuICAgICAgICB0aGlzLnRpY2tEZWxheSA9IG9wdGlvbnMudGlja0RlbGF5O1xuICAgICAgICB0aGlzLnRpY2tJbnRlcnZhbCA9IG9wdGlvbnMudGlja0ludGVydmFsO1xuICAgICAgICB0aGlzLnRvdGFsUnVucyA9IG9wdGlvbnMudG90YWxSdW5zO1xuICAgICAgICB0aGlzLmltbWVkaWF0ZSA9IG9wdGlvbnMuaW1tZWRpYXRlO1xuICAgICAgICB0aGlzLnJlbW92ZU9uQ29tcGxldGVkID0gb3B0aW9ucy5yZW1vdmVPbkNvbXBsZXRlZDtcbiAgICB9O1xuICAgIHJldHVybiBUYXNrO1xufSgpKTtcbmV4cG9ydHMuVGFzayA9IFRhc2s7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbiIsIlwidXNlIHN0cmljdFwiO1xuLyogdHNsaW50OmRpc2FibGU6bWF4LWZpbGUtbGluZS1jb3VudCAqL1xudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBleHRlbmRTdGF0aWNzID0gZnVuY3Rpb24gKGQsIGIpIHtcbiAgICAgICAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxuICAgICAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxuICAgICAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGIsIHApKSBkW3BdID0gYltwXTsgfTtcbiAgICAgICAgcmV0dXJuIGV4dGVuZFN0YXRpY3MoZCwgYik7XG4gICAgfTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGQsIGIpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBiICE9PSBcImZ1bmN0aW9uXCIgJiYgYiAhPT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDbGFzcyBleHRlbmRzIHZhbHVlIFwiICsgU3RyaW5nKGIpICsgXCIgaXMgbm90IGEgY29uc3RydWN0b3Igb3IgbnVsbFwiKTtcbiAgICAgICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcbiAgICAgICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XG4gICAgICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcbiAgICB9O1xufSkoKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuVGFza1RpbWVyID0gdm9pZCAwO1xuLy8gZGVwIG1vZHVsZXNcbnZhciBldmVudGVtaXR0ZXIzXzEgPSByZXF1aXJlKFwiZXZlbnRlbWl0dGVyM1wiKTtcbi8vIG93biBtb2R1bGVzXG52YXIgXzEgPSByZXF1aXJlKFwiLlwiKTtcbnZhciB1dGlsc18xID0gcmVxdWlyZShcIi4vdXRpbHNcIik7XG4vKipcbiAqICBAcHJpdmF0ZVxuICovXG52YXIgREVGQVVMVF9USU1FUl9PUFRJT05TID0gT2JqZWN0LmZyZWV6ZSh7XG4gICAgaW50ZXJ2YWw6IDEwMDAsXG4gICAgcHJlY2lzaW9uOiB0cnVlLFxuICAgIHN0b3BPbkNvbXBsZXRlZDogZmFsc2Vcbn0pO1xuLyoqXG4gKiAgVGFza1RpbWVyIOKAoiBodHRwczovL2dpdGh1Yi5jb20vb251cnkvdGFza3RpbWVyXG4gKiAgQGxpY2Vuc2UgTUlUXG4gKiAgQGNvcHlyaWdodCAyMDE5LCBPbnVyIFnEsWxkxLFyxLFtIDxvbnVyQGN1dGVwaWxvdC5jb20+XG4gKi9cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gRXZlbnRFbWl0dGVyIERvY3Ncbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLyoqXG4gKiAgQ2FsbHMgZWFjaCBvZiB0aGUgbGlzdGVuZXJzIHJlZ2lzdGVyZWQgZm9yIGEgZ2l2ZW4gZXZlbnQgbmFtZS5cbiAqICBAbmFtZSBUYXNrVGltZXIjZW1pdFxuICogIEBmdW5jdGlvblxuICpcbiAqICBAcGFyYW0ge1Rhc2tUaW1lci5FdmVudH0gZXZlbnROYW1lIC0gVGhlIG5hbWUgb2YgdGhlIGV2ZW50IHRvIGJlIGVtaXR0ZWQuXG4gKiAgQHBhcmFtIHthbnl9IFtkYXRhXSAtIERhdGEgdG8gYmUgcGFzc2VkIHRvIGV2ZW50IGxpc3RlbmVycy5cbiAqXG4gKiAgQHJldHVybnMge0Jvb2xlYW59IC0gYHRydWVgIGlmIHRoZSBldmVudCBoYWQgbGlzdGVuZXJzLCBlbHNlIGBmYWxzZWAuXG4gKi9cbi8qKlxuICogIFJldHVybiBhbiBhcnJheSBsaXN0aW5nIHRoZSBldmVudHMgZm9yIHdoaWNoIHRoZSBlbWl0dGVyIGhhcyByZWdpc3RlcmVkXG4gKiAgbGlzdGVuZXJzLlxuICogIEBuYW1lIFRhc2tUaW1lciNldmVudE5hbWVzXG4gKiAgQGZ1bmN0aW9uXG4gKlxuICogIEByZXR1cm5zIHtBcnJheX0gLSBMaXN0IG9mIGV2ZW50IG5hbWVzLlxuICovXG4vKipcbiAqICBBZGRzIHRoZSBsaXN0ZW5lciBmdW5jdGlvbiB0byB0aGUgZW5kIG9mIHRoZSBsaXN0ZW5lcnMgYXJyYXkgZm9yIHRoZSBldmVudFxuICogIG5hbWVkIGBldmVudE5hbWVgLiBObyBjaGVja3MgYXJlIG1hZGUgdG8gc2VlIGlmIHRoZSBsaXN0ZW5lciBoYXMgYWxyZWFkeVxuICogIGJlZW4gYWRkZWQuIE11bHRpcGxlIGNhbGxzIHBhc3NpbmcgdGhlIHNhbWUgY29tYmluYXRpb24gb2YgYGV2ZW50TmFtZWAgYW5kXG4gKiAgYGxpc3RlbmVyYCB3aWxsIHJlc3VsdCBpbiB0aGUgbGlzdGVuZXIgYmVpbmcgYWRkZWQsIGFuZCBjYWxsZWQsIG11bHRpcGxlXG4gKiAgdGltZXMuXG4gKiAgQG5hbWUgVGFza1RpbWVyI29uXG4gKiAgQGZ1bmN0aW9uXG4gKiAgQGFsaWFzIFRhc2tUaW1lciNhZGRMaXN0ZW5lclxuICogIEBjaGFpbmFibGVcbiAqXG4gKiAgQHBhcmFtIHtUYXNrVGltZXIuRXZlbnR9IGV2ZW50TmFtZSAtIFRoZSBuYW1lIG9mIHRoZSBldmVudCB0byBiZSBhZGRlZC5cbiAqICBAcGFyYW0ge0Z1bmN0aW9ufSBsaXN0ZW5lciAtIFRoZSBjYWxsYmFjayBmdW5jdGlvbiB0byBiZSBpbnZva2VkIHBlciBldmVudC5cbiAqICBAcGFyYW0geyp9IFtjb250ZXh0PXRoaXNdIC0gVGhlIGNvbnRleHQgdG8gaW52b2tlIHRoZSBsaXN0ZW5lciB3aXRoLlxuICpcbiAqICBAcmV0dXJucyB7VGFza1RpbWVyfSAtIGB7QGxpbmsgI1Rhc2tUaW1lcnxUYXNrVGltZXJ9YCBpbnN0YW5jZS5cbiAqXG4gKiAgQGV4YW1wbGVcbiAqICBjb25zdCB0aW1lciA9IG5ldyBUYXNrVGltZXIoMTAwMCk7XG4gKiAgLy8gYWRkIGEgbGlzdGVuZXIgdG8gYmUgaW52b2tlZCB3aGVuIHRpbWVyIGhhcyBzdG9wcGVkLlxuICogIHRpbWVyLm9uKFRhc2tUaW1lci5FdmVudC5TVE9QUEVELCAoKSA9PiB7XG4gKiAgICAgIGNvbnNvbGUubG9nKCdUaW1lciBoYXMgc3RvcHBlZCEnKTtcbiAqICB9KTtcbiAqICB0aW1lci5zdGFydCgpO1xuICovXG4vKipcbiAqICBBZGRzIGEgb25lIHRpbWUgbGlzdGVuZXIgZnVuY3Rpb24gZm9yIHRoZSBldmVudCBuYW1lZCBgZXZlbnROYW1lYC4gVGhlIG5leHRcbiAqICB0aW1lIGBldmVudE5hbWVgIGlzIHRyaWdnZXJlZCwgdGhpcyBgbGlzdGVuZXJgIGlzIHJlbW92ZWQgYW5kIHRoZW4gaW52b2tlZC5cbiAqICBAbmFtZSBUYXNrVGltZXIjb25jZVxuICogIEBmdW5jdGlvblxuICogIEBjaGFpbmFibGVcbiAqXG4gKiAgQHBhcmFtIHtUYXNrVGltZXIuRXZlbnR9IGV2ZW50TmFtZSAtIFRoZSBuYW1lIG9mIHRoZSBldmVudCB0byBiZSBhZGRlZC5cbiAqICBAcGFyYW0ge0Z1bmN0aW9ufSBsaXN0ZW5lciAtIFRoZSBjYWxsYmFjayBmdW5jdGlvbiB0byBiZSBpbnZva2VkIHBlciBldmVudC5cbiAqICBAcGFyYW0geyp9IFtjb250ZXh0PXRoaXNdIC0gVGhlIGNvbnRleHQgdG8gaW52b2tlIHRoZSBsaXN0ZW5lciB3aXRoLlxuICpcbiAqICBAcmV0dXJucyB7VGFza1RpbWVyfSAtIGB7QGxpbmsgI1Rhc2tUaW1lcnxUYXNrVGltZXJ9YCBpbnN0YW5jZS5cbiAqL1xuLyoqXG4gKiAgUmVtb3ZlcyB0aGUgc3BlY2lmaWVkIGBsaXN0ZW5lcmAgZnJvbSB0aGUgbGlzdGVuZXIgYXJyYXkgZm9yIHRoZSBldmVudFxuICogIG5hbWVkIGBldmVudE5hbWVgLlxuICogIEBuYW1lIFRhc2tUaW1lciNvZmZcbiAqICBAZnVuY3Rpb25cbiAqICBAYWxpYXMgVGFza1RpbWVyI3JlbW92ZUxpc3RlbmVyXG4gKiAgQGNoYWluYWJsZVxuICpcbiAqICBAcGFyYW0ge1Rhc2tUaW1lci5FdmVudH0gZXZlbnROYW1lIC0gVGhlIG5hbWUgb2YgdGhlIGV2ZW50IHRvIGJlIHJlbW92ZWQuXG4gKiAgQHBhcmFtIHtGdW5jdGlvbn0gbGlzdGVuZXIgLSBUaGUgY2FsbGJhY2sgZnVuY3Rpb24gdG8gYmUgaW52b2tlZCBwZXIgZXZlbnQuXG4gKiAgQHBhcmFtIHsqfSBbY29udGV4dD10aGlzXSAtIE9ubHkgcmVtb3ZlIHRoZSBsaXN0ZW5lcnMgdGhhdCBoYXZlIHRoaXMgY29udGV4dC5cbiAqICBAcGFyYW0ge0Jvb2xlYW59IFtvbmNlPWZhbHNlXSAtIE9ubHkgcmVtb3ZlIG9uZS10aW1lIGxpc3RlbmVycy5cbiAqXG4gKiAgQHJldHVybnMge1Rhc2tUaW1lcn0gLSBge0BsaW5rICNUYXNrVGltZXJ8VGFza1RpbWVyfWAgaW5zdGFuY2UuXG4gKi9cbi8qKlxuICogIEdldHMgdGhlIG51bWJlciBvZiBsaXN0ZW5lcnMgbGlzdGVuaW5nIHRvIGEgZ2l2ZW4gZXZlbnQuXG4gKiAgQG5hbWUgVGFza1RpbWVyI2xpc3RlbmVyQ291bnRcbiAqICBAZnVuY3Rpb25cbiAqXG4gKiAgQHBhcmFtIHtUYXNrVGltZXIuRXZlbnR9IGV2ZW50TmFtZSAtIFRoZSBuYW1lIG9mIHRoZSBldmVudC5cbiAqXG4gKiAgQHJldHVybnMge051bWJlcn0gLSBUaGUgbnVtYmVyIG9mIGxpc3RlbmVycy5cbiAqL1xuLyoqXG4gKiAgR2V0cyB0aGUgbGlzdGVuZXJzIHJlZ2lzdGVyZWQgZm9yIGEgZ2l2ZW4gZXZlbnQuXG4gKiAgQG5hbWUgVGFza1RpbWVyI2xpc3RlbmVyc1xuICogIEBmdW5jdGlvblxuICpcbiAqICBAcGFyYW0ge1Rhc2tUaW1lci5FdmVudH0gZXZlbnROYW1lIC0gVGhlIG5hbWUgb2YgdGhlIGV2ZW50LlxuICpcbiAqICBAcmV0dXJucyB7QXJyYXl9IC0gVGhlIHJlZ2lzdGVyZWQgbGlzdGVuZXJzLlxuICovXG4vKipcbiAqICBSZW1vdmVzIGFsbCBsaXN0ZW5lcnMsIG9yIHRob3NlIG9mIHRoZSBzcGVjaWZpZWQgYGV2ZW50TmFtZWAuXG4gKiAgQG5hbWUgVGFza1RpbWVyI3JlbW92ZUFsbExpc3RlbmVyc1xuICogIEBmdW5jdGlvblxuICogIEBjaGFpbmFibGVcbiAqXG4gKiAgQHBhcmFtIHtUYXNrVGltZXIuRXZlbnR9IFtldmVudE5hbWVdIC0gVGhlIG5hbWUgb2YgdGhlIGV2ZW50IHRvIGJlIHJlbW92ZWQuXG4gKlxuICogIEByZXR1cm5zIHtUYXNrVGltZXJ9IC0gYHtAbGluayAjVGFza1RpbWVyfFRhc2tUaW1lcn1gIGluc3RhbmNlLlxuICovXG4vKipcbiAqICBBIHRpbWVyIHV0aWxpdHkgZm9yIHJ1bm5pbmcgcGVyaW9kaWMgdGFza3Mgb24gdGhlIGdpdmVuIGludGVydmFsIHRpY2tzLiBUaGlzXG4gKiAgaXMgdXNlZnVsIHdoZW4geW91IHdhbnQgdG8gcnVuIG9yIHNjaGVkdWxlIG11bHRpcGxlIHRhc2tzIG9uIGEgc2luZ2xlIHRpbWVyXG4gKiAgaW5zdGFuY2UuXG4gKlxuICogIFRoaXMgY2xhc3MgZXh0ZW5kcyBgRXZlbnRFbWl0dGVyM2Agd2hpY2ggaXMgYW4gYEV2ZW50RW1pdHRlcmAgaW1wbGVtZW50YXRpb25cbiAqICBmb3IgYm90aCBOb2RlIGFuZCBicm93c2VyLiBGb3IgZGV0YWlsZWQgaW5mb3JtYXRpb24sIHJlZmVyIHRvIE5vZGUuanNcbiAqICBkb2N1bWVudGF0aW9uLlxuICogIEBjbGFzc1xuICogIEBnbG9iYWxcbiAqXG4gKiAgQGV4dGVuZHMgRXZlbnRFbWl0dGVyXG4gKlxuICogIEBzZWVcbiAqICB7QGxpbmsgaHR0cHM6Ly9ub2RlanMub3JnL2FwaS9ldmVudHMuaHRtbCNldmVudHNfY2xhc3NfZXZlbnRlbWl0dGVyfEV2ZW50RW1pdHRlcn1cbiAqL1xudmFyIFRhc2tUaW1lciA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoVGFza1RpbWVyLCBfc3VwZXIpO1xuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIENPTlNUUlVDVE9SXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLyoqXG4gICAgICogIENvbnN0cnVjdHMgYSBuZXcgYFRhc2tUaW1lcmAgaW5zdGFuY2Ugd2l0aCB0aGUgZ2l2ZW4gdGltZSBpbnRlcnZhbCAoaW5cbiAgICAgKiAgbWlsbGlzZWNvbmRzKS5cbiAgICAgKiAgQGNvbnN0cnVjdG9yXG4gICAgICpcbiAgICAgKiAgQHBhcmFtIHtJVGFza1RpbWVyT3B0aW9uc3xudW1iZXJ9IFtvcHRpb25zXSAtIEVpdGhlciBUYXNrVGltZXIgb3B0aW9uc1xuICAgICAqICBvciBhIGJhc2UgaW50ZXJ2YWwgKGluIG1pbGxpc2Vjb25kcykuIFNpbmNlIHRoZSB0YXNrcyBydW4gb24gdGlja3NcbiAgICAgKiAgaW5zdGVhZCBvZiBtaWxsaXNlY29uZCBpbnRlcnZhbHM7IHRoaXMgdmFsdWUgb3BlcmF0ZXMgYXMgdGhlIGJhc2VcbiAgICAgKiAgcmVzb2x1dGlvbiBmb3IgYWxsIHRhc2tzLiBJZiB5b3UgYXJlIHJ1bm5pbmcgaGVhdnkgdGFza3MsIGxvd2VyIGludGVydmFsXG4gICAgICogIHJlcXVpcmVzIGhpZ2hlciBDUFUgcG93ZXIuIFRoaXMgdmFsdWUgY2FuIGJlIHVwZGF0ZWQgYW55IHRpbWUgYnkgc2V0dGluZ1xuICAgICAqICB0aGUgYGludGVydmFsYCBwcm9wZXJ0eSBvbiB0aGUgaW5zdGFuY2UuXG4gICAgICpcbiAgICAgKiAgQGV4YW1wbGVcbiAgICAgKiAgY29uc3QgdGltZXIgPSBuZXcgVGFza1RpbWVyKDEwMDApOyAvLyBtaWxsaXNlY29uZHNcbiAgICAgKiAgLy8gRXhlY3V0ZSBzb21lIGNvZGUgb24gZWFjaCB0aWNrLi4uXG4gICAgICogIHRpbWVyLm9uKCd0aWNrJywgKCkgPT4ge1xuICAgICAqICAgICAgY29uc29sZS5sb2coJ3RpY2sgY291bnQ6ICcgKyB0aW1lci50aWNrQ291bnQpO1xuICAgICAqICAgICAgY29uc29sZS5sb2coJ2VsYXBzZWQgdGltZTogJyArIHRpbWVyLnRpbWUuZWxhcHNlZCArICcgbXMuJyk7XG4gICAgICogIH0pO1xuICAgICAqICAvLyBhZGQgYSB0YXNrIG5hbWVkICdoZWFydGJlYXQnIHRoYXQgcnVucyBldmVyeSA1IHRpY2tzIGFuZCBhIHRvdGFsIG9mIDEwIHRpbWVzLlxuICAgICAqICBjb25zdCB0YXNrMSA9IHtcbiAgICAgKiAgICAgIGlkOiAnaGVhcnRiZWF0JyxcbiAgICAgKiAgICAgIHRpY2tEZWxheTogMjAsICAgLy8gdGlja3MgKHRvIHdhaXQgYmVmb3JlIGZpcnN0IHJ1bilcbiAgICAgKiAgICAgIHRpY2tJbnRlcnZhbDogNSwgLy8gdGlja3MgKGludGVydmFsKVxuICAgICAqICAgICAgdG90YWxSdW5zOiAxMCwgICAvLyB0aW1lcyB0byBydW5cbiAgICAgKiAgICAgIGNhbGxiYWNrKHRhc2spIHsgLy8gY2FuIGFsc28gYmUgYW4gYXN5bmMgZnVuY3Rpb24sIHJldHVybmluZyBhIHByb21pc2VcbiAgICAgKiAgICAgICAgICBjb25zb2xlLmxvZyh0YXNrLmlkICsgJyB0YXNrIGhhcyBydW4gJyArIHRhc2suY3VycmVudFJ1bnMgKyAnIHRpbWVzLicpO1xuICAgICAqICAgICAgfVxuICAgICAqICB9O1xuICAgICAqICB0aW1lci5hZGQodGFzazEpLnN0YXJ0KCk7XG4gICAgICovXG4gICAgZnVuY3Rpb24gVGFza1RpbWVyKG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcykgfHwgdGhpcztcbiAgICAgICAgX3RoaXMuX3RpbWVvdXRSZWYgPSBudWxsO1xuICAgICAgICBfdGhpcy5faW1tZWRpYXRlUmVmID0gbnVsbDtcbiAgICAgICAgX3RoaXMuX3J1bkNvdW50ID0gMDtcbiAgICAgICAgX3RoaXMuX3Jlc2V0KCk7XG4gICAgICAgIF90aGlzLl8ub3B0cyA9IHt9O1xuICAgICAgICB2YXIgb3B0cyA9IHR5cGVvZiBvcHRpb25zID09PSAnbnVtYmVyJ1xuICAgICAgICAgICAgPyB7IGludGVydmFsOiBvcHRpb25zIH1cbiAgICAgICAgICAgIDogb3B0aW9ucyB8fCB7fTtcbiAgICAgICAgX3RoaXMuaW50ZXJ2YWwgPSBvcHRzLmludGVydmFsO1xuICAgICAgICBfdGhpcy5wcmVjaXNpb24gPSBvcHRzLnByZWNpc2lvbjtcbiAgICAgICAgX3RoaXMuc3RvcE9uQ29tcGxldGVkID0gb3B0cy5zdG9wT25Db21wbGV0ZWQ7XG4gICAgICAgIHJldHVybiBfdGhpcztcbiAgICB9XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFRhc2tUaW1lci5wcm90b3R5cGUsIFwiaW50ZXJ2YWxcIiwge1xuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gUFVCTElDIChJTlNUQU5DRSkgUFJPUEVSVElFU1xuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLyoqXG4gICAgICAgICAqICBHZXRzIG9yIHNldHMgdGhlIGJhc2UgdGltZXIgaW50ZXJ2YWwgaW4gbWlsbGlzZWNvbmRzLlxuICAgICAgICAgKlxuICAgICAgICAgKiAgU2luY2UgdGhlIHRhc2tzIHJ1biBvbiB0aWNrcyBpbnN0ZWFkIG9mIG1pbGxpc2Vjb25kIGludGVydmFsczsgdGhpc1xuICAgICAgICAgKiAgdmFsdWUgb3BlcmF0ZXMgYXMgdGhlIGJhc2UgcmVzb2x1dGlvbiBmb3IgYWxsIHRhc2tzLiBJZiB5b3UgYXJlIHJ1bm5pbmdcbiAgICAgICAgICogIGhlYXZ5IHRhc2tzLCBsb3dlciBpbnRlcnZhbCByZXF1aXJlcyBoaWdoZXIgQ1BVIHBvd2VyLiBUaGlzIHZhbHVlIGNhbiBiZVxuICAgICAgICAgKiAgdXBkYXRlZCBhbnkgdGltZS5cbiAgICAgICAgICpcbiAgICAgICAgICogIEBuYW1lIFRhc2tUaW1lciNpbnRlcnZhbFxuICAgICAgICAgKiAgQHR5cGUge251bWJlcn1cbiAgICAgICAgICovXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuXy5vcHRzLmludGVydmFsO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5fLm9wdHMuaW50ZXJ2YWwgPSB1dGlsc18xLnV0aWxzLmdldE51bWJlcih2YWx1ZSwgMjAsIERFRkFVTFRfVElNRVJfT1BUSU9OUy5pbnRlcnZhbCk7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoVGFza1RpbWVyLnByb3RvdHlwZSwgXCJwcmVjaXNpb25cIiwge1xuICAgICAgICAvKipcbiAgICAgICAgICogIEdldHMgb3Igc2V0cyB3aGV0aGVyIHRpbWVyIHByZWNpc2lvbiBlbmFibGVkLlxuICAgICAgICAgKlxuICAgICAgICAgKiAgQmVjYXVzZSBvZiB0aGUgc2luZ2xlLXRocmVhZGVkLCBhc3luY2hyb25vdXMgbmF0dXJlIG9mIEphdmFTY3JpcHQsIGVhY2hcbiAgICAgICAgICogIGV4ZWN1dGlvbiB0YWtlcyBhIHBpZWNlIG9mIENQVSB0aW1lLCBhbmQgdGhlIHRpbWUgdGhleSBoYXZlIHRvIHdhaXQgd2lsbFxuICAgICAgICAgKiAgdmFyeSwgZGVwZW5kaW5nIG9uIHRoZSBsb2FkLiBUaGlzIGNyZWF0ZXMgYSBsYXRlbmN5IGFuZCBjdW11bGF0aXZlXG4gICAgICAgICAqICBkaWZmZXJlbmNlIGluIGFzeW5jaHJvbm91cyB0aW1lcnM7IHRoYXQgZ3JhZHVhbGx5IGluY3JlYXNlIHRoZVxuICAgICAgICAgKiAgaW5hY3VyYWNjeS4gYFRhc2tUaW1lcmAgb3ZlcmNvbWVzIHRoaXMgcHJvYmxlbSBhcyBtdWNoIGFzIHBvc3NpYmxlOlxuICAgICAgICAgKlxuICAgICAgICAgKiAgPGxpPlRoZSBkZWxheSBiZXR3ZWVuIGVhY2ggdGljayBpcyBhdXRvLWFkanVzdGVkIHdoZW4gaXQncyBvZmZcbiAgICAgICAgICogIGR1ZSB0byB0YXNrL0NQVSBsb2FkcyBvciBjbG9jayBkcmlmdHMuPC9saT5cbiAgICAgICAgICogIDxsaT5JbiBOb2RlLmpzLCBgVGFza1RpbWVyYCBhbHNvIG1ha2VzIHVzZSBvZiBgcHJvY2Vzcy5ocnRpbWUoKWBcbiAgICAgICAgICogIGhpZ2gtcmVzb2x1dGlvbiByZWFsLXRpbWUuIFRoZSB0aW1lIGlzIHJlbGF0aXZlIHRvIGFuIGFyYml0cmFyeVxuICAgICAgICAgKiAgdGltZSBpbiB0aGUgcGFzdCAobm90IHJlbGF0ZWQgdG8gdGhlIHRpbWUgb2YgZGF5KSBhbmQgdGhlcmVmb3JlIG5vdFxuICAgICAgICAgKiAgc3ViamVjdCB0byBjbG9jayBkcmlmdHMuPC9saT5cbiAgICAgICAgICogIDxsaT5UaGUgdGltZXIgbWF5IGhpdCBhIHN5bmNocm9ub3VzIC8gYmxvY2tpbmcgdGFzazsgb3IgZGV0ZWN0IHNpZ25pZmljYW50XG4gICAgICAgICAqICB0aW1lIGRyaWZ0IChsb25nZXIgdGhhbiB0aGUgYmFzZSBpbnRlcnZhbCkgZHVlIHRvIEpTIGV2ZW50IHF1ZXVlLCB3aGljaFxuICAgICAgICAgKiAgY2Fubm90IGJlIHJlY292ZXJlZCBieSBzaW1wbHkgYWRqdXN0aW5nIHRoZSBuZXh0IGRlbGF5LiBJbiB0aGlzIGNhc2UsIHJpZ2h0XG4gICAgICAgICAqICBmcm9tIHRoZSBuZXh0IHRpY2sgb253YXJkOyBpdCB3aWxsIGF1dG8tcmVjb3ZlciBhcyBtdWNoIGFzIHBvc3NpYmxlIGJ5XG4gICAgICAgICAqICBydW5uaW5nIFwiaW1tZWRpYXRlXCIgdGFza3MgdW50aWwgaXQgcmVhY2hlcyB0aGUgcHJvcGVyIHRpbWUgdnMgdGljay9ydW5cbiAgICAgICAgICogIGJhbGFuY2UuPC9saT5cbiAgICAgICAgICpcbiAgICAgICAgICogIDxibG9ja3F1b3RlPjxpPk5vdGUgdGhhdCBwcmVjaXNpb24gd2lsbCBiZSBhcyBoaWdoIGFzIHBvc3NpYmxlIGJ1dCBpdCBzdGlsbFxuICAgICAgICAgKiAgY2FuIGJlIG9mZiBieSBhIGZldyBtaWxsaXNlY29uZHM7IGRlcGVuZGluZyBvbiB0aGUgQ1BVIG9yIHRoZSBsb2FkLjwvaT5cbiAgICAgICAgICogIDwvYmxvY2txdW90ZT5cbiAgICAgICAgICogIEBuYW1lIFRhc2tUaW1lciNwcmVjaXNpb25cbiAgICAgICAgICogIEB0eXBlIHtib29sZWFufVxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fLm9wdHMucHJlY2lzaW9uO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5fLm9wdHMucHJlY2lzaW9uID0gdXRpbHNfMS51dGlscy5nZXRCb29sKHZhbHVlLCBERUZBVUxUX1RJTUVSX09QVElPTlMucHJlY2lzaW9uKTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShUYXNrVGltZXIucHJvdG90eXBlLCBcInN0b3BPbkNvbXBsZXRlZFwiLCB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiAgR2V0cyBvciBzZXRzIHdoZXRoZXIgdGhlIHRpbWVyIHNob3VsZCBhdXRvbWF0aWNhbGx5IHN0b3Agd2hlbiBhbGwgdGFza3NcbiAgICAgICAgICogIGFyZSBjb21wbGV0ZWQuIEZvciB0aGlzIHRvIHRha2UgYWZmZWN0LCBhbGwgYWRkZWQgdGFza3Mgc2hvdWxkIGhhdmVcbiAgICAgICAgICogIGB0b3RhbFJ1bnNgIGFuZC9vciBgc3RvcERhdGVgIGNvbmZpZ3VyZWQuIFRoaXMgb3B0aW9uIGNhbiBiZSBzZXQvY2hhbmdlZFxuICAgICAgICAgKiAgYXQgYW55IHRpbWUuXG4gICAgICAgICAqICBAbmFtZSBUYXNrVGltZXIjc3RvcE9uQ29tcGxldGVkXG4gICAgICAgICAqICBAdHlwZSB7Ym9vbGVhbn1cbiAgICAgICAgICovXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuXy5vcHRzLnN0b3BPbkNvbXBsZXRlZDtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuXy5vcHRzLnN0b3BPbkNvbXBsZXRlZCA9IHV0aWxzXzEudXRpbHMuZ2V0Qm9vbCh2YWx1ZSwgREVGQVVMVF9USU1FUl9PUFRJT05TLnN0b3BPbkNvbXBsZXRlZCk7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoVGFza1RpbWVyLnByb3RvdHlwZSwgXCJzdGF0ZVwiLCB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiAgR2V0cyB0aGUgY3VycmVudCBzdGF0ZSBvZiB0aGUgdGltZXIuXG4gICAgICAgICAqICBGb3IgcG9zc2libGUgdmFsdWVzLCBzZWUgYFRhc2tUaW1lci5TdGF0ZWAgZW51bWVyYXRpb24uXG4gICAgICAgICAqICBAbmFtZSBUYXNrVGltZXIjc3RhdGVcbiAgICAgICAgICogIEB0eXBlIHtUYXNrVGltZXIuU3RhdGV9XG4gICAgICAgICAqICBAcmVhZG9ubHlcbiAgICAgICAgICovXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuXy5zdGF0ZTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShUYXNrVGltZXIucHJvdG90eXBlLCBcInRpbWVcIiwge1xuICAgICAgICAvKipcbiAgICAgICAgICogIEdldHMgdGltZSBpbmZvcm1hdGlvbiBmb3IgdGhlIGxhdGVzdCBydW4gb2YgdGhlIHRpbWVyLlxuICAgICAgICAgKiAgYCN0aW1lLnN0YXJ0ZWRgIGluZGljYXRlcyB0aGUgc3RhcnQgdGltZSBvZiB0aGUgdGltZXIuXG4gICAgICAgICAqICBgI3RpbWUuc3RvcHBlZGAgaW5kaWNhdGVzIHRoZSBzdG9wIHRpbWUgb2YgdGhlIHRpbWVyLiAoYDBgIGlmIHN0aWxsIHJ1bm5pbmcuKVxuICAgICAgICAgKiAgYCN0aW1lLmVsYXBzZWRgIGluZGljYXRlcyB0aGUgZWxhcHNlZCB0aW1lIG9mIHRoZSB0aW1lci5cbiAgICAgICAgICogIEBuYW1lIFRhc2tUaW1lciN0aW1lXG4gICAgICAgICAqICBAdHlwZSB7SVRpbWVJbmZvfVxuICAgICAgICAgKiAgQHJlYWRvbmx5XG4gICAgICAgICAqL1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBfYSA9IHRoaXMuXywgc3RhcnRUaW1lID0gX2Euc3RhcnRUaW1lLCBzdG9wVGltZSA9IF9hLnN0b3BUaW1lO1xuICAgICAgICAgICAgdmFyIHQgPSB7XG4gICAgICAgICAgICAgICAgc3RhcnRlZDogc3RhcnRUaW1lLFxuICAgICAgICAgICAgICAgIHN0b3BwZWQ6IHN0b3BUaW1lLFxuICAgICAgICAgICAgICAgIGVsYXBzZWQ6IDBcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBpZiAoc3RhcnRUaW1lKSB7XG4gICAgICAgICAgICAgICAgdmFyIGN1cnJlbnQgPSB0aGlzLnN0YXRlICE9PSBUYXNrVGltZXIuU3RhdGUuU1RPUFBFRCA/IERhdGUubm93KCkgOiBzdG9wVGltZTtcbiAgICAgICAgICAgICAgICB0LmVsYXBzZWQgPSBjdXJyZW50IC0gc3RhcnRUaW1lO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5mcmVlemUodCk7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoVGFza1RpbWVyLnByb3RvdHlwZSwgXCJ0aWNrQ291bnRcIiwge1xuICAgICAgICAvKipcbiAgICAgICAgICogIEdldHMgdGhlIGN1cnJlbnQgdGljayBjb3VudCBmb3IgdGhlIGxhdGVzdCBydW4gb2YgdGhlIHRpbWVyLlxuICAgICAgICAgKiAgVGhpcyB2YWx1ZSB3aWxsIGJlIHJlc2V0IHRvIGAwYCB3aGVuIHRoZSB0aW1lciBpcyBzdG9wcGVkIG9yIHJlc2V0LlxuICAgICAgICAgKiAgQG5hbWUgVGFza1RpbWVyI3RpY2tDb3VudFxuICAgICAgICAgKiAgQHR5cGUge051bWJlcn1cbiAgICAgICAgICogIEByZWFkb25seVxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fLnRpY2tDb3VudDtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShUYXNrVGltZXIucHJvdG90eXBlLCBcInRhc2tDb3VudFwiLCB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiAgR2V0cyB0aGUgY3VycmVudCB0YXNrIGNvdW50LiBUYXNrcyByZW1haW4gZXZlbiBhZnRlciB0aGUgdGltZXIgaXNcbiAgICAgICAgICogIHN0b3BwZWQuIEJ1dCB0aGV5IHdpbGwgYmUgcmVtb3ZlZCBpZiB0aGUgdGltZXIgaXMgcmVzZXQuXG4gICAgICAgICAqICBAbmFtZSBUYXNrVGltZXIjdGFza0NvdW50XG4gICAgICAgICAqICBAdHlwZSB7TnVtYmVyfVxuICAgICAgICAgKiAgQHJlYWRvbmx5XG4gICAgICAgICAqL1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBPYmplY3Qua2V5cyh0aGlzLl8udGFza3MpLmxlbmd0aDtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShUYXNrVGltZXIucHJvdG90eXBlLCBcInRhc2tSdW5Db3VudFwiLCB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiAgR2V0cyB0aGUgdG90YWwgbnVtYmVyIG9mIGFsbCB0YXNrIGV4ZWN1dGlvbnMgKHJ1bnMpLlxuICAgICAgICAgKiAgQG5hbWUgVGFza1RpbWVyI3Rhc2tSdW5Db3VudFxuICAgICAgICAgKiAgQHR5cGUge051bWJlcn1cbiAgICAgICAgICogIEByZWFkb25seVxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fLnRhc2tSdW5Db3VudDtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShUYXNrVGltZXIucHJvdG90eXBlLCBcInJ1bkNvdW50XCIsIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqICBHZXRzIHRoZSB0b3RhbCBudW1iZXIgb2YgdGltZXIgcnVucywgaW5jbHVkaW5nIHJlc3VtZWQgcnVucy5cbiAgICAgICAgICogIEBuYW1lIFRhc2tUaW1lciNydW5Db3VudFxuICAgICAgICAgKiAgQHR5cGUge051bWJlcn1cbiAgICAgICAgICogIEByZWFkb25seVxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcnVuQ291bnQ7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBQVUJMSUMgKElOU1RBTkNFKSBNRVRIT0RTXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLyoqXG4gICAgICogIEdldHMgdGhlIHRhc2sgd2l0aCB0aGUgZ2l2ZW4gSUQuXG4gICAgICogIEBtZW1iZXJvZiBUYXNrVGltZXJcbiAgICAgKlxuICAgICAqICBAcGFyYW0ge1N0cmluZ30gaWQgLSBJRCBvZiB0aGUgdGFzay5cbiAgICAgKlxuICAgICAqICBAcmV0dXJucyB7VGFza31cbiAgICAgKi9cbiAgICBUYXNrVGltZXIucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uIChpZCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fLnRhc2tzW2lkXSB8fCBudWxsO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogIEFkZHMgYSBjb2xsZWN0aW9uIG9mIG5ldyB0YXNrcyBmb3IgdGhlIHRpbWVyLlxuICAgICAqICBAbWVtYmVyb2YgVGFza1RpbWVyXG4gICAgICogIEBjaGFpbmFibGVcbiAgICAgKlxuICAgICAqICBAcGFyYW0ge1Rhc2t8SVRhc2tPcHRpb25zfFRhc2tDYWxsYmFja3xBcnJheX0gdGFzayAtIEVpdGhlciBhXG4gICAgICogIHNpbmdsZSB0YXNrLCB0YXNrIG9wdGlvbnMgb2JqZWN0IG9yIHRoZSBjYWxsYmFjayBmdW5jdGlvbjsgb3IgYSBtaXh0dXJlXG4gICAgICogIG9mIHRoZXNlIGFzIGFuIGFycmF5LlxuICAgICAqXG4gICAgICogIEByZXR1cm5zIHtUYXNrVGltZXJ9XG4gICAgICpcbiAgICAgKiAgQHRocm93cyB7RXJyb3J9IC0gSWYgYSB0YXNrIGNhbGxiYWNrIGlzIG5vdCBzZXQgb3IgYSB0YXNrIHdpdGggdGhlIGdpdmVuXG4gICAgICogIG5hbWUgYWxyZWFkeSBleGlzdHMuXG4gICAgICovXG4gICAgVGFza1RpbWVyLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiAodGFzaykge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBpZiAoIXV0aWxzXzEudXRpbHMuaXNzZXQodGFzaykpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRWl0aGVyIGEgdGFzaywgdGFzayBvcHRpb25zIG9yIGEgY2FsbGJhY2sgaXMgcmVxdWlyZWQuJyk7XG4gICAgICAgIH1cbiAgICAgICAgdXRpbHNfMS51dGlscy5lbnN1cmVBcnJheSh0YXNrKS5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7IHJldHVybiBfdGhpcy5fYWRkKGl0ZW0pOyB9KTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiAgUmVtb3ZlcyB0aGUgdGFzayBieSB0aGUgZ2l2ZW4gbmFtZS5cbiAgICAgKiAgQG1lbWJlcm9mIFRhc2tUaW1lclxuICAgICAqICBAY2hhaW5hYmxlXG4gICAgICpcbiAgICAgKiAgQHBhcmFtIHtzdHJpbmd8VGFza30gdGFzayAtIFRhc2sgdG8gYmUgcmVtb3ZlZC4gRWl0aGVyIHBhc3MgdGhlXG4gICAgICogIG5hbWUgb3IgdGhlIHRhc2sgaXRzZWxmLlxuICAgICAqXG4gICAgICogIEByZXR1cm5zIHtUYXNrVGltZXJ9XG4gICAgICpcbiAgICAgKiAgQHRocm93cyB7RXJyb3J9IC0gSWYgYSB0YXNrIHdpdGggdGhlIGdpdmVuIG5hbWUgZG9lcyBub3QgZXhpc3QuXG4gICAgICovXG4gICAgVGFza1RpbWVyLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbiAodGFzaykge1xuICAgICAgICB2YXIgaWQgPSB0eXBlb2YgdGFzayA9PT0gJ3N0cmluZycgPyB0YXNrIDogdGFzay5pZDtcbiAgICAgICAgdGFzayA9IHRoaXMuZ2V0KGlkKTtcbiAgICAgICAgaWYgKCFpZCB8fCAhdGFzaykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTm8gdGFza3MgZXhpc3Qgd2l0aCBJRDogJ1wiLmNvbmNhdChpZCwgXCInLlwiKSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gZmlyc3QgZGVjcmVtZW50IGNvbXBsZXRlZCB0YXNrcyBjb3VudCBpZiB0aGlzIGlzIGEgY29tcGxldGVkIHRhc2suXG4gICAgICAgIGlmICh0YXNrLmNvbXBsZXRlZCAmJiB0aGlzLl8uY29tcGxldGVkVGFza0NvdW50ID4gMClcbiAgICAgICAgICAgIHRoaXMuXy5jb21wbGV0ZWRUYXNrQ291bnQtLTtcbiAgICAgICAgdGhpcy5fLnRhc2tzW2lkXSA9IG51bGw7XG4gICAgICAgIGRlbGV0ZSB0aGlzLl8udGFza3NbaWRdO1xuICAgICAgICB0aGlzLl9lbWl0KFRhc2tUaW1lci5FdmVudC5UQVNLX1JFTU9WRUQsIHRhc2spO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuICAgIC8qKlxuICAgICAqICBTdGFydHMgdGhlIHRpbWVyIGFuZCBwdXRzIHRoZSB0aW1lciBpbiBgUlVOTklOR2Agc3RhdGUuIElmIGl0J3MgYWxyZWFkeVxuICAgICAqICBydW5uaW5nLCB0aGlzIHdpbGwgcmVzZXQgdGhlIHN0YXJ0L3N0b3AgdGltZSBhbmQgdGljayBjb3VudCwgYnV0IHdpbGwgbm90XG4gICAgICogIHJlc2V0IChvciByZW1vdmUpIGV4aXN0aW5nIHRhc2tzLlxuICAgICAqICBAbWVtYmVyb2YgVGFza1RpbWVyXG4gICAgICogIEBjaGFpbmFibGVcbiAgICAgKlxuICAgICAqICBAcmV0dXJucyB7VGFza1RpbWVyfVxuICAgICAqL1xuICAgIFRhc2tUaW1lci5wcm90b3R5cGUuc3RhcnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuX3N0b3AoKTtcbiAgICAgICAgdGhpcy5fLnN0YXRlID0gVGFza1RpbWVyLlN0YXRlLlJVTk5JTkc7XG4gICAgICAgIHRoaXMuX3J1bkNvdW50Kys7XG4gICAgICAgIHRoaXMuXy50aWNrQ291bnQgPSAwO1xuICAgICAgICB0aGlzLl8udGFza1J1bkNvdW50ID0gMDtcbiAgICAgICAgdGhpcy5fLnN0b3BUaW1lID0gMDtcbiAgICAgICAgdGhpcy5fbWFya1RpbWUoKTtcbiAgICAgICAgdGhpcy5fLnN0YXJ0VGltZSA9IERhdGUubm93KCk7XG4gICAgICAgIHRoaXMuX2VtaXQoVGFza1RpbWVyLkV2ZW50LlNUQVJURUQpO1xuICAgICAgICB0aGlzLl9ydW4oKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiAgUGF1c2VzIHRoZSB0aW1lciwgcHV0cyB0aGUgdGltZXIgaW4gYFBBVVNFRGAgc3RhdGUgYW5kIGFsbCB0YXNrcyBvbiBob2xkLlxuICAgICAqICBAbWVtYmVyb2YgVGFza1RpbWVyXG4gICAgICogIEBjaGFpbmFibGVcbiAgICAgKlxuICAgICAqICBAcmV0dXJucyB7VGFza1RpbWVyfVxuICAgICAqL1xuICAgIFRhc2tUaW1lci5wcm90b3R5cGUucGF1c2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLnN0YXRlICE9PSBUYXNrVGltZXIuU3RhdGUuUlVOTklORylcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB0aGlzLl9zdG9wKCk7XG4gICAgICAgIHRoaXMuXy5zdGF0ZSA9IFRhc2tUaW1lci5TdGF0ZS5QQVVTRUQ7XG4gICAgICAgIHRoaXMuX2VtaXQoVGFza1RpbWVyLkV2ZW50LlBBVVNFRCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogIFJlc3VtZXMgdGhlIHRpbWVyIGFuZCBwdXRzIHRoZSB0aW1lciBpbiBgUlVOTklOR2Agc3RhdGU7IGlmIHByZXZpdW9zbHlcbiAgICAgKiAgcGF1c2VkLiBJbiB0aGlzIHN0YXRlLCBhbGwgZXhpc3RpbmcgdGFza3MgYXJlIHJlc3VtZWQuXG4gICAgICogIEBtZW1iZXJvZiBUYXNrVGltZXJcbiAgICAgKiAgQGNoYWluYWJsZVxuICAgICAqXG4gICAgICogIEByZXR1cm5zIHtUYXNrVGltZXJ9XG4gICAgICovXG4gICAgVGFza1RpbWVyLnByb3RvdHlwZS5yZXN1bWUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLnN0YXRlID09PSBUYXNrVGltZXIuU3RhdGUuSURMRSkge1xuICAgICAgICAgICAgdGhpcy5zdGFydCgpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuc3RhdGUgIT09IFRhc2tUaW1lci5TdGF0ZS5QQVVTRUQpXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgdGhpcy5fcnVuQ291bnQrKztcbiAgICAgICAgdGhpcy5fbWFya1RpbWUoKTtcbiAgICAgICAgdGhpcy5fLnN0YXRlID0gVGFza1RpbWVyLlN0YXRlLlJVTk5JTkc7XG4gICAgICAgIHRoaXMuX2VtaXQoVGFza1RpbWVyLkV2ZW50LlJFU1VNRUQpO1xuICAgICAgICB0aGlzLl9ydW4oKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiAgU3RvcHMgdGhlIHRpbWVyIGFuZCBwdXRzIHRoZSB0aW1lciBpbiBgU1RPUFBFRGAgc3RhdGUuIEluIHRoaXMgc3RhdGUsIGFsbFxuICAgICAqICBleGlzdGluZyB0YXNrcyBhcmUgc3RvcHBlZCBhbmQgbm8gdmFsdWVzIG9yIHRhc2tzIGFyZSByZXNldCB1bnRpbFxuICAgICAqICByZS1zdGFydGVkIG9yIGV4cGxpY2l0bHkgY2FsbGluZyByZXNldC5cbiAgICAgKiAgQG1lbWJlcm9mIFRhc2tUaW1lclxuICAgICAqICBAY2hhaW5hYmxlXG4gICAgICpcbiAgICAgKiAgQHJldHVybnMge1Rhc2tUaW1lcn1cbiAgICAgKi9cbiAgICBUYXNrVGltZXIucHJvdG90eXBlLnN0b3AgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLnN0YXRlICE9PSBUYXNrVGltZXIuU3RhdGUuUlVOTklORylcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB0aGlzLl9zdG9wKCk7XG4gICAgICAgIHRoaXMuXy5zdG9wVGltZSA9IERhdGUubm93KCk7XG4gICAgICAgIHRoaXMuXy5zdGF0ZSA9IFRhc2tUaW1lci5TdGF0ZS5TVE9QUEVEO1xuICAgICAgICB0aGlzLl9lbWl0KFRhc2tUaW1lci5FdmVudC5TVE9QUEVEKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiAgU3RvcHMgdGhlIHRpbWVyIGFuZCBwdXRzIHRoZSB0aW1lciBpbiBgSURMRWAgc3RhdGUuXG4gICAgICogIFRoaXMgd2lsbCByZXNldCB0aGUgdGlja3MgYW5kIHJlbW92ZXMgYWxsIHRhc2tzIHNpbGVudGx5OyBtZWFuaW5nIG5vXG4gICAgICogIG90aGVyIGV2ZW50cyB3aWxsIGJlIGVtaXR0ZWQgc3VjaCBhcyBgXCJ0YXNrUmVtb3ZlZFwiYC5cbiAgICAgKiAgQG1lbWJlcm9mIFRhc2tUaW1lclxuICAgICAqICBAY2hhaW5hYmxlXG4gICAgICpcbiAgICAgKiAgQHJldHVybnMge1Rhc2tUaW1lcn1cbiAgICAgKi9cbiAgICBUYXNrVGltZXIucHJvdG90eXBlLnJlc2V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLl9yZXNldCgpO1xuICAgICAgICB0aGlzLl9lbWl0KFRhc2tUaW1lci5FdmVudC5SRVNFVCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gUFJJVkFURSAoSU5TVEFOQ0UpIE1FVEhPRFNcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvKipcbiAgICAgKiAgQHByaXZhdGVcbiAgICAgKi9cbiAgICBUYXNrVGltZXIucHJvdG90eXBlLl9lbWl0ID0gZnVuY3Rpb24gKHR5cGUsIGRhdGEpIHtcbiAgICAgICAgdmFyIGV2ZW50ID0ge1xuICAgICAgICAgICAgbmFtZTogdHlwZSxcbiAgICAgICAgICAgIHNvdXJjZTogdGhpcyxcbiAgICAgICAgICAgIGRhdGE6IGRhdGFcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZW1pdCh0eXBlLCBldmVudCk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiAgQWRkcyBhIG5ldyB0YXNrIGZvciB0aGUgdGltZXIuXG4gICAgICogIEBwcml2YXRlXG4gICAgICpcbiAgICAgKiAgQHBhcmFtIHtUYXNrfElUYXNrT3B0aW9uc3xUYXNrQ2FsbGJhY2t9IG9wdGlvbnMgLSBFaXRoZXIgYSB0YXNrIGluc3RhbmNlLFxuICAgICAqICB0YXNrIG9wdGlvbnMgb2JqZWN0IG9yIHRoZSBjYWxsYmFjayBmdW5jdGlvbiB0byBiZSBleGVjdXRlZCBvbiB0aWNrXG4gICAgICogIGludGVydmFscy5cbiAgICAgKlxuICAgICAqICBAcmV0dXJucyB7VGFza1RpbWVyfVxuICAgICAqXG4gICAgICogIEB0aHJvd3Mge0Vycm9yfSAtIElmIHRoZSB0YXNrIGNhbGxiYWNrIGlzIG5vdCBzZXQgb3IgYSB0YXNrIHdpdGggdGhlXG4gICAgICogIGdpdmVuIG5hbWUgYWxyZWFkeSBleGlzdHMuXG4gICAgICovXG4gICAgVGFza1RpbWVyLnByb3RvdHlwZS5fYWRkID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBvcHRpb25zID0ge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrOiBvcHRpb25zXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGlmICh1dGlsc18xLnV0aWxzLnR5cGUob3B0aW9ucykgPT09ICdvYmplY3QnICYmICFvcHRpb25zLmlkKSB7XG4gICAgICAgICAgICBvcHRpb25zLmlkID0gdGhpcy5fZ2V0VW5pcXVlVGFza0lEKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuZ2V0KG9wdGlvbnMuaWQpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJBIHRhc2sgd2l0aCBpZCAnXCIuY29uY2F0KG9wdGlvbnMuaWQsIFwiJyBhbHJlYWR5IGV4aXN0cy5cIikpO1xuICAgICAgICB9XG4gICAgICAgIHZhciB0YXNrID0gb3B0aW9ucyBpbnN0YW5jZW9mIF8xLlRhc2sgPyBvcHRpb25zIDogbmV3IF8xLlRhc2sob3B0aW9ucyk7XG4gICAgICAgIHRhc2suX3NldFRpbWVyKHRoaXMpO1xuICAgICAgICB0aGlzLl8udGFza3NbdGFzay5pZF0gPSB0YXNrO1xuICAgICAgICB0aGlzLl9lbWl0KFRhc2tUaW1lci5FdmVudC5UQVNLX0FEREVELCB0YXNrKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiAgU3RvcHMgdGhlIHRpbWVyLlxuICAgICAqICBAcHJpdmF0ZVxuICAgICAqL1xuICAgIFRhc2tUaW1lci5wcm90b3R5cGUuX3N0b3AgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuXy50aWNrQ291bnRBZnRlclJlc3VtZSA9IDA7XG4gICAgICAgIGlmICh0aGlzLl90aW1lb3V0UmVmKSB7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5fdGltZW91dFJlZik7XG4gICAgICAgICAgICB0aGlzLl90aW1lb3V0UmVmID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5faW1tZWRpYXRlUmVmKSB7XG4gICAgICAgICAgICB1dGlsc18xLnV0aWxzLmNsZWFySW1tZWRpYXRlKHRoaXMuX2ltbWVkaWF0ZVJlZik7XG4gICAgICAgICAgICB0aGlzLl9pbW1lZGlhdGVSZWYgPSBudWxsO1xuICAgICAgICB9XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiAgUmVzZXRzIHRoZSB0aW1lci5cbiAgICAgKiAgQHByaXZhdGVcbiAgICAgKi9cbiAgICBUYXNrVGltZXIucHJvdG90eXBlLl9yZXNldCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5fID0ge1xuICAgICAgICAgICAgb3B0czogKHRoaXMuXyB8fCB7fSkub3B0cyxcbiAgICAgICAgICAgIHN0YXRlOiBUYXNrVGltZXIuU3RhdGUuSURMRSxcbiAgICAgICAgICAgIHRhc2tzOiB7fSxcbiAgICAgICAgICAgIHRpY2tDb3VudDogMCxcbiAgICAgICAgICAgIHRhc2tSdW5Db3VudDogMCxcbiAgICAgICAgICAgIHN0YXJ0VGltZTogMCxcbiAgICAgICAgICAgIHN0b3BUaW1lOiAwLFxuICAgICAgICAgICAgY29tcGxldGVkVGFza0NvdW50OiAwLFxuICAgICAgICAgICAgcmVzdW1lVGltZTogMCxcbiAgICAgICAgICAgIGhyUmVzdW1lVGltZTogbnVsbCxcbiAgICAgICAgICAgIHRpY2tDb3VudEFmdGVyUmVzdW1lOiAwXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuX3N0b3AoKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqICBDYWxsZWQgKGJ5IFRhc2sgaW5zdGFuY2UpIHdoZW4gaXQgaGFzIGNvbXBsZXRlZCBhbGwgb2YgaXRzIHJ1bnMuXG4gICAgICogIEBwcml2YXRlXG4gICAgICovXG4gICAgLy8gQHRzLWlnbm9yZTogVFM2MTMzOiBkZWNsYXJlZCBidXQgbmV2ZXIgcmVhZC5cbiAgICBUYXNrVGltZXIucHJvdG90eXBlLl90YXNrQ29tcGxldGVkID0gZnVuY3Rpb24gKHRhc2spIHtcbiAgICAgICAgdGhpcy5fLmNvbXBsZXRlZFRhc2tDb3VudCsrO1xuICAgICAgICB0aGlzLl9lbWl0KFRhc2tUaW1lci5FdmVudC5UQVNLX0NPTVBMRVRFRCwgdGFzayk7XG4gICAgICAgIGlmICh0aGlzLl8uY29tcGxldGVkVGFza0NvdW50ID09PSB0aGlzLnRhc2tDb3VudCkge1xuICAgICAgICAgICAgdGhpcy5fZW1pdChUYXNrVGltZXIuRXZlbnQuQ09NUExFVEVEKTtcbiAgICAgICAgICAgIGlmICh0aGlzLnN0b3BPbkNvbXBsZXRlZClcbiAgICAgICAgICAgICAgICB0aGlzLnN0b3AoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGFzay5yZW1vdmVPbkNvbXBsZXRlZClcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlKHRhc2spO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogIEhhbmRsZXIgdG8gYmUgZXhlY3V0ZWQgb24gZWFjaCB0aWNrLlxuICAgICAqICBAcHJpdmF0ZVxuICAgICAqL1xuICAgIFRhc2tUaW1lci5wcm90b3R5cGUuX3RpY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHRoaXMuXy5zdGF0ZSA9IFRhc2tUaW1lci5TdGF0ZS5SVU5OSU5HO1xuICAgICAgICB2YXIgaWQ7XG4gICAgICAgIHZhciB0YXNrO1xuICAgICAgICB2YXIgdGFza3MgPSB0aGlzLl8udGFza3M7XG4gICAgICAgIHRoaXMuXy50aWNrQ291bnQrKztcbiAgICAgICAgdGhpcy5fLnRpY2tDb3VudEFmdGVyUmVzdW1lKys7XG4gICAgICAgIHRoaXMuX2VtaXQoVGFza1RpbWVyLkV2ZW50LlRJQ0spO1xuICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZTpmb3JpblxuICAgICAgICBmb3IgKGlkIGluIHRhc2tzKSB7XG4gICAgICAgICAgICB0YXNrID0gdGFza3NbaWRdO1xuICAgICAgICAgICAgaWYgKCF0YXNrIHx8ICF0YXNrLmNhblJ1bk9uVGljaylcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIC8vIGJlbG93IHdpbGwgbm90IGV4ZWN1dGUgaWYgdGFzayBpcyBkaXNhYmxlZCBvciBhbHJlYWR5XG4gICAgICAgICAgICAvLyBjb21wbGV0ZWQuXG4gICAgICAgICAgICB0YXNrLl9ydW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIF90aGlzLl8udGFza1J1bkNvdW50Kys7XG4gICAgICAgICAgICAgICAgX3RoaXMuX2VtaXQoVGFza1RpbWVyLkV2ZW50LlRBU0ssIHRhc2spO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fcnVuKCk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiAgTWFya3MgdGhlIHJlc3VtZSAob3Igc3RhcnQpIHRpbWUgaW4gbWlsbGlzZWNvbmRzIG9yIGhpZ2gtcmVzb2x1dGlvbiB0aW1lXG4gICAgICogIGlmIGF2YWlsYWJsZS5cbiAgICAgKiAgQHByaXZhdGVcbiAgICAgKi9cbiAgICBUYXNrVGltZXIucHJvdG90eXBlLl9tYXJrVGltZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgICAgIGlmICh1dGlsc18xLnV0aWxzLkJST1dTRVIpIHsgLy8gdGVzdGVkIHNlcGFyYXRlbHlcbiAgICAgICAgICAgIHRoaXMuXy5yZXN1bWVUaW1lID0gRGF0ZS5ub3coKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuXy5oclJlc3VtZVRpbWUgPSBwcm9jZXNzLmhydGltZSgpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiAgR2V0cyB0aGUgdGltZSBkaWZmZXJlbmNlIGluIG1pbGxpc2Vjb25kcyBzaW5jdCB0aGUgbGFzdCByZXN1bWUgb3Igc3RhcnRcbiAgICAgKiAgdGltZS5cbiAgICAgKiAgQHByaXZhdGVcbiAgICAgKi9cbiAgICBUYXNrVGltZXIucHJvdG90eXBlLl9nZXRUaW1lRGlmZiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gRGF0ZS5ub3coKSBpcyB+MnggZmFzdGVyIHRoYW4gRGF0ZSNnZXRUaW1lKClcbiAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgICAgIGlmICh1dGlsc18xLnV0aWxzLkJST1dTRVIpXG4gICAgICAgICAgICByZXR1cm4gRGF0ZS5ub3coKSAtIHRoaXMuXy5yZXN1bWVUaW1lOyAvLyB0ZXN0ZWQgc2VwYXJhdGVseVxuICAgICAgICB2YXIgaHJEaWZmID0gcHJvY2Vzcy5ocnRpbWUodGhpcy5fLmhyUmVzdW1lVGltZSk7XG4gICAgICAgIHJldHVybiBNYXRoLmNlaWwoKGhyRGlmZlswXSAqIDEwMDApICsgKGhyRGlmZlsxXSAvIDFlNikpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogIFJ1bnMgdGhlIHRpbWVyLlxuICAgICAqICBAcHJpdmF0ZVxuICAgICAqL1xuICAgIFRhc2tUaW1lci5wcm90b3R5cGUuX3J1biA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUgIT09IFRhc2tUaW1lci5TdGF0ZS5SVU5OSU5HKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB2YXIgaW50ZXJ2YWwgPSB0aGlzLmludGVydmFsO1xuICAgICAgICAvLyB3ZSdsbCBnZXQgYSBwcmVjaXNlIGludGVydmFsIGJ5IGNoZWNraW5nIGlmIG91ciBjbG9jayBpcyBhbHJlYWR5XG4gICAgICAgIC8vIGRyaWZ0ZWQuXG4gICAgICAgIGlmICh0aGlzLnByZWNpc2lvbikge1xuICAgICAgICAgICAgdmFyIGRpZmYgPSB0aGlzLl9nZXRUaW1lRGlmZigpO1xuICAgICAgICAgICAgLy8gZGlkIHdlIHJlYWNoIHRoaXMgZXhwZWN0ZWQgdGljayBjb3VudCBmb3IgdGhlIGdpdmVuIHRpbWUgcGVyaW9kP1xuICAgICAgICAgICAgLy8gY2FsY3VsYXRlZCBjb3VudCBzaG91bGQgbm90IGJlIGdyZWF0ZXIgdGhhbiB0aWNrQ291bnRBZnRlclJlc3VtZVxuICAgICAgICAgICAgaWYgKE1hdGguZmxvb3IoZGlmZiAvIGludGVydmFsKSA+IHRoaXMuXy50aWNrQ291bnRBZnRlclJlc3VtZSkge1xuICAgICAgICAgICAgICAgIC8vIGlmIHdlJ3JlIHJlYWxseSBsYXRlLCBydW4gaW1tZWRpYXRlbHkhXG4gICAgICAgICAgICAgICAgdGhpcy5faW1tZWRpYXRlUmVmID0gdXRpbHNfMS51dGlscy5zZXRJbW1lZGlhdGUoZnVuY3Rpb24gKCkgeyByZXR1cm4gX3RoaXMuX3RpY2soKTsgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gaWYgd2Ugc3RpbGwgaGF2ZSB0aW1lIGJ1dCBhIGJpdCBvZmYsIHVwZGF0ZSBuZXh0IGludGVydmFsLlxuICAgICAgICAgICAgaW50ZXJ2YWwgPSBpbnRlcnZhbCAtIChkaWZmICUgaW50ZXJ2YWwpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3RpbWVvdXRSZWYgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgcmV0dXJuIF90aGlzLl90aWNrKCk7IH0sIGludGVydmFsKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqICBHZXRzIGEgdW5pcXVlIHRhc2sgSUQuXG4gICAgICogIEBwcml2YXRlXG4gICAgICovXG4gICAgVGFza1RpbWVyLnByb3RvdHlwZS5fZ2V0VW5pcXVlVGFza0lEID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgbnVtID0gdGhpcy50YXNrQ291bnQ7XG4gICAgICAgIHZhciBpZDtcbiAgICAgICAgd2hpbGUgKCFpZCB8fCB0aGlzLmdldChpZCkpIHtcbiAgICAgICAgICAgIG51bSsrO1xuICAgICAgICAgICAgaWQgPSAndGFzaycgKyBudW07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGlkO1xuICAgIH07XG4gICAgcmV0dXJuIFRhc2tUaW1lcjtcbn0oZXZlbnRlbWl0dGVyM18xLkV2ZW50RW1pdHRlcikpO1xuZXhwb3J0cy5UYXNrVGltZXIgPSBUYXNrVGltZXI7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIE5BTUVTUEFDRVxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyB0c2xpbnQ6ZGlzYWJsZTpuby1uYW1lc3BhY2Vcbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4vKiogQHByaXZhdGUgKi9cbihmdW5jdGlvbiAoVGFza1RpbWVyKSB7XG4gICAgLyoqXG4gICAgICogIFJlcHJlc2VudHMgdGhlIGNsYXNzIHRoYXQgaG9sZHMgdGhlIGNvbmZpZ3VyYXRpb25zIGFuZCB0aGUgY2FsbGJhY2sgZnVuY3Rpb25cbiAgICAgKiAgcmVxdWlyZWQgdG8gcnVuIGEgdGFzay4gU2VlIHtAbGluayBhcGkvI1Rhc2t8Y2xhc3MgaW5mb3JtYXRpb259LlxuICAgICAqICBAbmFtZSBUYXNrVGltZXIuVGFza1xuICAgICAqICBAY2xhc3NcbiAgICAgKi9cbiAgICBUYXNrVGltZXIuVGFzayA9IF8xLlRhc2s7XG4gICAgLyoqXG4gICAgICogIEVudW1lcmF0ZXMgYFRhc2tUaW1lcmAgc3RhdGVzLlxuICAgICAqICBAbWVtYmVyb2YgVGFza1RpbWVyXG4gICAgICogIEBlbnVtIHtTdHJpbmd9XG4gICAgICogIEByZWFkb25seVxuICAgICAqL1xuICAgIHZhciBTdGF0ZTtcbiAgICAoZnVuY3Rpb24gKFN0YXRlKSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiAgSW5kaWNhdGVzIHRoYXQgdGhlIHRpbWVyIGlzIGluIGBpZGxlYCBzdGF0ZS5cbiAgICAgICAgICogIFRoaXMgaXMgdGhlIGluaXRpYWwgc3RhdGUgd2hlbiB0aGUgYFRhc2tUaW1lcmAgaW5zdGFuY2UgaXMgZmlyc3QgY3JlYXRlZC5cbiAgICAgICAgICogIEFsc28gd2hlbiBhbiBleGlzdGluZyB0aW1lciBpcyByZXNldCwgaXQgd2lsbCBiZSBgaWRsZWAuXG4gICAgICAgICAqICBAdHlwZSB7U3RyaW5nfVxuICAgICAgICAgKi9cbiAgICAgICAgU3RhdGVbXCJJRExFXCJdID0gXCJpZGxlXCI7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiAgSW5kaWNhdGVzIHRoYXQgdGhlIHRpbWVyIGlzIGluIGBydW5uaW5nYCBzdGF0ZTsgc3VjaCBhcyB3aGVuIHRoZSB0aW1lciBpc1xuICAgICAgICAgKiAgc3RhcnRlZCBvciByZXN1bWVkLlxuICAgICAgICAgKiAgQHR5cGUge1N0cmluZ31cbiAgICAgICAgICovXG4gICAgICAgIFN0YXRlW1wiUlVOTklOR1wiXSA9IFwicnVubmluZ1wiO1xuICAgICAgICAvKipcbiAgICAgICAgICogIEluZGljYXRlcyB0aGF0IHRoZSB0aW1lciBpcyBpbiBgcGF1c2VkYCBzdGF0ZS5cbiAgICAgICAgICogIEB0eXBlIHtTdHJpbmd9XG4gICAgICAgICAqL1xuICAgICAgICBTdGF0ZVtcIlBBVVNFRFwiXSA9IFwicGF1c2VkXCI7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiAgSW5kaWNhdGVzIHRoYXQgdGhlIHRpbWVyIGlzIGluIGBzdG9wcGVkYCBzdGF0ZS5cbiAgICAgICAgICogIEB0eXBlIHtTdHJpbmd9XG4gICAgICAgICAqL1xuICAgICAgICBTdGF0ZVtcIlNUT1BQRURcIl0gPSBcInN0b3BwZWRcIjtcbiAgICB9KShTdGF0ZSA9IFRhc2tUaW1lci5TdGF0ZSB8fCAoVGFza1RpbWVyLlN0YXRlID0ge30pKTtcbiAgICAvKipcbiAgICAgKiAgRW51bWVyYXRlcyB0aGUgYFRhc2tUaW1lcmAgZXZlbnQgdHlwZXMuXG4gICAgICogIEBtZW1iZXJvZiBUYXNrVGltZXJcbiAgICAgKiAgQGVudW0ge1N0cmluZ31cbiAgICAgKiAgQHJlYWRvbmx5XG4gICAgICovXG4gICAgdmFyIEV2ZW50O1xuICAgIChmdW5jdGlvbiAoRXZlbnQpIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqICBFbWl0dGVkIG9uIGVhY2ggdGljayAoaW50ZXJ2YWwpIG9mIGBUYXNrVGltZXJgLlxuICAgICAgICAgKiAgQHR5cGUge1N0cmluZ31cbiAgICAgICAgICovXG4gICAgICAgIEV2ZW50W1wiVElDS1wiXSA9IFwidGlja1wiO1xuICAgICAgICAvKipcbiAgICAgICAgICogIEVtaXR0ZWQgd2hlbiB0aGUgdGltZXIgaXMgcHV0IGluIGBSVU5OSU5HYCBzdGF0ZTsgc3VjaCBhcyB3aGVuIHRoZSB0aW1lciBpc1xuICAgICAgICAgKiAgc3RhcnRlZC5cbiAgICAgICAgICogIEB0eXBlIHtTdHJpbmd9XG4gICAgICAgICAqL1xuICAgICAgICBFdmVudFtcIlNUQVJURURcIl0gPSBcInN0YXJ0ZWRcIjtcbiAgICAgICAgLyoqXG4gICAgICAgICAqICBFbWl0dGVkIHdoZW4gdGhlIHRpbWVyIGlzIHB1dCBpbiBgUlVOTklOR2Agc3RhdGU7IHN1Y2ggYXMgd2hlbiB0aGUgdGltZXIgaXNcbiAgICAgICAgICogIHJlc3VtZWQuXG4gICAgICAgICAqICBAdHlwZSB7U3RyaW5nfVxuICAgICAgICAgKi9cbiAgICAgICAgRXZlbnRbXCJSRVNVTUVEXCJdID0gXCJyZXN1bWVkXCI7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiAgRW1pdHRlZCB3aGVuIHRoZSB0aW1lciBpcyBwdXQgaW4gYFBBVVNFRGAgc3RhdGUuXG4gICAgICAgICAqICBAdHlwZSB7U3RyaW5nfVxuICAgICAgICAgKi9cbiAgICAgICAgRXZlbnRbXCJQQVVTRURcIl0gPSBcInBhdXNlZFwiO1xuICAgICAgICAvKipcbiAgICAgICAgICogIEVtaXR0ZWQgd2hlbiB0aGUgdGltZXIgaXMgcHV0IGluIGBTVE9QUEVEYCBzdGF0ZS5cbiAgICAgICAgICogIEB0eXBlIHtTdHJpbmd9XG4gICAgICAgICAqL1xuICAgICAgICBFdmVudFtcIlNUT1BQRURcIl0gPSBcInN0b3BwZWRcIjtcbiAgICAgICAgLyoqXG4gICAgICAgICAqICBFbWl0dGVkIHdoZW4gdGhlIHRpbWVyIGlzIHJlc2V0LlxuICAgICAgICAgKiAgQHR5cGUge1N0cmluZ31cbiAgICAgICAgICovXG4gICAgICAgIEV2ZW50W1wiUkVTRVRcIl0gPSBcInJlc2V0XCI7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiAgRW1pdHRlZCB3aGVuIGEgdGFzayBpcyBleGVjdXRlZC5cbiAgICAgICAgICogIEB0eXBlIHtTdHJpbmd9XG4gICAgICAgICAqL1xuICAgICAgICBFdmVudFtcIlRBU0tcIl0gPSBcInRhc2tcIjtcbiAgICAgICAgLyoqXG4gICAgICAgICAqICBFbWl0dGVkIHdoZW4gYSB0YXNrIGlzIGFkZGVkIHRvIGBUYXNrVGltZXJgIGluc3RhbmNlLlxuICAgICAgICAgKiAgQHR5cGUge1N0cmluZ31cbiAgICAgICAgICovXG4gICAgICAgIEV2ZW50W1wiVEFTS19BRERFRFwiXSA9IFwidGFza0FkZGVkXCI7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiAgRW1pdHRlZCB3aGVuIGEgdGFzayBpcyByZW1vdmVkIGZyb20gYFRhc2tUaW1lcmAgaW5zdGFuY2UuXG4gICAgICAgICAqICBOb3RlIHRoYXQgdGhpcyB3aWxsIG5vdCBiZSBlbWl0dGVkIHdoZW4gYC5yZXNldCgpYCBpcyBjYWxsZWQ7IHdoaWNoXG4gICAgICAgICAqICByZW1vdmVzIGFsbCB0YXNrcyBzaWxlbnRseS5cbiAgICAgICAgICogIEB0eXBlIHtTdHJpbmd9XG4gICAgICAgICAqL1xuICAgICAgICBFdmVudFtcIlRBU0tfUkVNT1ZFRFwiXSA9IFwidGFza1JlbW92ZWRcIjtcbiAgICAgICAgLyoqXG4gICAgICAgICAqICBFbWl0dGVkIHdoZW4gYSB0YXNrIGhhcyBjb21wbGV0ZWQgYWxsIG9mIGl0cyBleGVjdXRpb25zIChydW5zKVxuICAgICAgICAgKiAgb3IgcmVhY2hlZCBpdHMgc3RvcHBpbmcgZGF0ZS90aW1lIChpZiBzZXQpLiBOb3RlIHRoYXQgdGhpcyBldmVudFxuICAgICAgICAgKiAgd2lsbCBvbmx5IGJlIGZpcmVkIGlmIHRoZSB0YXNrcyBoYXMgYSBgdG90YWxSdW5zYCBsaW1pdCBvciBhXG4gICAgICAgICAqICBgc3RvcERhdGVgIHZhbHVlIHNldC5cbiAgICAgICAgICogIEB0eXBlIHtTdHJpbmd9XG4gICAgICAgICAqL1xuICAgICAgICBFdmVudFtcIlRBU0tfQ09NUExFVEVEXCJdID0gXCJ0YXNrQ29tcGxldGVkXCI7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiAgRW1pdHRlZCB3aGVuIGEgdGFzayBwcm9kdWNlcyBhbiBlcnJvciBvbiBpdHMgZXhlY3V0aW9uLlxuICAgICAgICAgKiAgQHR5cGUge1N0cmluZ31cbiAgICAgICAgICovXG4gICAgICAgIEV2ZW50W1wiVEFTS19FUlJPUlwiXSA9IFwidGFza0Vycm9yXCI7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiAgRW1pdHRlZCB3aGVuIGFsbCB0YXNrcyBoYXZlIGNvbXBsZXRlZCBhbGwgb2YgdGhlaXIgZXhlY3V0aW9ucyAocnVucylcbiAgICAgICAgICogIG9yIHJlYWNoZWQgdGhlaXIgc3RvcHBpbmcgZGF0ZS90aW1lIChpZiBzZXQpLiBOb3RlIHRoYXQgdGhpcyBldmVudFxuICAgICAgICAgKiAgd2lsbCBvbmx5IGJlIGZpcmVkIGlmIGFsbCB0YXNrcyBoYXZlIGEgYHRvdGFsUnVuc2AgbGltaXQgb3IgYVxuICAgICAgICAgKiAgYHN0b3BEYXRlYCB2YWx1ZSBzZXQuXG4gICAgICAgICAqICBAdHlwZSB7U3RyaW5nfVxuICAgICAgICAgKi9cbiAgICAgICAgRXZlbnRbXCJDT01QTEVURURcIl0gPSBcImNvbXBsZXRlZFwiO1xuICAgIH0pKEV2ZW50ID0gVGFza1RpbWVyLkV2ZW50IHx8IChUYXNrVGltZXIuRXZlbnQgPSB7fSkpO1xufSkoVGFza1RpbWVyIHx8IChleHBvcnRzLlRhc2tUaW1lciA9IFRhc2tUaW1lciA9IHt9KSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2NyZWF0ZUJpbmRpbmcgPSAodGhpcyAmJiB0aGlzLl9fY3JlYXRlQmluZGluZykgfHwgKE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xuICAgIHZhciBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihtLCBrKTtcbiAgICBpZiAoIWRlc2MgfHwgKFwiZ2V0XCIgaW4gZGVzYyA/ICFtLl9fZXNNb2R1bGUgOiBkZXNjLndyaXRhYmxlIHx8IGRlc2MuY29uZmlndXJhYmxlKSkge1xuICAgICAgZGVzYyA9IHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIG1ba107IH0gfTtcbiAgICB9XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIGsyLCBkZXNjKTtcbn0pIDogKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcbiAgICBvW2syXSA9IG1ba107XG59KSk7XG52YXIgX19leHBvcnRTdGFyID0gKHRoaXMgJiYgdGhpcy5fX2V4cG9ydFN0YXIpIHx8IGZ1bmN0aW9uKG0sIGV4cG9ydHMpIHtcbiAgICBmb3IgKHZhciBwIGluIG0pIGlmIChwICE9PSBcImRlZmF1bHRcIiAmJiAhT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGV4cG9ydHMsIHApKSBfX2NyZWF0ZUJpbmRpbmcoZXhwb3J0cywgbSwgcCk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuX19leHBvcnRTdGFyKHJlcXVpcmUoXCIuL0lUYXNrT3B0aW9uc1wiKSwgZXhwb3J0cyk7XG5fX2V4cG9ydFN0YXIocmVxdWlyZShcIi4vSVRhc2tUaW1lck9wdGlvbnNcIiksIGV4cG9ydHMpO1xuX19leHBvcnRTdGFyKHJlcXVpcmUoXCIuL0lUYXNrVGltZXJFdmVudFwiKSwgZXhwb3J0cyk7XG5fX2V4cG9ydFN0YXIocmVxdWlyZShcIi4vSVRpbWVJbmZvXCIpLCBleHBvcnRzKTtcbl9fZXhwb3J0U3RhcihyZXF1aXJlKFwiLi9UYXNrXCIpLCBleHBvcnRzKTtcbl9fZXhwb3J0U3RhcihyZXF1aXJlKFwiLi9UYXNrQ2FsbGJhY2tcIiksIGV4cG9ydHMpO1xuX19leHBvcnRTdGFyKHJlcXVpcmUoXCIuL1Rhc2tUaW1lclwiKSwgZXhwb3J0cyk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX3NwcmVhZEFycmF5ID0gKHRoaXMgJiYgdGhpcy5fX3NwcmVhZEFycmF5KSB8fCBmdW5jdGlvbiAodG8sIGZyb20sIHBhY2spIHtcbiAgICBpZiAocGFjayB8fCBhcmd1bWVudHMubGVuZ3RoID09PSAyKSBmb3IgKHZhciBpID0gMCwgbCA9IGZyb20ubGVuZ3RoLCBhcjsgaSA8IGw7IGkrKykge1xuICAgICAgICBpZiAoYXIgfHwgIShpIGluIGZyb20pKSB7XG4gICAgICAgICAgICBpZiAoIWFyKSBhciA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGZyb20sIDAsIGkpO1xuICAgICAgICAgICAgYXJbaV0gPSBmcm9tW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0by5jb25jYXQoYXIgfHwgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZnJvbSkpO1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMudXRpbHMgPSB2b2lkIDA7XG52YXIgcHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xudmFyIE5PREUgPSB0eXBlb2Ygc2V0SW1tZWRpYXRlID09PSAnZnVuY3Rpb24nXG4gICAgJiYgdHlwZW9mIHByb2Nlc3MgPT09ICdvYmplY3QnXG4gICAgJiYgdHlwZW9mIHByb2Nlc3MuaHJ0aW1lID09PSAnZnVuY3Rpb24nO1xudmFyIEJST1dTRVIgPSAhTk9ERTtcbi8qKiBAcHJpdmF0ZSAqL1xudmFyIHV0aWxzID0ge1xuICAgIE5PREU6IE5PREUsXG4gICAgQlJPV1NFUjogQlJPV1NFUixcbiAgICB0eXBlOiBmdW5jdGlvbiAobykge1xuICAgICAgICByZXR1cm4gcHJvdG8udG9TdHJpbmcuY2FsbChvKS5tYXRjaCgvXFxzKFxcdyspL2kpWzFdLnRvTG93ZXJDYXNlKCk7XG4gICAgfSxcbiAgICBpc3NldDogZnVuY3Rpb24gKG8pIHtcbiAgICAgICAgcmV0dXJuIG8gIT09IG51bGwgJiYgbyAhPT0gdW5kZWZpbmVkO1xuICAgIH0sXG4gICAgZW5zdXJlQXJyYXk6IGZ1bmN0aW9uIChvKSB7XG4gICAgICAgIHJldHVybiB1dGlscy5pc3NldChvKVxuICAgICAgICAgICAgPyAhQXJyYXkuaXNBcnJheShvKSA/IFtvXSA6IG9cbiAgICAgICAgICAgIDogW107XG4gICAgfSxcbiAgICBnZXROdW1iZXI6IGZ1bmN0aW9uICh2YWx1ZSwgbWluaW11bSwgZGVmYXVsdFZhbHVlKSB7XG4gICAgICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInXG4gICAgICAgICAgICA/ICh2YWx1ZSA8IG1pbmltdW0gPyBtaW5pbXVtIDogdmFsdWUpXG4gICAgICAgICAgICA6IGRlZmF1bHRWYWx1ZTtcbiAgICB9LFxuICAgIGdldEJvb2w6IGZ1bmN0aW9uICh2YWx1ZSwgZGVmYXVsdFZhbHVlKSB7XG4gICAgICAgIHJldHVybiB0eXBlb2YgdmFsdWUgIT09ICdib29sZWFuJ1xuICAgICAgICAgICAgPyBkZWZhdWx0VmFsdWVcbiAgICAgICAgICAgIDogdmFsdWU7XG4gICAgfSxcbiAgICBzZXRJbW1lZGlhdGU6IGZ1bmN0aW9uIChjYikge1xuICAgICAgICB2YXIgYXJncyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBfaSA9IDE7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgYXJnc1tfaSAtIDFdID0gYXJndW1lbnRzW19pXTtcbiAgICAgICAgfVxuICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICAgICAgaWYgKHV0aWxzLkJST1dTRVIpIHsgLy8gdGVzdGVkIHNlcGFyYXRlbHlcbiAgICAgICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGNiLmFwcGx5KG51bGwsIGFyZ3MpLCAwKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc2V0SW1tZWRpYXRlLmFwcGx5KHZvaWQgMCwgX19zcHJlYWRBcnJheShbY2JdLCBhcmdzLCBmYWxzZSkpO1xuICAgIH0sXG4gICAgY2xlYXJJbW1lZGlhdGU6IGZ1bmN0aW9uIChpZCkge1xuICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgICAgICBpZiAoIWlkKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICAgICAgaWYgKHV0aWxzLkJST1dTRVIpXG4gICAgICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KGlkKTsgLy8gdGVzdGVkIHNlcGFyYXRlbHlcbiAgICAgICAgY2xlYXJJbW1lZGlhdGUoaWQpO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogIENoZWNrcyB3aGV0aGVyIHRoZSBnaXZlbiB2YWx1ZSBpcyBhIHByb21pc2UuXG4gICAgICogIEBwcml2YXRlXG4gICAgICogIEBwYXJhbSB7YW55fSB2YWx1ZSAtIFZhbHVlIHRvIGJlIGNoZWNrZWQuXG4gICAgICogIEByZXR1cm4ge2Jvb2xlYW59XG4gICAgICovXG4gICAgaXNQcm9taXNlOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlXG4gICAgICAgICAgICAmJiB1dGlscy50eXBlKHZhbHVlKSA9PT0gJ3Byb21pc2UnXG4gICAgICAgICAgICAmJiB0eXBlb2YgdmFsdWUudGhlbiA9PT0gJ2Z1bmN0aW9uJztcbiAgICB9XG59O1xuZXhwb3J0cy51dGlscyA9IHV0aWxzO1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRpZiAoIShtb2R1bGVJZCBpbiBfX3dlYnBhY2tfbW9kdWxlc19fKSkge1xuXHRcdGRlbGV0ZSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRcdHZhciBlID0gbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIiArIG1vZHVsZUlkICsgXCInXCIpO1xuXHRcdGUuY29kZSA9ICdNT0RVTEVfTk9UX0ZPVU5EJztcblx0XHR0aHJvdyBlO1xuXHR9XG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvaW5kZXgudHNcIik7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=
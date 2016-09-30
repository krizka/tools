/**
 * Created by kriz on 31/07/16.
 */

Function.prototype.curry = function (...curried) {
    return (...args) => {
        this(...curried, ...args);
    }
};

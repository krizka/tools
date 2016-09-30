/**
 * Created by kriz on 12/07/16.
 */

import { Meteor } from 'meteor/meteor';
import { Match, check } from 'meteor/check';
import { User } from '/imports/models/user';
import { checkUser } from '/imports/utils/check-user';
import { _ } from 'meteor/underscore';

/////////////////////////
// For methods
/////////////////////////

// noinspection Eslint
const methodDescription = {
    action: Match.Optional(String),
    user: Match.Optional(Boolean),
    validate: Match.OneOf(Array, Function),
    anonymous: Match.Optional(Boolean),
    method: Function
};

export function registerMeteorMethods(methods) {
    _.map(methods, (desc, name) => {
        check(desc, methodDescription);

        const validate = Array.isArray(desc.validate)
            ? args => desc.validate.forEach((cond, i) => check(args[i], cond))
            : desc.validate;
        const action = desc.action || name;

        Meteor.methods({
            [name](...args) {
                validate(args);
                if (!desc.anonymous) {
                    checkUser(this.userId, action);

                    if (desc.user) {
                        this.user = User.findOne(this.userId);
                    }
                }

                return desc.method.apply(this, args);
            }
        }, 'secured');
    });
}

const originalMethods = Meteor.methods;
Meteor.methods = function (methods, secured) {
    if (secured !== 'secured') {
        const err = new Error('use registerMeteorMethods function for secure methods registration');
        // TODO uncomment
        // throw err;
        const m = err.stack.match(/Error: (.*\n).*\n(.*)/m);
        console.warn(`Warning: ${m[1]}${m[2]}`);
    }

    originalMethods.call(Meteor, methods);
};

/////////////////////////
// For publish
/////////////////////////

// noinspection Eslint
const publishDescription = {
    action: Match.Optional(String),
    user: Match.Optional(Boolean),
    validate: Match.OneOf(Array, Function),
    publish: Function,
    anonymous: Match.Optional(Boolean),
};

export function registerMeteorPublish(publish) {
    _.map(publish, (desc, name) => {
        check(desc, publishDescription);

        const validate = Array.isArray(desc.validate)
            ? args => desc.validate.forEach((cond, i) => check(args[i], cond))
            : desc.validate;
        const action = desc.action || name;

        Meteor.publish(name, function (...args) {
            validate(args);
            if (!desc.anonymous) {
                checkUser(this.userId, action);
                if (desc.user) {
                    this.user = User.findOne(this.userId);
                }
            }

            return desc.publish.apply(this, args);
        }, 'secured');
    });
}

const originalPublish = Meteor.publish;
Meteor.publish = function (name, callback, secured) {
    if (secured !== 'secured') {
        const err = new Error(`use registerMeteorPublish function for secure publications: ${name}`);
        // TODO uncomment
        // throw err;
        const m = err.stack.match(/Error: (.*\n).*\n(.*)/m);
        console.warn(`Warning: ${m[1]}${m[2]}`);
    }

    originalPublish.call(Meteor, name, callback);
};

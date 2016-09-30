/**
 * Created by kriz on 21/06/16.
 */

import { Class, Validator, Enum } from 'meteor/jagi:astronomy';
import { Match } from 'meteor/check';


export function makeValidators(obj) {
    return _.map(obj, (param, type) => ({ param, type }));
}

Class.pickFields = function (...fields) {
    const fieldDefs = {};
    (fields.length ? fields : this.definition.fields)
        .forEach(fieldName => {
            const fieldDef = this.definition.fields[fieldName];
            if (!fieldDef)
                throw new Error(`no field ${fieldName} in schema ${this.name}`);

            const field = Object.assign({}, fieldDef);

            // add validator if any
            var validator = this.definition.validators[fieldName];
            if (validator)
                field.validators = validator;

            fieldDefs[fieldName] = field;
        });
    return fieldDefs;
};

Class.check = function checkModel() {
    return this._checkWhere || (this._checkWhere = Match.Where(data => {
            const obj = new this(data);
            obj.validate({ stopOnFirstError: true });
            return true;
        }));
};

Class.requireOne = function requireOne(selector, options) {
    const doc = this.findOne(selector, options);
    if (!doc) {
        throw new Meteor.Error(404, 'not_found');
    }

    return doc;
};

export { Class, Enum };

Validator.create({
    name: 'equalTo',
    isValid({ value, param, doc }) {
        return value === doc[param];
    },
    resolveError({ name, param }) {
        return `"${name}" should be equal ${param}`;
    }
});

Validator.create({
    name: 'minLengthOptional',
    isValid({ value, param, doc }) {
        return !value || value.length >= param;
    },
    resolveError({ name, param }) {
        return `"${name}" must be empty or its length must be at least ${param}`;
    }
});


Meteor.Collection.prototype.getTransform = function () {
    return this._transform;
};
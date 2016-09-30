import transformToClass from 'meteor/jagi:astronomy/lib/modules/storage/utils/transform_to_class';
import { Class } from 'meteor/jagi:astronomy';
import { Meteor } from 'meteor/meteor';
import { each } from 'lodash';
import { Counts } from 'meteor/tmeasday:publish-counts';

function from(col) {
    // check(col, Meteor.Collection);

    const sub = this;
    const fieldName = `sub_${sub.subscriptionId}`;

    function transformFunc(before, doc) {
        // remove all sub_ fields
        each(doc, (_, fieldName) => {
            if (fieldName.length === 21 && fieldName.startsWith('sub_')) // 4(sub_) + 17(id)
                delete doc[fieldName];
        });
        // return with prev transform, or just a doc
        return before ? before(doc) : doc;
    }

    const transform = col.prototype instanceof Class ?
        transformToClass(col.getName()) :
        col._transform;

    function find(fn, query, options) {
        const q = Object.assign({
            [fieldName]: 1
        }, query);

        const o = Object.assign({}, options);
        o.transform = transformFunc.bind(null, transform);

        return col[fn](q, o);
    }

    return {
        find: find.bind(null, 'find'),
        findOne: find.bind(null, 'findOne'),

        count() {
            return Counts.get(`sub_count_${col._name}_${sub.subscriptionId}`);
        }
    };
}

Meteor.subscribeScoped = function (subName, ...params) {
    const handle = Meteor.subscribe('fromsub', subName, ...params);
    handle.from = from;
    return handle;
};

import './find-and-modify';
import { Mongo } from 'meteor/mongo';

class MongoCounter {
    constructor(col, counterName) {
        this._col = col;
        this._name = counterName;

        if (!col.findOne({ _id: this._name })) {
            col.insert({ _id: this._name, value: 0 });
        }
    }

    increment(value = 1) {
        const query = {
            query: { _id: this._name },
            update: { $inc: { value } },
            new: true
        };
        const counter = this._col.findAndModify(query);

        return counter.value.value;
    }
}

export const MongoCounters = {
    _collection: new Mongo.Collection('counters'),

    createCounter(name) {
        return new MongoCounter(this._collection, name);
    }
};

/**
 * Created by kriz on 29/11/15.
 */

import './scoped-subscribe';
import { Meteor } from 'meteor/meteor';

function publishCursorWithCount(pub, cursor) {
    const colName = cursor._cursorDescription.collectionName;
    const subId = pub._subscriptionId;
    const handle = cursor.observeChanges({
        added(id, fields) {
            fields[`sub_${subId}`] = 1;
            pub.added(colName, id, fields);
        },

        changed(id, fields) {
            pub.changed(colName, id, fields);
        },

        removed(id) {
            pub.removed(colName, id);
        }
    });

    pub.onStop(() => handle.stop());
    // mimic tmeasday:publish-counts
    pub.added('counts', `sub_count_${colName}_${subId}`, { count: cursor.count() });
}

const publishHandlers = Meteor.default_server.publish_handlers;

Meteor.publish('fromsub', function (subName, ...params) {
    const subHandler = publishHandlers[subName];
    if (!subHandler)
        throw new Meteor.Error('sub_not_found', `sub with name ${subName} not found`, subName);
    let cursors;

    try {
        cursors = subHandler.apply(this, params);
    } catch (e) {
        console.error(`Exception from sub ${subName} id ${this._subscriptionId}`, e);
        return;
    }

    if (!cursors)
        return;

    if (Array.isArray(cursors)) {
        cursors.forEach(cursor => publishCursorWithCount(this, cursor));
    } else {
        publishCursorWithCount(this, cursors);
    }

    this.ready();
});

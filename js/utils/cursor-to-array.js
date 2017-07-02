
export function syncCursorToArray(col, cursor, array) {
    // cursor._cursorDescription.collectionName
    cursor.observeChanges({
        added(_id, fields) {
            array.push(col.findOne(_id));
        },
        changed(_id, fields) {
            const idx = array.findIndex(e => e._id === _id);
            array[idx] = col.findOne(_id);
        },
        removed(_id) {
            const idx = array.findIndex(e => e._id === _id);
            array.splice(idx, 1);
        },
    })
}

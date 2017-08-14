/**
 * Created by kriz on 02/06/2017.
 */

import moment from 'moment';

export function diffDate(date, y, m, d, h, M, s) {
    const res = new Date(date);
    if (y || m || d)
        res.setFullYear(
            date.getFullYear() + (y || 0),
            date.getMonth() + (m || 0),
            date.getDate() + (d || 0),
        );
    if (h || M || s)
        res.setHours(
            date.getHours() + (h || 0),
            date.getMinutes() + (m || 0),
            date.getSeconds() + (s || 0),
        );

    return res;
}

export function formatDatetime(date) {
    return moment(date).format('DD.MM.YYYY HH:mm')
}

export function formatDate(date) {
    return moment(date).format('DD.MM.YYYY');
}
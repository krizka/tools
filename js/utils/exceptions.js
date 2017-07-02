/**
 * Created by kriz on 14/06/2017.
 */

export class StopRetry extends Error {

}

export function retry(func, retries = 10, check) {
    let last = undefined;
    while (retries--) {
        try {
            return func()
        } catch (e) {
            if (e instanceof StopRetry) {
                console.error('RETRY STOP Error', e.message);
                return;
            }
            console.error('RETRY error', e.message);
            last = e;

            if (check && check(e))
                break;
        }
    }
    if (last)
        throw last;
}

import { md5 } from './md5';
import { SSR } from 'meteor/meteorhacks:ssr';

export function renderTemplate(text, data) {
    const name = md5(text);
    if (!Template[name])
        SSR.compileTemplate(name, text);

    return SSR.render(name, data);
}

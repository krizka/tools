/**
 * Created by kriz on 28/04/16.
 */

import { renderEmailTemplate } from './template';
import { siteName } from '/imports/settings/server';

SSR.compileTemplate('verifyEmail', Assets.getText('verify-email.html'));

Object.assign(Accounts.emailTemplates.verifyEmail, {
    subject(user) {
        return `Регистрация на сайте ${siteName}`;
    },

    html(user, url) {
        return renderEmailTemplate('verifyEmail', { user, url });
    }

});

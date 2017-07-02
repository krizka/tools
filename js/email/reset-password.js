/**
 * Created by kriz on 23/07/16.
 */

/**
 * Created by kriz on 28/04/16.
 */

import { renderEmailTemplate } from './template';
import { siteName } from '/imports/settings/server';

SSR.compileTemplate('resetPassword', Assets.getText('reset-password-email.html'));

Object.assign(Accounts.emailTemplates.resetPassword, {
    subject(user) {
        return `Восстановление пароля на ${siteName}`;
    },

    html(user, url) {
        return renderEmailTemplate('resetPassword', { user, url });
    }

});

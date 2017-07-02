/**
 * Created by kriz on 23/07/16.
 */

import { siteName, fromEmail } from '/imports/settings/server';
import './verify-email';
import './reset-password';

let email = Meteor.settings.email;
Accounts.emailTemplates.from = email.from;
Accounts.emailTemplates.sitename = email.siteName;

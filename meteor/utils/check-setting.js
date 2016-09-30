/**
 * Created by kriz on 28/04/16.
 */

/**
 * Check meteor setting and exit if not exists
 * @param path - path to the setting like 'email.from'
 * @param defaultValue - default value, exit if option and default value not specified
 * @param description - description to log if path not exists
 * @returns {*} - setting value
 */
export default function checkSetting(path, defaultValue, description) {
	const hasDefault = arguments.length === 3;
	if (!hasDefault) {
		description = defaultValue;
		defaultValue = undefined;
	}
	
	var settings = Meteor.settings;

	if (_.isEmpty(settings)) {
		Log.error('Please include settings on meteor command line with --settings <file> or METEOR_SETTINGS enveronment variable');
		process.exit(1);
	}

	var args = path.split('.');
	var value = Meteor._get(settings, ...args);
	if (value === undefined) {
		if (hasDefault) {
			value = defaultValue;
			Log.warn(`${path} (${description}) is not set on settings, using default: ${value}`);
		} else {
			Log.error(new Error(`Please set ${path} on Meteor settings: ${description}`).stack);
			process.exit(1);
		}
	}

	return value;
};

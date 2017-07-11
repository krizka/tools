import { Alerts } from './Alerts';

const showOk = () => 'OK';

export function alertCallback(headline, parseResult = showOk) {
    Alerts.generate(headline, ' started', 'info');
    return (err, result) => {
        if (err) {
            Alerts.generate(headline, err.message, 'danger');
        } else {
            Alerts.generate(headline, parseResult(result), 'success');
        }
    }
}
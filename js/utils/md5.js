import crypto from 'crypto';

export function md5(text) {
    const md5sum = crypto.createHash('md5');
    md5sum.update(text);
    return md5sum.digest('hex');
}

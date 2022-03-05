const config = require(`config/index.js`);
const crypto = require('crypto');

const cipher = {};

// 반드시 32글자 해야함
const cipher_key = config.cipher.key;

cipher.encrypt = async (text) => {
    const cipher_iv = crypto.randomBytes(16);
    const enc = crypto.createCipheriv(config.cipher.two_way_algorithm, Buffer.from(cipher_key), cipher_iv);
    let encrypted = enc.update(text);

    encrypted = Buffer.concat([encrypted, enc.final()]);

    return cipher_iv.toString('hex') + ':' + encrypted.toString('hex');
};

cipher.decrypt = async (text) => {
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv(config.cipher.two_way_algorithm, Buffer.from(cipher_key), iv);
    let decrypted = decipher.update(encryptedText);

    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString();
};


module.exports = cipher;

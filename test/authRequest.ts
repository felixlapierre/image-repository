import crypto = require('crypto');
const request = require('supertest');
const users = {
    mike: {
        key: "a5b9731b-240a-4d9d-bbf5-8bd35502e16e",
        secret: "mike-secret"
    },
    frankie: {
        key: "67f66d5e-19e8-4162-bf7f-6f1be73d6537",
        secret: "frankie-secret"
    },
    rebecca: {
        key: "1c383b31-3c44-413c-a286-5d07562a582d",
        secret: "rebecca-secret"
    }
}

function getAuthorizationHeader(key, secret, date) {
    const signature = `date: ${date}`;
    const encoded = crypto.createHmac('sha256', secret).update(signature).digest('base64');
    return `Signature keyId="${key}",algorithm="hmac-sha256",signature="${encoded}"`;
}

module.exports = function(user) {
    const date = new Date().toUTCString();
    const authorizationHeader = getAuthorizationHeader(users[user].key, users[user].secret, date);
    return {auth: authorizationHeader, date: date}
}
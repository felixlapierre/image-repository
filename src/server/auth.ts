const apiKeys = new Map();
import uuid from 'uuid';
import apiKeyAuth = require('api-key-auth');

const existingKeys = require("./api_keys.json");

existingKeys.forEach((data) => {
    apiKeys.set(data.key, {
        id: uuid.v4(),
        name: data.name,
        secret: data.secret
    })
})

function getSecret(key, done) {
    if (!apiKeys.has(key)) {
        done(new Error('API key not found'));
    }

    const client = apiKeys.get(key);

    done(null, client.secret, {
        id: client.id,
        name: client.name
    })
}

module.exports = apiKeyAuth({ getSecret });
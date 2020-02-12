const apiKeys = new Map();
import uuid from 'uuid';
import apiKeyAuth = require('api-key-auth');

/**
 * Existing keys are hardcoded into a json file, in a real system these would
 * be managed by an authentication server.
 */
const existingKeys = require("./api_keys").default;

existingKeys.forEach((data) => {
    apiKeys.set(data.key, {
        id: data.id,
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
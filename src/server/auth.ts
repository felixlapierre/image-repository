const apiKeys = new Map();
import apiKeyAuth = require('api-key-auth');

/**
 * Existing keys are hardcoded into a json file, in a real system these would
 * be managed by an authentication server.
 */
const existingKeys = require("./api_keys").default;

const users = {};

existingKeys.forEach((data) => {
    apiKeys.set(data.key, {
        id: data.id,
        key: data.key,
        name: data.name,
        secret: data.secret
    })

    users[data.id] = data.name;
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

const auth = apiKeyAuth({getSecret});
export {auth, users};
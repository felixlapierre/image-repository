const apiKeys = new Map();
const uuid = require('uuid');
const apiKeyAuth = require('api-key-auth');

const key1 = "a5b9731b-240a-4d9d-bbf5-8bd35502e16e"
const key2 = "67f66d5e-19e8-4162-bf7f-6f1be73d6537"
const key3 = "1c383b31-3c44-413c-a286-5d07562a582d"

apiKeys.set(key1, {
    id: uuid.v4(),
    name: 'mike',
    secret: 'mike-secret'
})

apiKeys.set(key2, {
    id: uuid.v4(),
    name: 'frankie',
    secret: 'frankie-secret'
})

apiKeys.set(key3, {
    id: uuid.v4(),
    name: 'rebecca',
    secret: 'rebecca-secret'
})

function getSecret(key, done) {
    if(!apiKeys.has(key)) {
        done(new Error('API key not found'));
    }

    const client = apiKeys.get(key);

    done(null, client.secret, {
        id: client.id,
        name: client.name
    })
}

module.exports = apiKeyAuth({getSecret});
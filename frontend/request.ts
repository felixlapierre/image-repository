const authRequest = require('./authRequest');
const axios = require('axios').default;

export interface RequestOptions {
    path: string,
    method: string
    body?: any
}

export function Request(options: RequestOptions, user: string) {
    let auth, date;
    ({ auth, date } = authRequest(user))
    const instance = axios.create({
        timeout: 1000,
        headers: {
            'Authorization': auth,
            'Date': date
        }
    })

    return instance({
        method: options.method,
        url: `http://localhost:3000${options.path}`,
        data: options.body
    })
}

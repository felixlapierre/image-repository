var assert = require('assert');

const request = require('supertest');
let app = require('../src/index');

describe('app', () => {
    describe('/', () => {
        it('should return status 200', (done) => {
            request(app)
                .get('/')
                .expect(200, done)
        })
    })
})
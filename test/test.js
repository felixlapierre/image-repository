const request = require('supertest');
const expect = require('chai').expect;
let app = require('../src/index');
let database = require('../src/database');
const sampleImages = require('./sampleImages');

describe('app', () => {
    before(() => {
        database.clearImages();
    })
    describe('/', () => {
        it('should return status 200', (done) => {
            request(app)
                .get('/')
                .expect(200, done)
        })
    })
    describe('POST /images', () => {
        it('should upload an image', (done) => {
            request(app)
                .post('/image')
                .send({ image: sampleImages.sample })
                .expect(200, done);
        })
    })

    describe('POST /images/bulk', () => {
        it('should be able to upload several images', (done) => {
            request(app)
                .post('/image/bulk')
                .send({ images: [sampleImages.blue, sampleImages.matterhorn] })
                .expect(200, done);
        })
    })
})
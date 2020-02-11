const request = require('supertest');
const expect = require('chai').expect;
let app = require('../src/index');
let database = require('../src/database');
const sampleImages = require('./sampleImages');

describe('app', () => {
    before(() => {
        database.clearImages();
    })
    describe('Status', () => {
        it('should return status 200 on GET /', (done) => {
            request(app)
                .get('/')
                .expect(200, done)
        })
    })
    describe('Uploading images', () => {
        it('should support uploading several images', (done) => {
            request(app)
                .post('/image')
                .send({ image: sampleImages.sample })
                .expect(200, done);
        })

        it('should support uploading several images', (done) => {
            const images = [sampleImages.blue, sampleImages.matterhorn];

            request(app)
                .post('/image/bulk')
                .send({ images: images})
                .expect(200, done);
        })
    })
})
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
        it('should return status 200 on GET /', async () => {
            return request(app)
                .get('/')
                .expect(200)
        })
    })
    describe('Uploading images', () => {
        it('should support uploading single images', async () => {
            return request(app)
                .post('/image')
                .send({ image: sampleImages.sample })
                .expect(200)
                .then((response) => {
                    return request(app)
                        .get(`/image/${response.body.uuid}`)
                        .expect(200)
                }).then((response) => {
                    expect(response.body.base64).to.equal(sampleImages.sample.base64);
                })
        })

        it('should support uploading several images', async () => {
            const images = [sampleImages.blue, sampleImages.matterhorn];

            return request(app)
                .post('/image/bulk')
                .send({ images: images})
                .expect(200)
                .then((response) => {
                    return Promise.all([
                        request(app)
                        .get(`/image/${response.body.images[0].uuid}`)
                        .expect(200),
                        request(app)
                        .get(`/image/${response.body.images[1].uuid}`)
                        .expect(200)
                    ])
                }).then((responses) => {
                    expect(responses[0].body.base64).to.equal(sampleImages.blue.base64);
                    expect(responses[1].body.base64).to.equal(sampleImages.matterhorn.base64);
                })
        })
    })
})
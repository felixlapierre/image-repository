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
        it('should support uploading several images', async () => {
            return request(app)
                .post('/image')
                .send({ image: sampleImages.sample })
                .expect(200)
                .then((response) => {
                    return request(app)
                        .get(`/image/${response.uuid}`)
                        .expect(200)
                }).then((response) => {
                    console.log(response);
                    expect(response.base64).to.exist;
                    expect(response.base64).to.equal(sampleImages.sample.base64);
                })
        })

        it('should support uploading several images', async () => {
            const images = [sampleImages.blue, sampleImages.matterhorn];

            return request(app)
                .post('/image/bulk')
                .send({ images: images})
                .expect(200);
        })
    })
})
/// <reference path="../src/typings/custom.d.ts" />
import request = require('supertest');
import {expect} from 'chai';
import {Server} from '../src/server/Server';
import {MongoDBImageDatabase} from '../src/database/MongoDBImageDatabase';

const sampleImages = require('./sampleImages');
const getAuthHeaders = require('./authRequest');

const database = new MongoDBImageDatabase('mongodb://localhost:27017/imagerepotest');
const server = new Server(database);
const app = server.getExpressApp();

describe('app', () => {
    before(() => {
        database.clearImages();
    })
    describe('Status', () => {
        it('should return status 200 on GET /', async () => {
            const { auth, date } = getAuthHeaders('mike')
            return request(app)
                .get('/')
                .set('Authorization', auth)
                .set('Date', date)
                .expect(200)
        })
    })
    describe('Uploading images', () => {
        let auth, date;
        beforeEach(() => {
            ({ auth, date } = getAuthHeaders('mike'));
        })
        it('should support uploading single images', async () => {
            return request(app)
                .post('/image')
                .set('Authorization', auth)
                .set('Date', date)
                .send({ image: sampleImages.sample })
                .expect(200)
                .then((response) => {
                    return request(app)
                        .get(`/image/${response.body.uuid}`)
                        .set('Authorization', auth)
                        .set('Date', date)
                        .expect(200)
                }).then((response) => {
                    expect(response.body.base64).to.equal(sampleImages.sample.base64);
                })
        })

        it('should support uploading several images', async () => {
            const images = [sampleImages.blue, sampleImages.matterhorn];

            return request(app)
                .post('/image/bulk')
                .set('Authorization', auth)
                .set('Date', date)
                .send({ images: images })
                .expect(200)
                .then((response) => {
                    return Promise.all([
                        request(app)
                            .get(`/image/${response.body.images[0].uuid}`)
                            .set('Authorization', auth)
                            .set('Date', date)
                            .expect(200),
                        request(app)
                            .get(`/image/${response.body.images[1].uuid}`)
                            .set('Authorization', auth)
                            .set('Date', date)
                            .expect(200)
                    ])
                }).then((responses) => {
                    expect(responses[0].body.base64).to.equal(sampleImages.blue.base64);
                    expect(responses[1].body.base64).to.equal(sampleImages.matterhorn.base64);
                })
        })

        it('should only show private images to the image uploader', async () => {
            const image = sampleImages.snom;
            image.visibility = "private";
            let imageUuid;

            return request(app)
                .post('/image')
                .set('Authorization', auth)
                .set('Date', date)
                .send({ image: image })
                .expect(200)
                .then((response) => {
                    imageUuid = response.body.uuid;

                    return request(app)
                        .get(`/image/${imageUuid}`)
                        .set('Authorization', auth)
                        .set('Date', date)
                        .expect(200)
                }).then((response) => {
                    expect(response.body.base64).to.equal(sampleImages.snom.base64);
                    return Promise.resolve()
                }).then(() => {
                    ({ auth, date } = getAuthHeaders('frankie'));

                    return request(app)
                        .get(`/image/${imageUuid}`)
                        .set('Authorization', auth)
                        .set('Date', date)
                        .expect(401);
                })

        })
    })

    describe('Deleting images', () => {
        let auth, date;
        beforeEach(() => {
            ({ auth, date } = getAuthHeaders('mike'));
        })
        it('should allow deleting images', async () => {
            const image = sampleImages.matterhorn;
            let imageUuid;

            return request(app)
                .post('/image')
                .set('Authorization', auth)
                .set('Date', date)
                .send({ image: image })
                .expect(200)
                .then((response) => {
                    imageUuid = response.body.uuid;
                    return request(app)
                        .delete(`/image/${imageUuid}`)
                        .set('Authorization', auth)
                        .set('Date', date)
                        .expect(200)
                }).then(() => {
                    return request(app)
                        .get(`/image/${imageUuid}`)
                        .set('Authorization', auth)
                        .set('Date', date)
                        .expect(404)
                })
        })

        it('should not allow deleting another user\'s images', async () => {
            const image = sampleImages.sample;

            return request(app)
                .post('/image')
                .set('Authorization', auth)
                .set('Date', date)
                .send({image: image})
                .expect(200)
                .then((response) => {
                    ({auth, date} = getAuthHeaders('frankie'))
                    return request(app)
                        .delete(`/image/${response.body.uuid}`)
                        .set('Authorization', auth)
                        .set('Date', date)
                        .expect(401)                        
                })
        })
    })
})
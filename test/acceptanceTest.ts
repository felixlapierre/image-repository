/// <reference path="../src/typings/custom.d.ts" />
import request = require('supertest');
import {expect} from 'chai';
import {Server} from '../src/server/Server';
import {MongoDBImageDatabase} from '../src/database/MongoDBImageDatabase';

import {SampleImages} from './utils/sampleImages';

const getAuthHeaders = require('./utils/authRequest');

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
                .send({ image: SampleImages.Sample })
                .expect(200)
                .then((response) => {
                    return request(app)
                        .get(`/image/${response.body.uuid}`)
                        .set('Authorization', auth)
                        .set('Date', date)
                        .expect(200)
                }).then((response) => {
                    expect(response.body.base64).to.equal(SampleImages.Sample.base64);
                })
        })

        it('should support uploading several images', async () => {
            const images = [SampleImages.Blue, SampleImages.Matterhorn];

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
                    expect(responses[0].body.base64).to.equal(SampleImages.Blue.base64);
                    expect(responses[1].body.base64).to.equal(SampleImages.Matterhorn.base64);
                })
        })

        it('should only show private images to the image uploader', async () => {
            const image = SampleImages.Snom;
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
                    expect(response.body.base64).to.equal(SampleImages.Snom.base64);
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
            const image = SampleImages.Matterhorn;
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
            const image = SampleImages.Sample;

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

        it.skip('should allow deleting bulk images', async () => {
            const images = [SampleImages.Blue, SampleImages.Snom];

            return request(app)
                .post('/image/bulk')
                .set('Authorization', auth)
                .set('Date', date)
                .send({images: images})
                .expect(200)
                .then((response) => {
                    const toDelete = [response.body.images[0].uuid, response.body.images[1].uuid];
                    return request(app)
                        .delete(`/image/bulk`)
                        .set('Authorization', auth)
                        .set('Date', date)
                        .send({images: toDelete})
                        .expect(200)
                })
        })
    })

    describe('Image search', () => {
        let auth: string, date: string;
        beforeEach(() => {
            ({auth, date} = getAuthHeaders('mike'));
        })
        it('should support searching by name', async () => {
            database.clearImages();
            const images = [SampleImages.Blue, SampleImages.Snom, SampleImages.Blue];
            let uuids;

            return request(app)
                .post('/image/bulk')
                .set('Authorization', auth)
                .set('Date', date)
                .send({images: images})
                .expect(200)
                .then((response) => {
                    uuids = response.body.images.map((image) => {
                        return image.uuid;
                    })

                    const search = SampleImages.Blue.name;

                    return request(app)
                    .get(`/search?name=${encodeURIComponent(search)}`)
                    .set('Authorization', auth)
                    .set('Date', date)
                    .expect(200)                    
                }).then((response) => {
                    expect(response.body.images).to.contain(uuids[0]);
                    expect(response.body.images).to.contain(uuids[2]);
                })
        })
    })
})
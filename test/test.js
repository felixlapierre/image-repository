const request = require('supertest');
const expect = require('chai').expect;
let app = require('../src/index');
let database = require('../src/database');

function loadImage(filename) {
    const fs = require('fs');
    const imageAsBase64 = fs.readFileSync(`${__dirname}\\images\\${filename}`, 'base64');
    return imageAsBase64;
}

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
            const name = "Sample Image";
            const base64 = loadImage('sample.jpg');
            const image = {
                name: name,
                base64: base64
            }
            request(app)
                .post('/image')
                .send({ image: image })
                .expect(200, done);
        })
    })

    describe('POST /images/bulk', () => {
        it('should be able to upload several images', (done) => {
            const image1 = {
                name: "Blue",
                base64: loadImage('sample2.jpg')
            }
            const image2 = {
                name: "Matterhorn",
                base64: loadImage('sample3.jpg')
            }

            request(app)
                .post('/image/bulk')
                .send({ images: [image1, image2] })
                .expect(200, done);
        })
    })
})
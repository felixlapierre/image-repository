const request = require('supertest');
const expect = require('chai').expect;
let app = require('../src/index');

function loadImage(filename) {
    const fs = require('fs');
    const imageAsBase64 = fs.readFileSync(`${__dirname}\\images\\${filename}`, 'base64');
    return imageAsBase64;
}

describe('app', () => {
    describe('/', () => {
        it('should return status 200', (done) => {
            request(app)
                .get('/')
                .expect(200, done)
        })
    })
    describe('POST /images', () => {
        it('should upload an image', () => {
            const image = loadImage('sample.jpg');
            request(app)
                .post('/image')
                .send({image: image})
                .expect(200)
                .end((err, res) => {
                    expect(res.text).to.equal("Image saved successfully")
                })
        })
    })
})
var express = require('express')
var router = express.Router()
var database = require('./database');

router.get('/:uuid', (req, res) => {
    database.findImageByUuid(req.params.uuid).then((image) => {
        res.status(200).send(image);
    }).catch((err) => {
        res.sendStatus(404);
    })
})

router.post('/', (req, res) => {
    const image = req.body.image;
    database.saveImage(image).then((savedImage) => {
        res.status(200).send({uuid: savedImage.uuid});
    }).catch((err) => {
        res.sendStatus(500);
    });
})

router.post('/bulk', (req, res) => {
    const images = req.body.images;
    const savedImages = images.map((image) => {
        return database.saveImage(image);
    })
    Promise.all(savedImages).then((images) => {
        res.status(200).send({images: images})
    }).catch(() => {
        res.sendStatus(500);
    })
})

module.exports = router
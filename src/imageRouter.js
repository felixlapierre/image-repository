var express = require('express')
var router = express.Router()
var database = require('./database');

router.get('/:uuid', (req, res) => {
    database.findImageByUuid(req.params.uuid).then((image) => {
        if(image.visibility == "private" && image.owner != req.credentials.id)
            res.status(401).send()
        else
            res.status(200).send(image);
    }).catch((err) => {
        res.sendStatus(404);
    })
})

router.post('/', (req, res) => {
    const image = req.body.image;
    image.owner = req.credentials.id;
    database.saveImage(image).then((savedImage) => {
        res.status(200).send({uuid: savedImage.uuid});
    }).catch((err) => {
        res.sendStatus(500);
    });
})

router.post('/bulk', (req, res) => {
    const images = req.body.images;
    const savedImages = images.map((image) => {
        image.owner = req.credentials.id;
        return database.saveImage(image);
    })
    Promise.all(savedImages).then((images) => {
        res.status(200).send({images: images})
    }).catch(() => {
        res.sendStatus(500);
    })
})

router.delete('/:uuid', (req, res) => {
    const uuid = req.params.uuid
    database.findImageByUuid(uuid).then((image) => {
        if(image.owner != req.credentials.id) {
            res.sendStatus(401);
        } else {
            database.deleteImage(uuid).then(() => {
                res.sendStatus(200)
            })
        }
    }).catch((err) => {
        res.sendStatus(404);
    })
})

module.exports = router
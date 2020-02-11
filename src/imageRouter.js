var express = require('express')
var router = express.Router()
var database = require('./database');

router.get('/', (req, res) => {
    res.send("GET image")
})

router.post('/', (req, res) => {
    const image = req.body.image;
    database.saveImage(image).then(() => {
        res.sendStatus(200);
    }).catch((err) => {
        res.sendStatus(500);
    });
})

router.post('/bulk', (req, res) => {
    const images = req.body.images;
    const promises = images.map((image) => {
        return database.saveImage(image);
    })
    Promise.all(promises).then(() => {
        res.sendStatus(200);
    }).catch(() => {
        res.sendStatus(500);
    })
})

module.exports = router
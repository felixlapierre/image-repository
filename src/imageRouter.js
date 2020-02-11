var express = require('express')
var router = express.Router()
var database = require('./database');

router.get('/', (req, res) => {
    res.send("GET image")
})

router.post('/', (req, res) => {
    const image = req.body.image;
    database.saveImage(image);
    res.sendStatus(200);
})

router.post('/bulk', (req, res) => {
    const images = req.body.images;
    images.forEach((image) => {
        database.saveImage(image);
    })
    res.sendStatus(200);
})

module.exports = router
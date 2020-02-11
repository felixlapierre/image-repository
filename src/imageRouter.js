var express = require('express')
var router = express.Router()
var database = require('./database');

router.get('/', (req, res) => {
    res.send("GET image")
})

router.post('/', (req, res) => {
    const image = req.body.image;
    database.saveImage(image);
    res.status(200).send("Image saved successfully");
})

router.post('/bulk', (req, res) => {
    const images = req.body.images;
    images.forEach((image) => {
        database.saveImage(image);
    })
})

module.exports = router
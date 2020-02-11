var express = require('express')
var router = express.Router()
var database = require('./database');

router.get('/', (req, res) => {
    res.send("GET image")
})

router.post('/', (req, res) => {
    const imgData = req.body.base64image;
    database.saveImage(imgData);
    res.status(200).send("Image saved successfully");
})


module.exports = router
function loadImage(filename) {
    const fs = require('fs');
    const imageAsBase64 = fs.readFileSync(`${__dirname}\\images\\${filename}`, 'base64');
    return imageAsBase64;
}

const sample = loadImage('sample.jpg');
const blue = loadImage('blue.jpg');
const matterhorn = loadImage('matterhorn.jpg');

module.exports.sample = {
    name: "Sample Image",
    base64: sample
}

module.exports.blue = {
    name: "Blue",
    base64: blue
}

module.exports.matterhorn = {
    name: "Matterhorn",
    base64: matterhorn
}
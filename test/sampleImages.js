function loadImage(filename) {
    const fs = require('fs');
    const imageAsBase64 = fs.readFileSync(`${__dirname}\\images\\${filename}`, 'base64');
    return imageAsBase64;
}

const sample = loadImage('sample.jpg');
const blue = loadImage('blue.jpg');
const matterhorn = loadImage('matterhorn.jpg');
const snom = loadImage('snom.png');

module.exports.sample = {
    name: "Sample Image",
    base64: sample,
    visibility: "public"
}

module.exports.blue = {
    name: "Blue",
    base64: blue,
    visibility: "public"
}

module.exports.matterhorn = {
    name: "Matterhorn",
    base64: matterhorn,
    visibility: "public"
}

module.exports.snom = {
    name: "Snom",
    base64: snom,
    visibility: "public"
}
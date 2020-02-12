function loadImage(filename) {
    const fs = require('fs');
    const path = require('path');
    const imageAsBase64 = fs.readFileSync(path.resolve(`${__dirname}\\..\\images\\${filename}`), 'base64');
    return imageAsBase64;
}

const sample = loadImage('sample.jpg');
const blue = loadImage('blue.jpg');
const matterhorn = loadImage('matterhorn.jpg');
const snom = loadImage('snom.png');

export class SampleImages {
    static Sample = {
        name: "Sample Image",
        base64: sample,
        visibility: "public"
    }
    static Blue = {
        name: "Blue",
        base64: blue,
        visibility: "public"
    }
    static Matterhorn = {
        name: "Matterhorn",
        base64: matterhorn,
        visibility: "public"
    }
    static Snom = {
        name: "Snom",
        base64: snom,
        visibility: "public"
    }
}
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
const railroad = loadImage('railroad.jpg')

export class SampleImages {
    static Sample = {
        name: "Sample Image",
        base64: sample,
        visibility: "public",
        description: "green cute smile"
    }
    static Blue = {
        name: "Blue",
        base64: blue,
        visibility: "public",
        description: "sky blue cute"
    }
    static Matterhorn = {
        name: "Matterhorn",
        base64: matterhorn,
        visibility: "public",
        description: "mountain blue sky snow white sunrise"
    }
    static Snom = {
        name: "Snom",
        base64: snom,
        visibility: "public",
        description: "white blue pokemon"
    }
    static Railroad = {
        name: "Railroad",
        base64: railroad,
        visibility: "public",
        description: "railroad sky sunset green red"
    }
}
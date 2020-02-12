var mongoose = require('mongoose');
var connectionString = 'mongodb://localhost:27017/imagerepo';
mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error: '))
import uuid = require('uuid');

function onError(error) {
    if (error)
        console.log("An error occurred: " + error);
}

var Schema = mongoose.Schema;

var ImageSchema = new Schema({
    name: String,
    base64: String,
    uuid: String,
    visibility: String,
    owner: String
})

var ImageModel = mongoose.model('Images', ImageSchema);

export function saveImage(image) {
    return new Promise((resolve, reject) => {
        image.uuid = uuid.v4();
        var newImage = new ImageModel(image)

        newImage.save({}, (err, savedImage) => {
            if (err) reject(err)
            else resolve(savedImage)
        });
    })
}

export function clearImages() {
    ImageModel.deleteMany({}, onError);
}

export function findImageByUuid(uuid) {
    return new Promise((resolve, reject) => {
        ImageModel.find({ uuid: uuid }, (err, images) => {
            if(err) reject(err)
            else if (images.length == 0) reject();
            if (images.length > 1) 
                console.log("More than 1 image found with uuid " + uuid);
            resolve(images[0]);
        })
    })
}

export function deleteImage(uuid) {
    return new Promise((resolve, reject) => {
        ImageModel.deleteOne({uuid: uuid}, (err) => {
            if(err) reject(err)
            else resolve();
        })
    })
}
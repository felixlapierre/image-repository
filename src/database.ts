import mongoose = require('mongoose');
const Schema = mongoose.Schema;
import uuid = require('uuid');

const ImageSchema = new Schema({
    name: String,
    base64: String,
    uuid: String,
    visibility: String,
    owner: String
})

var ImageModel = mongoose.model('Images', ImageSchema);

export class MongoDBImageDatabase {
    constructor(connectionString) {
        mongoose.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true});
        var db = mongoose.connection;
        db.on('error', console.error.bind(console, 'MongoDB connection error: '))
    }

    saveImage(image) {
        return new Promise((resolve, reject) => {
            image.uuid = uuid.v4();
            var newImage = new ImageModel(image)
    
            newImage.save({}, (err, savedImage) => {
                if (err) reject(err)
                else resolve(savedImage)
            });
        })
    }

    clearImages() {
        ImageModel.deleteMany({}, (err) => {
            console.log(err);
        });
    }

    findImageByUuid(uuid) {
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

    deleteImage(uuid) {
        return new Promise((resolve, reject) => {
            ImageModel.deleteOne({uuid: uuid}, (err) => {
                if(err) reject(err)
                else resolve();
            })
        })
    }
}
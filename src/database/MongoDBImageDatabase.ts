import mongoose = require('mongoose');
import uuid = require('uuid');

import {ImageModel, Image} from './ImageModel';
import { ImageDatabase } from './ImageDatabase';

export class MongoDBImageDatabase implements ImageDatabase {
    constructor(connectionString: string) {
        mongoose.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true});
        var db = mongoose.connection;
        db.on('error', console.error.bind(console, 'MongoDB connection error: '))
    }

    saveImage(image: Image) {
        return new Promise<Image>((resolve, reject) => {
            image.uuid = uuid.v4();
            var newImage = new ImageModel(image)
    
            newImage.save({}, (err, savedImage) => {
                if (err) reject(err)
                else resolve(savedImage)
            });
        })
    }

    clearImages() {
        return new Promise<void>((resolve, reject) => {
            ImageModel.deleteMany({}, (err) => {
                if(err) reject(err);
                else resolve();
            });
        })
    }

    findImageByUuid(uuid: String) {
        return new Promise<Image>((resolve, reject) => {
            ImageModel.find({ uuid: uuid }, (err, images) => {
                if(err) reject(err)
                else if (images.length == 0) reject();
                if (images.length > 1) 
                    console.log("More than 1 image found with uuid " + uuid);
                resolve(images[0]);
            })
        })
    }

    deleteImage(uuid: String) {
        return new Promise<void>((resolve, reject) => {
            ImageModel.deleteOne({uuid: uuid}, (err) => {
                if(err) reject(err)
                else resolve();
            })
        })
    }
}
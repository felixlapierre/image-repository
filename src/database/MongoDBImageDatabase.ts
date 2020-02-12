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

    findImages(image: Partial<Image>) {
        return new Promise<Image[]>((resolve, reject) => {
            ImageModel.find(image, (err, images) => {
                if(err) reject(err)
                else resolve(images)
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

    searchImage(query: String) {
        return new Promise<Image[]>((resolve, reject) => {
            ImageModel.find({$text: {$search: query}}, (err, images) => {
                if(err) reject(err)
                else resolve(images);
            })
        });
    }
}
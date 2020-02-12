import express, { Router } from 'express';
import { ImageDatabase } from '../database/ImageDatabase';

export class ImageRouter {
    private router: Router
    constructor(private database: ImageDatabase) {
        this.router = express.Router();
        this.router.get('/:uuid', this.get.bind(this));
        this.router.post('/', this.post.bind(this));
        this.router.post('/bulk', this.postBulk.bind(this));
        this.router.delete('/:uuid', this.delete.bind(this));
    }

    addToApp(app: any) {
        app.use('/image', this.router)
    }

    get(req, res) {
        this.database.findImageByUuid(req.params.uuid).then((image: any) => {
            if (image.visibility == "private" && image.owner != req.credentials.id)
                res.status(401).send()
            else
                res.status(200).send(image);
        }).catch((err) => {
            res.sendStatus(404);
        })
    }

    post(req, res) {
        const image = req.body.image;
        image.owner = req.credentials.id;
        this.database.saveImage(image).then((savedImage: any) => {
            res.status(200).send({ uuid: savedImage.uuid });
        }).catch((err) => {
            res.sendStatus(500);
        });
    }

    postBulk(req, res) {
        const images = req.body.images;
        const savedImages = images.map((image) => {
            image.owner = req.credentials.id;
            return this.database.saveImage(image);
        })
        Promise.all(savedImages).then((images) => {
            res.status(200).send({ images: images })
        }).catch(() => {
            res.sendStatus(500);
        })
    }

    delete(req, res) {
        const uuid = req.params.uuid
        this.database.findImageByUuid(uuid).then((image: any) => {
            if (image.owner != req.credentials.id) {
                res.sendStatus(401);
            } else {
                this.database.deleteImage(uuid).then(() => {
                    res.sendStatus(200)
                })
            }
        }).catch((err) => {
            res.sendStatus(404);
        })
    }

    deleteBulk(req, res) {
        
    }
}
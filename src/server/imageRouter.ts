import express, { Router } from 'express';
import { ImageDatabase } from '../database/ImageDatabase';
import { Image } from '../database/ImageModel';

export class ImageRouter {
    private router: Router
    constructor(private database: ImageDatabase) {
        this.router = express.Router();
        this.router.get('/all', this.getAll.bind(this));
        this.router.get('/:uuid', this.get.bind(this));
        this.router.post('/', this.post.bind(this));
        this.router.post('/bulk', this.postBulk.bind(this));
        this.router.delete('/:uuid', this.delete.bind(this));
    }

    addToApp(app: any) {
        app.use('/image', this.router)
    }

    removeForbiddenImages(images: Image[], user: string) {
        const returned = [];
        images.forEach((image) => {
            if(image.visibility != "private" || image.owner == user)
                returned.push(image);
        })
        return returned;
    }

    get(req, res) {
        this.database.findImages({uuid: req.params.uuid}).then((images: Image[]) => {
            if(images.length == 0) {
                return res.status(404).send();
            }
            const visibleImages = this.removeForbiddenImages(images, req.credentials.id)
            if(visibleImages.length == 0) {
                return res.status(401).send();
            } else {
                res.status(200).send(visibleImages[0]);
            }
        }).catch((err) => {
            res.sendStatus(500);
        })
    }
    
    getAll(req, res) {
        this.database.findImages({}).then((images: Image[]) => {
            const visibleImages = this.removeForbiddenImages(images, req.credentials.id);
            const imageUuids = visibleImages.map((image) => {return image.uuid});
            res.status(200).send({images: imageUuids});
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
        this.database.findImages({uuid: uuid}).then((images: Image[]) => {
            if(images.length === 0)
                return res.sendStatus(404);
            const visibleImages = this.removeForbiddenImages(images, req.credentials.id);
            if(visibleImages.length === 0)
                return res.sendStatus(401);
            
            this.database.deleteImage(visibleImages[0].uuid).then(() => {
                res.sendStatus(200);
            })
        }).catch((err) => {
            res.sendStatus(404);
        })
    }

    deleteBulk(req, res) {
        
    }
}
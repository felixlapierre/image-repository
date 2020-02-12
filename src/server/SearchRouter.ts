import { ImageDatabase } from "../database/ImageDatabase";
import express, { Router } from "express";

export class SearchRouter {
    private router: Router
    constructor(private database: ImageDatabase) {
        this.router = express.Router();
        this.router.get('/',this.get.bind(this));
    }

    addToApp(app: any) {
        app.use('/search', this.router)
    }

    get(req, res) {
        this.database.searchImage(req.params).then((images) => {
            const returned = images.map((image) => {
                return image.uuid;
            })

            res.status(200).send({images: returned});
        })
    }
}
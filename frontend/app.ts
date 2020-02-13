import express = require('express')
import path = require('path');
import { Request } from './request';
import multer = require('multer')
const upload = multer();
const app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

function getImages(images, user) {
    return new Promise((resolve, reject) => {
        if (images.length == 0) {
            resolve([]);
        } else {
            Promise.all(images.map((uuid) => {
                return Request({ path: `/image/${uuid}`, method: 'GET' }, user).catch((err) => {
                    return Promise.resolve({data: undefined});
                })
            })).then((responses) => {
                const images = responses.map((response: any) => {
                    return response.data;
                })

                resolve(images);
            })
        }
    })
}

app.get("/", (req, res) => {
    const user = 'mike';
    Request({ path: '/image/all', method: 'get' }, user).then((response) => {
        getImages(response.data.images, user).then((images) => {
            res.render("content", { images: images, user: 'mike' })
        });
    });
})

app.get("/search", (req, res) => {
    Request({ path: `/search?query=${req.query.search}`, method: 'get' }, req.query.user).then((response) => {
        getImages(response.data.images, req.query.user).then((images) => {
            res.render("content", { images: images, user: req.query.user })
        })
    })
})

app.post("/image", upload.single('image'), (req: any, res) => {
    const encoded = req.file.buffer.toString('base64');

    const image = {
        name: req.body.title,
        visibility: req.body.visibility,
        description: req.body.description,
        base64: encoded
    }

    Request({path: `/image`, method: 'post', body: {image: image}}, req.body.user).then(() => {
        Request({ path: '/image/all', method: 'get' }, req.body.user).then((response) => {
            getImages(response.data.images, req.body.user).then((images) => {
                res.render("content", { images: images, user: req.body.user })
            });
        });
    })
})

const port = 4000;
app.listen(port, () => console.log(`Starting frontend server on port ${port}`))
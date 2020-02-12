import express = require('express')
import path = require('path');
import {Request, RequestOptions} from './request';

const app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
    Request({path: '/search?query=blue', method: 'get'}, 'mike').then((response) => {
        console.log(response.data.images.length);
        if(response.data.images.length == 0) {
            res.render("homepage", {images: ["No images to be displayed"]});
            return;
        }
        Promise.all(response.data.images.map((uuid) => {
            return Request({path: `/image/${uuid}`, method: 'GET'}, 'mike')
        })).then((responses) => {
            const images = responses.map((response: any) => {
                return response.data.name;
            })

            res.render("homepage", {images: images});
        })
    });
})

const port = 4000;
app.listen(port, () => console.log(`Starting frontend server on port ${port}`))
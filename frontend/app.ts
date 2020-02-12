import express = require('express')
import path = require('path');
import { Request, RequestOptions } from './request';

const app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

function renderSearchResults(images, res) {
    if (images.length == 0) {
        res.render("header", {});
    } else {
        Promise.all(images.map((uuid) => {
            return Request({ path: `/image/${uuid}`, method: 'GET' }, 'mike')
        })).then((responses) => {
            const images = responses.map((response: any) => {
                return response.data;
            })

            res.render("content", { images: images });
        })
    }
}

app.get("/", (req, res) => {
    Request({ path: '/image/all', method: 'get' }, 'mike').then((response) => {
        renderSearchResults(response.data.images, res);
    });
})

app.get("/search", (req, res) => {
    Request({ path: `/search?query=${req.query.search}`, method: 'get' }, 'mike').then((response) => {
        renderSearchResults(response.data.images, res);
    })
})

const port = 4000;
app.listen(port, () => console.log(`Starting frontend server on port ${port}`))
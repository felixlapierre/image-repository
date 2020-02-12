import express = require('express')
import path = require('path');

const app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
    res.render("homepage");
})

const port = 4000;
app.listen(port, () => console.log(`Starting frontend server on port ${port}`))
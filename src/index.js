const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

const imageRouter = require('./imageRouter');

app.use('/image', imageRouter);

app.get('/', (req, res) => res.status(200).send('Hello World!'))

app.listen(port, () => console.log(`Now listening on port ${port}.`))

module.exports = app;
import express from 'express';
const app = express();
const port = 3000
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({extended: false, limit: '50mb'}))
app.use(bodyParser.json({limit: '50mb'}))

const auth = require('./auth');
app.use(auth);

import {MongoDBImageDatabase} from './database/MongoDBImageDatabase';
const database = new MongoDBImageDatabase('mongodb://localhost:27017/imagerepo');
import {ImageRouter} from './imageRouter';
const imageRouter = new ImageRouter(database);
imageRouter.addToApp(app);

app.get('/', (req, res) => res.status(200).send('Hello World!'))

app.listen(port, () => console.log(`Now listening on port ${port}.`))

module.exports = app;
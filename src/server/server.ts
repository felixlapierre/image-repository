import express, { Express } from 'express';
import bodyParser = require('body-parser')
import {ImageRouter} from './ImageRouter';
import { ImageDatabase } from '../database/ImageDatabase';
import { SearchRouter } from './SearchRouter';

export class Server {
    private app: Express
    constructor(database: ImageDatabase) {
        this.app = express();
        const port = 3000
        
        this.app.use(bodyParser.urlencoded({extended: false, limit: '50mb'}))
        this.app.use(bodyParser.json({limit: '50mb'}))
        
        const auth = require('./auth');
        this.app.use(auth);
        
        const imageRouter = new ImageRouter(database);
        imageRouter.addToApp(this.app);

        const searchRouter = new SearchRouter(database);
        searchRouter.addToApp(this.app);
        
        this.app.get('/', (req, res) => {
            res.status(200).send('Hello World!');
        })

        this.app.get('*', (req, res) => {
            console.log("404 on " + req.url);
            res.sendStatus(404);
        })
        
        this.app.listen(port, () => console.log(`Now listening on port ${port}.`))
    }

    getExpressApp() {
        return this.app;
    }
}
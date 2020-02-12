import { MongoDBImageDatabase } from "./database/MongoDBImageDatabase";
import { Server } from "./server/Server";

const database = new MongoDBImageDatabase('mongodb://localhost:27017/imagerepotest');
new Server(database);
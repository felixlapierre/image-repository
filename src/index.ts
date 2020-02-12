import { MongoDBImageDatabase } from "./database/MongoDBImageDatabase";
import { Server } from "./server/server";

const database = new MongoDBImageDatabase('mongodb://localhost:27017/imagerepo');
new Server(database);
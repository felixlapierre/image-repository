var mongoose = require('mongoose');
var connectionString = 'mongodb://localhost:27017/imagerepo';
mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error: '))
const uuid = require('uuid');

function onError(error) {
    if (error)
        console.log("An error occurred: " + error);
}

var Schema = mongoose.Schema;

var ImageSchema = new Schema({
    name: String,
    base64: String,
    uuid: String
})

var ImageModel = mongoose.model('Images', ImageSchema);

module.exports.saveImage = function (image) {
    return new Promise((resolve, reject) => {
        image.uuid = uuid.v4();
        var newImage = new ImageModel(image)

        newImage.save({}, (err, savedImage) => {
            if (err) reject(err)
            else resolve(savedImage)
        });
    })
}

module.exports.clearImages = function () {
    ImageModel.deleteMany({}, onError);
}

module.exports.findImageByUuid = function (uuid) {
    return new Promise((resolve, reject) => {
        ImageModel.find({ uuid: uuid }, (err, image) => {
            if(err) reject(err)
            else resolve(image);
        })
    })
}
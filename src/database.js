var mongoose = require('mongoose');
var connectionString = 'mongodb://localhost:27017/imagerepo';
mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error: '))

function onError(error) {
    if (error)
        console.log("An error occurred: " + error);
}

var Schema = mongoose.Schema;

var ImageSchema = new Schema({
    name: String,
    base64: String
})

var ImageModel = mongoose.model('Images', ImageSchema);

module.exports.saveImage = function (image) {
    return new Promise((resolve, reject) => {
        var newImage = new ImageModel(image)
        console.log("Saving image " + image.name);
    
        newImage.save({}, (err, product) => {
            if(err) reject(err)
            else resolve(product)
        });
    })
}

module.exports.clearImages = function () {
    ImageModel.deleteMany({}, onError);
}
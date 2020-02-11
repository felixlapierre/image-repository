var mongoose = require('mongoose');
var connectionString = 'mongodb://localhost:27017/imagerepo';
mongoose.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error: '))

function onError(error) {
    if(error)
        console.log("An error occurred: " + error);
}

var Schema = mongoose.Schema;

var ImageSchema = new Schema({
    base64: String
})

var ImageModel = mongoose.model('Images', ImageSchema);

module.exports.saveImage = function(base64) {
    var newImage = new ImageModel({
        base64: base64
    })

    newImage.save(onError);
}
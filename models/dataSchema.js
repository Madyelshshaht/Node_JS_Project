const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// Schema for the data
const dataSchema = new Schema({
    username: { type: String, required: true},
})


// Create a model based on the schema
const MyData = mongoose.model('MyDataa', dataSchema);

// Export the model
module.exports = MyData;
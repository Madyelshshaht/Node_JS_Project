const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const userschema = new Schema({
    firstName: { type: String, required: true },
    lastName: {type: String, required: true},
    email: { type: String, required: true },
    phone: {type: Number, required: true},
    age: {type: Number, required: true},
    country: { type: String, required: false },
    gender: { type: String, required: true }
});


const UserData = mongoose.model("UserDataa", userschema);

module.exports = UserData;
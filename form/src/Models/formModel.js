const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true 
    },
    lastname: {
        type: String,
        required: true 
    },
    email: { 
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    dob: {
        type: Date,
        required: true,
        default: Date.now
    },
    gender: {
        type: String,
        required: true,
        enum: ['male', 'female', 'other']
    },
    address: {
        type: String 
    }
})

const FormModel = mongoose.model('FormModel', formSchema);
module.exports = FormModel;
const Joi = require('joi');
const mongoose = require('mongoose');

const User = mongoose.model('User', new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        required: true,
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        required: true,
        maxlength: 1024
    },

}));

function validateUser(user) {
    const schema = Joi.object().keys({

        name: Joi.string().min(3).required(),
        email: Joi.string().required().email(),
        password: Joi.string().max(1024).required()
    });

    return schema.validate(user);
}

exports.User = User;
exports.validate = validateUser;
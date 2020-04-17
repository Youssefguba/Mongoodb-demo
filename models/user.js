const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');


const userSchema = new mongoose.Schema({
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
    isAdmin: Boolean,
    roles: [] //roles for many roles of user [Anonymous, signed in ]
});

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({_id: this._id, isAdmin: this.isAdmin}, config.get('jwtPrivateKey'));
    return token;
};

const User = mongoose.model('User', userSchema);



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
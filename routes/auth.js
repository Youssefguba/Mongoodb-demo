const {User} = require('../models/user');
const bcrypt = require('bcrypt');
const express = require('express');
const Joi = require('@hapi/joi');
const router = express.Router();

router.post('/', async (req, res) => {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //Check if User.email is already registered..
    let user = await User.findOne({email: req.body.email});
    // if (user) return res.status(400).send('User Already Registered');

    if (!user)  return res.status(400).send('Invalid email or password.');

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).send('Invalid email or password.');

    const token = user.generateAuthToken();
    res.send(token);
});


function validateUser(req) {
    const schema = Joi.object().keys({
        email: Joi.string().required().email(),
        password: Joi.string().max(1024).required()
    });

    return schema.validate(req);
}
module.exports = router;
// exports.validate = validateUser;
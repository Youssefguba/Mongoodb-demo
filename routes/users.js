const {User, validate} = require('../models/user');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const express = require('express');
const _ = require('lodash');
const router = express.Router();

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //Check if User.email is already registered..
    let user = await User.findOne({email: req.body.email});
    if (user) return res.status(400).send('User Already Registered');

    if (!user) {
        let user = new User(_.pick(req.body, ['name','email','password']));
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt)

        user = await user.save();
        res.send(_.pick(user, ['_id','name', 'email', 'password']));
    }
});

module.exports = router;
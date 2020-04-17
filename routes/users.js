const auth = require('../middleware/auth');
const {User, validate} = require('../models/user');
const bcrypt = require('bcrypt');
const express = require('express');
const _ = require('lodash');
const router = express.Router();


// For getting User as a admin without put id in route => Security reasons!!
router.get('/me', auth, async (req, res)=> {
    const user = await User.findById(req.body._id).select('-password');
    res.send(user);

});

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //Check if User.email is already registered..
    let user = await User.findOne({email: req.body.email});
    if (user) return res.status(400).send('User Already Registered');

        user = new User(_.pick(req.body, ['name','email','password']));
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        await user.save();

        const token = user.generateAuthToken();

        res.header('x-auth-token', token).send(_.pick(user, ['_id','name', 'email', 'password']));
});

module.exports = router;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const login_router = require('express').Router;
const User = require('../models/user');

login_router.post('/', async (req, res) => {
    const body = req.body;

    const user = await User.findOne({ username: body.username });
    const password_correct = user === null
        ? false
        : await bcrypt.compare(body.password, user.password_hash);

    if (!(user && password_correct)){
        return res.status(401).json({
            error : "invalid username or password"
        });
    }
});
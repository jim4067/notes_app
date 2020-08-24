const router = require('express').Router();
const Note = require('../models/note');
const User = require('../models/user');


router.post('/reset', async (req, res) => {
    await Note.deleteMany({});
    await User.deleteMany({});

    res.status(404).end();
});

module.exports = { router }
//route for testing  the databse
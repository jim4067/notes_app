const router = require('express').Router();
const Note = require('../models/note');
const User = require('../models/user');

router.get('/', async (req,res) => {
    res.send("the route works just fine");
});

router.post('/reset', async (req, res) => {
    await Note.deleteMany({});
    await User.deleteMany({});

    res.status(204).end();
});

module.exports =  router; 
//route for testing  the databse

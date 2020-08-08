const jwt = require('jsonwebtoken');
const note_router = require('express').Router();
const Note = require('../models/note');
const User = require('../models/user');

note_router.get('/', async (req, res) => {
    const notes = await Note
        .find({})
        .populate('user', {username: 1, name: 1});

    res.json(notes);
});

note_router.get('/:id', async (req, res) => {
    const id = req.params.id;

    const note = await Note.findById(id);
    if (note) {
        res.json(note);
    } else {
        res.status(404).end();
    }
});

const get_token_from = (req) => {
    const authorization = req.get('authorization');
    if(authorization && authorization.toLowerCase().startsWith('bearer ')){
        return authorization.substring(7);
    }
    return null;
}

note_router.post('/', async (req, res) => {
    const body = req.body;

    const token = get_token_from(req);
    const decoded_token = jwt.verify(token, process.env.SECRET);
    if(!token || decoded_token.id){
        return res.status(401).json({erro : "token missing or invalid"})
    }

    const user = await User.findById(body.user_id);

    const note = new Note({
        content: body.content,
        date: body.date,
        important: body.important === "undefined" ? false : body.important,
        user: user._id
    });

    const saved_note = await note.save();
    user.notes = user.notes.concat(saved_note._id);
    await user.save();

    res.json(saved_note);
});

note_router.put('/:id', async (req, res) => {
    const body = req.body;
    const id = req.params.id;

    const note = {
        content: body.content,
        important: body.important,
    }

    const updated_note = await Note.findByIdAndUpdate(id, note, { new: true })
    res.json(updated_note);
});

note_router.delete('/:id', async (req, res) => {
    const id = req.params.id;

    await Note.findByIdAndDelete(id);
    res.json(204).end();
});

module.exports = note_router;
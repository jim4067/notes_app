const note_router = require('express').Router();
const Note = require('../models/note');

note_router.get('/', async (req, res) => {
    const notes = await Note.find({});
    res.json(notes);
});

note_router.get('/:id', async (req, res, next) => {
    const id = req.params.id;

    try {
        const note = await Note.findById(id);
        if (note) {
            res.json(note);
        } else {
            res.status(404).end();
        }

    } catch (exception) {
        next(exception);
    }
});

note_router.post('/', async (req, res, next) => {
    const body = req.body;
    const note = new Note({
        content: body.content,
        date: body.date,
        important: body.important
    });

    try {
        const saved_note = await note.save();
        res.json(saved_note);

    } catch (exception) {
        next(exception);
    }
});

note_router.put('/:id', (req, res, next) => {
    const body = req.body;
    const id = req.params.id;

    const note = {
        content: body.content,
        important: body.important,
    }

    try {
        const updated_note = await Note.findByIdAndUpdate(id, note, { new: true })
        res.json(updated_note)
    } catch (exception) {
        next(exception);
    }
});

note_router.delete('/:id', async (req, res, next) => {
    const id = req.params.id;

    try {
        await Note.findByIdAndDelete(id);
        res.json(204).end()
    } catch (exception) {
        next(exception);
    }
});

module.exports = note_router;
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Note = require('../models/note');

const api = supertest(app);

const initial_notes = [
    {
        content : "HTML is easy",
        date: new Date(),
        important: false
    },
    {
        content: "Browser can execute only javascript",
        date: new Date(),
        important: true
    }
];

beforeEach( async () => {
    await Note.deleteMany({});

    let note_object = new Note(initial_notes[0]);
    await note_object.save();

    note_object = new Note(initial_notes[1]);
    await note_object.save();
});

test("notes are returned as JSON", async () => {
    await api
        .get('/api/notes')
        .expect(200)
        .expect('Content-Type', /application\/json/)
});

test("all notes are returned", async () => {
    const response = await api.get('/api/notes');

    expect(response.body).toHaveLength(initial_notes.length);
});

test("a specific note is within the returned notes", async () => {
    const response = await api.get('/api/notes');

    const contents = response.body.map(res => res.content);

    expect(contents).toContain("Browser can execute only javascript");
})

afterAll(() => {
    mongoose.connection.close();
});
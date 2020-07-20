const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const helper = require('./test_helper');
const Note = require('../models/note');

const api = supertest(app);

beforeEach( async () => {
    await Note.deleteMany({});

    let note_object = new Note(helper.initial_notes[0]);
    await note_object.save();

    note_object = new Note(helper.initial_notes[1]);
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

    expect(response.body).toHaveLength(helper.initial_notes.length);
});

test("a specific note is within the returned notes", async () => {
    const response = await api.get('/api/notes');

    const contents = response.body.map(res => res.content);

    expect(contents).toContain("Browser can execute only javascript");
})

//testing whether a note can be aded after refactoring
test("a new note can be added ", async( ) => {
    const new_note = {
        content: "async/await simplifies making async calls",
        date: new Date(),
        important: false
    };

    await api
             .post('/api/notes')
             .send(new_note)
             .expect(200)
             .expect('Content-Type', /application\/json/);

    const notes_at_end = await helper.notes_in_db();
    expect(notes_at_end).toHaveLength(helper.initial_notes.length + 1);

    const contents = notes_at_end.body.map( res => res.content);
    expect(contents).toContain("async/await simplifies making async calls");
});

//making sure that a note without content cannot be added
test("a note without content is added", async() => {
    const no_content = {
        important: true
    };

    await api.post('/api/notes')
             .send(no_content)
             .expect(404)
             .expect('Content-Type', /application\/json/);

    const notes_at_end = await api.get('/api/note');
    expect(notes_at_end).toHaveLength(helper.initial_notes.length);
});

afterAll(() => {
    mongoose.connection.close();
});
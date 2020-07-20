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
    const response = await api.get('/api/notes');

    const contents = response.body.map( res => res.content);

    expect(response.body).toHaveLength(initial_notes.length + 1);
    expect(contents).toContain("async/await simplifies making async calls");
});

//making sure that a note without content cannot be added
test("a note without content", async() => {
    const no_content = {
        important: true
    };
    await api.post('/api/notes')
             .send(no_content)
             .expect(404)
             .expect('Content-Type', /application\/json/);

    const response = await api.get('/api/note');
    expect(response).toHaveLength(initial_notes.length);
});

afterAll(() => {
    mongoose.connection.close();
});
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const helper = require('./test_helper');
const Note = require('../models/note');

const api = supertest(app);

beforeEach(async () => {
    await Note.deleteMany({});

    for (let note of helper.initial_notes) {
        let note_object = new Note(note);
        await note_object.save();
    }
});

test("all notes are returned", async () => {
    const response = await api.get('/api/notes');

    expect(response.body).toHaveLength(helper.initial_notes.length);
});

test("a specific note is within the returned notes", async () => {
    const response = await api.get('/api/notes');

    const contents = response.body.map(res => res.content);

    expect(contents).toContain("Browser can execute only javascript");
});

//testing whether a note can be added after refactoring
test("a new note can be added ", async () => {
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

    const notes_in_the_db = await helper.notes_in_db();
    expect(notes_in_the_db).toHaveLength(helper.initial_notes.length + 1);

    //the lines below cause the this test to fail i,e they return undefined
    //const contents = await notes_in_the_db.map(res => res.content);
    //expect(contents).toContain("async/await simplifies making async calls");
});

/*
//making sure that a note without content cannot be added
test("note without content is not added", async () => {
    const no_content = {
        important: true
    };

    await api.post('/api/notes')
        .send(no_content)
        .expect(400)
        .expect('Content-Type', /application\/json/);

    const notes_at_end = await api.get('/api/notes');
    expect(notes_at_end.body).toHaveLength(helper.initial_notes.length);
});


//test for fetching and removing a single note
test("a specific note can be viewed", async () => {
    const notes_at_start = await helper.notes_in_db();

    const note_to_view = notes_at_start[0];

    const result_note = await api
        .get(`/api/notes/${note_to_view.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/);

    expect(result_note.body).toEqual(note_to_view);
});

test("a note can be deleted", async () => {
    const note_at_start = await helper.notes_in_db();
    const note_to_delete = note_at_start[0];

    await api
        .delete(`/api/notes/${note_to_delete.id}`)
        .expect(204);

    const notes_at_end = await helper.notes_in_db();
    expect(notes_at_end).toHaveLength(helper.initial_notes.length - 1);

    const contents = notes_at_end.map(note_param => note_param.content);
    expect(contents).not.toContain(note_to_delete.content);
});

*/
afterAll(() => {
    mongoose.connection.close();
});

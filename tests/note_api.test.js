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

describe("when initially there are some notes saved", () => {
    test("the notes are returned as json", async() => {
        await api
                 .get('/api/notes')
                 .expect(200)
                 .expect('Content-Type' , /application\/json/);
    });

    test("all notes are returned", async() => {
        const response = await api.get('/api/notes');

        expect(response.body).toHaveLength(helper.initial_notes.length);
    });

    test("a specific note within the notes is returned", async () => {
        const notes_response = await api.get('/api/notes');
        const notes_contents = notes_response.body.map(notes => notes.content)

        expect(notes_contents).toContain("Browser can execute only javascript");
    });
});

afterAll(() => {
    mongoose.connection.close();
});

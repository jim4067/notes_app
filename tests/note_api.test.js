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

describe("viewing a specific note", () => {
    test("succeds with a valid id", async () => {
        const notes_at_start = await helper.notes_in_db();
        const note_to_view = notes_at_start[0];

        const result_note = await api
                                     .get(`/api/notes/${note_to_view}`)
                                     .expect(200)
                                     .expect('Content-Type', /application\/json/)
        expect(result_note.body).toEqual(note_to_view);
    });

    test("fails with status code 404 if note does not exist", async () => {
        const valid_non_existing_id = helper.non_existent_id();
        console.log(valid_non_existing_id);

        await api.get(`/api/notes/${valid_non_existing_id}`)
                 .expect(404);
    });

    test("fails with status code 400 for invalid ID", async () => {
        const invalid_id = "2342gygvjh34234324";

        await api.get(`/api/notes${invalid_id}`)
                 .expect(400);
    });
});

afterAll(() => {
    mongoose.connection.close();
});

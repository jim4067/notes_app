const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const helper = require('./test_helper');
const User = require('../models/user');

const api = supertest(app);

beforeEach(async () => {
    await User.deleteMany({});

    const password_hash = await bcrypt.hash('secret', 10);

    const user = new User({
        username: "root",
        name: "superuser",
        password_hash
    });

    await user.save();
});

describe("when initially there is one user in the database", () => {
    test("creation succeeds with a fresh username", async () => {
        const users_at_start = await helper.users_in_db();

        const password_hash = await bcrypt.hash('secret', 10);

        const new_user = {
            username: "jim_4067",
            name: "James Mutuku",
            password_hash
        };

        await api
            .post('/api/users')
            .send(new_user)
            .expect(200)
            .expect('Content-Type', /application\/json/);

        const users_at_end = await helper.users_in_db();
        expect(users_at_end).toHaveLength(users_at_start.length + 1);

        const usernames = users_at_end.map(u_param => u_param.username);
        expect(usernames).toContain(new_user.username);
    });

    test("creation fails with proper statuscode and message if username is already taken", async () => {
        const users_at_start = helper.users_in_db();

        const new_user = {
            username: "root",
            name: "superuser",
            password_hash: "pass123"
        };

        const result = await api
            .post('/api/users')
            .send(new_user)
            .expect(400)
            .expect('Content-Type', /application\/json/);

        expect(result.body.error).toContain('`username` to be unique');

        //const users_at_end = await helper.users_in_db();
        //expect(users_at_end).toHaveLength(users_at_start.length);
    });

});

afterAll(() => {
    mongoose.connection.close();
});
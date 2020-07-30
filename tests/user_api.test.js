const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const helper = require('./test_helper');
const User = require('../models/user');

const api = supertest(app);

describe("when initially there is one user in the database", () => {
    beforeEach(async () => {
        await User.deleteMany({});

        const password_hash = await bcrypt.hash('secret', 10);
        const user = new User({
            username: "root",
            password_hash
        });

        await user.save();
    });

    test("creation succeds with a fresh username", async () => {
        const users_at_start = await helper.users_in_db();

        const new_user = new User({
            username : "jim_4067",
            name : "James Mutuku",
            password : "pass123"
        });

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
});

afterAll(() => {
    mongoose.connection.close();
});
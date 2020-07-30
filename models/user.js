const mongoose = require('mongoose');

const user_schema = new mongoose.Schema({
    username: String,
    name: String,
    password_hash: String,
    notes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Note'
        }
    ],
});

user_schema.set('toJSON', {
    transform : (document, returned_object) => {
        returned_object.id = returned_object._id.toString();
        delete returned_object._id;
        delete returned_object.__v;
        //the password_hash should not be returned
        delete returned_object.password_hash;
    }
});

const User = mongoose.model(user_schema);

module.exports = User;
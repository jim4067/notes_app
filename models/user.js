const mongoose = require('mongoose');
const uniuque_validator = require('mongoose-unique-validator');

mongoose.set('useCreateIndex', true);

const user_schema = new mongoose.Schema({
    username: {
        maxlength : 15,
        minlength : 3,
        type: String,
        unique : true
    },
    name: String,
    password_hash: String,
    notes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Note'
        }
    ],
});

user_schema.plugin(uniuque_validator);

user_schema.set('toJSON', {
    transform : (document, returned_object) => {
        returned_object.id = returned_object._id.toString();
        delete returned_object._id;
        delete returned_object.__v;
        //the password_hash should not be returned
        delete returned_object.password;
    }
});

const User = mongoose.model('User', user_schema);

module.exports = User;

//the password_hash is stored in the database and not the actual password
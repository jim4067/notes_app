const mongoose = require('mongoose');

mongoose.set('useFindAndModify', false);

const note_schema = new mongoose.Schema({
    content: {
        type: String,
        minlength: 5,
        required: false
    },
    date: {
        type: Date,
        required: false
    },
    important: Boolean
} );

note_schema.set( 'toJSON', {
    transform: (document, return_object) => {
        return_object.id = return_object._id.toString();
        delete return_object._id;
        delete return_object.__v;
    }
});

//this makes sure that the schema is registered with mongoose
const Note = mongoose.model('Note', note_schema);

module.exports = Note;
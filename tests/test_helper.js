const Note = require('../models/note');
const User = require('../models/user');

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

const non_existent_id = async () => {
    const note = new Note({content: "will remove this soon"});
    await note.save();
    await note.remove();

    return note._id.toString()
}

const notes_in_db = async () => {
    const notes = await Note.find({});
    return notes.map(note_param => note_param.toJSON())
}

const users_in_db = async () => {
    const users = await User.find({});
    return users.map(u_param => u_param.toJSON());
}

module.exports = ({
    initial_notes,
    non_existent_id,
    notes_in_db,
    users_in_db
})
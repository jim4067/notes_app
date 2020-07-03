const mongoose = require('mongoose');

const url = process.env.MONGODB_URI;

console.log("connecting to mongoDB..." , url)

mongoose.connect(url, {useNewUrlParser:true, useUnifiedTopology:true} )
        .then( (result) => {
            console.log("connected to mongoDB")
        })
        .catch((err) =>  {
            console.log("aaahhh shit.....", err)
        }) 

const note_schema = new mongoose.Schema({
    content: String,
    date: Date,
    important: Boolean
} );

note_schema.set( 'toJSON', {
    transform: (document, return_object) => {
        return_object.id = return_object._id.toString();
        delete return_object._id;
        delete return_object.__v;
    }
});

const Note = mongoose.model('Note', note_schema);

module.exports = Note;
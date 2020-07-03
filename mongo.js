const mongoose = require('mongoose')

if(process.argv.length < 3 ){
    console.log("please provide the password as an argument : node mongojs <password>");
    process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://fullstack_tutorial:${password}@cluster0-zogjd.mongodb.net/note-app~?retryWrites=true&w=majority`

mongoose.connect(url , {useNewUrlParser: true, useUnifiedTopology: true} );

const noteSchema = new mongoose.Schema({
    content : String,
    date : Date,
    important : Boolean
} );

const Note = mongoose.model('Note', noteSchema);

/*
const note = new Note ({
    content : "Who the fuck uses callbacks",
    date : new Date(),
    important : false
} );

note.save().then ( result => {
    console.log("note saved!");
    console.log("and the result goes to..." , result);
    mongoose.connection.close();
} );
*/
Note.find( {} ).then(result => {
    result.forEach( note => {
        console.log(note);
    });
    mongoose.connection.close();
} );
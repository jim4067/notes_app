const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
app.use(express.json() );
app.use(morgan('tiny') );

app.use( cors() );

let notes = [
    {
        id: 1,
        content: "HTML is easy",
        date: "2019-05-30T17:30:31.098Z",
        important: true
      },
      {
        id: 2,
        content: "Browser can execute only Javascript",
        date: "2019-05-30T18:39:34.091Z",
        important: false
      },
      {
        id: 3,
        content: "GET and POST are the most important methods of HTTP protocol",
        date: "2019-05-30T19:20:14.298Z",
        important: true
      }
]

//how the app should respond when a request is made to the homepage
app.get( '/' , (req, res) => {
    res.send('<h1>Hello world<h1>');
} );

//when a req to all notes is made
app.get('/api/notes', (req, res) => {
  res.json(notes)
} );

//how the app should respond when a request is made to GET a single notes resource
app.get('/api/notes/:id' , (req , res) => {
  const id = Number(req.params.id);
  const note = notes.find(note => note.id === id );

  if(note){
    res.json(note);
  } else {
    res.status(404).end();
  }
} );

const generateID = () => {
  const maxID = notes.length > 0 
  ? Math.max(...notes.map( n => n.id ) ) 
  : 0;

  return maxID + 1;
}
//respomding to post requests
app.post('/api/notes' , (req, res) => {
  const body = req.body;

  if(!body.content){
    return res.status(404).json({
      error: "content missing"
    } );
  }

  const note = {
    content : body.content,
    id: generateID(),
    important: body.important || false,
    date: new Date()
  }

  notes = notes.concat(note);

  res.json(note);
} );

//how the app should respond to a DELETE request
app.delete( '/api/notes/:id', (req, res) => {
  const id = Number(req.params.id)
  notes = notes.filter( note => note.id !== id);

  res.status(204).end();
} );

const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
} )

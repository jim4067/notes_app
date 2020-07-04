const cors = require("cors");
require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const Note = require("./models/note");
const { static } = require("express");

const app = express();

app.use(express.static("build"));
app.use(express.json());
app.use(morgan("tiny"));

app.use(cors());

//how the app should respond when a request is made to the homepage, 
//but since we using "app.use(express.static(build))", the front-end of react will be returned
app.get("/", (req, res) => {
  res.send("<h1>wad up<h1>");
});

//when a req to all notes is made
app.get('/api/notes', (req, res) => {
  Note.find({}).then((notes) => {
    res.json(notes);
  });
});

//how the app should respond when a request is made to GET a single notes resource
app.get('/api/notes/:id', (req, res,next) => {
  const id = req.params.id;

  Note.findById(id)
    .then((note) => {
      if (note) {
        res.json(note);
      } else {
        res.status(404).end();
      }
    })
    .catch((err) => next(err));
});

//responding to post requests
app.post("/api/notes", (req, res) => {
  const body = req.body;

  if (body.content === undefined) {
    return res.status(404).json({
      error: "content missing",
    });
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  });

  note.save().then((saved_note) => {
    res.json(saved_note);
    console.log("the post log for saved_note...", saved_note);
  });
});

//updating the notes. toggling importance
app.put('/notes/api/notes:id', (req, res, next) => {
  const body = req.body;

  const note = {
    content: body.content,
    important: body.important
  }

  const id = req.params.id;
  Note.findByIdAndUpdate(id, {new: true} )
      .then(updated_note => {
        res.json(updated_note);
      })
      .catch( err => next(err))
} );

//how the app should respond to a DELETE request
app.delete("/api/notes/:id", (req, res, next) => {
  const id = req.params.id;

  Note.findByIdAndRemove(id)
      .then( ( ) => {
        res.status(204).end();
      })
      .catch( (err) => {
        next(err);
      })
});

//the middleware for handling error when a req to an unknown endpoint is made
const unknown_endpoint = (req, res) => {
  res.status(404).send({ error: "unknown endoint"})
}
app.use(unknown_endpoint);

//the middleware for handling requests that result into errors. 
//It shold come after unknown_endpoint middleware
const error_handler = (err, req, res, next) => {
  console.error(err);

  if (err.name === 'CastError' && error.kind == 'ObjectId') {
    return res.status(404).send({ error: "malformatted id"})
  }
  next(err);
}
app.use(error_handler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});

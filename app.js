const config = require('./utils/config');
const cors = require('cors');
const express = require('express');
const logger = require('./utils/logger')
const note_router = require('./controllers/notes');
const middleware = require('./utils/middleware')
const mongoose = require('mongoose');
require('express-async-errors');

const app = express();

logger.info(`connecting to... ${config.MONGODB_URI}`);

mongoose.connect(config.MONGODB_URI, {useUnifiedTopology:true, useNewUrlParser:true} )
        .then( () => {
            logger.info('connected to MongoDB')
        })
        .catch( (err) => {
            logger.error("error connecting to mongoDB.....", err.message)
        })


app.use(cors());
app.use(express.static('build'));
app.use(express.json());

app.use('/api/notes', note_router);

app.use(middleware.request_logger)
app.use(middleware.unknown_endpoint);
app.use(middleware.error_handler);


module.exports = app;
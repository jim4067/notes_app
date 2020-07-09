const logger = require('./logger');

const request_logger = (req, res, next) => {
    logger.info('Method', req.method)
    logger.info('Path', req.path)
    logger.info('Body', req.body)
    logger.info('----')
    next()
}

const unknown_endpoint = (req, res) => {
    res.status(404).send({error : "unknown endpoint"});
}

const error_handler = (error, req, res, next)  => {
    logger.error(error.message);

    if(error.name === 'CastError'){
        return res.status(400).send({error: "malformatted id"})
    } else if (error.name === "ValidationError"){
        return res.status(400).json({error : error.message})
    }
    next(error);
}

module.exports = {
    request_logger,
    unknown_endpoint,
    error_handler
}
const app = require('./app'); //the actual express aplication
const http = require('http');
const config = require('./utils/config');
const logger = require('./utils/logger');

const server = http.createServer(app);

server.listen( config.PORT, () => {
  logger.info(`app running on port ${config.PORT}`)
});
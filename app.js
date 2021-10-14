require('dotenv').config();
require('events').EventEmitter.defaultMaxListeners = 15;
const Server = require('./models/server');

const server = new Server();

server.listen();
require('dotenv').config();

let appRoot = require('app-root-path');
let winston = require('winston');
let date = new Date();
//let formatDate = date.toISOString().slice(0, 10);

const logger = (idPlaning) => {
    const levels = {
        info: 2,
        warn: 1,
        error: 0,
        http: 3,
        verbose: 4,
        debug: 5,
        silly: 6
    };
    let options = {
        fileCombined: {
            level: 'info',
            filename: `${appRoot}/logs/planing-${idPlaning}.log`,
            handleExceptions: true,
            json: true,
            maxsize: process.env.FILE_SIZE_LOGS,
            maxFiles: 100,
            colorize: false
        },
        fileError: {
            level: 'error',
            filename: `${appRoot}/logs/planing-${idPlaning}.log`,
            handleExceptions: true,
            json: true,
            maxsize: process.env.FILE_SIZE_LOGS, // 5MB
            maxFiles: 100,
            colorize: false,
            level: 'error'
        },
        console: {
            level: 'debug',
            handleExceptions: true,
            json: false,
            colorize: true,
        },
    };

    return winston.createLogger({
        levels: levels,
        format: winston.format.json(),
        defaultMeta: {
            service: 'stupendo-worker'
        },
        transports: [
            new winston.transports.File(options.fileCombined),
            new winston.transports.File(options.fileError)
        ],
        exitOnError: false,
    });
}



module.exports = logger;
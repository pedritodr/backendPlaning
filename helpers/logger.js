require('dotenv').config();

let appRoot = require('app-root-path');

const levels = () => {
    return {
        info: 2,
        warn: 1,
        error: 0,
        http: 3,
        verbose: 4,
        debug: 5,
        silly: 6
    };
}

const options = (idPlaning) => {
    return {
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
}

module.exports = {
    options,
    levels
}
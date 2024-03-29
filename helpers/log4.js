require('dotenv').config();

const appRoot = require('app-root-path');
const log4js = require("log4js");


const logger = (idPlaning) => {
    log4js.configure({
        appenders: { cheese: { type: "file", filename: `${appRoot}/logs/planing-${idPlaning}.log` } },
        categories: { default: { appenders: ["cheese"], level: "info" } }
    });

    return log4js.getLogger();
}

module.exports = logger;
const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const { dbConnection } = require('../database/config');
const cron = require('node-cron');

const { createToFileFtp } = require('../controllers/execute-planing')
class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.paths = {
            auth: '/api/auth',
            planing: '/api/planing',
            user: '/api/users',
        }

        this.connectionDb();

        this.cronJobs();

        //middlewares
        this.middlewares();
        //rutas app
        this.routers()
    }
    async connectionDb() {
        await dbConnection();
    }

    cronJobs() {
        cron.schedule('* */1 * * *', () => {
            console.log('running a task every hours');
            createToFileFtp();
        });
    }

    routers() {
        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.user, require('../routes/users'));
        this.app.use(this.paths.planing, require('../routes/planing'));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en el puerto: ' + this.port);
        });
    }

    middlewares() {
        this.app.use(express.static('public'));
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp/',
            createParentPath: true
        }));
    }
}

module.exports = Server;
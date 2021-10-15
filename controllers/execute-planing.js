const path = require('path');
const { Planing } = require('../models');
const csv = require('csv-parser');
const fs = require('fs');
const results = [];
//WORKER POOL(NODE WORKER_THREAD)
const workerPool = require("workerpool");
require('events').EventEmitter.defaultMaxListeners = 10;
class ProcessToFtp {

    static instance;
    active = 'init';

    constructor() {
        if (!!ProcessToFtp.instance) {
            return ProcessToFtp.instance;
        }
        ProcessToFtp.instance = this;
    }

    setActive(a) {
        this.active = a;
    }

    getActive() {
        return this.active;
    }
}

const pool = workerPool.pool(
    path.resolve(__dirname) + "/workers/stupendo-worker.js", {
        maxWorkers: parseInt(process.env.MAX_WORKERS),
        workerType: "thread",
        /*   maxQueueSize: 1000, */
    }
);

const createToFileFtp = async() => {
    try {
        let processToFtp = new ProcessToFtp();
        if (processToFtp.getActive() === 'init') {
            const planing = await Planing.findOne({ status: 0 }).sort({ time: 1 }).limit(1);
            if (planing) {
                processToFtp.setActive('process');
                const dateProcess = new Date();
                await Planing.findByIdAndUpdate(planing._id, { status: 1, date_process: dateProcess }, { new: true });
                const uploadPath = path.join(__dirname, '../uploads/', 'cvss', planing.secuential);
                const dateBegin = new Date(planing.date_begin);
                const dateEnd = new Date(planing.date_end);
                const nameFolder = `${dateBegin.toISOString().slice(0, 10)}-${dateEnd.toISOString().slice(0, 10)}-${planing._id}`;

                fs.createReadStream(uploadPath)
                    .pipe(csv())
                    .on('data', (data) => results.push(data))
                    .on('end', async() => {
                        let arrayChunked = results.length > 0 ? await chunkArray(results, 50) : [];
                        for (const [index, data] of arrayChunked.entries()) {
                            console.time('worker' + index)
                            try {
                                if (typeof data !== "undefined" && data.length > 0) {
                                    pool
                                        .exec("pushDocumentToFtp", [data, JSON.stringify(planing), nameFolder])
                                        .then(function(result) {
                                            console.timeEnd('worker' + index)
                                        })
                                        .catch(function(err) {
                                            console.log(err);
                                        });
                                }
                            } catch (error) {
                                processToFtp.setActive('complete');
                            }
                        }
                    });

                setTimeout(() => {
                    processToFtp.setActive('complete');
                }, 5000);

                const setIntervalFinish = setInterval(async() => {
                    console.log('tasks pending:' + parseInt(pool.stats().pendingTasks))
                    if (parseInt(pool.stats().pendingTasks) == 0) {
                        clearInterval(setIntervalFinish);
                        const dateFinish = new Date();
                        await Planing.findByIdAndUpdate(planing._id, { status: 2, date_culminated: dateFinish }, { new: true });
                        processToFtp.setActive('complete');
                        pool.terminate();
                    }
                }, 1500);
            }
        } else {
            if (processToFtp.getActive() === 'complete') {
                processToFtp.setActive('init');
            }
        }

    } catch (error) {
        console.log(error)
    }
}


const chunkArray = (arr, size) => {
    var arrayForChunk = [];
    for (var i = 0; i < arr.length; i += size) {
        arrayForChunk.push(arr.slice(i, i + size));
    }
    return arrayForChunk;
};


module.exports = {
    createToFileFtp
}
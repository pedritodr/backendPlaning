const path = require('path');
const { Planing } = require('../models');
const csv = require('csv-parser')
const fs = require('fs')
const results = [];
//WORKER POOL(NODE WORKER_THREAD)
const workerPool = require("workerpool");

class ProcessToFtp {

    static instance;
    active = 'init';

    constructor() {
        console.log(ProcessToFtp.instance)
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
        maxQueueSize: 1000,
    }
);

const createToFileFtp = async() => {
    try {
        let processToFtp = new ProcessToFtp();
        console.log("process:" + processToFtp.getActive())
        if (processToFtp.getActive() === 'init') {
            const planing = await Planing.find({ status: 0 }).sort({ time: 1 }).limit(1);
            //  console.log(planing)
            if (planing.length > 0) {
                processToFtp.setActive('process');
                const uploadPath = path.join(__dirname, '../uploads/', 'cvss', planing[0].secuential);
                fs.createReadStream(uploadPath)
                    .pipe(csv())
                    .on('data', (data) => results.push(data))
                    .on('end', async() => {
                        let arrayChunked = results.length > 0 ? await chunkArray(results, 50) : [];
                        for (const data of arrayChunked) {
                            try {
                                if (typeof data !== "undefined" && data.length > 0) {
                                    pool
                                        .exec("pushDocumentToFtp", [data, planing[0]])
                                        .then(function(result) {})
                                        .catch(function(err) {
                                            console.log(err);
                                        });
                                }
                            } catch (error) {
                                processToFtp.setActive('complete');
                            }
                        }
                        //console.log(arrayChunked);
                    });


                setTimeout(() => {
                    processToFtp.setActive('complete');
                }, 5000);

                const setIntervalFinish = setInterval(() => {
                    console.log(pool.stats().pendingTasks);
                    if (parseInt(pool.stats().pendingTasks) == 0) {
                        clearInterval(setIntervalFinish);
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
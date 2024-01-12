
import http from 'http';
import morgan from 'morgan';
import express from 'express';
import bodyParser from 'body-parser';
import cluster from 'cluster';

import { setRouter } from './route';

const app = express();
let workers = [];




const setupWorkerProcesses = () => {
   
    let numCores = require('os').cpus().length;
    console.log('Master cluster setting up ' + numCores + ' workers');

    
    // will utilize all of them
    for(let i = 0; i < numCores; i++) {
        
       
        workers.push(cluster.fork());

  
        workers[i].on('message', function(message) {
            console.log(message);
        });
    }

    
    cluster.on('online', function(worker) {
        console.log('Worker ' + worker.process.pid + ' is listening');
    });

    
    cluster.on('exit', function(worker, code, signal) {
        console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
        console.log('Starting a new worker');
        cluster.fork();
        workers.push(cluster.fork());
        workers[workers.length-1].on('message', function(message) {
            console.log(message);
        });
    });
};

/**
 * 
 */
const setUpExpress = () => {
    // create server
    app.server = http.createServer(app);

    
    app.use(morgan('tiny'));

    
    app.use(bodyParser.json({
        limit: '2000kb',
    }));
    app.disable('x-powered-by');

    
    setRouter(app);

    
    app.server.listen('443', () => {
        console.log(`Started server on => http://localhost:${app.server.address().port} for Process Id ${process.pid}`);
    });

    // in case of an error
    app.on('error', (appErr, appCtx) => {
        console.error('app error', appErr.stack);
        console.error('on url', appCtx.req.url);
        console.error('with headers', appCtx.req.headers);
    });
};

/**
 * 
 * 
 * @constructor
 */
const setupServer = (isClusterRequired) => {

    if(isClusterRequired && cluster.isMaster) {
        setupWorkerProcesses();
    } else {
 
        setUpExpress();
    }
};

setupServer(true);

export { app };

'use strict';
const express = require('express');
const morgan = require('morgan');
const port = 3001;
let expressServer;

const start = (port) => {
    console.log('Starting Express server...');
    if (!port) {
        throw new Error('You must specify a port to run the server on.');
    }
    const app = express();
    const staticDir = process.cwd();
    console.log('Static directory:', staticDir);
    app.use(morgan('dev'));
    app.use(express.static(staticDir));
    expressServer = app.listen(port, () => {
        console.log(`Express listening on port ${port}. http://localhost:${port}`);
    });
};

const stop = () => {
    console.log('Stopping express...');
    expressServer.close((err) => {
        console.log(err || 'Express server stopped.');
    });
};

module.exports = {
    start,
    stop,
    port
};

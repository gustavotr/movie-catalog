const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const { populate } = require('./model/Movie');
const mongoose = require('mongoose');

// Connect to the database
const dbURL = "mongodb://database/movie-catalog";
mongoose.connect(dbURL, { useNewUrlParser: true })
    .then(() => console.info(`Successfully connected to MongoDB database on "${dbURL}"`))
    .catch((error) => console.error(`Cannot connect to MongoDB: ${error}`));

// Populate the database if empty
populate();

// Get our API routes
const api = require('./routes/api');

const app = express();

// Parsers for POST data 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// Set our api routes
app.use('/', api);


/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '3000';
app.set('port', port);

/**
 *Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => console.log(`API running on localhost:${port}`));
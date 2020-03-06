// connect to redis

// connect to postgres

// broker information between them + react app


const keys = require('./keys');

// SETUP EXPRESS server
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// create new express server, responds to http requests
const app = express();
app.use(cors()); // cross origin resource sharing
// possible to route to other ports

app.use(bodyParser.json());

// SETUP POSTGRESS CLIENT
const { Pool } = require('pg');
const pgClient = new Pool({
    host: keys.pgHost,
    port: keys.pgPort,
    database: keys.pgDatabase,
    user: keys.pgUser,
    password: keys.pgPassword,
});
pgClient.on('error', () => console.log('Lost Postgress connection'));

// need to create a table thats going to store indices
pgClient.query('CREATE TABLE IF NOT EXISTS values (number INT)')
    .catch((err) => console.log(err));

// SETUP REDIS CLIENT
const redis = require('redis');
const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
});
// duplicate connections
const redisPublisher = redisClient.duplicate();

// SETUP EXPRESS ROUTES
app.get('/', (req, res) => {
    res.send('Hi this is the root route handler, try /values');
});

// get all the values from database
app.get('/values/all', async (req, res) => {
    const values = await pgClient.query('SELECT * from values');
    res.send(values.rows);
});

// get all the calculated values from redis ( K / V pairs)
app.get('/values/current', async (req, res) => {
    redisClient.hgetall('values', (err, values) => {
        res.send(values);
    });
});

// RECEIVE new values from react app
app.post('/values', async (req, res) => {
    // get index from body
    const index = req.body.index;

    // cap index at 40
    if (parseInt(index) > 40) {
        return res.status(422).send('Index too high, capped at 40');
    }
    // Set the value in redis
    redisClient.hset('values', index, 'Nothing calculated yet by the worker!!');

    // notify the worker
    redisPublisher.publish('insert', index);

    // Store index in postgres
    pgClient.query('INSERT INTO values(number) VALUES($1)', [index]);

    res.send({ working: true });
});

app.listen(5000, err => {
    console.log('API server using express listening on port 5000');
});

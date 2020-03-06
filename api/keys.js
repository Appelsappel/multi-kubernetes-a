module.exports = {
// Redis environment vars
    redisHost: process.env.REDIS_HOST,
    redisPort: process.env.REDIS_PORT,
// Postgress environment vars
    pgHost:     process.env.PGHOST,
    pgPort:     process.env.PGPORT,
    pgDatabase: process.env.PGDATABASE,
    pgUser:     process.env.PGUSER,
    pgPassword: process.env.PGPASSWORD
};

const knex = require('knex')({
    client: 'pg',
    connection: {
        host: 'localhost',
        user: 'postgres',
        password: 'postgres',
        database: 'provihack',
        ssl: {
            rejectUnauthorized: false
        }
    }
});

module.exports = knex;
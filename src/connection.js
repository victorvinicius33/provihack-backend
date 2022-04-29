const knex = require('knex')({
    client: 'pg',
    connection: {
        host: 'localhost',
        user: 'postgres',
        password: 'Sa2123465',
        database: 'provihack'
    }
});

module.exports = knex;
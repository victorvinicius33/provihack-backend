/* const knex = require('knex')({
    client: 'pg',
    connection: {
        host: 'ec2-34-194-73-236.compute-1.amazonaws.com',
        user: 'oqjppcekekeags',
        password: '32c65aeae229c12d5a42a85ed438e3b65bad79c63979d3c8f04b12943e421b2a',
        database: 'datbjt5qecimqt',
        port: 5432,
        ssl: {
            rejectUnauthorized: false
        }
    }
}); */

const knex = require('knex')({
    client: 'pg',
    connection: {
        host: 'localhost',
        user: 'postgres',
        password: 'Sa2123465',
        database: 'provihack',
        port: 5432
    }
});

module.exports = knex;
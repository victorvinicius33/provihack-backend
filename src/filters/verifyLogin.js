const knex = require('../connection');
const jwt = require('jsonwebtoken');
const hashPassword = require('../hashPassword');

const verifyLogin = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json('Não autorizado');
    }

    try {
        const token = authorization.replace('Bearer ', '').trim();

        const { id } = jwt.verify(token, hashPassword);

        const loggedInUser = await knex('users').where({ id }).first();

        if (!loggedInUser) {
            return res.status(404).json('Usuario não encontrado');
        }

        const { password, ...user } = loggedInUser;

        req.user = user;

        next();
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = verifyLogin;
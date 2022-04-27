const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const hashPassword = require('../hashPassword');
const knex = require('../connection');

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(404).json({ message: 'É obrigatório email e senha' });
    }

    try {
        const user = await knex('users').where('email', email).returning('*').first();

        if (!user) {
            return res.status(400).json({ message: 'O usuario não foi encontrado' });
        }

        const correctPassword = await bcrypt.compare(password, user.password);

        if (!correctPassword) {
            return res.status(400).json({ message: 'Email ou senha incorretos.' });
        }

        const token = jwt.sign({ id: user.id }, hashPassword, { expiresIn: '8h' });

        const { password: _, ...userData } = user;

        return res.status(200).json({
            user: userData,
            token
        });
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = {
    login
}
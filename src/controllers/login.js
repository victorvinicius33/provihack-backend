const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const hashPassword = require('../hashPassword');
const knex = require('../connection');

const login = async (req, res) => {
    const { email, password, stayConnected } = req.body;

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

        const token = stayConnected
            ? jwt.sign({ id: user.id }, hashPassword)
            : jwt.sign({ id: user.id }, hashPassword, { expiresIn: '2h' });

        const formatedCPFOrCNPJ = user.cpf_or_cnpj.length === 11
            ? user.cpf_or_cnpj.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
            : user.cpf_or_cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");

        const formatedUser = user;
        formatedUser.cpf_or_cnpj = formatedCPFOrCNPJ;

        const { 
            password: _, 
            ...userData 
        } = formatedUser;

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
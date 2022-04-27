const bcrypt = require('bcrypt');
const knex = require('../connection');

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name) {
        return res.status(404).json({ message: 'O campo nome é obrigatório.' });
    }

    if (!email) {
        return res.status(404).json({ message: 'O campo email é obrigatório.' });
    }

    if (!password) {
        return res.status(404).json({ message: 'O campo senha é obrigatório.' });
    }

    try {
        const checkIfEmailAlreadyExists = await knex('users')
            .where('email', email)
            .returning('*');

        if (checkIfEmailAlreadyExists.length > 0) {
            return res.status(400).json({ message: 'O email já existe.' });
        }

        const encryptedPassword = await bcrypt.hash(password, 10);

        const novoUsuario = await knex('users')
            .insert({
                name, email, password: encryptedPassword
            })
            .returning('*');

        return res.status(200).json(novoUsuario);
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const getProfile = async (req, res) => {
    return res.status(200).json(req.user);
}

const updateProfile = async (req, res) => {
    const { name, email, password } = req.body;
    const { id } = req.user;

    if (!name && !email && !password) {
        return res.status(404).json({ message: 'É obrigatório informar ao menos um campo para atualização.' });
    }

    try {
        const user = await knex('users').where({ id }).first();

        if (!user) {
            return res.status(400).json({ message: 'Não foi possível encontrar o usuário.' });
        }

        if (email) {
            if (email !== req.user.email) {
                const checkIfEmailAlreadyExists = await knex('users').select('*').where({ email }).first();

                if (checkIfEmailAlreadyExists) {
                    return res.status(400).json({ message: 'O email já existe.' });
                }
            }
        }

        if (password) {
            const updatedPassword = await bcrypt.hash(password, 10);

            const updatedUser = await knex('users')
                .update({
                    name,
                    email,
                    password: updatedPassword
                })
                .where('id', req.user.id);

            if (!updatedUser) {
                return res.status(200), json({ message: 'Não foi possível atualizar o usuário.' });
            }

            return res.status(200).json({ message: 'Usuário foi atualizado com sucesso.' });
        }

        const updatedUser = await knex('users')
            .update({
                name,
                email,
                password
            })
            .where('id', req.user.id);

        if (!updatedUser) {
            return res.status(200), json({ message: 'Não foi possível atualizar o usuário.' });
        }

        return res.status(200).json({ message: 'Usuário foi atualizado com sucesso.' });
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = {
    registerUser,
    getProfile,
    updateProfile
}
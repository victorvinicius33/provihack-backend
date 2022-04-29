const bcrypt = require('bcrypt');
const knex = require('../connection');

const registerUser = async (req, res) => {
    const { name, email, cpf, cnpj, address, password, groupcategory } = req.body;

    try {
        const encryptedPassword = await bcrypt.hash(password, 10);

        const novoUsuario = await knex('users')
            .insert({
                name, 
                email, 
                cpf, 
                cnpj, 
                address, 
                password: encryptedPassword,
                groupcategory
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
    const { name, email, cpf, cnpj, address, password, groupcategory } = req.body;
    const { id } = req.user;

    if (!name && !email && !cpf && !cnpj && !address && !password && !groupcategory) {
        return res.status(404).json({ message: 'É obrigatório informar ao menos um campo para atualização.' });
    }

    try {
        const user = await knex('users').where({ id }).first();

        if (!user) {
            return res.status(400).json({ message: 'Não foi possível encontrar o usuário.' });
        }

        if (password) {
            const updatedPassword = await bcrypt.hash(password, 10);

            const updatedUser = await knex('users')
                .update({
                    name,
                    email,
                    cpf,
                    cnpj,
                    address,
                    password: updatedPassword,
                    groupcategory
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
                cpf,
                cnpj,
                address,
                password,
                groupcategory
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
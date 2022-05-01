const bcrypt = require('bcrypt');
const knex = require('../connection');

const registerUser = async (req, res) => {
    const {
        name, email, cpf_or_cnpj, password, groupcategory,
        zip_code, address, house_number, complement
    } = req.body;

    try {
        const encryptedPassword = await bcrypt.hash(password, 10);

        const newUser = await knex('users')
            .insert({
                name,
                email,
                cpf_or_cnpj,
                password: encryptedPassword,
                groupcategory
            })
            .returning('*');

        const adressNewUser = await knex('users_addresses')
            .insert({
                email,
                zip_code,
                address,
                house_number,
                complement,
            });

        return res.status(200).json({ message: 'Usuário cadastrado com sucesso.' });
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const getProfile = async (req, res) => {
    return res.status(200).json(req.user);
}

const createProfileInfo = async (req, res) => {
    const { profile_image, user_description, telephone, images } = req.body;
    const { user_info } = req.user;

    try {
        const profileDescription = await knex('profile_description')
            .insert({
                user_id: user_info.id,
                profile_image,
                user_description,
                telephone
            })
            .returning('*');

        for (const image of images) {
            const profileImages = await knex('profile_images')
                .insert({
                    user_id: user_info.id,
                    image_url: image
                })
                .returning('*');
        }

        return res.status(200).json({ message: 'Perfil criado com sucesso!' });
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const updateProfile = async (req, res) => {
    const { name, email, cpf_or_cnpj, address, password, groupcategory } = req.body;
    const { user_info } = req.user;

    if (!name && !email && cpf_or_cnpj && !address && !password && !groupcategory) {
        return res.status(404).json({ message: 'É obrigatório informar ao menos um campo para atualização.' });
    }

    try {
        const user = await knex('users').where({ id: user_info.id }).first();

        if (!user) {
            return res.status(400).json({ message: 'Não foi possível encontrar o usuário.' });
        }

        if (password) {
            const updatedPassword = await bcrypt.hash(password, 10);

            const updatedUser = await knex('users')
                .update({
                    name,
                    email,
                    cpf_or_cnpj,
                    address,
                    password: updatedPassword,
                    groupcategory
                })
                .where('id', req.user.user_info.id);

            const updateEmailAdress = await knex('users_addresses')
                .update({
                    email  
                })
                .where('email', req.user.user_info.email);

            if (!updatedUser) {
                return res.status(200), json({ message: 'Não foi possível atualizar o usuário.' });
            }

            return res.status(200).json({ message: 'Usuário foi atualizado com sucesso.' });
        }

        const updatedUser = await knex('users')
            .update({
                name,
                email,
                cpf_or_cnpj,
                address,
                password,
                groupcategory
            })
            .where('id', req.user.user_info.id);

        if (!updatedUser) {
            return res.status(200), json({ message: 'Não foi possível atualizar o usuário.' });
        }

        return res.status(200).json({ message: 'Usuário foi atualizado com sucesso.' });
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const deleteUser = async (req, res) => {
    const { user_info } = req.user;

    try {
        const profileDeleted = await knex('profile_description')
            .delete()
            .where({ user_id: user_info.id });

        const userAddressDeleted = await knex('users_addresses')
            .delete()
            .where({ email: user_info.email });
        
        const profileImagesDeleted = await knex('profile_images')
            .delete()
            .where({ user_id: user_info.id });

        const userDeleted = await knex('users')
            .delete()
            .where({ id: user_info.id });

        if (!userDeleted) {
            return res.status(400).json({ message: 'Não foi possível excluir o usuário.' });
        }

        return res.status(200).json({ message: 'Usuário excluido com sucesso' });
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = {
    registerUser,
    createProfileInfo,
    getProfile,
    updateProfile,
    deleteUser
}
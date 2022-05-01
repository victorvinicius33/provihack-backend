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
            return res.status(404).json('Usuário não encontrado.');
        }

        const { password, ...user } = loggedInUser;

        const formatedCPF = user.cpf !== null
            ? user.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
            : user.cpf;
        const formatedCNPJ = user.cnpj !== null
            ? user.cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")
            : user.cnpj;

        const formatedUser = user;
        user.cpf = formatedCPF;
        user.cnpj = formatedCNPJ;

        const userAddress = await knex('users_addresses')
            .where({ email: user.email })
            .returning('*')
            .first();

        const work_images = await knex('profile_images')
            .where({ user_id: user.id })
            .returning('*');

        const profile_description = await knex('profile_description')
            .where({ user_id: user.id })
            .returning('*');

        const allUserData = {
            user_info: formatedUser,
            address: userAddress,
            work_images,
            profile_description
        }

        req.user = allUserData;

        next();
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = verifyLogin;
const knex = require('../connection');

const checkIfFieldsAreNull = async (req, res, next) => {
    const { name, email, cpf, cnpj, address, password, groupcategory } = req.body;

    if (!name) {
        return res.status(404).json({ message: 'O campo nome é obrigatório.' });
    }

    if (!email) {
        return res.status(404).json({ message: 'O campo email é obrigatório.' });
    }

    if (!cpf && !cnpj) {
        return res.status(404).json({ message: 'Digite um CPF ou CNPJ.' });
    }

    if (!address) {
        return res.status(404).json({ message: 'O campo endereço é obrigatório.' });
    }

    if (!password) {
        return res.status(404).json({ message: 'O campo senha é obrigatório.' });
    }

    if (!groupcategory) {
        return res.status(404).json({ message: 'Selecione a categoria do grupo ao qual você pertence.' });
    }

    next()
}

const checkIfFieldsAlreadyExistsInRegister = async (req, res, next) => {
    const { email, cpf, cnpj } = req.body;

    try {
        const emailAlreadyExists = await knex('users')
            .where('email', email)
            .returning('*')
            .first();

        if (emailAlreadyExists) {
            return res.status(400).json({ message: 'Email já cadastrado.' });
        }

        if (cpf) {
            const cpfAlreadyExists = await knex('users')
                .whereNotNull('cpf')
                .where('cpf', cpf)
                .returning('*')
                .first();

            if (cpfAlreadyExists) {
                return res.status(400).json({ message: 'CPF já cadastrado.' });
            }
        }

        if (cnpj) {
            const cnpjAlreadyExists = await knex('users')
                .whereNotNull('cnpj')
                .where('cnpj', cnpj)
                .returning('*')
                .first();

            if (cnpjAlreadyExists) {
                return res.status(400).json({ message: 'CNPJ já cadastrado.' });
            }
        }

        next();
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const checkIfFieldsAlreadyExistsInUpdate = async (req, res, next) => {
    const { email, cpf, cnpj } = req.body;

    try {
        if (email) {
            if (email !== req.user.email) {
                const emailAlreadyExists = await knex('users')
                    .where('email', email)
                    .returning('*')
                    .first();

                if (emailAlreadyExists) {
                    return res.status(400).json({ message: 'Email já cadastrado.' });
                }
            }
        }

        if (cpf) {
            if (cpf !== req.user.cpf) {
                const cpfAlreadyExists = await knex('users')
                    .whereNotNull('cpf')
                    .where('cpf', cpf)
                    .returning('*')
                    .first();
    
                if (cpfAlreadyExists) {
                    return res.status(400).json({ message: 'CPF já cadastrado.' });
                }
            }
        }

        if (cnpj) {
            if (cnpj !== req.user.cnpj) {
                const cnpjAlreadyExists = await knex('users')
                    .whereNotNull('cnpj')
                    .where('cnpj', cnpj)
                    .returning('*')
                    .first();
    
                if (cnpjAlreadyExists) {
                    return res.status(400).json({ message: 'CNPJ já cadastrado.' });
                }
            }
        }

        next();
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = {
    checkIfFieldsAreNull,
    checkIfFieldsAlreadyExistsInRegister,
    checkIfFieldsAlreadyExistsInUpdate
}
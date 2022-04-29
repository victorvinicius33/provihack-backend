const express = require('express');
const users = require('../controllers/users');
const usersMiddleware = require('../middlewares/users');
const login = require('../controllers/login');
const verifyLogin = require('../middlewares/verifyLogin');

const routes = express();

// Cadastro de usuário
routes.post('/register', usersMiddleware.checkIfFieldsAreNull, usersMiddleware.checkIfFieldsAlreadyExistsInRegister, users.registerUser);

// Login
routes.post('/login', login.login);

// Filtro para verificar usuário logado
routes.use(verifyLogin);

// Obter e atualizar perfil do usuário logado
routes.get('/profile', users.getProfile);
routes.put('/profile', usersMiddleware.checkIfFieldsAlreadyExistsInUpdate, users.updateProfile);

module.exports = routes;
const express = require('express');
const users = require('../controllers/users');
const usersMiddleware = require('../middlewares/users');
const login = require('../controllers/login');
const verifyLogin = require('../middlewares/verifyLogin');

const routes = express();

// Cadastro de usuário
routes.post('/register', usersMiddleware.checkIfFieldsAreNullInRegister, usersMiddleware.checkIfFieldsAlreadyExistsInRegister, users.registerUser);

// Login
routes.post('/login', login.login);

// Filtro para verificar usuário logado
routes.use(verifyLogin);

// Perfil do usuário logado
routes.post('/profile', usersMiddleware.checkFieldsInCreateProfile, users.createProfileInfo);
routes.get('/profile', users.getProfile);
routes.put('/profile', usersMiddleware.checkIfFieldsAlreadyExistsInUpdate, users.updateProfile);
routes.delete('/profile', users.deleteUser);

module.exports = routes;
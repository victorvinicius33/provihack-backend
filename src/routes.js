const express = require('express');
const users = require('./controllers/users');
const login = require('./controllers/login');
const verifyLogin = require('./filters/verifyLogin');

const routes = express();

// Cadastro de usuário
routes.post('/users', users.registerUser);

// Login
routes.post('/login', login.login);

// Filtro para verificar usuário logado
routes.use(verifyLogin);

// Obter e atualizar perfil do usuário logado
routes.get('/profile', users.getProfile);
routes.put('/profile', users.updateProfile);

module.exports = routes;
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

module.exports = router.get('/', async (req,res) => {
    try { 
        const token = req.cookies.token; 
        if (!token) { 
            return res.redirect('/auth/login'); 
        } 
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        const user = await User.findById(decoded.id); 
        if (!user) { 
            console.log('Usuário não encontrado. Redirecionando para o login...'); 
            return res.redirect('/auth/login'); 
        } 
        res.render('home', { username: user.username });
    } catch (error) { 
        console.error('Erro ao acessar o dashboard:', error); 
        return res.redirect('/auth/login');
    } 
})
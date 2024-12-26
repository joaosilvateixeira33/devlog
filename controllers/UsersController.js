const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = class UsersController {
    static loginForm(req, res) {
        res.render('users/loginForm');
    }

    static async login(req, res) {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).send('Usuário não encontrado');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send('Senha incorreta');
        }

        const token = jwt.sign({ id: user._id, role: user.role, name: user.name }, process.env.JWT_SECRET);

        res.cookie('token', token, { httpOnly: true });

        res.render('home', { username: user.username });
    }
    
    static logout(req, res) {
        res.clearCookie('token');
        res.redirect('/');
    }

    static registerForm(req, res){
        res.render('users/registerForm');
    }

    static async register(req, res) {
        const { username, email, password, confirm } = req.body;
    
        if (password !== confirm) {
            return res.status(400).send('As senhas não coincidem');
        }
    
        try {
            const emailExists = await User.findOne({ email });
            if (emailExists) {
                return res.status(400).send('Email já registrado');
            }
    
            const usernameExists = await User.findOne({ username });
            if (usernameExists) {
                return res.status(400).send('Nome de usuário já registrado');
            }
    
            const newUser = new User({
                username,
                email,
                password,
            });
    
            await newUser.save();
    
            res.redirect('/auth/login');
        } catch (error) {
            console.error(error);
            res.status(500).send('Erro ao registrar o usuário');
        }
    }
    static async dashboard(req, res) { 
        try { 
            const token = req.cookies.token; 
            if (!token) { 
                return res.redirect('/login'); 
            } 
            const decoded = jwt.verify(token, process.env.JWT_SECRET); 
            const user = await User.findById(decoded.id); 
            if (!user) { 
                console.log('Usuário não encontrado. Redirecionando para o login...'); 
                return res.redirect('/auth/login'); 
            } 
            res.render('users/dashboard', { username: user.username });
        } catch (error) { 
            console.error('Erro ao acessar o dashboard:', error); 
            return res.redirect('/auth/login'); 
        } 
    }
}
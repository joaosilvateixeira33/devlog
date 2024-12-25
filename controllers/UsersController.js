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

        res.render('home', { username: user.name });
    }
    
    static logout(req, res) {
        res.clearCookie('token');
        res.redirect('/');
    }
}
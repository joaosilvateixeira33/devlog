const User = require('../models/User');
const jwt = require('jsonwebtoken');

module.exports = class HomeController {
    static async home(req, res) {
        try {
            const token = req.cookies.token;

            // Verificar se o token não existe
            if (!token) {
                return res.render('home', { username: null });
            }

            // Tentar decodificar o token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Procurar pelo usuário no banco de dados
            const user = await User.findById(decoded.id);

            // Verificar se o usuário existe
            if (!user) {
                return res.render('home', { username: null });
            }

            // Renderizar a página com o nome do usuário
            res.render('home', { username: user.username });
        } catch (error) {
            console.error('Erro ao acessar o dashboard:', error);

            // Caso o erro seja relacionado ao JWT, redirecionar para o login
            if (error instanceof jwt.JsonWebTokenError) {
                return res.redirect('/auth/login');
            }

            // Para outros erros, apenas redirecionar para o login
            return res.redirect('/auth/login');
        }
    }
}

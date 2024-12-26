const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = {
  ensureAuthenticated(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
      return res.redirect('/login');
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; 
      next();
    } catch (err) {
      res.redirect('/auth/login');
    }
  },
  ensureRole(role) {
    return (req, res, next) => {
      if (req.user && req.user.role === role) {
        return next();
      }
      res.status(403).send('Acesso negado');
    };
  },

  async authenticate(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        return res.redirect('/login');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Token decodificado:', decoded);

        const user = await User.findById(decoded.id);
        if (!user) {
            console.log('Usuário não encontrado. Redirecionando para o login...');
            return res.redirect('/auth/login');
        }

        req.user = user;
        next();
    } catch (err) {
        console.error('Erro ao verificar token:', err);
        return res.redirect('/auth/login');
    }
  }
};
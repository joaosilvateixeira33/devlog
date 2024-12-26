const express = require('express');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const authRoutes = require('./routes/authRoutes');
const homeRouter = require('./routes/homeRoute');

dotenv.config();
const app = express();

const hbs = exphbs.create({
    partialsDir: ['views/partials'],
})

app.use(express.json());
app.use(cookieParser());
app.use(session({ secret: 'secreta', resave: false, saveUninitialized: true }));
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use('/', homeRouter);
app.use('/auth', authRoutes);

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB conectado!'))
  .catch(err => console.log(err));


app.listen(process.env.PORT, () => {
    console.log(`Servidor rodando na porta ${process.env.PORT}`);
});
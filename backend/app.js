const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser')
const helmet = require('helmet')
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors())

const userRoutes = require('./routes/user')
const saucesRoutes = require('./routes/sauce')

app.use(helmet())
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});


mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Vous est conecté à la basse de donnes');
}).catch(error => console.log({ error }))

app.use(bodyParser.json())
app.use(express.json())

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/auth', userRoutes)
app.use('/api/sauces', saucesRoutes)


module.exports = app
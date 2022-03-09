const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const cryptoJS = require("crypto-js");
const Secret = process.env.SECRET;

let passwordValidator = require('password-validator');
// Create a schema
let schema = new passwordValidator();
schema
    .is().min(8)
    .is().max(20)
    .has().uppercase()
    .has().lowercase()
    .has().digits(1)
    .has().not().spaces()

exports.signup = (req, res, next) => {

    bcrypt.hash(req.body.password, 10).then((hash) => {
        const user = new User({
            email: cryptoJS.enc.Base64.stringify(cryptoJS.SHA512(Secret + req.body.email)),
            password: hash
        })
        user.save().then(function () {
            res.status(201).json({ message: "Compte créé avec succes" })
        }).catch(function (error) {
            res.status(400).json({ error })
        }).catch(function (error) {
            res.status(500).json({ error })
        })
    })
}


exports.login = (req, res, next) => {
    User.findOne({ email: cryptoJS.enc.Base64.stringify(cryptoJS.SHA512(Secret + req.body.email)) }).then(function (user) {
        if (!user) {
            return res.status(401).json({ error: "Nom d'utilisateur invalide" })
        }
        bcrypt.compare(req.body.password, user.password).then(function (valid) {
            if (!valid) {
                return res.status(401).json({ error: "Mot de pass invalide" })
            }
            res.status(200).json({
                userId: user._id,
                token: jwt.sign({ userId: 'user._id' }, process.env.TOKEN, { expiresIn: 60 * 60 })
            });
        }).catch(function (error) {
            res.status(500).json({ error })
        })
    }).catch(function (error) {
        res.status(500).json({ error })
    })
}

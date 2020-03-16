const express = require('express')
const router = express.Router()
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const bcryptSalt = 10;
const regexTestPassword = RegExp("(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$")


router.get('/signup', (req, res, next) => {
    res.render('auth/signup');
})

router.post("/signup", (req, res, next) => {
    const {
        username,
        password
    } = req.body;
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    console.log(password);
    if (password.length < 6) {
        res.render('auth/signup', {
            errorMessage: 'Please pon contraseña'
        });
        return;
    }

    // validamos si los valores de los inputs llegan vacíos

    if (username === "" || password === "") {
        res.render("auth/signup", {
            errorMessage: "Indicate a username and a password to sign up"
        });
        return;
    }

    //busco en la BD si existe el username

    User.findOne({
            username: username
        })
        .then(user => {
            if (user !== null) {
                res.render("auth/signup", {
                    errorMessage: "The username already exists!"
                });
                return;
            }

            const salt = bcrypt.genSaltSync(bcryptSalt);
            const hashPass = bcrypt.hashSync(password, salt);

            User.create({
                    username,
                    password: hashPass
                })
                .then(() => {
                    req.session.CurrentUser = user
                    res.redirect("/");
                })
                .catch(error => {
                    console.log(error);
                });
        })
        .catch(error => {
            next(error);
        });
    });
    module.exports = router;
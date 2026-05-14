var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/Users');

//auth middleware

function authChecker(req, res, next) {
    if (!req.session.userId) {
        return res.redirect('/auth/login');
    }
    next();
}

// protected route
router.get('/dashboard', authChecker, (req, res) => {
    res.render('dashboard');
});

//profile route

router.get('/profile', authChecker, async (req, res) => {
    const user = await User.findById(req.session.userId);
    res.render('profile', {user});
})

//change password

router.get('/change-password', authChecker, (req, res) => {
    res.render('change-password');
})

router.post('/change-password', authChecker, async (req, res) => {
    const {currentPassword, newPassword, confirmPassword} = req.body;
    const user = await User.findById(req.session.userId)
    const match = await bcrypt.compare(currentPassword, user.password);

    if (!match) {
        return res.render('change-password', {message: 'ძველი პაროლი არასწორია'});
    }

    if (newPassword.length < 8) {
        return res.render('change-password', {message: "ახალი პაროლი უნდა შეიცავდეს მინიმუმ 8 სიმბოლოს"});
    }

    if (confirmPassword !== newPassword) {
        return res.render('change-password', {message: "პაროლები არ ემთხვევა ერთმანეთს"});
    }
    user.password = newPassword;
    await user.save();
    res.redirect('/profile');
})

module.exports = router;

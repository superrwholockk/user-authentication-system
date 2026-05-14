var express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/Users');

const router = express.Router();

/* Register page. */
router.get('/register', (req, res) => {
    res.render('register');
});

// login page
router.get('/login', (req, res) => {
    res.render('login', {
        success: req.query.success || null,
        message: req.query.message || null
    });
});

//register

router.post('/register', async (req, res) => {
    try {
        const {email, password} = req.body;

        if (!email || !password) {
            return res.render('register', {
                message: 'შეავსეთ ყველა ველი'
            })
        }

        if (password.length < 8) {
            return res.render('register', {message: "პაროლი უნდა შედგებოდეს მინიმუმ 8 სიმბოლოსგან"})
        }

        const existingUser = await User.findOne({email});
        if (existingUser) {
            return res.render('register', {message: "user ამ იმეილით უკვე არსებობს"})
        }
        const newUser = new User({
            email: email,
            password: password
        })
        await newUser.save();
        res.redirect('/auth/login?success=registered');
    } catch (err) {
        console.log(err);
        res.render("register", {message: "რეგისტრაციის დროს მოხდა შეცდომა,  გთხოვთ სცადოთ თავიდან"});
    }
})

//Login
router.post('/login', async (req, res) => {
    const {email, password} = req.body;

    const user = await User.findOne({email})
    if (!user) {
        return res.render('login', {message: "user ამ იმეილით ვერ მოიძებნა"})
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        return res.render('login', {message: "პაროლი არასწორია"})
    }
    req.session.userId = user._id;
    res.redirect('/dashboard');
})

//logout
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.send("გასვლისას დაფიქსირდა შეცდომა");
        }
        res.redirect('/auth/login');
    });
})
module.exports = router;

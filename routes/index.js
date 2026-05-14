var express = require('express');
var router = express.Router();

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

module.exports = router;

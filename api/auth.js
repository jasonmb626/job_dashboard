const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../models/User');
const auth = require('../middleware/auth');

router.use(express.json());

router.post('/', (req, res) => {
  console.log('Loggin in');
  const { login, password } = req.body;
  console.log(`${login} ${password}`);
  User.findOne({ login }).then(validUser => {
    bcrypt
      .compare(password, validUser.password)
      .then(isMatch => {
        if (!isMatch)
          return res.status(401).json({ msg: 'Incorrect password' });
        const tokenContent = {
          user: {
            id: validUser.id
          }
        };
        const token = jwt.sign(tokenContent, config.get('jwtSecret'));
        return res.json(token);
      })
      .catch(err => console.error(err));
  });
});

router.get('/', auth, (req, res) => {
  res.json(req.headers.user);
});

module.exports = router;

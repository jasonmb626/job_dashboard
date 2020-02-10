const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../models/User');
const auth = require('../middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET || config.get('jwtSecret');

router.use(express.json());

// @route    POST api/auth
// @desc     Log In a User
// @access   Public
router.post('/', (req, res) => {
  const { login, password } = req.body;
  User.findOne({ login }).then(validUser => {
    if (!validUser) { 
      return res.status(401).json({ msg: 'No such username' });
    }
    bcrypt
      .compare(password, validUser.password)
      .then(isMatch => {
        if (!isMatch) {
          return res.status(401).json({ msg: 'Incorrect password' });
        }
        const tokenContent = {
          user: {
            id: validUser.id
          }
        };
        const token = jwt.sign(tokenContent, JWT_SECRET);
        return res.json(token);
      })
      .catch(err => console.error(err));
  });
});

// @route    POST api/posts
// @desc     Get User details based on user authorized with attached token 
//           (the user is attached to the req at this point due to the auth middleware used)
// @access   Private
router.get('/', auth, (req, res) => {
  res.json(req.headers.user);
});

module.exports = router;
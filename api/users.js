const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../models/User');

router.use(express.json());

// @route    POST api/users
// @desc     Create a new user
// @access   Public
router.post('/', async (req, res) => {
  const { name, login, password } = req.body;

  //10 was a sensibile figure when this was written, but I've seen 12 suggested too.
  const salt = await bcrypt.genSalt(10); 
  const hash = await bcrypt.hash(password, salt);
  let newUser = new User({
    name,
    login,
    password: hash
  });
  newUser
    .save()
    .then(user => {
      const tokenContent = {
        user: {
          id: user.id
        }
      };
      const token = jwt.sign(tokenContent, config.get('jwtSecret'));
      return res.json(token);
    })
    .catch(error => console.error(error));
});

module.exports = router;

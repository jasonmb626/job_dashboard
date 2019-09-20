const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('config');

module.exports = (req, res, next) => {
  const token = req.headers['x-auth-token'];
  jwt.verify(token, config.get('jwtSecret'), async (err, decoded) => {
    if (err) {
      console.error(err);
      res.status(404).json({ msg: 'Invalid token' });
    }
    const { id } = decoded.user;
    const user = await User.findById(id)
      .select('-password')
      .catch(err => {
        console.error(err);
        res.status(401).json({ msg: 'No such user' });
      });
    req.headers.user = user;
    next();
  });
};

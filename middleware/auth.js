const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('config');

const JWT_SECRET = process.env.JWT_SECRET || config.get('jwtSecret');

//Middleware that stops protected routes here if token is missing or invalid.
//It also adds the entire user object to the headers of the user whose token is attached.
module.exports = (req, res, next) => {
  const token = req.headers['x-auth-token'];
  if (!token) {
    console.log('Middleware: missing token');
    return res.status(401).json({ msg: 'Missing Token' });
  }
  jwt.verify(token, JWT_SECRET, async (err, decoded) => {
    if (err) {
      console.error(err);
      res.status(404).json({ msg: 'Invalid token' });
    }
    const { id } = decoded.user;
    const user = await User.findById(id)
      .select('-password') //don't send back the password!
      .exec()
      .catch(err => {
        console.error(err);
        res.status(401).json({ msg: 'No such user' });
      });
    req.headers.user = user;
    next(); //authorized, so call next middleware
  });
};

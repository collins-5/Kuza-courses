const { verifyToken } = require('../lib/jwt');
const User = require('../models/user');

const protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).send('Not authorized. No token provided.');
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).send('Not authorized. User no longer exists.');
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).send('Not authorized. Invalid or expired token.');
  }
};

const restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).send('Forbidden. Insufficient permissions.');
  }
  next();
};

module.exports = { protect, restrictTo };
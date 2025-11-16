import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const protect = async (req, res, next) => {
  let token;

  // The token is usually sent in the 'Authorization' header like this: "Bearer eyJhbGci..."
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 1. Get token from header
      token = req.headers.authorization.split(' ')[1];

      // 2. Verify the token using our JWT_SECRET
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Find the user by the ID that was stored in the token
      // We attach the user object to the request, so all our protected routes can access it
      req.user = await User.findById(decoded.id).select('-password');

      next(); // Move on to the next function (the controller)
    } catch (error) {
      console.error(error);
      res.status(401); // Unauthorized
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
};

// A simple middleware to check if the user is an artisan
const isArtisan = (req, res, next) => {
    if (req.user && req.user.userType === 'Artisan') {
        next();
    } else {
        res.status(401);
        throw new Error('Not authorized as an artisan');
    }
}

export { protect, isArtisan };
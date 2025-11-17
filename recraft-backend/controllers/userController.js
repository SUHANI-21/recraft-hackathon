import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Helper function to generate a JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register a new user
// @route   POST /api/users
const registerUser = async (req, res) => {
  const { name, email, password, userType, contact } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }
    const user = await User.create({ name, email, password, userType, contact });
    if (user) {
      res.status(201).json({
        _id: user._id, 
        name: user.name, 
        email: user.email, 
        userType: user.userType, 
        profileImage: user.profileImage,
        contact: user.contact,
        token: generateToken(user._id),
      });
    } else {
      res.status(400); throw new Error('Invalid user data');
    }
  } catch (error) {
    res.status(res.statusCode || 500).json({ message: error.message });
  }
};

// @desc    Authenticate a user & get token
// @route   POST /api/users/login
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id, 
        name: user.name, 
        email: user.email, 
        userType: user.userType, 
        profileImage: user.profileImage,
        contact: user.contact,
        token: generateToken(user._id),
      });
    } else {
      res.status(401); throw new Error('Invalid email or password');
    }
  } catch (error) {
    res.status(res.statusCode || 500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
const updateUserProfile = async (req, res) => {
  try {
    console.log('Update profile request for user:', req.user._id);
    console.log('Request body:', req.body);
    
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.profileImage = req.body.profileImage || user.profileImage;
      if (user.userType === 'Artisan') {
        user.contact.phone = req.body.contact?.phone || user.contact.phone;
        user.contact.address = req.body.contact?.address || user.contact.address;
      }
      const updatedUser = await user.save();
      console.log('User profile updated successfully:', updatedUser._id);
      res.json({
        _id: updatedUser._id, name: updatedUser.name, email: updatedUser.email, userType: updatedUser.userType, profileImage: updatedUser.profileImage, contact: updatedUser.contact,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(res.statusCode || 500).json({ message: error.message });
  }
};

// @desc    Get all artisans
// @route   GET /api/users/artisans
const getArtisans = async (req, res) => {
  try {
    const artisans = await User.find({ userType: 'Artisan' }).select('-password');
    res.json(artisans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user by ID (for public profiles)
// @route   GET /api/users/:id
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(res.statusCode || 500).json({ message: error.message });
    }
};

export { registerUser, loginUser, updateUserProfile, getArtisans, getUserById };
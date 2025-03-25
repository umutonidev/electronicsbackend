// controllers/userController.js
import User from '../models/User.js';
import { generateToken } from '../utils/utils.js';

// User Registration
export const registerUser = async (req, res) => {
  try {
    const newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
    });

    const user = await newUser.save();
    res.status(201).send({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user),
    });
  } catch (error) {
    console.error(error);
    res.status(400).send({ message: 'Invalid user data', error: error.message });
  }
};

// User Login
export const loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (user && (await user.comparePassword(req.body.password))) {
      res.send({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user),
      });
      return;
    }

    res.status(401).send({ message: 'Invalid email or password' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Login failed', error: error.message });
  }
};

// Get User Profile (Requires Authentication)
export const getUserProfile = async (req, res) => {
    try {
      const user = await User.findById(req.user._id); // req.user is set by isAuth middleware

      if(user){
        res.send({
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          isAdmin: user.isAdmin,
          address: user.address,
          phoneNumber: user.phoneNumber
        });
      } else {
        res.status(404).send({message: "User not found"});
      }


    } catch (error) {
      console.error(error);
      res.status(500).send({message: "Failed to fetch profile", error: error.message});
    }
};

// Update User Profile (Requires Authentication)
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.firstName = req.body.firstName || user.firstName;
      user.lastName = req.body.lastName || user.lastName;
      user.email = req.body.email || user.email;
      user.address = req.body.address || user.address;
      user.phoneNumber = req.body.phoneNumber || user.phoneNumber;

      if (req.body.password) {
        user.password = req.body.password; // Will be hashed by pre-save middleware
      }

      const updatedUser = await user.save();
      res.send({
        _id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        address: updatedUser.address,
        phoneNumber: updatedUser.phoneNumber,
        token: generateToken(updatedUser),
      });
    } else {
      res.status(404).send({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(400).send({ message: 'Failed to update profile', error: error.message });
  }
};

//Get all users (Admin only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Failed to fetch users', error: error.message });
  }
};

//Delete user (Admin only)
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).send({ message: 'User Not Found' });
    }

    if (user.isAdmin) {
      return res.status(400).send({ message: 'Can Not Delete Admin User' });
    }

    await user.remove();
    res.send({ message: 'User Deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Failed to delete user', error: error.message });
  }
};

//Get User by Id (Admin only)
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      res.send(user);
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Failed to fetch user', error: error.message });
  }
};

//Update user (Admin only)
export const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      user.firstName = req.body.firstName || user.firstName;
      user.lastName = req.body.lastName || user.lastName;
      user.email = req.body.email || user.email;
      user.isAdmin = Boolean(req.body.isAdmin); // Ensure it's a boolean

      const updatedUser = await user.save();
      res.send({ message: 'User Updated', user: updatedUser });
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  } catch (error) {
    console.error(error);
    res.status(400).send({ message: 'Failed to update user', error: error.message });
  }
};
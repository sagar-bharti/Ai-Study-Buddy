import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// @route POST /api/auth/register
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      res.status(400);
      throw new Error("Please fill in all fields.");
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      res.status(400);
      throw new Error("Please provide a valid email address.");
    }

    if (password.length < 6) {
      res.status(400);
      throw new Error("Password must be at least 6 characters.");
    }

    if (password !== confirmPassword) {
      res.status(400);
      throw new Error("Passwords do not match.");
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error("An account with this email already exists.");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, password: hashedPassword });

    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    next(error);
  }
};

// @route POST /api/auth/login
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error("Please provide email and password.");
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      res.status(401);
      throw new Error("Invalid email or password.");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(401);
      throw new Error("Invalid email or password.");
    }

    res.json({
      success: true,
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    next(error);
  }
};

// @route GET /api/auth/me
export const getMe = async (req, res, next) => {
  try {
    res.json({ success: true, user: req.user });
  } catch (error) {
    next(error);
  }
};

// @route PUT /api/auth/profile
export const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, bio, avatar } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404);
      throw new Error("User not found.");
    }

    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (bio !== undefined) user.bio = bio;
    if (avatar !== undefined) user.avatar = avatar;

    await user.save();

    const updatedUser = await User.findById(user._id);

    res.json({ success: true, user: updatedUser });
  } catch (error) {
    next(error);
  }
};
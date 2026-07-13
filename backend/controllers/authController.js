const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

// @route POST /api/auth/login
// @access Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() })
      .select("+password")
      .populate("school", "name status");

    if (!user || !user.isActive) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Block login for school admins whose school hasn't been approved yet
    if (user.role === "schooladmin" && user.school?.status !== "approved") {
      return res.status(403).json({
        message: "Your school's registration is not yet approved by the Super Admin",
      });
    }

    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        school: user.school,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @route GET /api/auth/me
// @access Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate("school", "name status");
    res.json(user);
  } catch (err) {
    next(err);
  }
};

module.exports = { login, getMe };

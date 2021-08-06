const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authCtrl = {
  register: async (req, res) => {
    const { username, email, password, avatar, role, gender } = req.body;
    const user = await User.findOne({ username: username });
    if (user) return res.json({ message: "User already exist" });
    const emailUser = await User.findOne({ email: email });
    if (emailUser) return res.json({ message: "Email already exist" });
    if (password.length < 8)
      return res.json({ message: "Password must be at least 6 characters" });
    const newPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      username: username,
      email: email,
      password: newPassword,
      avatar: avatar,
      role: role,
      gender: gender,
    });
    const access_token = createAccessToken({ id: newUser._id });
    const refresh_token = createRefreshToken({ id: newUser._id });
    res.cookie("refreshtoken", refresh_token, {
      httpOnly: true,
      path: "/api/refresh_token",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30days
    });

    await newUser.save();
    return res.json({ success: true, accessToken });
  },
  login: async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.json({ message: "Fill all the field" });
    }
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.json({ message: "User is not exist." });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.json({ message: "User or password mismatch." });
    const accessToken = createAccessToken({ id: user._id });
    const refresh_token = createRefreshToken({ id: user._id });
    res.cookie("refreshtoken", refresh_token, {
      httpOnly: true,
      path: "/api/refresh_token",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30days
    });
    return res.json({ success: true, accessToken: accessToken });
  },
  logout: async (req, res) => {
    try {
      res.clearCookie("refreshtoken", { path: "/api/refresh_token" });
      return res.json({ msg: "Logged out!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};
const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN, { expiresIn: "1d" });
};

const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN, {
    expiresIn: "30d",
  });
};

module.exports = authCtrl;

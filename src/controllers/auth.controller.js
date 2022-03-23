const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

const router = express.Router();

const newToken = (user) => {
  return jwt.sign({ user }, process.env.JWT_SECRECT_KET);
};

router.post("/register", async (req, res) => {
  try {
    // 1. check if the email is already in user
    let user = await User.findOne({ email: req.body.email });
    // 2. if user exists, do not create a new user and inform that try with a different email
    if (user) {
      return res
        .status(400)
        .json("User already exists, try with a diferent email adddres");
    }
    // 3. if user does not exists, create one
    user = await User.create(req.body);

    let token = newToken(user);
    //
    return res.status(200).json({ token });
  } catch (err) {
    return res.status(500).json({ status: "failed", message: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    // 1. does user exists
    let user = await User.findOne({ email: req.body.email });
    // 2. if does not then return 400
    if (!user) {
      return res.status(400).json("User email or password is incorrect");
    }
    // 3. if exists then check if password is matching
    const matching = user.checkPassword(req.body.password);
    // 4. if not matching then throw 400
    if (!matching) {
      return res.status(400).json("User email or password is incorrect");
    }
    // 5. if matching then give him the token
    let token = newToken(user);
    return res.status(200).json({ token });
  } catch (err) {
    return res.status(500).json({ status: "failed", message: err.message });
  }
});

module.exports = router;

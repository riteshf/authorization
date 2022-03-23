const express = require("express");
const authCheck = require("../middlewares/auth.middleware");

const Product = require("../models/product.model");

const router = express.Router();

router.post("", authCheck, async (req, res) => {
  try {
    console.log(req.user);
    const product = await Product.create({
      ...req.body,
      user_id: req.user._id,
    });

    return res.send(product);
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

router.get("", async (req, res) => {
  try {
    const products = await Product.find();

    return res.send(products);
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

router.get("/my", authCheck, async (req, res) => {
  try {
    const products = await Product.find({ user_id: req.user._id });

    return res.send(products);
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

module.exports = router;

const express = require("express");
const authenticate = require("../middlewares/authenticate.middleware");
const authorise = require("../middlewares/authorise.middleware");

const Product = require("../models/product.model");

const router = express.Router();

router.post("", authenticate, async (req, res) => {
  try {
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

router.get("/my", authenticate, async (req, res) => {
  try {
    const products = await Product.find({ user_id: req.user._id });

    return res.send(products);
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

router.patch("/:id", authenticate, authorise(["owner"]), async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        user_id: req.user._id,
      },
      { new: true }
    );

    return res.send(product);
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

module.exports = router;

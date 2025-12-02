const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/shopping_cart");

// User Schema
const Users = mongoose.model("Users", {
  username: String,
  email: String,
  password: String,
  cartData: Object,
});

// Product Schema
const Product = mongoose.model("Product", {
  name: String,
  image: String,
  category: String,
  new_price: Number,
  old_price: Number,
});

// Storage for images
const storage = multer.diskStorage({
  destination: "./upload/images",
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage: storage });
app.use("/images", express.static("upload/images"));

// Signup
app.post("/signup", async (req, res) => {
  const check = await Users.findOne({ email: req.body.email });
  if (check) {
    return res.json({ success: false, errors: "User already exists" });
  }

  let cart = {};
  for (let i = 0; i < 300; i++) cart[i] = 0;

  const user = new Users({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    cartData: cart,
  });

  await user.save();

  const token = jwt.sign({ email: req.body.email }, "secret");
  res.json({ success: true, token });
});

// Login
app.post("/login", async (req, res) => {
  const user = await Users.findOne({
    email: req.body.email,
    password: req.body.password,
  });

  if (!user) {
    return res.json({ success: false, errors: "Invalid email or password" });
  }

  const token = jwt.sign({ email: req.body.email }, "secret");
  res.json({ success: true, token });
});

// Middleware
const fetchUser = async (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) return res.json({ success: false, errors: "Login first" });

  const data = jwt.verify(token, "secret");
  req.user = data.email;
  next();
};

// Add Product
app.post("/addproduct", upload.single("product"), async (req, res) => {
  const product = new Product({
    name: req.body.name,
    image: req.file.filename,
    category: req.body.category,
    new_price: req.body.new_price,
    old_price: req.body.old_price,
  });

  await product.save();
  res.json({ success: true });
});

// Get All Products
app.get("/allproduct", async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

// Add to Cart
app.post("/addtocart", fetchUser, async (req, res) => {
  const user = await Users.findOne({ email: req.user });
  user.cartData[req.body.itemId] += 1;
  await Users.findOneAndUpdate({ email: req.user }, { cartData: user.cartData });
  res.json({ success: true });
});

// Remove from Cart
app.post("/removefromcart", fetchUser, async (req, res) => {
  const user = await Users.findOne({ email: req.user });
  user.cartData[req.body.itemId] -= 1;
  await Users.updateOne({ email: req.user }, { cartData: user.cartData });
  res.json({ success: true });
});

// Get Cart Data
app.post("/getcart", fetchUser, async (req, res) => {
  const user = await Users.findOne({ email: req.user });
  res.json(user.cartData);
});

// Start Server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});

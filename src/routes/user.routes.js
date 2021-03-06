/*  */
/*  */
const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/User");
const { isNotAuthenticated } = require("../helpers/auth");

router.get("/user/signup", isNotAuthenticated, (req, res) => {
  res.render("users/signup");
});

router.post("/user/signup", async (req, res) => {
  const { name, email, password, passwordConfirm } = req.body;
  let errors = [];
  if (!name || !email || !password || !passwordConfirm) {
    errors.push({ text: "Please enter all fields" });
  }
  if (password != passwordConfirm) {
    errors.push({ text: "Passwords do not match" });
  }
  if (password < 6) {
    errors.push({ text: "Password must be at least 6 characters" });
  }
  if (errors.length > 0) {
    res.render("users/signup", {
      errors,
      name,
      email,
      password,
      passwordConfirm,
    });
  } else {
    const searchEmail = await User.findOne({ email: email });
    if (searchEmail) {
      errors.push({ text: "Email already exists" });
      res.render("users/signup", {
        errors,
        name,
        email,
        password,
        passwordConfirm,
      });
    } else {
      const newUser = new User({ name, email, password });
      newUser.password = await newUser.encryptPassword(password);
      await newUser.save();
      req.flash("successMessage", "You are registered successfully");
      res.redirect("/user/signin");
    }
  }
});

router.get("/user/signin", isNotAuthenticated, (req, res) => {
  res.render("users/signin");
});

router.post(
  "/user/signin",
  passport.authenticate("local", {
    successRedirect: "/note",
    failureRedirect: "/user/signin",
    failureFlash: true,
  })
);

/* logout */
router.get("/user/logout", (req, res) => {
  req.logout();
  req.flash("successMessage", "You are logged out now.");
  res.redirect("/");
});

module.exports = router;

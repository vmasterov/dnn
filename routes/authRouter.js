const express = require("express");
const router = express.Router();
const base = require("../helpers/baseUrl").url;
const auth = require(`${base}/middlewares/auth`);
const index = require(`${base}/helpers/authMethods/index`);
const login = require(`${base}/helpers/authMethods/login`);
const signup = require(`${base}/helpers/authMethods/signup`);
const logout = require(`${base}/helpers/authMethods/logout`);

router.get("/", auth, index);
router.post("/login", auth, express.urlencoded({ extended: false }), login);
router.post("/signup", auth, express.urlencoded({ extended: false }), signup);
router.get("/logout", auth, logout);

module.exports = router;

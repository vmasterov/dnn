const express = require("express");
const router = express.Router();
const base = require("../helpers/baseUrl").url;
const auth = require(`${base}/middlewares/auth`);
const index = require(`${base}/helpers/dashboardMethods/index`);

router.get("/", auth, index);

module.exports = router;

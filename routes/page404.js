const express = require("express");
const router = express.Router();
const base = require("../helpers/baseUrl").url;
const index = require(`${base}/helpers/page404/index`);

router.get("*", index);

module.exports = router;

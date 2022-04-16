const base = require("../../helpers/baseUrl").url;
const redirectIfAuth = require(`${base}/helpers/redirectIfAuth`);
const gitAuth = require(`${base}/helpers/authMethods/gitAuth`);
const { DASHBOARD_URL } = require(`${base}/helpers/constants`);

const index = async (req, res) => {
  if (redirectIfAuth(req, res, DASHBOARD_URL)) return;

  if (req.query.code) {
    try {
      return await gitAuth(req, res);
    } catch (error) {
      console.error(error);
      return res.redirect("/?authError=Git auth error");
    }
  }

  const options = {
    user: req.user,
    authError: req.query.authError,
  };

  const headers = {
    "Cache-Control": "no-cache, no-store, must-revalidate",
    Pragma: "no-cache",
    Expires: "0",
  };

  res.set(headers).render("index", options);
};

module.exports = index;

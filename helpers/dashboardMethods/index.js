const base = require("../../helpers/baseUrl").url;
const redirectIfNotAuth = require(`${base}/helpers/redirectIfNotAuth`);

const index = (req, res) => {
  if (redirectIfNotAuth(req, res, "/")) return;

  const headers = {
    "Cache-Control": "no-cache, no-store, must-revalidate",
    Pragma: "no-cache",
    Expires: "0",
  };

  res.set(headers).render("dashboard", { user: req.user });
};

module.exports = index;

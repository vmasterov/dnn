const base = require("../../helpers/baseUrl").url;
const { findUserByUsername, createSession } = require(`${base}/DB`);
const hash = require(`${base}/helpers/hash`);
const redirectIfAuth = require(`${base}/helpers/redirectIfAuth`);
const { DASHBOARD_URL, MAX_AGE } = require(`${base}/helpers/constants`);

const login = async (req, res) => {
  if (redirectIfAuth(req, res, DASHBOARD_URL)) return;

  const { username, password } = req.body;

  if (!username || !password) {
    return res.redirect("/?authError=Wrong username or password");
  }

  const user = await findUserByUsername(username);

  if (!user || user.password !== hash(password)) {
    return res.redirect("/?authError=Wrong username or password");
  }

  try {
    const { sessionId } = await createSession(user.id);
    res.cookie("sessionId", sessionId, { httpOnly: true, MAX_AGE }).redirect(DASHBOARD_URL);
  } catch (error) {
    console.error(error);
    return res.redirect("/?authError=Server error");
  }
};

module.exports = login;

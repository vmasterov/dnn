const base = require("../../helpers/baseUrl").url;
const { signupUser } = require(`${base}/DB`);
const CustomError = require(`${base}/CustomError`);
const redirectIfAuth = require(`${base}/helpers/redirectIfAuth`);
const createFirstNote = require(`${base}/helpers/createFirstNote`);
const { DASHBOARD_URL, MAX_AGE } = require(`${base}/helpers/constants`);

const signup = async (req, res) => {
  if (redirectIfAuth(req, res, DASHBOARD_URL)) return;

  try {
    const { username, password } = req.body;

    if (!username || !password) {
      throw new CustomError("Username or password is undefined");
    }

    const { sessionId, userId } = await signupUser(username, password);

    await createFirstNote(userId);

    res.cookie("sessionId", sessionId, { httpOnly: true, MAX_AGE }).redirect(DASHBOARD_URL);
  } catch (error) {
    console.error(error);
    switch (error.code) {
      case "23505":
        return res.redirect("/?authError=User already exist");
      case "1":
        return res.redirect("/?authError=Wrong username or password");
      default:
        return res.redirect("/?authError=Server error");
    }
  }
};

module.exports = signup;

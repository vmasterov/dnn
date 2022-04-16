require("dotenv").config();
const axios = require("axios");
const base = require("../../helpers/baseUrl").url;
const authGitUser = require(`${base}/helpers/authMethods/authGitUser`);
const createFirstNote = require(`${base}/helpers/createFirstNote`);
const { DASHBOARD_URL, MAX_AGE } = require(`${base}/helpers/constants`);
const CustomError = require(`${base}/CustomError`);

const gitAuth = async (req, res) => {
  try {
    const tokenOptions = {
      method: "POST",
      url: "https://github.com/login/oauth/access_token",
      headers: {
        Accept: "application/json",
      },
      data: {
        client_id: process.env.GIT_USER_ID,
        client_secret: process.env.GIT_USER_SECRET,
        code: req.query.code,
      },
    };
    const token = await axios(tokenOptions);
    const { access_token } = token.data;

    const userOptions = {
      method: "GET",
      url: "https://api.github.com/user",
      headers: {
        Authorization: `token ${access_token}`,
        "user-agent": "node.js",
      },
    };
    const { data: userInfo } = await axios(userOptions);
    const { sessionId, userId } = await authGitUser(userInfo);

    if (userId) {
      await createFirstNote(userId);
    }

    return res.cookie("sessionId", sessionId, { httpOnly: true, MAX_AGE }).redirect(DASHBOARD_URL);
  } catch (error) {
    console.error(error);
    throw new CustomError("Git auth error");
  }
};

module.exports = gitAuth;

const base = require("../../helpers/baseUrl").url;
const { deleteSession } = require(`${base}/DB`);

const logout = async (req, res) => {
  if (!req.sessionId) return res.redirect("/");

  try {
    await deleteSession(req.sessionId);
    res.clearCookie("sessionId").redirect("/");
  } catch (error) {
    console.error(error);
    return res.redirect("/?authError=Server error");
  }
};

module.exports = logout;

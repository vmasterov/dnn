const { findUserBySessionId } = require("../DB");

const auth = async (req, res, next) => {
  const session = req.cookies.sessionId || {};

  if (!session) {
    return next();
  }

  req.user = await findUserBySessionId(session);
  req.sessionId = session;
  return next();
};

module.exports = auth;

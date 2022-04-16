const redirectIfNotAuth = (req, res, url) => {
  if (!req.sessionId || !req.user) {
    res.redirect(url);
    return true;
  }

  return false;
};

module.exports = redirectIfNotAuth;

const base = require("../../helpers/baseUrl").url;
const hash = require(`${base}/helpers/hash`);
const CustomError = require(`${base}/CustomError`);
const { findUserByUsername, createSession, signupUser } = require(`${base}/DB`);

const authGitUser = async ({ login, id }) => {
  const username = login;
  const password = `git${username}${id}`;

  if (!username) {
    throw new CustomError("Username are empty");
  }

  const user = await findUserByUsername(username);

  try {
    if (user && user.password === hash(password)) {
      return await createSession(user.id);
    } else {
      return await signupUser(username, password);
    }
  } catch (error) {
    console.error(error);
  }
};

module.exports = authGitUser;

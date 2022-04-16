const base = require("../../helpers/baseUrl").url;
const { findAllUserNotes } = require(`${base}/DB`);
const redirectIfNotAuth = require(`${base}/helpers/redirectIfNotAuth`);
const isShowMore = require(`${base}/helpers/isShowMore`);
const errorHandler = require(`${base}/helpers/errorHandler`);

const getUsersNotes = async (req, res) => {
  if (redirectIfNotAuth(req, res, "/")) return;

  try {
    const options = {
      userId: req.user.id,
      age: req.query.age,
      search: req.query.search,
      page: req.query.page,
      limit: req.query.limit,
      offsetCount: req.query.limit * (req.query.page - 1),
    };

    const allUserNotes = await findAllUserNotes(options);

    const status = 200;
    return res.status(status).send({
      data: allUserNotes,
      hasMore: isShowMore(options, allUserNotes),
      status,
    });
  } catch (error) {
    errorHandler(res, error, 500);
  }
};

module.exports = getUsersNotes;

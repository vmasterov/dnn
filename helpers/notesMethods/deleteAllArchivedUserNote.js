const base = require("../../helpers/baseUrl").url;
const { deleteAllArchivedNote } = require(`${base}/DB`);
const redirectIfNotAuth = require(`${base}/helpers/redirectIfNotAuth`);
const errorHandler = require(`${base}/helpers/errorHandler`);
const CustomError = require(`${base}/CustomError`);

const deleteAllArchivedUserNote = async (req, res) => {
  if (redirectIfNotAuth(req, res, "/")) return;

  try {
    const userId = req.user.id;

    if (!userId) {
      throw new CustomError("User ID is undefined");
    }

    const delCount = await deleteAllArchivedNote(userId);

    if (!delCount) {
      throw new CustomError("Archived notes was not deleted");
    }

    const status = 200;
    res.status(status).send({ data: { success: true }, status });
  } catch (error) {
    errorHandler(res, error, 500);
  }
};

module.exports = deleteAllArchivedUserNote;

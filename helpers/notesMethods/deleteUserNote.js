const base = require("../../helpers/baseUrl").url;
const { deleteNote } = require(`${base}/DB`);
const redirectIfNotAuth = require(`${base}/helpers/redirectIfNotAuth`);
const errorHandler = require(`${base}/helpers/errorHandler`);
const CustomError = require(`${base}/CustomError`);

const deleteUserNote = async (req, res) => {
  if (redirectIfNotAuth(req, res, "/")) return;

  try {
    const delCount = await deleteNote(req.params.id);

    if (!delCount) {
      throw new CustomError(`Note with id ${req.params.id} was not deleted. Only archived notes can be deleted`);
    }

    const status = 200;
    res.status(status).send({ data: { success: true }, status });
  } catch (error) {
    errorHandler(res, error, 500);
  }
};

module.exports = deleteUserNote;

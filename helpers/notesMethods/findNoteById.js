const base = require("../../helpers/baseUrl").url;
const { findUserNoteById } = require(`${base}/DB`);
const redirectIfNotAuth = require(`${base}/helpers/redirectIfNotAuth`);
const errorHandler = require(`${base}/helpers/errorHandler`);
const CustomError = require(`${base}/CustomError`);

const findNodeById = async (req, res) => {
  if (redirectIfNotAuth(req, res, "/")) return;

  try {
    const noteId = req.params.id;

    const note = await findUserNoteById(noteId);

    if (!note) {
      throw new CustomError(`Note with id ${noteId} is not exist`);
    }

    const status = 200;
    res.status(status).send({ data: note, status });
  } catch (error) {
    errorHandler(res, error, 500);
  }
};

module.exports = findNodeById;

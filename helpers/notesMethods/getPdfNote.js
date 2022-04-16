const base = require("../../helpers/baseUrl").url;
const redirectIfNotAuth = require(`${base}/helpers/redirectIfNotAuth`);
const { findUserNoteById } = require(`${base}/DB`);
const errorHandler = require(`${base}/helpers/errorHandler`);
const getPdf = require(`${base}/helpers/getPdf`);
const CustomError = require(`${base}/CustomError`);

const getPdfNote = async (req, res) => {
  if (redirectIfNotAuth(req, res, "/")) return;

  try {
    const noteId = req.params.id;

    if (!noteId) {
      throw new CustomError("Note id is empty");
    }

    const note = await findUserNoteById(noteId);

    if (!note) {
      throw new CustomError(`Note with id ${noteId} is not exist`);
    }

    const pdfData = await getPdf(note);

    const status = 200;
    res.status(status).send({ data: pdfData, status });
  } catch (error) {
    errorHandler(res, error, 500);
  }
};

module.exports = getPdfNote;

const base = require("../../helpers/baseUrl").url;
const { archiveUnarchiveNote } = require(`${base}/DB`);
const redirectIfNotAuth = require(`${base}/helpers/redirectIfNotAuth`);
const errorHandler = require(`${base}/helpers/errorHandler`);
const CustomError = require(`${base}/CustomError`);

const archiveUnarchiveUserNote = async (req, res) => {
  if (redirectIfNotAuth(req, res, "/")) return;

  try {
    const note = await archiveUnarchiveNote(req.body.is_archive, req.params.id);

    if (!note) {
      throw new CustomError(`Note with id ${req.params.id} is not exist`);
    }

    const status = 200;
    res.status(status).send({ data: note, status });
  } catch (error) {
    errorHandler(res, error, 500);
  }
};

module.exports = archiveUnarchiveUserNote;

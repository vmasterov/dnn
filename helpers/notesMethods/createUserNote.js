const showdown = require("showdown");
const base = require("../../helpers/baseUrl").url;
const { createNote } = require(`${base}/DB`);
const redirectIfNotAuth = require(`${base}/helpers/redirectIfNotAuth`);
const errorHandler = require(`${base}/helpers/errorHandler`);

const createUserNote = async (req, res) => {
  if (redirectIfNotAuth(req, res, "/")) return;

  if (!req.body.title || !req.body.text) {
    errorHandler(res, { message: "Title or Text fields are empty" }, 500);
    return;
  }

  try {
    const converter = new showdown.Converter();
    const html = converter.makeHtml(req.body.text);

    const noteData = {
      user_id: req.user.id,
      title: req.body.title,
      text: req.body.text,
      html,
    };

    const note = await createNote(noteData);
    const status = 200;
    res.status(status).send({ data: note, status });
  } catch (error) {
    errorHandler(res, error, 500);
  }
};

module.exports = createUserNote;

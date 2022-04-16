const path = require("path");
const showdown = require("showdown");
const base = require("../helpers/baseUrl").url;
const readFile = require(`${base}/helpers/readFile`);
const { createNote } = require(`${base}/DB`);

const createFirstNote = async (userId) => {
  const firstNotePath = path.resolve(process.cwd(), "firstNote.md");
  const text = await readFile(firstNotePath);
  const converter = new showdown.Converter();
  const html = converter.makeHtml(text);

  const noteData = {
    user_id: userId,
    title: "Demo",
    text,
    html,
  };

  await createNote(noteData);
};

module.exports = createFirstNote;

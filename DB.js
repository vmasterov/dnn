require("dotenv").config();

const { nanoid } = require("nanoid");
const knex = require("knex")({
  client: "pg",
  connection: process.env.DB_URL,
});
const subMonths = require("date-fns/subMonths");
const subWeeks = require("date-fns/subWeeks");
const base = require("./helpers/baseUrl").url;
const hash = require(`${base}/helpers/hash`);
const CustomError = require(`${base}/CustomError`);

const findUserByUsername = async (name) => {
  return await knex("users").where("user_name", name).first();
};

const findUserBySessionId = async (sessionId) => {
  const session = await knex("sessions").where("session", sessionId).first();

  if (!session) {
    return;
  }

  const userId = session.user_id;
  return await knex("users").where("id", userId).first();
};

const signupUser = async (username, password) => {
  return await knex.transaction(async (trx) => {
    const userInsert = { user_name: username, password: hash(password) };
    const [{ id: userId }] = await trx("users").insert(userInsert, "id");

    const sessionInsert = { user_id: userId, session: nanoid() };
    const [{ session: sessionId }] = await trx("sessions").insert(sessionInsert, "session");

    return { sessionId, userId };
  });
};

const createSession = async (userId) => {
  if (!userId) {
    throw new CustomError("User id is undefined");
  }

  const insert = { user_id: userId, session: nanoid() };
  const [{ session: sessionId }] = await knex("sessions").insert(insert, "session");

  if (!sessionId) {
    throw new CustomError("Session does not exist");
  }

  return { sessionId };
};

const deleteSession = async (sessionId) => {
  await knex("sessions").where("session", sessionId).del();
};

const _findQuery = ({ userId, age, limit, offsetCount }) => {
  let from;
  let to = new Date().toISOString();

  let select = "SELECT *, count(*) OVER() AS full_count FROM notes";
  let whereUserId = `WHERE user_id = ${userId}`;
  let whereNotArchive = "is_archive = false";
  let where = `${whereUserId} AND ${whereNotArchive}`;
  let offset = `ORDER BY created_at desc LIMIT ${limit} OFFSET ${offsetCount};`;

  switch (age) {
    case "1week":
      from = subWeeks(new Date(), 1).toISOString();
      where = `${whereUserId} AND ${whereNotArchive} AND (created_at BETWEEN '${from}' AND '${to}')`;
      break;
    case "1month":
      from = subMonths(new Date(), 1).toISOString();
      where = `${whereUserId} AND ${whereNotArchive} AND (created_at BETWEEN '${from}' AND '${to}')`;
      break;
    case "3months":
      from = subMonths(new Date(), 3).toISOString();
      where = `${whereUserId} AND ${whereNotArchive} AND (created_at BETWEEN '${from}' AND '${to}')`;
      break;
    case "archive":
      where = `${whereUserId} AND is_archive = true`;
      break;
  }

  return `${select} ${where} ${offset}`;
};

const _searchQuery = ({ search, limit, offsetCount, userId }) => {
  return `SELECT *, ts_headline('russian', title, q, 'StartSel = <mark>, StopSel = </mark>') as highlights
    FROM (
        SELECT * FROM notes, plainto_tsquery('russian', '${search}') q
        WHERE to_tsvector('russian', title) @@ q AND user_id = ${userId}
        ORDER BY created_at desc LIMIT ${limit} OFFSET ${offsetCount}
   ) AS foo;`;
};

const findAllUserNotes = async (data) => {
  const query = data.search ? _searchQuery(data) : _findQuery(data);
  const { rows } = await knex.raw(query);
  return rows;
};

const createNote = async (note) => {
  const noteArray = await knex("notes").insert(note).returning("*");
  return noteArray[0];
};

const updateNote = async ({ id, user_id, title, text, html }) => {
  const update = {
    id,
    user_id,
    title,
    text,
    html,
    updated_at: new Date().toISOString(),
  };

  const noteArray = await knex("notes").where({ id }).update(update).returning("*");
  return noteArray[0];
};

const findUserNoteById = async (noteId) => {
  return await knex("notes").where({ id: noteId }).first();
};

const archiveUnarchiveNote = async (is_archive, id) => {
  const noteArray = await knex("notes")
    .where({ id })
    .update({ is_archive, updated_at: new Date().toISOString() })
    .returning("*");

  return noteArray[0];
};

const deleteNote = async (id) => {
  return await knex("notes").where({ id, is_archive: true }).del();
};

const deleteAllArchivedNote = async (user_id) => {
  return await knex("notes").where({ user_id, is_archive: true }).del();
};

module.exports = {
  findUserByUsername,
  findUserBySessionId,
  signupUser,
  createSession,
  deleteSession,
  findAllUserNotes,
  createNote,
  updateNote,
  findUserNoteById,
  archiveUnarchiveNote,
  deleteNote,
  deleteAllArchivedNote,
};

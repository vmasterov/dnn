const express = require("express");
const router = express.Router();
const base = require("../helpers/baseUrl").url;
const auth = require(`${base}/middlewares/auth`);

const getUsersNotes = require(`${base}/helpers/notesMethods/getUsersNotes`);
const createUserNote = require(`${base}/helpers/notesMethods/createUserNote`);
const updateUserNote = require(`${base}/helpers/notesMethods/updateUserNote`);
const findNoteById = require(`${base}/helpers/notesMethods/findNoteById`);
const archiveUnarchiveUserNote = require(`${base}/helpers/notesMethods/archiveUnarchiveUserNote`);
const deleteUserNote = require(`${base}/helpers/notesMethods/deleteUserNote`);
const deleteAllArchivedUserNote = require(`${base}/helpers/notesMethods/deleteAllArchivedUserNote`);
const getPdfNote = require(`${base}/helpers/notesMethods/getPdfNote`);

router.get("/", auth, getUsersNotes);
router.post("/", auth, createUserNote);
router.patch("/", auth, updateUserNote);
router.get("/:id", auth, findNoteById);
router.patch("/:id", auth, archiveUnarchiveUserNote);
router.delete("/:id", auth, deleteUserNote);
router.delete("/", auth, deleteAllArchivedUserNote);
router.get("/:id/pdf", auth, getPdfNote);

module.exports = router;

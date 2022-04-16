const fs = require("fs/promises");

const readFile = async (path) => {
  try {
    return await fs.readFile(path, "utf8");
  } catch (error) {
    return false;
  }
};

module.exports = readFile;

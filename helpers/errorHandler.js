const base = require("../helpers/baseUrl").url;
const logger = require(`${base}/helpers/logger`);

const errorHandler = (res, error, status) => {
  logger.error(error);
  console.error(error);
  res.status(status).send(`${error.message}. Status code: ${status}`);
};

module.exports = errorHandler;

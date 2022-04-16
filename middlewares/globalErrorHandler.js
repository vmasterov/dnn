const base = require("../helpers/baseUrl").url;
const logger = require(`${base}/helpers/logger`);

// eslint-disable-next-line no-unused-vars
const globalErrorHandler = (err, req, res, next) => {
  logger.error(err);
  console.error(err);
  const status = 500;
  res.status(status).send(`Internal server error. Status: ${status}`);
};

module.exports = globalErrorHandler;

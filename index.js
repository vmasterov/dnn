require("dotenv").config();

const base = require("./helpers/baseUrl");
base.addUrl(__dirname);

const express = require("express");
const nunjucks = require("nunjucks");
const cookieParser = require("cookie-parser");
const httpLogger = require(`${base.url}/middlewares/httpLogger`);
const logger = require(`${base.url}/helpers/logger`);
const authRouter = require(`${base.url}/routes/authRouter`);
const dashboardRouter = require(`${base.url}/routes/dashboardRouter`);
const notesRouter = require(`${base.url}/routes/notesRouter`);
const page404 = require(`${base.url}/routes/page404`);
const globalErrorHandler = require(`${base.url}/middlewares/globalErrorHandler`);
const { DASHBOARD_URL, API_URL } = require(`${base.url}/helpers/constants`);

const app = express();

nunjucks
  .configure("views", {
    autoescape: true,
    express: app,
  })
  .addGlobal("userId", process.env.GIT_USER_ID);

app.set("view engine", "njk");

app.use(express.json());
app.use(express.static("public"));
app.use(cookieParser());
app.use(httpLogger);

app.use("/", authRouter);
app.use(DASHBOARD_URL, dashboardRouter);
app.use(API_URL, notesRouter);
app.use(page404);

app.use(globalErrorHandler);

const port = process.env.PORT || 3001;

app.listen(port, () => {
  logger.info(`Listening on http://localhost:${port}`);
});

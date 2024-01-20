import express from "express";
const OAuthServer = require("express-oauth-server");
const methodOverride = require("method-override");
const compression = require("compression");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");

const UnauthorizedRequestError = require("oauth2-server/lib/errors/unauthorized-request-error.js");

import { processRoutePath, OAuthModel } from "./plugins/index.js";
import formidableMiddleware from "./plugins/formidable/index.js";
import customConfig from "./plugins/custom-config/index.js";
import AppError from "./plugins/app-error/index.js";

import mongodbManager from "./db.js";

import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(helmet()); // security
app.use(compression()); // nén data trước khi gửi về  client
app.use(express.static(`${__dirname}/public`));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("X-HTTP-Method-Override"));
app.use(cors());
app.options("*", cors());

/** Response formatter */
customConfig(app);

/** Log HTTP requests */
if (process.env.APP_ENV !== "local") {
  morgan.token("req-headers", (req, res) => {
    return JSON.stringify(req.headers);
  });
  app.use(
    morgan(
      ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :req-headers'
    )
  );
} else {
  app.use(morgan("tiny"));
}

/** oauth2-server */
app.oauth = new OAuthServer({
  model: OAuthModel,
  grants: ["password"],
  useErrorHandler: true,
  continueMiddleware: false,
  accessTokenLifetime: 24 * 30 * 3600, // 30 days
});

const host = process.env.LISTEN_HOST || "localhost";
const port = parseInt(process.env.LISTEN_PORT || "3002", 10);

// Ứng dung singleton pattern trong kết nối db
mongodbManager.connect(async () => {
  await processRoutePath(app, `${__dirname}/routes`, {
    prefix: "",
    middlewares: formidableMiddleware,
  });

  app.use((err, req, res, next) => {
    if (res.headersSent) {
      return next();
    }

    if (err instanceof AppError) {
      console.log("AppError:", err);
      return res.formatter.unprocess(
        err.messages || err,
        err.stack,
        undefined,
        err.httpCode
      );
    }

    if (err instanceof UnauthorizedRequestError) {
      // nếu là lỗi thuộc authorized
      return res.formatter.unauthorized(err.message || err, err.stack);
    }
    // eslint-disable-next-line no-console
    console.log("Server Error:", err);
    return res.formatter.serverError(
      err.message || "Internal Server Error",
      err.stack
    );
  });

  app.listen(port, host, () => {
    console.log(`App listening on: http://${host}:${port}`);
  });
});

process.on("uncaughtException", (err, origin) => {
  console.log("******* Uncaught Exception *******");
  console.log(err);
});

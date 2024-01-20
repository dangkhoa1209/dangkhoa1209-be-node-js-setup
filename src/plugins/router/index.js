import * as express from "express";
import middlewareRequest from "../../middleware/request";
import { errorHandler } from "../error-handler";
import setAuthUser from "../../middleware/set-auth-user";
import limiter from "../../middleware/limiter/index.js";

export const guestRouter = (app) => express.Router();

export const authRouter = (app) => {
  const temp = express.Router();
  temp.use(limiter());
  temp.use(app.oauth.authenticate());
  temp.use(errorHandler);
  temp.use(setAuthUser);
  temp.use(middlewareRequest);
  return temp;
};

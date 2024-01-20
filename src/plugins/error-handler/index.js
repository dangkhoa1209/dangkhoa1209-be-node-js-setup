import { validationResult } from "express-validator";

const errorHandler = (req, res, next) => {
  if (res.headersSent) {
    return next();
  }
  const result = validationResult(req);

  if (!result.isEmpty()) {
    return res.formatter.unprocess(result.array());
  }
  next();
};
export { errorHandler };

import { rateLimit } from "express-rate-limit";
import dotenv from "dotenv";
dotenv.config();

const apiLimiter = (windowMs, limit, message) => {
  return rateLimit({
    windowMs: windowMs || 15 * 60 * 1000, // 15 minutes
    max: limit || 2, // requests
    handler: function (req, res) {
      return res.formatter.tooManyRequests();
    },
    skip: (req, res) => {
      if (process.env.APP_ENV !== "develop") {
        return false;
      }

      return true;
    },
  });
};

export default apiLimiter;

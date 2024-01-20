import { guestRouter } from "../../plugins/index";
import { validationLogin, register } from "../../controllers/auth";
import { errorHandler } from "../../plugins/error-handler";

export default (app) => {
  const router = guestRouter(app);

  router.post("/register", register);

  router.post(
    "/token",
    validationLogin,
    app.oauth.token({ allowExtendedTokenAttributes: true }),
    errorHandler
  );

  return router;
};

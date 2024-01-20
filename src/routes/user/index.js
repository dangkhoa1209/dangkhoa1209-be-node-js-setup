import AppError from "../../plugins/app-error";
import { authRouter } from "../../plugins/index";

export default (app) => {
  const router = authRouter(app);

  router.get("", async (req, res) => {
    throw new Error("khoa");
    return res.formatter.ok(req.user);
  });
  return router;
};

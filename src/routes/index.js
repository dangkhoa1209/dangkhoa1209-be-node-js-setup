import { guestRouter } from "../plugins/index";

export default (app) => {
  const router = guestRouter(app);
  router.get("/test", async (req, res) => {
    res.formatter.ok(req.user);
  });
  return router;
};

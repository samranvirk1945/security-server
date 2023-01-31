module.exports = (app, libs) => {
  const router = app.Router();

  router.post("/register", async (req, res) => {
    const result = await libs.Auth.registerUser(req);
    return res.status(result.code).json(result);
  });
  router.post("/superAdminCreate", async (req, res) => {
    const result = await libs.Auth.superAdminCreate(req);
    return res.status(result.code).json(result);
  });
  router.post("/subAdminCreate", async (req, res) => {
    const result = await libs.Auth.subAdminCreate(req);
    return res.status(result.code).json(result);
  });

  
  router.post("/otp", async (req, res) => {
    const result = await libs.Auth.otp(req);
    return res.status(result.code).json(result);
  });
  router.post("/passwordForget", async (req, res) => {
    const result = await libs.Auth.passwordForget(req);
    return res.status(result.code).json(result);
  });
  router.post("/login", async (req, res) => {
    const result = await libs.Auth.loginUser(req);
    return res.status(result.code).json(result);
  });
  router.post("/notificationSend", async (req, res) => {
    const result = await libs.Auth.notificationSend(req);
    return res.status(result.code).json(result);
  });
  return router;
};

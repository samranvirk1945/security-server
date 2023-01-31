module.exports = (app, libs) => {
    const router = app.Router();
  
    router.post("/create", async (req, res) => {
      const result = await libs.Right.create(req);
      return res.status(result.code).json(result);
    });
    router.get("/getAll", async (req, res) => {
      const result = await libs.Right.getAll(req);
      return res.status(result.code).json(result);
    });
    return router;
  };
  
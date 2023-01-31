module.exports = (app, libs) => {
    const router = app.Router();
  
    router.post("/createSubAdmin", async (req, res) => {
      const result = await libs.User.createSubAdmin(req);
      return res.status(result.code).json(result);
    });
    router.get("/getAll", async (req, res) => {
      const result = await libs.User.getAll(req);
      return res.status(result.code).json(result);
    });
    router.get("/getSubAmins", async (req, res) => {
      const result = await libs.User.getSubAmins(req);
      return res.status(result.code).json(result);
    });
    router.get("/getById/:id", async (req, res) => {
      const result = await libs.User.getById(req);
      return res.status(result.code).json(result);
    });
    router.delete("/delete/:id", async (req, res) => {
      const result = await libs.User.delete(req);
      return res.status(result.code).json(result);
    });
    router.put("/updateProfile", async (req, res) => {
      const result = await libs.User.updateProfile(req);
      return res.status(result.code).json(result);
    });
    router.put("/updateUserByAdmin/:id", async (req, res) => {
      const result = await libs.User.updateUserByAdmin(req);
      return res.status(result.code).json(result);
    });


    
    return router;
  };
  
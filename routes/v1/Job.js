module.exports = (app, libs) => {
    const router = app.Router();
  
    router.post("/create", async (req, res) => {
      const result = await libs.Job.create(req);
      return res.status(result.code).json(result);
    });
    router.put("/update/:id", async (req, res) => {
      const result = await libs.Job.update(req);
      return res.status(result.code).json(result);
    });
    router.post("/book/:id", async (req, res) => {
      const result = await libs.Job.book(req);
      return res.status(result.code).json(result);
    });
    router.delete("/delete/:id", async (req, res) => {
      const result = await libs.Job.delete(req);
      return res.status(result.code).json(result);
    });
    router.put("/start/:id", async (req, res) => {
      const result = await libs.Job.start(req);
      return res.status(result.code).json(result);
    });
    router.put("/cancel/:id", async (req, res) => {
      const result = await libs.Job.cancel(req);
      return res.status(result.code).json(result);
    });
    router.put("/completed/:id", async (req, res) => {
      const result = await libs.Job.completed(req);
      return res.status(result.code).json(result);
    });
    router.get("/getAll", async (req, res) => {
      const result = await libs.Job.getAll(req);
      return res.status(result.code).json(result);
    });
    router.get("/getAllHistory", async (req, res) => {
      const result = await libs.Job.getAllHistory(req);
      return res.status(result.code).json(result);
    });
    router.get("/getAllbookedJobs", async (req, res) => {
      const result = await libs.Job.getAllBooked(req);
      return res.status(result.code).json(result);
    });
    router.get("/getAllOngoing", async (req, res) => {
      const result = await libs.Job.getAllOngoing(req);
      return res.status(result.code).json(result);
    });
    router.get("/jobHistoryUser", async (req, res) => {
      const result = await libs.Job.jobHistoryUser(req);
      return res.status(result.code).json(result);
    });
    router.get("/getAllUsersBookedJob/:id", async (req, res) => {
      const result = await libs.Job.getAllUsersBookedJob(req);
      return res.status(result.code).json(result);
    });

    
    return router;
  };
  
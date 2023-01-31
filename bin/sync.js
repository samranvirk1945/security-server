const model = require('../models');

//model.sequelize.sync({ force: true });
model.sequelize.sync({ alter: true });

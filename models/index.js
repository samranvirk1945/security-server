// Packages
const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");

const env = process.env.NODE_ENV || "development";

const basename = path.basename(__filename);
const config = require(`./config.json`)[env];
const db = {};
const constant = require("../constants");
let sequelize;
// if (config.use_env_variable) {
//   sequelize = new Sequelize(process.env[config.use_env_variable], config);
// } else {
sequelize = new Sequelize({
  username: "ug1hirpd4yjexfqevgg9",
  password: "x9CnQdcVrupbpwFNo1hm",
  database: "bv0d95fcevcmsficiivp",
  host: "bv0d95fcevcmsficiivp-postgresql.services.clever-cloud.com",
  dialect: "postgres",
  
  // username: "postgres",
  // password: "admin",
  // database: "security",
  // host: "localhost",
  // dialect: "postgres",
});
// }
sequelize
  .authenticate()
  .then(() => {
    console.log(constant.strings.db.success);
  })
  .catch((err) => {
    console.error(constant.strings.db.err, err);
  });

fs.readdirSync(__dirname)
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  )
  .forEach((file) => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

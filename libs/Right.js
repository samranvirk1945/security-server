const httpStatus = require("http-status-codes");
const { hashing, JWT } = require("../utils/index");
const models = require("../models/index");
const email = require("../services/email");
const constant = require("../constants");
const Sequelize = require('sequelize');
const notification = require("../services/notification");

module.exports = {
  create: async (req) => {
    let transaction;
    try {
      transaction = await models.sequelize.transaction();
      const { body } = req;
      const errors = { flag: false };
      let user = await models.Right.create(body, { transaction });
      await transaction.commit();
      return {
        status: true,
        code: httpStatus.OK,
        message: constant.strings.response.success.signup,
        data:user,
      };
    } catch (err) {
      if (transaction) await transaction.rollback();
      return {
        status: false,
        code: httpStatus.BAD_REQUEST,
        message: err.message,
        error: err,
      };
    }
  },

  getAll: async (req) => {
    let transaction;
    try {
      transaction = await models.sequelize.transaction();
      const { body } = req;
      const errors = { flag: false };
      let user = await models.Right.getAll();
      await transaction.commit();
      return {
        status: true,
        code: httpStatus.OK,
        message: constant.strings.response.success.signup,
        data:user,
      };
    } catch (err) {
      if (transaction) await transaction.rollback();
      return {
        status: false,
        code: httpStatus.BAD_REQUEST,
        message: err.message,
        error: err,
      };
    }
  }

};

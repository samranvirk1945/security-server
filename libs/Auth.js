const httpStatus = require("http-status-codes");
const { hashing, JWT } = require("../utils/index");
const models = require("../models/index");
const email = require("../services/email");
const constant = require("../constants");
const Sequelize = require('sequelize');
const notification = require("../services/notification");

module.exports = {
  registerUser: async (req) => {
    let transaction;
    try {
      transaction = await models.sequelize.transaction();
      const { body } = req;
      body.type = 3
      const errors = { flag: false };
      const userData = await models.User.byEmail(req.body);
      if (userData) {
        if (transaction) await transaction.rollback();
        return {
          status: false,
          code: httpStatus.BAD_REQUEST,
          message: constant.strings.response.error.email_exist,
        };
      }
      if (!body.email) {
        if (transaction) await transaction.rollback();
        return {
          status: false,
          code: httpStatus.BAD_REQUEST,
          message: constant.strings.response.error.email_required,
        };
      }
      if (!body.password) {
        if (transaction) await transaction.rollback();
        return {
          status: false,
          code: httpStatus.BAD_REQUEST,
          message: constant.strings.response.error.password_required,
        };
      }
      if (!body.fcmToken) {
        if (transaction) await transaction.rollback();
        return {
          status: false,
          code: httpStatus.BAD_REQUEST,
          message: constant.strings.response.error.fcmToken_required,
        };

      }
      body.password = await hashing.encrypt(body.password);

      let user = await models.User.create(body, { transaction });
      const token = await JWT.generateToken(user);
      await transaction.commit();
      return {
        status: true,
        code: httpStatus.OK,
        message: constant.strings.response.success.signup,
        data: user,
        token,
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
  superAdminCreate: async (req) => {
    let transaction;
    try {
      transaction = await models.sequelize.transaction();
      const { body } = req;
      body.type = 1
      const errors = { flag: false };
      const userData = await models.User.byEmail(req.body);
      if (userData) {
        if (transaction) await transaction.rollback();
        return {
          status: false,
          code: httpStatus.BAD_REQUEST,
          message: constant.strings.response.error.email_exist,
        };

      }
      if (!body.email) {
        if (transaction) await transaction.rollback();
        return {
          status: false,
          code: httpStatus.BAD_REQUEST,
          message: constant.strings.response.error.email_required,
        };
      }
      if (!body.password) {
        if (transaction) await transaction.rollback();
        return {
          status: false,
          code: httpStatus.BAD_REQUEST,
          message: constant.strings.response.error.password_required,
        };
      }
      if (!body.fcmToken) {
        if (transaction) await transaction.rollback();
        return {
          status: false,
          code: httpStatus.BAD_REQUEST,
          message: constant.strings.response.error.fcmToken_required,
        };
      }
      body.password = await hashing.encrypt(body.password);
      // if (errors.flag) {
      //   if (transaction) await transaction.rollback();
      //   return { status: false, code: httpStatus.BAD_REQUEST, error: errors };
      // }
      let user = await models.User.create(body, { transaction });
      const token = await JWT.generateToken(user);
      await transaction.commit();
      return {
        status: true,
        code: httpStatus.OK,
        message: constant.strings.response.success.signup,
        data: user,
        token,
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
  subAdminCreate: async (req) => {
    let transaction;
    try {
      transaction = await models.sequelize.transaction();
      const { body } = req;
      body.type = 2
      const errors = { flag: false };
      const userData = await models.User.byEmail(req.body);
      if (userData) {
        if (transaction) await transaction.rollback();
        return {
          status: false,
          code: httpStatus.BAD_REQUEST,
          message: constant.strings.response.error.email_exist,
        };

      }
      if (!body.email) {
        if (transaction) await transaction.rollback();
        return {
          status: false,
          code: httpStatus.BAD_REQUEST,
          message: constant.strings.response.error.email_required,
        };
      }
      if (!body.password) {
        if (transaction) await transaction.rollback();
        return {
          status: false,
          code: httpStatus.BAD_REQUEST,
          message: constant.strings.response.error.password_required,
        };
      }
      if (!body.fcmToken) {
        if (transaction) await transaction.rollback();
        return {
          status: false,
          code: httpStatus.BAD_REQUEST,
          message: constant.strings.response.error.fcmToken_required,
        };
      }
      body.password = await hashing.encrypt(body.password);
      // if (errors.flag) {
      //   if (transaction) await transaction.rollback();
      //   return { status: false, code: httpStatus.BAD_REQUEST, error: errors };
      // }
      let user = await models.User.create(body, { transaction });
      const token = await JWT.generateToken(user);
      await transaction.commit();
      return {
        status: true,
        code: httpStatus.OK,
        message: constant.strings.response.success.signup,
        data: user,
        token,
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


  otp: async (req) => {
    try {
      let { body } = req;
      const errors = { flag: false };
      const userData = await models.User.byEmail(req.body);
      if (userData) {
        errors.flag = true;
        errors.message = constant.strings.response.error.email_exist;
      }
      const userData1 = await models.User.byPhone(req.body);
      if (userData1 && errors.flag != true) {
        errors.flag = true;
        errors.message = constant.strings.response.error.phone_exist;
      }
      if (errors.flag) {
        return { status: false, code: httpStatus.BAD_REQUEST, error: errors };
      }
      let code = Math.floor(Math.random() * 8999 + 1000);
      let data = {
        code: code,
        to: body.phone
      }
      return {
        status: true,
        code: httpStatus.OK,
        message: constant.strings.response.success.otp,
        //    // // result,
        otp: code,
      };
    } catch (err) {
      return {
        status: false,
        code: httpStatus.BAD_REQUEST,
        message: err.message,
        error: err,
      };
    }
  },
  passwordForget: async (req) => {
    try {
      let { body } = req;
      const errors = { flag: false };
      let code = Math.floor(Math.random() * 8999 + 1000);
      const userData1 = await models.User.byEmail(req.body);
      // let data = {
      //   password: code,
      //   mail: body.mail
      // }
      // //  sms.sendSms(data)
      // console.log(data)
      //  let mail= await email.sendemailforgotPassword(data)
      //  console.log(mail)
      if (!userData1) {
        errors.flag = true;
        errors.message = constant.strings.response.error.email_not_exist;
      }
      if (errors.flag) {
        return { status: false, code: httpStatus.BAD_REQUEST, error: errors };
      }

      let data = {
        password: code.toString(),
        mail: body.email
      }
      let mail = await email.sendemailforgotPassword(data)


      body.password = await hashing.encrypt(code.toString());
      let result = await models.User.update(body, {
        where: {
          id: userData1.id
        }
      })
      return {
        status: true,
        code: httpStatus.OK,
        message: constant.strings.response.success.updated,
        result
      };
    } catch (err) {
      console.log(err)
      return {

        status: false,
        code: httpStatus.BAD_REQUEST,
        message: err,
        error: err,
      };
    }
  },
  loginUser: async (req) => {
    let transaction;
    try {
      transaction = await models.sequelize.transaction();
      const { body } = req;
      if (!body.password || !body.email) {
        if (transaction) await transaction.rollback();
        return {
          status: false,
          code: httpStatus.BAD_REQUEST,
          message: constant.strings.response.error.required_field_missing,
        };
      }
      if (!body.fcmToken) {
        if (transaction) await transaction.rollback();
        return {
          status: false,
          code: httpStatus.BAD_REQUEST,
          message: constant.strings.response.error.fcmToken_required,
        };

      }
      let user = await models.User.byEmail(req.body);
      if (!user) {
        if (transaction) await transaction.rollback();
        return {
          status: false,
          code: httpStatus.BAD_REQUEST,
          message: constant.strings.response.error.email_not_exist,
        };
      }
      const passwordCheck = await hashing.decrypt(body.password, user.password);
      if (!passwordCheck) {
        if (transaction) await transaction.rollback();
        return {
          status: false,
          code: httpStatus.BAD_REQUEST,
          message: constant.strings.response.error.invalid_password,
        };
      }
// if(user.numberOfCancelJobs>=5){
//   if (transaction) await transaction.rollback();
//   return {
//     status: false,
//     code: httpStatus.BAD_REQUEST,
//     message: constant.strings.response.error.cancel_jobs_exced,
//   };
// }
      user = user.toJSON();
      delete user.password;
      let updateDate = {
        "fcmToken": body.fcmToken
      }
      await models.User.update(updateDate, {
        where: {
          id: user.id
        }
      })
      user.fcmToken = body.fcmToken
      const token = await JWT.generateToken(user);
      await transaction.commit();
      return {
        status: true,
        code: httpStatus.OK,
        message: constant.strings.response.success.login,
        data: user,
        token,
      };
    } catch (err) {
      if (transaction) await transaction.rollback();
      return {
        status: false,
        code: httpStatus.BAD_REQUEST,
        message: err.message,
        error: err.message,
      };
    }
  },
  addDriverFeatures: async (req) => {
    let transaction;
    try {
      transaction = await models.sequelize.transaction();
      let { body } = req

      let result = await models.DriverFeature.create(body)
      await transaction.commit();
      return {
        status: true,
        code: httpStatus.OK,
        message: constant.strings.response.success.added,
        result
      };
    } catch (err) {
      if (transaction) await transaction.rollback();
      return {
        status: false,
        code: httpStatus.BAD_REQUEST,
        message: err.message,
        error: err
      };
    }
  },
  serverCitiesCreate: async (req) => {
    let transaction;
    try {
      transaction = await models.sequelize.transaction();
      let { body } = req

      let result = await models.ServedCities.create(body)
      await transaction.commit();
      return {
        status: true,
        code: httpStatus.OK,
        message: constant.strings.response.success.added,
        result
      };
    } catch (err) {
      if (transaction) await transaction.rollback();
      return {
        status: false,
        code: httpStatus.BAD_REQUEST,
        message: err.message,
        error: err
      };
    }
  },
  notificationSend: async (req) => {
    let transaction;
    try {
      transaction = await models.sequelize.transaction();
      let { body, user } = req
      let token = "fluaKptAROuFCOG1nRifQx:APA91bEyBXwM-LYlGNN6oGxLCNsnu77QNgzpTyV5_jKe3yg9sCxob9_gszGGpQPKZj6FRq_y6lMqsiUgnXvZ5T9rRfR5PgtJQ_I5SHRGSzRdBiE_mmvJPbdQNWPZd4FvldODmPm-Yqc4"
      let title = "dddd"

      let not = await notification.onSendNotifications(token, title, body, user)
      await transaction.commit();
      return {
        status: true,
        code: httpStatus.OK,
        message: constant.strings.response.success.added,
      };
    } catch (err) {
      if (transaction) await transaction.rollback();
      return {
        status: false,
        code: httpStatus.BAD_REQUEST,
        message: err.message,
        error: err
      };
    }
  },
  serverCitiesUpdate: async (req) => {
    let transaction;
    try {
      transaction = await models.sequelize.transaction();
      let { body, params } = req

      let result = await models.ServedCities.update(body, {
        where: {
          id: params.id
        }
      })
      await transaction.commit();
      return {
        status: true,
        code: httpStatus.OK,
        message: constant.strings.response.success.added,
        result
      };
    } catch (err) {
      if (transaction) await transaction.rollback();
      return {
        status: false,
        code: httpStatus.BAD_REQUEST,
        message: err.message,
        error: err
      };
    }
  },
  serverCitiesCounter: async (req) => {
    let transaction;
    try {
      transaction = await models.sequelize.transaction();
      let { params } = req
      let city = await models.ServedCities.findOne({
        where: {
          id: params.id
        }
      })
      let data = {
        count: city.count + 1
      }
      let result = await models.ServedCities.update(data, {
        where: {
          id: params.id
        }
      })
      let cities = await models.ServedCities.getAll(req)
      await transaction.commit();
      return {
        status: true,
        code: httpStatus.OK,
        message: constant.strings.response.success.added,
        cities,
        result
      };
    } catch (err) {
      if (transaction) await transaction.rollback();
      return {
        status: false,
        code: httpStatus.BAD_REQUEST,
        message: err.message,
        error: err
      };
    }
  },
  getAllserverCities: async (req) => {
    let transaction;
    try {
      transaction = await models.sequelize.transaction();

      let cities = await models.ServedCities.getAll(req)
      await transaction.commit();
      return {
        status: true,
        code: httpStatus.OK,
        message: constant.strings.response.success.added,
        cities
      };
    } catch (err) {
      if (transaction) await transaction.rollback();
      return {
        status: false,
        code: httpStatus.BAD_REQUEST,
        message: err.message,
        error: err
      };
    }
  }

};

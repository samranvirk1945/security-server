const httpStatus = require("http-status-codes");
const { hashing, JWT } = require("../utils/index");
const models = require("../models/index");
const email = require("../services/email");
const constant = require("../constants");
const Sequelize = require('sequelize');
const notification = require("../services/notification");
const { model } = require("mongoose");

module.exports = {
  createSubAdmin: async (req) => {
    let transaction;
    try {
      transaction = await models.sequelize.transaction();
      let { body,user } = req;
      body.type=2
      body.verify = true
      const userData = await models.User.byEmail(req.body);
      if (userData) {
        if (transaction) await transaction.rollback();
        return {
          status: false,
          code: httpStatus.BAD_REQUEST,
          message: constant.strings.response.error.email_exist,
        };
      }
      if (user.type!=1) {
        if (transaction) await transaction.rollback();
        return {
          status: false,
          code: httpStatus.BAD_REQUEST,
          message: constant.strings.response.error.prohibited_action,
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
      if (!body.rights||body.rights.length<1) {
        if (transaction) await transaction.rollback();
        return {
          status: false,
          code: httpStatus.BAD_REQUEST,
          message: constant.strings.response.error.rights_required,
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
      body.password = await hashing.encrypt(body.password);
      let userCreated = await models.User.create(body, { transaction });
      let userRight=[]

      body.rights.map((data)=>{
        userRight.push({name:data,UserId:userCreated.id})
      })
      await models.UserRight.bulkCreate(userRight, { transaction });

      await transaction.commit();
      return {
        status: true,
        code: httpStatus.OK,
        message: constant.strings.response.success.admin_created,
        userCreated,
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
      const errors = { flag: false };
      let {user,query}=req
      if (user.type==3) {
        if (transaction) await transaction.rollback();
              return {
                status: false,
                code: httpStatus.BAD_REQUEST,
                message: constant.strings.response.error.prohibited_action,
              };
      }
      let users = await models.User.getAll(query);
      await transaction.commit();
      return {
        status: true,
        code: httpStatus.OK,
        message: constant.strings.response.success.get,
        data:users,
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
  getSubAmins: async (req) => {
    let transaction;
    try {
      transaction = await models.sequelize.transaction();
      const errors = { flag: false };
      let {user,query}=req
      if (user.type==3) {
        if (transaction) await transaction.rollback();
              return {
                status: false,
                code: httpStatus.BAD_REQUEST,
                message: constant.strings.response.error.prohibited_action,
              };
      }
      let users = await models.User.getSubAmins(query);
      await transaction.commit();
      return {
        status: true,
        code: httpStatus.OK,
        message: constant.strings.response.success.get,
        data:users,
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
  updateProfile:async (req) => {
    let transaction;
    try {
      transaction = await models.sequelize.transaction();
      const errors = { flag: false };
      let {user,body}=req
      if(body.verify){
        if (transaction) await transaction.rollback();
        return {
          status: false,
          code: httpStatus.BAD_REQUEST,
          message: constant.strings.response.error.prohibited_action,
        }; 
      }
delete body.verify
      if(body.password)
      body.password = await hashing.encrypt(body.password);

let data= await models.User.update(body, {
        where: {
          id: user.id
        }
      })
      await transaction.commit();
      return {
        status: true,
        code: httpStatus.OK,
        message: constant.strings.response.success.updated,
        data,
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
  updateUserByAdmin:async (req) => {
    let transaction;
    try {
      transaction = await models.sequelize.transaction();
      const errors = { flag: false };
      let {params,body,user}=req
if ((user.type!=1||user.type!=2)&&user.type==3) {
  if (transaction) await transaction.rollback();
        return {
          status: false,
          code: httpStatus.BAD_REQUEST,
          message: constant.strings.response.error.prohibited_action,
        };
}

let findUser=await models.User.byId(params.id)
if (user.type!=1&&findUser.type==1) {
  if (transaction) await transaction.rollback();
        return {
          status: false,
          code: httpStatus.BAD_REQUEST,
          message: constant.strings.response.error.prohibited_action,
        };
}
      if(body.password)
      body.password = await hashing.encrypt(body.password);

let data= await models.User.update(body, {
        where: {
          id: params.id
        }
      })
      await transaction.commit();
      return {
        status: true,
        code: httpStatus.OK,
        message: constant.strings.response.success.updated,
        data,
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
  delete:async (req) => {
    let transaction;
    try {
      transaction = await models.sequelize.transaction();
      const errors = { flag: false };
      let {params}=req


      let data=await models.User.destroy({ where: { id: params.id } }, { transaction });
      await transaction.commit();
      return {
        status: true,
        code: httpStatus.OK,
        message: constant.strings.response.success.delete,
        data,
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
  getById:async (req) => {
    let transaction;
    try {
      transaction = await models.sequelize.transaction();
      const errors = { flag: false };
      let {user,params}=req
      if ((user.type!=1||user.type!=2)&&user.type==3) {
        if (transaction) await transaction.rollback();
              return {
                status: false,
                code: httpStatus.BAD_REQUEST,
                message: constant.strings.response.error.prohibited_action,
              };
      }
      let userfound = await models.User.byId(params.id);
      await transaction.commit();
      return {
        status: true,
        code: httpStatus.OK,
        message: constant.strings.response.success.get,
        data:userfound,
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

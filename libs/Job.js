const httpStatus = require("http-status-codes");
const { hashing, JWT } = require("../utils/index");
const models = require("../models/index");
const email = require("../services/email");
const constant = require("../constants");
const Sequelize = require('sequelize');
const notification = require("../services/notification");
const { Op } = require('sequelize');

module.exports = {
  create: async (req) => {
    let transaction;
    try {
      transaction = await models.sequelize.transaction();
      const { body, user } = req;
      const errors = { flag: false };
      if (user.type == 3) {
        if (transaction) await transaction.rollback();
        return {
          status: false,
          code: httpStatus.BAD_REQUEST,
          message: constant.strings.response.error.prohibited_action,
        };
      }

      // console.log(body.expireDateTime)
      // let expiryDate = new Date(body.expireDateTime).getTime()
      //   console.log(expiryDate)
      //   console.log(1 * 24 * 60 * 60 * 1000)
      //   console.log(expiryDate - 1 * 24 * 60 * 60 * 1000)
      // expiryDate= new Date(expiryDate - 1 * 24 * 60 * 60 * 1000);
      // console.log(expiryDate)
//       let newDate= new Date()
// newDate.setDate(body.endDate)
// newDate.setTime(body.endTime)
//var futureDate = new Date(2016,9,27,10,00);

      let expireDateTime  = new Date(parseInt(body.endDate?.slice(6,10)),parseInt(body.endDate?.slice(3,5))-1,parseInt(body.endDate?.slice(0,2)),parseInt(body.endTime?.slice(0,2)),parseInt(body.endTime?.slice(3,5)),00);
      let startDateTime  = new Date(parseInt(body.startDate?.slice(6,10)),parseInt(body.startDate?.slice(3,5))-1,parseInt(body.startDate?.slice(0,2)),parseInt(body.startTime?.slice(0,2)),parseInt(body.startTime?.slice(3,5)),00);

      body.expireDateTime = parseInt(expireDateTime.getTime())
      body.startDateTime=parseInt(startDateTime.getTime())
      // let expiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      //  console.log(expiryDate)

      let job = await models.Job.create(body, { transaction });
      await transaction.commit();
      return {
        status: true,
        code: httpStatus.OK,
        message: constant.strings.response.success.added,
        data: job
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

  book: async (req) => {
    let transaction;
    try {
      transaction = await models.sequelize.transaction();
      const { params, user } = req;
      const errors = { flag: false };
      // if (user.verify == false || !user.verify) {
      //   if (transaction) await transaction.rollback();
      //   return {
      //     status: false,
      //     code: httpStatus.BAD_REQUEST,
      //     message: constant.strings.response.error.prohibited_action,
      //   };
      // }
      if(user.numberOfCancelJobs>=5){
          if (transaction) await transaction.rollback();
          return {
            status: false,
            code: httpStatus.BAD_REQUEST,
            message: constant.strings.response.error.cancel_jobs_exced,
          };
        }
      let bookedJob = await models.Booked.findOne({
        where: { UserId: user.id, JobId: params.id }
      })
      if (bookedJob) {
        if (transaction) await transaction.rollback();
        return {
          status: false,
          code: httpStatus.BAD_REQUEST,
          message: constant.strings.response.error.already_booked,
        };
      }
      let job = await models.Job.byId(params.id)

      if (job.bookedJobs>=job.totalNumberJobs) {
        if (transaction) await transaction.rollback();
        return {
          status: false,
          code: httpStatus.BAD_REQUEST,
          message: constant.strings.response.error.all_booked,
        };
      }
       await models.Job.byId(params.id)

      let updateJobData = {
        bookedJobs: job.bookedJobs + 1
      }
      if(job.totalNumberJobs==updateJobData.bookedJobs)
      updateJobData.allSlotsbooked=true

      let dataCreate = {
        UserId: user.id,
        JobId: params.id,
        expireDateTime:job.expireDateTime,
        startDateTime:job.startDateTime
      }
      let data = await models.Booked.create(dataCreate, { transaction });
      await models.Job.update(updateJobData, {
        where: {
          id: params.id
        }
      }, { transaction })
      await transaction.commit();
      return {
        status: true,
        code: httpStatus.OK,
        message: constant.strings.response.success.book_successfully,
        data
        
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


  update: async (req) => {
    let transaction;
    try {
      transaction = await models.sequelize.transaction();
      const { body, params, user } = req;
      const errors = { flag: false };
      if (user.type == 3) {
        if (transaction) await transaction.rollback();
        return {
          status: false,
          code: httpStatus.BAD_REQUEST,
          message: constant.strings.response.error.prohibited_action,
        };
      }
      await models.Job.update(body, {
        where: {
          id: params.id
        }
      })
      await transaction.commit();
      return {
        status: true,
        code: httpStatus.OK,
        message: constant.strings.response.success.updated
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
  start: async (req) => {
    let transaction;
    try {
      transaction = await models.sequelize.transaction();
      const { body, params, user } = req;
      const errors = { flag: false };
      let dataUpdate = {
        status: 'start'
      }
      let expiryDate = new Date().getTime()
      let startDataExpiry= await models.Booked.findAll( {
        where: {
          UserId: user.id,
          status: 'start',
          expireDateTime: {
            [Op.lte]: expiryDate //+1.5 * 24 * 60 * 60 * 1000,
        }
        }
 })
      if (startDataExpiry.length>0) {
        startDataExpiry.map(async(data)=>{
          await models.Booked.update({status:'completed'}, {
            where: {
              id: data.id
            }
          })
        }) 
      }
// console.log("---",expiryDate)
//       let requested=await models.Booked.findOne(dataUpdate, {
//         where: {
//           id: params.id,
//           status: 'start',
//           expireDateTime: {
//             [Op.lte]: expiryDate //+1.5 * 24 * 60 * 60 * 1000,
//         }
//         }
//       })
//       console.log(requested)
//       if (requested) {
//         if (transaction) await transaction.rollback();
//         return {
//           status: false,
//           code: httpStatus.BAD_REQUEST,
//           message: constant.strings.response.error.job_expired,
//         };
//       }
     let startData= await models.Booked.findAll( {
        where: {
          UserId: user.id,
          status: 'start'
        }
      })
      if (startData.length>0) {
        if (transaction) await transaction.rollback();
        return {
          status: false,
          code: httpStatus.BAD_REQUEST,
          message: constant.strings.response.error.another_started,
        };
      }
      await models.Booked.update(dataUpdate, {
        where: {
          id: params.id
        }
      })
      await transaction.commit();
      return {
        status: true,
        code: httpStatus.OK,
        message: constant.strings.response.success.job_start
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
  cancel: async (req) => {
    let transaction;
    try {
      transaction = await models.sequelize.transaction();
      const { body, params, user } = req;
      const errors = { flag: false };
      let dataUpdate = {
        status: 'cancel'
      }
      let currentTime = new Date().getTime()
      console.log("currentTime",currentTime)
         let startDataJob= await models.Booked.findAll( {
        where: {
          status:'booked',
          UserId: user.id,
          id:params.id,
        }
 })
 if (startDataJob.length<1) {
  if (transaction) await transaction.rollback();
  return {
    status: false,
    code: httpStatus.BAD_REQUEST,
    message: constant.strings.response.error.job_not_found,
  };
}
      let startDataExpiry= await models.Booked.findAll( {
        where: {
          status:'booked',
          UserId: user.id,
          id:params.id,
          startDateTime: {
            [Op.lte]: currentTime +24 * 60 * 60 * 1000//1.5 * 24 * 60 * 60 * 1000,
        }
        }
 })
 if (startDataExpiry.length>0) {
  if (transaction) await transaction.rollback();
  return {
    status: false,
    code: httpStatus.BAD_REQUEST,
    message: constant.strings.response.error.cannot_cancel_job,
  };
}
 //console.log("+++",startDataExpiry)
      
     
      await models.Booked.update(dataUpdate, {
        where: {
          id: params.id
        }
      })
      let userUpdateData={
        numberOfCancelJobs:user.numberOfCancelJobs+1
      }
      await models.User.update(userUpdateData, {
        where: {
          id: user.id
        }
      })
      await transaction.commit();
      return {
        status: true,
        code: httpStatus.OK,
        message: constant.strings.response.success.cancel_job
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
  completed: async (req) => {
    let transaction;
    try {
      transaction = await models.sequelize.transaction();
      const { body, params, user } = req;
      const errors = { flag: false };
      let dataUpdate = {
        status: 'completed'
      }
      await models.Booked.update(dataUpdate, {
        where: {
          id: params.id
        }
      })
      await transaction.commit();
      return {
        status: true,
        code: httpStatus.OK,
        message: constant.strings.response.success.completed_start
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
      const { query, user } = req;
      const errors = { flag: false };
      let alreadyBookedJobs = []
      if (user.type == 3) {
        let bookedJobs = await models.Booked.findAll({
          where: { UserId: user.id }
        })
        if (bookedJobs) {
          bookedJobs.map((data, index) => {
            alreadyBookedJobs.push(data.JobId)
          })
        }
      }
      let data = await models.Job.getAll(query, alreadyBookedJobs, user);
      await transaction.commit();
      return {
        status: true,
        code: httpStatus.OK,
        message: constant.strings.response.success.get,
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
  getAllHistory: async (req) => {
    let transaction;
    try {
      transaction = await models.sequelize.transaction();
      const { query, user } = req;
      const errors = { flag: false };
      let data = await models.Job.getAllHistory(query);
      await transaction.commit();
      return {
        status: true,
        code: httpStatus.OK,
        message: constant.strings.response.success.get,
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

  getAllBooked: async (req) => {
    let transaction;
    try {
      transaction = await models.sequelize.transaction();
      const { user ,query} = req;
      const errors = { flag: false };
      let data = await models.Booked.getJobsBookedByUser(user,query)
      await transaction.commit();
      return {
        status: true,
        code: httpStatus.OK,
        message: constant.strings.response.success.get,
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
  getAllOngoing: async (req) => {
    let transaction;
    try {
      transaction = await models.sequelize.transaction();
      const { user ,query} = req;
      const errors = { flag: false };
      let expiryDate = new Date().getTime()
      let startDataExpiry= await models.Booked.findAll( {
        where: {
          UserId: user.id,
          status: 'start',
          expireDateTime: {
            [Op.lte]: expiryDate //+1.5 * 24 * 60 * 60 * 1000,
        }
        }
 })
      if (startDataExpiry.length>0) {
        startDataExpiry.map(async(data)=>{
          await models.Booked.update({status:'completed'}, {
            where: {
              id: data.id
            }
          })
        }) 
      }
      let data = await models.Booked.getAllOngoing(user,query)
      await transaction.commit();
      return {
        status: true,
        code: httpStatus.OK,
        message: constant.strings.response.success.get,
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
  jobHistoryUser: async (req) => {
    let transaction;
    try {
      transaction = await models.sequelize.transaction();
      const { user,query } = req;
      const errors = { flag: false };
      let data = await models.Booked.jobHistoryUser(user,query)
      await transaction.commit();
      return {
        status: true,
        code: httpStatus.OK,
        message: constant.strings.response.success.get,
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
  getAllUsersBookedJob: async (req) => {
    let transaction;
    try {
      transaction = await models.sequelize.transaction();
      const { params, user,query } = req;
      const errors = { flag: false };
      if (user.type == 3) {
        if (transaction) await transaction.rollback();
        return {          status: false,
          code: httpStatus.BAD_REQUEST,
          message: constant.strings.response.error.prohibited_action,
        };
      }
      let data = await models.Booked.getUsersBookedJob(params,query)
      await transaction.commit();
      return {
        status: true,
        code: httpStatus.OK,
        message: constant.strings.response.success.get,
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
  delete: async (req) => {
    let transaction;
    try {
      transaction = await models.sequelize.transaction();
      const errors = { flag: false };
      let { params, user } = req
      if (user.type == 3) {
        if (transaction) await transaction.rollback();
        return {
          status: false,
          code: httpStatus.BAD_REQUEST,
          message: constant.strings.response.error.prohibited_action,
        };
      }

      let data = await models.Job.destroy({ where: { id: params.id } }, { transaction });
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

};

const sequelizePaginate = require('sequelize-paginate');
const { Op } = require('sequelize');
const Booked = require("./Booked");

module.exports = (sequelize, DataTypes) => {
    const Job = sequelize.define('Job', {
        name: {
            type: DataTypes.STRING,
        },
        active: {
            type: DataTypes.BOOLEAN,  //admin can change this 
            defaultValue: true
        },
        allSlotsbooked:{
            type: DataTypes.BOOLEAN,  //admin can change this 
            defaultValue: false
        },
        startTime: {
            type: DataTypes.STRING,
        },
        endTime: {
            type: DataTypes.STRING,
        },
        category: {
            type: DataTypes.STRING,
        },
        startDate: {
            type: DataTypes.STRING,
        },
        endDate: {
            type: DataTypes.STRING,
        },
        expireDateTime: {
            type: DataTypes.BIGINT,
        },
        startDateTime: {
            type: DataTypes.BIGINT,
        },
        // expireDateTimeDateFormate: {
        //     type: DataTypes.DATE,
        // },
        type: {
            type: DataTypes.STRING,   //not using
        },
        postalCode: {
            type: DataTypes.STRING,
        },
        description: {
            type: DataTypes.STRING,
        },
        address: {
            type: DataTypes.STRING,
        },
        city: {
            type: DataTypes.STRING,
        },
        latitude: {
            type: DataTypes.FLOAT,
        },
        longitude: {
            type: DataTypes.FLOAT,
        },
        rate: {
            type: DataTypes.FLOAT,
        },
        totalNumberJobs: {
            type: DataTypes.INTEGER,
        },
        bookedJobs: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        }

    });
    Job.associate = function (models) {
        Job.hasMany(models.Booked)
    };

    Job.add = async (req) => {
        return Job.create(req)
    },
        Job.getAll = async (query, alreadyBookedJobs, user) => {

            let where = {
            }
            let expiryDate = new Date().getTime()
            // 1 * 24 * 60 * 60 * 1000
            console.log(expiryDate)

            where = {
                ...where,
                expireDateTime: {
                    [Op.gte]: expiryDate,
                }

            };
console.log(alreadyBookedJobs)
            if (alreadyBookedJobs.length > 0) {
                where = {
                    ...where,
                    id: { [Op.notIn]: alreadyBookedJobs }
                }
            }
            if (user.type == 3){
                where.active = true
                where.allSlotsbooked=false
            }

            if (query.search) {
                where = {
                    ...where,
                    [Op.or]:
                        [
                            { name: { [Op.iLike]: `%${query.search}%` } },
                            { city: { [Op.iLike]: `%${query.search}%` } },
                            { address: { [Op.iLike]: `%${query.search}%` } }


                        ]
                }
            }
            const options = {
                page: parseInt(query.page) || 1, // defaultValue 1
                paginate: parseInt(query.size) || 10,
                where,
                order: [['id', 'DESC']],

            };
            const { docs, pages, total } = await Job.paginate(options);
            return { docs, pages, total };
        },
        Job.getAllHistory = async (query) => {

            let where = {
            }
            let expiryDate = new Date().getTime()
            // 1 * 24 * 60 * 60 * 1000
            console.log(expiryDate)

            where = {
                ...where,
                expireDateTime: {
                    [Op.lte]: expiryDate,
                }

            };
            if (query.search) {
                where = {
                    ...where,
                    [Op.or]:
                        [
                            { name: { [Op.iLike]: `%${query.search}%` } },
                            { city: { [Op.iLike]: `%${query.search}%` } },
                            { address: { [Op.iLike]: `%${query.search}%` } }


                        ]
                }
            }
            const options = {
                page: parseInt(query.page) || 1, // defaultValue 1
                paginate: parseInt(query.size) || 10,
                where,
                order: [['id', 'DESC']],

            };
            const { docs, pages, total } = await Job.paginate(options);
            return { docs, pages, total };
        },
        Job.byId = async function (id) {
            return await Job.findOne({
                where: {
                    id
                }
            })

        };
    Job.updateJob = async function (req) {
        const { params, body } = req;
        return await Job.update(body, {
            where: {
                id: params.id
            }
        })

    };



    sequelizePaginate.paginate(Job);
    return Job;
};
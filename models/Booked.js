const sequelizePaginate = require('sequelize-paginate');
const { Op } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const Booked = sequelize.define('Booked', {        
        status: {
            type: DataTypes.STRING,
            defaultValue:'booked'
        },
        startDateTime:{
            type:DataTypes.BIGINT
        },
        endDateTime:{
            type:DataTypes.DATE
        },
        expireDateTime: {
            type: DataTypes.BIGINT
        },
        expireDateTimeDateFormate: {
            type: DataTypes.DATE
        },

    });

    Booked.associate = function (models) {
        Booked.belongsTo(models.Job);
        Booked.belongsTo(models.User);
    };
    Booked.add = async (req) => {
        return Booked.create(req)
    },
    
    Booked.getAllOngoing = async (user,query) => {

        let where = {
        }
        let expiryDate = new Date().getTime()
        where = {
            ...where,
            // expireDateTime: {
            //     [Op.gte]: expiryDate,
            // }

        };
        where.UserId=user.id
        where.status='start'
        const options = {
            page: parseInt(query.page) || 1, // defaultValue 1
            paginate: parseInt(query.size) || 10,
            where,
            order: [['id', 'DESC']],
            include: [{ model: sequelize.models.Job }]
        };
        const { docs, pages, total } = await Booked.paginate(options);
        return { docs, pages, total };
    },
        Booked.getJobsBookedByUser = async (user,query) => {

            let where = {
            }
            let expiryDate = new Date().getTime()
            console.log(expiryDate)
            where = {
                ...where,
                // expireDateTime: {
                //     [Op.gte]: expiryDate,
                // }
            };
            where.UserId=user.id
            where.status='booked'
            const options = {
                page: parseInt(query.page) || 1, // defaultValue 1
                paginate: parseInt(query.size) || 10,
                where,
                order: [['id', 'DESC']],
                include: [{ model: sequelize.models.Job }]
            };
            const { docs, pages, total } = await Booked.paginate(options);
            return { docs, pages, total };
        },
        Booked.jobHistoryUser= async (user,query) => {
            let where={}
            where.UserId=user.id
            where.status='completed'
            const options = {
                page: parseInt(query.page) || 1, // defaultValue 1
                paginate: parseInt(query.size) || 10,
                where,
                order: [['id', 'DESC']],
                include: [{ model: sequelize.models.Job }]


            };
            const { docs, pages, total } = await Booked.paginate(options);
            return { docs, pages, total };
        },
        Booked.getUsersBookedJob = async (params,query) => {
            const options = {
                page: parseInt(query.page) || 1, // defaultValue 1
                paginate: parseInt(query.size) || 10,
                where: { JobId: params.id },
                order: [['id', 'DESC']],
                include: [{ model: sequelize.models.User }],
            };
            const { docs, pages, total } = await Booked.paginate(options);
            return { docs, pages, total };
        },
        Booked.byId = async function (id) {
            return await Booked.findOne({
                where: {
                    id
                }
            })

        };
    Booked.updateBooked = async function (req) {
        const { params, body } = req;
        return await Booked.update(body, {
            where: {
                id: params.id
            }
        })
    };


    sequelizePaginate.paginate(Booked);
    return Booked;
};